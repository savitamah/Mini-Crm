"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Plus, Phone, Building2 } from "lucide-react";
import { api, apiErrorMessage } from "@/lib/api";
import { Lead, LEAD_STATUSES, LEAD_STATUS_LABEL, LeadStatus } from "@/lib/types";
import { LEAD_STATUS_BAR } from "@/lib/leadStatusColors";
import { formatCurrency, initials } from "@/lib/utils";
import { PageSpinner } from "@/components/ui/Spinner";
import LeadModal, { LeadFormValues } from "@/components/leads/LeadModal";

const BOARD_STATUSES: LeadStatus[] = ["NEW", "CONTACTED", "INTERESTED", "PROPOSAL", "NEGOTIATION", "WON"];

export default function LeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [dragId, setDragId] = useState<number | null>(null);
  const router = useRouter();

  const load = useCallback(() => {
    setLoading(true);
    api
      .get<Lead[]>("/leads")
      .then(({ data }) => setLeads(data))
      .catch((err) => setError(apiErrorMessage(err, "Could not load leads.")))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function handleCreate(values: LeadFormValues) {
    setSubmitting(true);
    try {
      const { notes, estimatedValue, ...rest } = values;
      await api.post("/leads", {
        ...rest,
        estimatedValue: estimatedValue ? Number(estimatedValue) : null,
      });
      setModalOpen(false);
      load();
    } catch (err) {
      alert(apiErrorMessage(err, "Could not create lead."));
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDrop(status: LeadStatus) {
    if (dragId == null) return;
    const lead = leads.find((l) => l.id === dragId);
    if (!lead || lead.status === status) {
      setDragId(null);
      return;
    }
    setLeads((prev) => prev.map((l) => (l.id === dragId ? { ...l, status } : l)));
    setDragId(null);
    try {
      await api.patch(`/leads/${dragId}/status`, { status });
    } catch (err) {
      alert(apiErrorMessage(err, "Could not update lead stage."));
      load();
    }
  }

  if (loading) return <PageSpinner />;
  if (error) return <div className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">{error}</div>;

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-lg font-semibold text-ink-900">Lead Pipeline</h1>
          <p className="text-sm text-ink-500">Drag &amp; drop leads across stages.</p>
        </div>
        <button className="btn-primary" onClick={() => setModalOpen(true)}>
          <Plus size={16} /> Add Lead
        </button>
      </div>

      <div className="flex gap-4 overflow-x-auto pb-4">
        {BOARD_STATUSES.map((status) => {
          const columnLeads = leads.filter((l) => l.status === status);
          return (
            <div
              key={status}
              className="flex w-72 shrink-0 flex-col rounded-2xl bg-ink-100/60 p-3"
              onDragOver={(e) => e.preventDefault()}
              onDrop={() => handleDrop(status)}
            >
              <div className="mb-3 flex items-center justify-between px-1">
                <div className="flex items-center gap-2">
                  <span className={`h-2 w-2 rounded-full ${LEAD_STATUS_BAR[status]}`} />
                  <span className="text-sm font-semibold text-ink-800">{LEAD_STATUS_LABEL[status]}</span>
                </div>
                <span className="rounded-full bg-white px-2 py-0.5 text-xs font-medium text-ink-500">
                  {columnLeads.length}
                </span>
              </div>

              <div className="flex flex-1 flex-col gap-2">
                {columnLeads.map((lead) => (
                  <div
                    key={lead.id}
                    draggable
                    onDragStart={() => setDragId(lead.id)}
                    onClick={() => router.push(`/leads/${lead.id}`)}
                    className="cursor-pointer rounded-xl border border-ink-200 bg-white p-3 shadow-sm transition hover:shadow-md active:cursor-grabbing"
                  >
                    <p className="text-sm font-semibold text-ink-900">{lead.name}</p>
                    {lead.company && (
                      <p className="mt-0.5 flex items-center gap-1 text-xs text-ink-400">
                        <Building2 size={11} /> {lead.company}
                      </p>
                    )}
                    <div className="mt-2 flex items-center justify-between">
                      <span className="text-xs font-medium text-primary-600">
                        {lead.estimatedValue ? formatCurrency(lead.estimatedValue) : ""}
                      </span>
                      <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary-50 text-[10px] font-semibold text-primary-700">
                        {initials(lead.assignedToName || lead.name)}
                      </div>
                    </div>
                  </div>
                ))}
                <button
                  onClick={() => setModalOpen(true)}
                  className="mt-1 flex items-center justify-center gap-1 rounded-lg border border-dashed border-ink-300 py-2 text-xs font-medium text-ink-400 hover:border-primary-300 hover:text-primary-600"
                >
                  <Plus size={13} /> Add Lead
                </button>
              </div>
            </div>
          );
        })}
      </div>

      <LeadModal open={modalOpen} onClose={() => setModalOpen(false)} onSubmit={handleCreate} submitting={submitting} />
    </div>
  );
}
