"use client";

import { useCallback, useEffect, useState } from "react";
import { Plus, Pencil, Trash2, ListChecks } from "lucide-react";
import { api, apiErrorMessage } from "@/lib/api";
import { TaskItem } from "@/lib/types";
import { TASK_STATUS_COLOR, TASK_PRIORITY_COLOR } from "@/lib/leadStatusColors";
import { formatDate, titleCase } from "@/lib/utils";
import Badge from "@/components/ui/Badge";
import { PageSpinner } from "@/components/ui/Spinner";
import EmptyState from "@/components/ui/EmptyState";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import TaskModal, { TaskFormValues } from "@/components/tasks/TaskModal";

export default function TasksPage() {
  const [tasks, setTasks] = useState<TaskItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<TaskItem | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [deleting, setDeleting] = useState<TaskItem | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const load = useCallback(() => {
    setLoading(true);
    api
      .get<TaskItem[]>("/tasks")
      .then(({ data }) => setTasks(data))
      .catch((err) => setError(apiErrorMessage(err, "Could not load tasks.")))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function handleSubmit(values: TaskFormValues) {
    setSubmitting(true);
    try {
      if (editing) {
        await api.put(`/tasks/${editing.id}`, values);
      } else {
        await api.post("/tasks", values);
      }
      setModalOpen(false);
      setEditing(null);
      load();
    } catch (err) {
      alert(apiErrorMessage(err, "Could not save task."));
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete() {
    if (!deleting) return;
    setDeleteLoading(true);
    try {
      await api.delete(`/tasks/${deleting.id}`);
      setDeleting(null);
      load();
    } catch (err) {
      alert(apiErrorMessage(err, "Could not delete task."));
    } finally {
      setDeleteLoading(false);
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-lg font-semibold text-ink-900">Tasks</h1>
          <p className="text-sm text-ink-500">Create tasks and stay productive.</p>
        </div>
        <button
          className="btn-primary"
          onClick={() => {
            setEditing(null);
            setModalOpen(true);
          }}
        >
          <Plus size={16} /> Add Task
        </button>
      </div>

      <div className="card p-4">
        {loading ? (
          <PageSpinner />
        ) : error ? (
          <div className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">{error}</div>
        ) : tasks.length === 0 ? (
          <EmptyState icon={<ListChecks size={28} />} title="No tasks yet" description="Add a task to track your to-dos." />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-ink-100 text-xs uppercase tracking-wide text-ink-400">
                  <th className="py-2 pr-4 font-medium">Task</th>
                  <th className="py-2 pr-4 font-medium">Due Date</th>
                  <th className="py-2 pr-4 font-medium">Priority</th>
                  <th className="py-2 pr-4 font-medium">Assigned To</th>
                  <th className="py-2 pr-4 font-medium">Status</th>
                  <th className="py-2 pr-0 text-right font-medium">Action</th>
                </tr>
              </thead>
              <tbody>
                {tasks.map((t) => (
                  <tr key={t.id} className="border-b border-ink-50 last:border-0 hover:bg-ink-50/60">
                    <td className="py-3 pr-4">
                      <p className="font-medium text-ink-800">{t.title}</p>
                      {t.description && <p className="text-xs text-ink-400">{t.description}</p>}
                    </td>
                    <td className="py-3 pr-4 text-ink-500">{formatDate(t.dueDate)}</td>
                    <td className="py-3 pr-4">
                      <Badge color={TASK_PRIORITY_COLOR[t.priority]}>{titleCase(t.priority)}</Badge>
                    </td>
                    <td className="py-3 pr-4 text-ink-500">{t.assignedToName || "-"}</td>
                    <td className="py-3 pr-4">
                      <Badge color={TASK_STATUS_COLOR[t.status]}>{titleCase(t.status)}</Badge>
                    </td>
                    <td className="py-3 pr-0">
                      <div className="flex justify-end gap-1">
                        <button
                          className="rounded-md p-1.5 text-ink-400 hover:bg-ink-100 hover:text-primary-600"
                          onClick={() => {
                            setEditing(t);
                            setModalOpen(true);
                          }}
                        >
                          <Pencil size={15} />
                        </button>
                        <button
                          className="rounded-md p-1.5 text-ink-400 hover:bg-red-50 hover:text-red-600"
                          onClick={() => setDeleting(t)}
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <TaskModal
        open={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setEditing(null);
        }}
        onSubmit={handleSubmit}
        initial={editing}
        submitting={submitting}
      />
      <ConfirmDialog
        open={!!deleting}
        title="Delete task"
        message={`Delete "${deleting?.title}"? This can't be undone.`}
        onCancel={() => setDeleting(null)}
        onConfirm={handleDelete}
        loading={deleteLoading}
      />
    </div>
  );
}
