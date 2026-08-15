"use client";

import { useCallback, useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  Building2,
  Mail,
  Phone,
  Globe,
  DollarSign,
  Star,
  Pencil,
  BellRing,
  Check,
} from "lucide-react";
import { api, apiErrorMessage } from "@/lib/api";
import { Activity, Lead, LEAD_STATUSES, LEAD_STATUS_LABEL, LeadStatus } from "@/lib/types";
import { LEAD_STATUS_COLOR } from "@/lib/leadStatusColors";
import { formatCurrency, formatDateTime, titleCase } from "@/lib/utils";
import Badge from "@/components/ui/Badge";
import { PageSpinner } from "@/components/ui/Spinner";
import EmptyState from "@/components/ui/EmptyState";
import LeadModal, { LeadFormValues } from "@/components/leads/LeadModal";
import FollowUpModal, { FollowUpFormValues } from "@/components/followups/FollowUpModal";

export default function LeadDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const leadId = Number(params.id);

  const [lead, setLead] = useState<Lead | null>(null);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editOpen, setEditOpen] = useState(false);
  const [followUpOpen, setFollowUpOpen] = useState(false);
  const [savingStage, setSavingStage] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const load = useCallback(() => {
    setLoading(true);
    Promise.all([
      api.get<Lead>(`/leads/${leadId}`),
      api.get<Activity[]>(`/activities/lead/${leadId}`),
    ])
      .then(([leadRes, actRes]) => {
        setLead(leadRes.data);
        setActivities(actRes.data);
      })
      .catch((err) => setError(apiErrorMessage(err, "Could not load this lead.")))
      .finally(() => setLoading(false));
  }, [leadId]);

  useEffect(() => {
    if (leadId) load();
  }, [leadId, load]);

  async function handleStageChange(status: LeadStatus) {
    if (!lead || lead.status === status) return;
    setSavingStage(true);
    try {
      const { data } = await api.patch<Lead>(`/leads/${leadId}/status`, { status });
      setLead(data);
    } catch (err) {
      alert(apiErrorMessage(err, "Could not update stage."));
    } finally {
      setSavingStage(false);
    }
  }

  async function handleEdit(values: LeadFormValues) {
    setSubmitting(true);
    try {
      const { notes, estimatedValue, ...rest } = values;
      const { data } = await api.put<Lead>(`/leads/${leadId}`, {
        ...rest,
        estimatedValue: estimatedValue ? Number(estimatedValue) : null,
      });
      setLead(data);
      setEditOpen(false);
    } catch (err) {
      alert(apiErrorMessage(err, "Could not update lead."));
    } finally {
      setSubmitting(false);
    }
  }

  async function handleScheduleFollowUp(values: FollowUpFormValues) {
    setSubmitting(true);
    try {
      const { leadId: _ignored, ...rest } = values;
      await api.post("/follow-ups", { ...rest, leadId });
      setFollowUpOpen(false);
    } catch (err) {
      alert(apiErrorMessage(err, "Could not schedule follow-up."));
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) return <PageSpinner />;
  if (error) return <div className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">{error}</div>;
  if (!lead) return null;

  return (
    <div className="space-y-4">
      <button
        onClick={() => router.push("/leads")}
        className="flex items-center gap-1 text-sm font-medium text-ink-500 hover:text-ink-800"
      >
        <ArrowLeft size={15} /> Back to pipeline
      </button>

      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary-100 text-base font-semibold text-primary-700">
            {lead.name.slice(0, 1).toUpperCase()}
          </div>
          <div>
            <h1 className="text-lg font-semibold text-ink-900">{lead.name}</h1>
            <p className="text-sm text-ink-500">{lead.company}</p>
          </div>
          <Badge color={LEAD_STATUS_COLOR[lead.status]}>{LEAD_STATUS_LABEL[lead.status]}</Badge>
        </div>
        <div className="flex gap-2">
          <button className="btn-secondary" onClick={() => setEditOpen(true)}>
            <Pencil size={15} /> Edit
          </button>
          <button className="btn-primary" onClick={() => setFollowUpOpen(true)}>
            <BellRing size={15} /> Schedule Follow-up
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="card space-y-4 p-5">
          <h2 className="text-sm font-semibold text-ink-900">Lead Details</h2>
          <dl className="space-y-3 text-sm">
            <div className="flex items-center gap-2 text-ink-600">
              <Mail size={14} className="text-ink-400" /> {lead.email || "-"}
            </div>
            <div className="flex items-center gap-2 text-ink-600">
              <Phone size={14} className="text-ink-400" /> {lead.phone || "-"}
            </div>
            <div className="flex items-center gap-2 text-ink-600">
              <Building2 size={14} className="text-ink-400" /> {lead.company || "-"}
            </div>
            <div className="flex items-center gap-2 text-ink-600">
              <Globe size={14} className="text-ink-400" /> {lead.source || "-"}
            </div>
            <div className="flex items-center gap-2 text-ink-600">
              <DollarSign size={14} className="text-ink-400" /> {formatCurrency(lead.estimatedValue)}
            </div>
            <div className="flex items-center gap-2 text-ink-600">
              <Star size={14} className="text-ink-400" /> Score: {lead.score ?? "-"}
            </div>
          </dl>
          <div className="border-t border-ink-100 pt-3 text-xs text-ink-400">
            Owner: {lead.assignedToName || "Unassigned"}
          </div>
        </div>

        <div className="card p-5 lg:col-span-2">
          <h2 className="mb-4 text-sm font-semibold text-ink-900">Stage Workflow</h2>
          <div className="flex flex-wrap gap-2">
            {LEAD_STATUSES.map((status) => {
              const active = lead.status === status;
              return (
                <button
                  key={status}
                  disabled={savingStage}
                  onClick={() => handleStageChange(status)}
                  className={`flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition-colors ${
                    active
                      ? "border-primary-600 bg-primary-600 text-white"
                      : "border-ink-200 bg-white text-ink-600 hover:border-primary-300 hover:text-primary-600"
                  }`}
                >
                  {active && <Check size={12} />}
                  {LEAD_STATUS_LABEL[status]}
                </button>
              );
            })}
          </div>
          <p className="mt-3 text-xs text-ink-400">
            Click a stage to move this lead through the pipeline.
          </p>

          <h2 className="mb-3 mt-6 text-sm font-semibold text-ink-900">Activity Timeline</h2>
          {activities.length === 0 ? (
            <EmptyState title="No activity yet" description="Activity on this lead will show up here." />
          ) : (
            <ol className="space-y-4 border-l border-ink-100 pl-4">
              {activities.map((a) => (
                <li key={a.id} className="relative">
                  <span className="absolute -left-[21px] top-1 h-2.5 w-2.5 rounded-full bg-primary-500" />
                  <p className="text-sm font-medium text-ink-800">{titleCase(a.type)}</p>
                  {a.description && <p className="text-sm text-ink-500">{a.description}</p>}
                  <p className="mt-0.5 text-xs text-ink-400">
                    {formatDateTime(a.createdAt)} {a.performedByName ? `· ${a.performedByName}` : ""}
                  </p>
                </li>
              ))}
            </ol>
          )}
        </div>
      </div>

      <LeadModal
        open={editOpen}
        onClose={() => setEditOpen(false)}
        onSubmit={handleEdit}
        initial={lead}
        submitting={submitting}
      />
      <FollowUpModal
        open={followUpOpen}
        onClose={() => setFollowUpOpen(false)}
        onSubmit={handleScheduleFollowUp}
        leads={[lead]}
        lockedLeadId={lead.id}
        submitting={submitting}
      />
    </div>
  );
}
