"use client";

import { useEffect, useState, FormEvent } from "react";
import Modal from "@/components/ui/Modal";
import { FollowUp, Lead } from "@/lib/types";

export interface FollowUpFormValues {
  title: string;
  leadId: string;
  activityType: string;
  followUpDate: string;
  followUpTime: string;
  reminderOffset: string;
  notes: string;
}

const ACTIVITY_TYPES = ["CALL", "EMAIL", "MEETING", "NOTE", "TASK"];
const REMINDER_OPTIONS = ["15 minutes before", "30 minutes before", "1 hour before", "1 day before"];

function emptyValues(leadId?: number): FollowUpFormValues {
  return {
    title: "",
    leadId: leadId ? String(leadId) : "",
    activityType: "CALL",
    followUpDate: "",
    followUpTime: "",
    reminderOffset: "15 minutes before",
    notes: "",
  };
}

export default function FollowUpModal({
  open,
  onClose,
  onSubmit,
  initial,
  leads,
  lockedLeadId,
  submitting,
}: {
  open: boolean;
  onClose: () => void;
  onSubmit: (values: FollowUpFormValues) => void;
  initial?: FollowUp | null;
  leads: Lead[];
  lockedLeadId?: number;
  submitting?: boolean;
}) {
  const [values, setValues] = useState<FollowUpFormValues>(emptyValues(lockedLeadId));

  useEffect(() => {
    if (open) {
      setValues(
        initial
          ? {
              title: initial.title ?? "",
              leadId: initial.leadId ? String(initial.leadId) : "",
              activityType: initial.activityType ?? "CALL",
              followUpDate: initial.followUpDate ?? "",
              followUpTime: initial.followUpTime?.slice(0, 5) ?? "",
              reminderOffset: initial.reminderOffset ?? "15 minutes before",
              notes: initial.notes ?? "",
            }
          : emptyValues(lockedLeadId)
      );
    }
  }, [open, initial, lockedLeadId]);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    onSubmit(values);
  }

  return (
    <Modal open={open} onClose={onClose} title={initial ? "Edit Follow-up" : "Schedule Follow-up"}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="label-field">Title *</label>
          <input
            required
            className="input-field"
            placeholder="Follow-up call to share proposal"
            value={values.title}
            onChange={(e) => setValues({ ...values, title: e.target.value })}
          />
        </div>
        {!lockedLeadId && (
          <div>
            <label className="label-field">Lead</label>
            <select
              className="input-field"
              value={values.leadId}
              onChange={(e) => setValues({ ...values, leadId: e.target.value })}
            >
              <option value="">Select a lead</option>
              {leads.map((l) => (
                <option key={l.id} value={l.id}>
                  {l.name} {l.company ? `— ${l.company}` : ""}
                </option>
              ))}
            </select>
          </div>
        )}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="label-field">Activity Type</label>
            <select
              className="input-field"
              value={values.activityType}
              onChange={(e) => setValues({ ...values, activityType: e.target.value })}
            >
              {ACTIVITY_TYPES.map((t) => (
                <option key={t} value={t}>
                  {t.charAt(0) + t.slice(1).toLowerCase()}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="label-field">Reminder</label>
            <select
              className="input-field"
              value={values.reminderOffset}
              onChange={(e) => setValues({ ...values, reminderOffset: e.target.value })}
            >
              {REMINDER_OPTIONS.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="label-field">Follow-up Date *</label>
            <input
              required
              type="date"
              className="input-field"
              value={values.followUpDate}
              onChange={(e) => setValues({ ...values, followUpDate: e.target.value })}
            />
          </div>
          <div>
            <label className="label-field">Time</label>
            <input
              type="time"
              className="input-field"
              value={values.followUpTime}
              onChange={(e) => setValues({ ...values, followUpTime: e.target.value })}
            />
          </div>
        </div>
        <div>
          <label className="label-field">Notes</label>
          <textarea
            className="input-field"
            rows={3}
            value={values.notes}
            onChange={(e) => setValues({ ...values, notes: e.target.value })}
          />
        </div>
        <div className="flex justify-end gap-2 pt-2">
          <button type="button" className="btn-secondary" onClick={onClose}>
            Cancel
          </button>
          <button type="submit" className="btn-primary" disabled={submitting}>
            {submitting ? "Saving..." : "Schedule"}
          </button>
        </div>
      </form>
    </Modal>
  );
}
