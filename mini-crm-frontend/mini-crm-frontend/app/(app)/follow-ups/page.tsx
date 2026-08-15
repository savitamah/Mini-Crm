"use client";

import { useCallback, useEffect, useState } from "react";
import { Plus, Pencil, Trash2, CheckCircle2, BellRing } from "lucide-react";
import { api, apiErrorMessage } from "@/lib/api";
import { FollowUp, Lead } from "@/lib/types";
import { FOLLOWUP_STATUS_COLOR } from "@/lib/leadStatusColors";
import { formatDate, formatTime, titleCase } from "@/lib/utils";
import Badge from "@/components/ui/Badge";
import { PageSpinner } from "@/components/ui/Spinner";
import EmptyState from "@/components/ui/EmptyState";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import FollowUpModal, { FollowUpFormValues } from "@/components/followups/FollowUpModal";

export default function FollowUpsPage() {
  const [followUps, setFollowUps] = useState<FollowUp[]>([]);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState<"all" | "today">("all");

  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<FollowUp | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [deleting, setDeleting] = useState<FollowUp | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const load = useCallback((mode: "all" | "today") => {
    setLoading(true);
    const endpoint = mode === "today" ? "/follow-ups/today" : "/follow-ups";
    Promise.all([api.get<FollowUp[]>(endpoint), api.get<Lead[]>("/leads")])
      .then(([fRes, lRes]) => {
        setFollowUps(fRes.data);
        setLeads(lRes.data);
      })
      .catch((err) => setError(apiErrorMessage(err, "Could not load follow-ups.")))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    load(filter);
  }, [filter, load]);

  async function handleSubmit(values: FollowUpFormValues) {
    setSubmitting(true);
    try {
      const payload = { ...values, leadId: values.leadId ? Number(values.leadId) : null };
      if (editing) {
        await api.put(`/follow-ups/${editing.id}`, payload);
      } else {
        await api.post("/follow-ups", payload);
      }
      setModalOpen(false);
      setEditing(null);
      load(filter);
    } catch (err) {
      alert(apiErrorMessage(err, "Could not save follow-up."));
    } finally {
      setSubmitting(false);
    }
  }

  async function markDone(f: FollowUp) {
    try {
      await api.put(`/follow-ups/${f.id}`, { ...f, status: "COMPLETED" });
      load(filter);
    } catch (err) {
      alert(apiErrorMessage(err, "Could not update follow-up."));
    }
  }

  async function handleDelete() {
    if (!deleting) return;
    setDeleteLoading(true);
    try {
      await api.delete(`/follow-ups/${deleting.id}`);
      setDeleting(null);
      load(filter);
    } catch (err) {
      alert(apiErrorMessage(err, "Could not delete follow-up."));
    } finally {
      setDeleteLoading(false);
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-lg font-semibold text-ink-900">Follow-up Reminders</h1>
          <p className="text-sm text-ink-500">Get notified and never miss a follow-up.</p>
        </div>
        <button
          className="btn-primary"
          onClick={() => {
            setEditing(null);
            setModalOpen(true);
          }}
        >
          <Plus size={16} /> Add Follow-up
        </button>
      </div>

      <div className="flex gap-2">
        {(["all", "today"] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`rounded-full px-3 py-1.5 text-xs font-medium ${
              filter === f ? "bg-primary-600 text-white" : "bg-white text-ink-500 border border-ink-200"
            }`}
          >
            {f === "all" ? "All" : "Today"}
          </button>
        ))}
      </div>

      <div className="card p-4">
        {loading ? (
          <PageSpinner />
        ) : error ? (
          <div className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">{error}</div>
        ) : followUps.length === 0 ? (
          <EmptyState
            icon={<BellRing size={28} />}
            title="No follow-ups"
            description="Schedule a follow-up to keep your leads warm."
          />
        ) : (
          <ul className="divide-y divide-ink-50">
            {followUps.map((f) => (
              <li key={f.id} className="flex items-center gap-3 py-3">
                <div
                  className={`h-2 w-2 shrink-0 rounded-full ${
                    f.status === "COMPLETED"
                      ? "bg-emerald-500"
                      : f.status === "OVERDUE"
                      ? "bg-red-500"
                      : "bg-orange-500"
                  }`}
                />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-ink-800">{f.title}</p>
                  <p className="truncate text-xs text-ink-400">
                    {f.leadName ? `${f.leadName} · ` : ""}
                    {titleCase(f.activityType)} · {formatDate(f.followUpDate)}{" "}
                    {f.followUpTime ? formatTime(f.followUpTime) : ""}
                  </p>
                </div>
                <Badge color={FOLLOWUP_STATUS_COLOR[f.status]}>{titleCase(f.status)}</Badge>
                <div className="flex shrink-0 gap-1">
                  {f.status !== "COMPLETED" && (
                    <button
                      className="rounded-md p-1.5 text-ink-400 hover:bg-emerald-50 hover:text-emerald-600"
                      title="Mark done"
                      onClick={() => markDone(f)}
                    >
                      <CheckCircle2 size={15} />
                    </button>
                  )}
                  <button
                    className="rounded-md p-1.5 text-ink-400 hover:bg-ink-100 hover:text-primary-600"
                    onClick={() => {
                      setEditing(f);
                      setModalOpen(true);
                    }}
                  >
                    <Pencil size={15} />
                  </button>
                  <button
                    className="rounded-md p-1.5 text-ink-400 hover:bg-red-50 hover:text-red-600"
                    onClick={() => setDeleting(f)}
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      <FollowUpModal
        open={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setEditing(null);
        }}
        onSubmit={handleSubmit}
        initial={editing}
        leads={leads}
        submitting={submitting}
      />
      <ConfirmDialog
        open={!!deleting}
        title="Delete follow-up"
        message={`Delete "${deleting?.title}"? This can't be undone.`}
        onCancel={() => setDeleting(null)}
        onConfirm={handleDelete}
        loading={deleteLoading}
      />
    </div>
  );
}
