"use client";

import { useEffect, useState, FormEvent } from "react";
import Modal from "@/components/ui/Modal";
import { Lead, LEAD_STATUSES, LEAD_STATUS_LABEL } from "@/lib/types";

export interface LeadFormValues {
  name: string;
  company: string;
  email: string;
  phone: string;
  source: string;
  status: string;
  estimatedValue: string;
  notes: string;
}

const EMPTY: LeadFormValues = {
  name: "",
  company: "",
  email: "",
  phone: "",
  source: "Website",
  status: "NEW",
  estimatedValue: "",
  notes: "",
};

const SOURCES = ["Website", "Referral", "Social Media", "Email Campaign", "Cold Call", "Other"];

export default function LeadModal({
  open,
  onClose,
  onSubmit,
  initial,
  submitting,
}: {
  open: boolean;
  onClose: () => void;
  onSubmit: (values: LeadFormValues) => void;
  initial?: Lead | null;
  submitting?: boolean;
}) {
  const [values, setValues] = useState<LeadFormValues>(EMPTY);

  useEffect(() => {
    if (open) {
      setValues(
        initial
          ? {
              name: initial.name ?? "",
              company: initial.company ?? "",
              email: initial.email ?? "",
              phone: initial.phone ?? "",
              source: initial.source ?? "Website",
              status: initial.status ?? "NEW",
              estimatedValue: initial.estimatedValue?.toString() ?? "",
              notes: "",
            }
          : EMPTY
      );
    }
  }, [open, initial]);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    onSubmit(values);
  }

  return (
    <Modal open={open} onClose={onClose} title={initial ? "Edit Lead" : "Add New Lead"}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div className="col-span-2">
            <label className="label-field">Full Name *</label>
            <input
              required
              className="input-field"
              value={values.name}
              onChange={(e) => setValues({ ...values, name: e.target.value })}
            />
          </div>
          <div>
            <label className="label-field">Company</label>
            <input
              className="input-field"
              value={values.company}
              onChange={(e) => setValues({ ...values, company: e.target.value })}
            />
          </div>
          <div>
            <label className="label-field">Email</label>
            <input
              type="email"
              className="input-field"
              value={values.email}
              onChange={(e) => setValues({ ...values, email: e.target.value })}
            />
          </div>
          <div>
            <label className="label-field">Phone</label>
            <input
              className="input-field"
              value={values.phone}
              onChange={(e) => setValues({ ...values, phone: e.target.value })}
            />
          </div>
          <div>
            <label className="label-field">Source</label>
            <select
              className="input-field"
              value={values.source}
              onChange={(e) => setValues({ ...values, source: e.target.value })}
            >
              {SOURCES.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="label-field">Stage</label>
            <select
              className="input-field"
              value={values.status}
              onChange={(e) => setValues({ ...values, status: e.target.value })}
            >
              {LEAD_STATUSES.map((s) => (
                <option key={s} value={s}>
                  {LEAD_STATUS_LABEL[s]}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="label-field">Estimated Value ($)</label>
            <input
              type="number"
              min="0"
              className="input-field"
              value={values.estimatedValue}
              onChange={(e) => setValues({ ...values, estimatedValue: e.target.value })}
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
            {submitting ? "Saving..." : "Save Lead"}
          </button>
        </div>
      </form>
    </Modal>
  );
}
