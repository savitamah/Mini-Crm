"use client";

import { useEffect, useState, FormEvent } from "react";
import Modal from "@/components/ui/Modal";
import { Contact } from "@/lib/types";

export interface ContactFormValues {
  name: string;
  company: string;
  email: string;
  phone: string;
  tags: string;
}

const EMPTY: ContactFormValues = { name: "", company: "", email: "", phone: "", tags: "" };

export default function ContactModal({
  open,
  onClose,
  onSubmit,
  initial,
  submitting,
}: {
  open: boolean;
  onClose: () => void;
  onSubmit: (values: ContactFormValues) => void;
  initial?: Contact | null;
  submitting?: boolean;
}) {
  const [values, setValues] = useState<ContactFormValues>(EMPTY);

  useEffect(() => {
    if (open) {
      setValues(
        initial
          ? {
              name: initial.name ?? "",
              company: initial.company ?? "",
              email: initial.email ?? "",
              phone: initial.phone ?? "",
              tags: initial.tags ?? "",
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
    <Modal open={open} onClose={onClose} title={initial ? "Edit Contact" : "Add Contact"}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="label-field">Full Name *</label>
          <input
            required
            className="input-field"
            value={values.name}
            onChange={(e) => setValues({ ...values, name: e.target.value })}
          />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="label-field">Company</label>
            <input
              className="input-field"
              value={values.company}
              onChange={(e) => setValues({ ...values, company: e.target.value })}
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
          <label className="label-field">Tags (comma separated)</label>
          <input
            className="input-field"
            placeholder="Client, Hot"
            value={values.tags}
            onChange={(e) => setValues({ ...values, tags: e.target.value })}
          />
        </div>
        <div className="flex justify-end gap-2 pt-2">
          <button type="button" className="btn-secondary" onClick={onClose}>
            Cancel
          </button>
          <button type="submit" className="btn-primary" disabled={submitting}>
            {submitting ? "Saving..." : "Save Contact"}
          </button>
        </div>
      </form>
    </Modal>
  );
}
