"use client";

import { useEffect, useState, FormEvent } from "react";
import Modal from "@/components/ui/Modal";
import { TaskItem } from "@/lib/types";

export interface TaskFormValues {
  title: string;
  description: string;
  dueDate: string;
  priority: string;
  status: string;
}

const EMPTY: TaskFormValues = {
  title: "",
  description: "",
  dueDate: "",
  priority: "MEDIUM",
  status: "PENDING",
};

export default function TaskModal({
  open,
  onClose,
  onSubmit,
  initial,
  submitting,
}: {
  open: boolean;
  onClose: () => void;
  onSubmit: (values: TaskFormValues) => void;
  initial?: TaskItem | null;
  submitting?: boolean;
}) {
  const [values, setValues] = useState<TaskFormValues>(EMPTY);

  useEffect(() => {
    if (open) {
      setValues(
        initial
          ? {
              title: initial.title ?? "",
              description: initial.description ?? "",
              dueDate: initial.dueDate ?? "",
              priority: initial.priority ?? "MEDIUM",
              status: initial.status ?? "PENDING",
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
    <Modal open={open} onClose={onClose} title={initial ? "Edit Task" : "Add Task"}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="label-field">Task *</label>
          <input
            required
            className="input-field"
            value={values.title}
            onChange={(e) => setValues({ ...values, title: e.target.value })}
          />
        </div>
        <div>
          <label className="label-field">Description</label>
          <textarea
            className="input-field"
            rows={2}
            value={values.description}
            onChange={(e) => setValues({ ...values, description: e.target.value })}
          />
        </div>
        <div className="grid grid-cols-3 gap-3">
          <div>
            <label className="label-field">Due Date</label>
            <input
              type="date"
              className="input-field"
              value={values.dueDate}
              onChange={(e) => setValues({ ...values, dueDate: e.target.value })}
            />
          </div>
          <div>
            <label className="label-field">Priority</label>
            <select
              className="input-field"
              value={values.priority}
              onChange={(e) => setValues({ ...values, priority: e.target.value })}
            >
              <option value="LOW">Low</option>
              <option value="MEDIUM">Medium</option>
              <option value="HIGH">High</option>
            </select>
          </div>
          <div>
            <label className="label-field">Status</label>
            <select
              className="input-field"
              value={values.status}
              onChange={(e) => setValues({ ...values, status: e.target.value })}
            >
              <option value="PENDING">Pending</option>
              <option value="IN_PROGRESS">In Progress</option>
              <option value="COMPLETED">Completed</option>
            </select>
          </div>
        </div>
        <div className="flex justify-end gap-2 pt-2">
          <button type="button" className="btn-secondary" onClick={onClose}>
            Cancel
          </button>
          <button type="submit" className="btn-primary" disabled={submitting}>
            {submitting ? "Saving..." : "Save Task"}
          </button>
        </div>
      </form>
    </Modal>
  );
}
