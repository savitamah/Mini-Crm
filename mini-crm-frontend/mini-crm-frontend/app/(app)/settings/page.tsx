"use client";

import { useCallback, useEffect, useState, FormEvent } from "react";
import { Plus, Pencil, Trash2, UserCog } from "lucide-react";
import { api, apiErrorMessage } from "@/lib/api";
import { User, RoleType } from "@/lib/types";
import { titleCase } from "@/lib/utils";
import Badge from "@/components/ui/Badge";
import Modal from "@/components/ui/Modal";
import { PageSpinner } from "@/components/ui/Spinner";
import EmptyState from "@/components/ui/EmptyState";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import IntegrationsPanel from "@/components/settings/IntegrationsPanel";
import { useAuth } from "@/lib/auth";

const ROLES: RoleType[] = ["ADMIN", "MANAGER", "SALES_REP"];
const ROLE_COLOR: Record<RoleType, "purple" | "blue" | "green"> = {
  ADMIN: "purple",
  MANAGER: "blue",
  SALES_REP: "green",
};

export default function SettingsPage() {
  const { session } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<User | null>(null);
  const [form, setForm] = useState({ name: "", email: "", role: "SALES_REP" as RoleType, password: "" });
  const [submitting, setSubmitting] = useState(false);
  const [deleting, setDeleting] = useState<User | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const load = useCallback(() => {
    setLoading(true);
    api
      .get<User[]>("/users")
      .then(({ data }) => setUsers(data))
      .catch((err) => setError(apiErrorMessage(err, "Could not load users.")))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  function openCreate() {
    setEditing(null);
    setForm({ name: "", email: "", role: "SALES_REP", password: "" });
    setModalOpen(true);
  }

  function openEdit(u: User) {
    setEditing(u);
    setForm({ name: u.name, email: u.email, role: u.role, password: "" });
    setModalOpen(true);
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    try {
      if (editing) {
        await api.put(`/users/${editing.id}`, { name: form.name, email: form.email, role: form.role });
      } else {
        await api.post("/users", {
          name: form.name,
          email: form.email,
          role: form.role,
          password: form.password || undefined,
        });
      }
      setModalOpen(false);
      load();
    } catch (err) {
      alert(apiErrorMessage(err, "Could not save user."));
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete() {
    if (!deleting) return;
    setDeleteLoading(true);
    try {
      await api.delete(`/users/${deleting.id}`);
      setDeleting(null);
      load();
    } catch (err) {
      alert(apiErrorMessage(err, "Could not delete user."));
    } finally {
      setDeleteLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-lg font-semibold text-ink-900">Settings &amp; Integrations</h1>
        <p className="text-sm text-ink-500">Customize the CRM and manage your team.</p>
      </div>

      <div className="card p-5">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-ink-900">Users &amp; Roles</h2>
          <button className="btn-primary" onClick={openCreate}>
            <Plus size={16} /> Add User
          </button>
        </div>

        {loading ? (
          <PageSpinner />
        ) : error ? (
          <div className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">{error}</div>
        ) : users.length === 0 ? (
          <EmptyState icon={<UserCog size={28} />} title="No team members yet" />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-ink-100 text-xs uppercase tracking-wide text-ink-400">
                  <th className="py-2 pr-4 font-medium">Name</th>
                  <th className="py-2 pr-4 font-medium">Email</th>
                  <th className="py-2 pr-4 font-medium">Role</th>
                  <th className="py-2 pr-4 font-medium">Status</th>
                  <th className="py-2 pr-0 text-right font-medium">Action</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u.id} className="border-b border-ink-50 last:border-0 hover:bg-ink-50/60">
                    <td className="py-3 pr-4 font-medium text-ink-800">
                      {u.name} {u.id === session?.id && <span className="text-xs text-ink-400">(you)</span>}
                    </td>
                    <td className="py-3 pr-4 text-ink-500">{u.email}</td>
                    <td className="py-3 pr-4">
                      <Badge color={ROLE_COLOR[u.role]}>{titleCase(u.role)}</Badge>
                    </td>
                    <td className="py-3 pr-4 text-ink-500">{titleCase(u.status || "ACTIVE")}</td>
                    <td className="py-3 pr-0">
                      <div className="flex justify-end gap-1">
                        <button
                          className="rounded-md p-1.5 text-ink-400 hover:bg-ink-100 hover:text-primary-600"
                          onClick={() => openEdit(u)}
                        >
                          <Pencil size={15} />
                        </button>
                        <button
                          className="rounded-md p-1.5 text-ink-400 hover:bg-red-50 hover:text-red-600"
                          onClick={() => setDeleting(u)}
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

      <IntegrationsPanel />

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editing ? "Edit User" : "Add User"}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="label-field">Name *</label>
            <input
              required
              className="input-field"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
          </div>
          <div>
            <label className="label-field">Email *</label>
            <input
              type="email"
              required
              disabled={!!editing}
              className="input-field disabled:bg-ink-50"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
          </div>
          <div>
            <label className="label-field">Role</label>
            <select
              className="input-field"
              value={form.role}
              onChange={(e) => setForm({ ...form, role: e.target.value as RoleType })}
            >
              {ROLES.map((r) => (
                <option key={r} value={r}>
                  {titleCase(r)}
                </option>
              ))}
            </select>
          </div>
          {!editing && (
            <div>
              <label className="label-field">Temporary Password</label>
              <input
                type="password"
                className="input-field"
                placeholder="Defaults to changeme123"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
              />
            </div>
          )}
          <div className="flex justify-end gap-2 pt-2">
            <button type="button" className="btn-secondary" onClick={() => setModalOpen(false)}>
              Cancel
            </button>
            <button type="submit" className="btn-primary" disabled={submitting}>
              {submitting ? "Saving..." : "Save User"}
            </button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        open={!!deleting}
        title="Remove user"
        message={`Remove "${deleting?.name}" from your team?`}
        onCancel={() => setDeleting(null)}
        onConfirm={handleDelete}
        loading={deleteLoading}
      />
    </div>
  );
}