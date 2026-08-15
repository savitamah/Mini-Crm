"use client";

import { useCallback, useEffect, useState } from "react";
import { Search, Plus, Pencil, Trash2, ChevronLeft, ChevronRight, Users } from "lucide-react";
import { api, apiErrorMessage } from "@/lib/api";
import { Contact, Page } from "@/lib/types";
import { formatDate } from "@/lib/utils";
import Badge from "@/components/ui/Badge";
import { PageSpinner } from "@/components/ui/Spinner";
import EmptyState from "@/components/ui/EmptyState";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import ContactModal, { ContactFormValues } from "@/components/contacts/ContactModal";

const PAGE_SIZE = 8;

export default function ContactsPage() {
  const [data, setData] = useState<Page<Contact> | null>(null);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Contact | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [deleting, setDeleting] = useState<Contact | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const load = useCallback(() => {
    setLoading(true);
    api
      .get<Page<Contact>>("/contacts", { params: { search: search || undefined, page, size: PAGE_SIZE } })
      .then(({ data }) => setData(data))
      .catch((err) => setError(apiErrorMessage(err, "Could not load contacts.")))
      .finally(() => setLoading(false));
  }, [search, page]);

  useEffect(() => {
    const t = setTimeout(load, 250);
    return () => clearTimeout(t);
  }, [load]);

  async function handleSubmit(values: ContactFormValues) {
    setSubmitting(true);
    try {
      if (editing) {
        await api.put(`/contacts/${editing.id}`, values);
      } else {
        await api.post("/contacts", values);
      }
      setModalOpen(false);
      setEditing(null);
      load();
    } catch (err) {
      alert(apiErrorMessage(err, "Could not save contact."));
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete() {
    if (!deleting) return;
    setDeleteLoading(true);
    try {
      await api.delete(`/contacts/${deleting.id}`);
      setDeleting(null);
      load();
    } catch (err) {
      alert(apiErrorMessage(err, "Could not delete contact."));
    } finally {
      setDeleteLoading(false);
    }
  }

  const totalPages = data?.totalPages ?? 0;

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-lg font-semibold text-ink-900">Contacts</h1>
          <p className="text-sm text-ink-500">Add, view and manage all contacts.</p>
        </div>
        <button
          className="btn-primary"
          onClick={() => {
            setEditing(null);
            setModalOpen(true);
          }}
        >
          <Plus size={16} /> Add Contact
        </button>
      </div>

      <div className="card p-4">
        <div className="relative mb-4 max-w-xs">
          <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-ink-400" size={16} />
          <input
            className="input-field pl-9"
            placeholder="Search contacts..."
            value={search}
            onChange={(e) => {
              setPage(0);
              setSearch(e.target.value);
            }}
          />
        </div>

        {loading ? (
          <PageSpinner />
        ) : error ? (
          <div className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">{error}</div>
        ) : !data || data.content.length === 0 ? (
          <EmptyState
            icon={<Users size={28} />}
            title="No contacts found"
            description="Try a different search, or add your first contact."
          />
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-ink-100 text-xs uppercase tracking-wide text-ink-400">
                    <th className="py-2 pr-4 font-medium">Name</th>
                    <th className="py-2 pr-4 font-medium">Company</th>
                    <th className="py-2 pr-4 font-medium">Email</th>
                    <th className="py-2 pr-4 font-medium">Phone</th>
                    <th className="py-2 pr-4 font-medium">Tags</th>
                    <th className="py-2 pr-4 font-medium">Added</th>
                    <th className="py-2 pr-0 text-right font-medium">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {data.content.map((c) => (
                    <tr key={c.id} className="border-b border-ink-50 last:border-0 hover:bg-ink-50/60">
                      <td className="py-3 pr-4 font-medium text-ink-800">{c.name}</td>
                      <td className="py-3 pr-4 text-ink-500">{c.company || "-"}</td>
                      <td className="py-3 pr-4 text-ink-500">{c.email || "-"}</td>
                      <td className="py-3 pr-4 text-ink-500">{c.phone || "-"}</td>
                      <td className="py-3 pr-4">
                        <div className="flex flex-wrap gap-1">
                          {(c.tags || "")
                            .split(",")
                            .map((t) => t.trim())
                            .filter(Boolean)
                            .map((t) => (
                              <Badge key={t} color="blue">
                                {t}
                              </Badge>
                            ))}
                        </div>
                      </td>
                      <td className="py-3 pr-4 text-ink-400">{formatDate(c.createdAt)}</td>
                      <td className="py-3 pr-0">
                        <div className="flex justify-end gap-1">
                          <button
                            className="rounded-md p-1.5 text-ink-400 hover:bg-ink-100 hover:text-primary-600"
                            onClick={() => {
                              setEditing(c);
                              setModalOpen(true);
                            }}
                          >
                            <Pencil size={15} />
                          </button>
                          <button
                            className="rounded-md p-1.5 text-ink-400 hover:bg-red-50 hover:text-red-600"
                            onClick={() => setDeleting(c)}
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

            <div className="mt-4 flex items-center justify-between text-xs text-ink-500">
              <span>
                Showing {page * PAGE_SIZE + 1} to {Math.min((page + 1) * PAGE_SIZE, data.totalElements)} of{" "}
                {data.totalElements} entries
              </span>
              <div className="flex items-center gap-1">
                <button
                  disabled={page === 0}
                  onClick={() => setPage((p) => Math.max(0, p - 1))}
                  className="rounded-md border border-ink-200 p-1.5 disabled:opacity-40"
                >
                  <ChevronLeft size={14} />
                </button>
                <span className="px-2">
                  Page {page + 1} of {Math.max(totalPages, 1)}
                </span>
                <button
                  disabled={page + 1 >= totalPages}
                  onClick={() => setPage((p) => p + 1)}
                  className="rounded-md border border-ink-200 p-1.5 disabled:opacity-40"
                >
                  <ChevronRight size={14} />
                </button>
              </div>
            </div>
          </>
        )}
      </div>

      <ContactModal
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
        title="Delete contact"
        message={`Are you sure you want to delete "${deleting?.name}"? This can't be undone.`}
        onCancel={() => setDeleting(null)}
        onConfirm={handleDelete}
        loading={deleteLoading}
      />
    </div>
  );
}
