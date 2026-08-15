"use client";

import { useCallback, useEffect, useState, FormEvent } from "react";
import { Mail, Calendar, MessageSquare, Workflow, Check, Loader2 } from "lucide-react";
import Badge from "@/components/ui/Badge";
import Modal from "@/components/ui/Modal";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import { api, apiErrorMessage } from "@/lib/api";
import { formatDateTime } from "@/lib/utils";

type IntegrationId = "gmail" | "google_calendar" | "whatsapp" | "mailchimp" | "zapier" | "slack";

interface IntegrationDef {
  id: IntegrationId;
  name: string;
  icon: typeof Mail;
  credentialLabel: string;
  credentialPlaceholder: string;
}

// Backend shape, mirrors com.minicrm.dto.IntegrationDTO
interface IntegrationDTO {
  id: number;
  provider: IntegrationId;
  name: string;
  connected: boolean;
  connectedAt?: string;
  connectedByName?: string;
  maskedCredential?: string;
}

const INTEGRATIONS: IntegrationDef[] = [
  { id: "gmail", name: "Gmail", icon: Mail, credentialLabel: "API Key", credentialPlaceholder: "AIza..." },
  { id: "google_calendar", name: "Google Calendar", icon: Calendar, credentialLabel: "API Key", credentialPlaceholder: "AIza..." },
  { id: "whatsapp", name: "WhatsApp", icon: MessageSquare, credentialLabel: "Access Token", credentialPlaceholder: "EAAG..." },
  { id: "mailchimp", name: "Mailchimp", icon: Mail, credentialLabel: "API Key", credentialPlaceholder: "xxxxxxxx-us21" },
  { id: "zapier", name: "Zapier", icon: Workflow, credentialLabel: "Webhook URL", credentialPlaceholder: "https://hooks.zapier.com/..." },
  { id: "slack", name: "Slack", icon: MessageSquare, credentialLabel: "Webhook URL", credentialPlaceholder: "https://hooks.slack.com/..." },
];

type StateMap = Partial<Record<IntegrationId, IntegrationDTO>>;

export default function IntegrationsPanel() {
  const [state, setState] = useState<StateMap>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [connecting, setConnecting] = useState<IntegrationDef | null>(null);
  const [credential, setCredential] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [disconnecting, setDisconnecting] = useState<IntegrationDef | null>(null);
  const [disconnectLoading, setDisconnectLoading] = useState(false);

  const load = useCallback(() => {
    setLoading(true);
    api
      .get<IntegrationDTO[]>("/integrations")
      .then(({ data }) => {
        const map: StateMap = {};
        data.forEach((i) => {
          map[i.provider] = i;
        });
        setState(map);
      })
      .catch((err) => setError(apiErrorMessage(err, "Could not load integrations.")))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  function openConnect(def: IntegrationDef) {
    setConnecting(def);
    setCredential("");
  }

  async function handleConnect(e: FormEvent) {
    e.preventDefault();
    if (!connecting) return;
    setSubmitting(true);
    try {
      const { data } = await api.post<IntegrationDTO>(`/integrations/${connecting.id}/connect`, { credential });
      setState((prev) => ({ ...prev, [connecting.id]: data }));
      setConnecting(null);
    } catch (err) {
      alert(apiErrorMessage(err, "Could not connect integration."));
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDisconnect() {
    if (!disconnecting) return;
    setDisconnectLoading(true);
    try {
      const { data } = await api.delete<IntegrationDTO>(`/integrations/${disconnecting.id}`);
      setState((prev) => ({ ...prev, [disconnecting.id]: data }));
      setDisconnecting(null);
    } catch (err) {
      alert(apiErrorMessage(err, "Could not disconnect integration."));
    } finally {
      setDisconnectLoading(false);
    }
  }

  return (
    <div className="card p-5">
      <h2 className="mb-1 text-sm font-semibold text-ink-900">Integrations</h2>
      <p className="mb-4 text-xs text-ink-400">
        Connect these services to automate emails, calendar sync, and notifications. Credentials are
        stored securely on the server and never shown back in full.
      </p>
      {error && <div className="mb-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">{error}</div>}
      <div className={`grid grid-cols-2 gap-3 sm:grid-cols-3 ${loading ? "opacity-50" : ""}`}>
        {INTEGRATIONS.map((def) => {
          const s = state[def.id];
          const connected = !!s?.connected;
          return (
            <div
              key={def.id}
              className="flex flex-col gap-3 rounded-xl border border-ink-100 p-3 transition-colors hover:border-ink-200"
            >
              <div className="flex items-center gap-3">
                <div
                  className={`flex h-9 w-9 items-center justify-center rounded-lg ${
                    connected ? "bg-emerald-50 text-emerald-600" : "bg-ink-100 text-ink-500"
                  }`}
                >
                  <def.icon size={16} />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-ink-800">{def.name}</p>
                  {connected ? (
                    <Badge color="green" className="mt-0.5">
                      <Check size={11} className="mr-1" /> Connected
                    </Badge>
                  ) : (
                    <p className="text-xs text-ink-400">Not connected</p>
                  )}
                </div>
              </div>

              {connected ? (
                <div className="flex items-center justify-between gap-2">
                  <p className="truncate text-xs text-ink-400" title={s?.connectedAt}>
                    Since {formatDateTime(s?.connectedAt)}
                  </p>
                  <button
                    className="shrink-0 text-xs font-medium text-red-600 hover:underline"
                    onClick={() => setDisconnecting(def)}
                  >
                    Disconnect
                  </button>
                </div>
              ) : (
                <button
                  className="rounded-md border border-ink-200 px-2.5 py-1.5 text-xs font-medium text-ink-600 hover:border-primary-300 hover:bg-primary-50 hover:text-primary-700"
                  onClick={() => openConnect(def)}
                  disabled={loading}
                >
                  Connect
                </button>
              )}
            </div>
          );
        })}
      </div>

      <Modal
        open={!!connecting}
        onClose={() => setConnecting(null)}
        title={connecting ? `Connect ${connecting.name}` : ""}
        widthClass="max-w-sm"
      >
        {connecting && (
          <form onSubmit={handleConnect} className="space-y-4">
            <div>
              <label className="label-field">{connecting.credentialLabel}</label>
              <input
                required
                autoFocus
                className="input-field"
                placeholder={connecting.credentialPlaceholder}
                value={credential}
                onChange={(e) => setCredential(e.target.value)}
              />
              <p className="mt-1 text-xs text-ink-400">
                Stored securely on the server. Only a masked version is ever shown again.
              </p>
            </div>
            <div className="flex justify-end gap-2 pt-1">
              <button type="button" className="btn-secondary" onClick={() => setConnecting(null)}>
                Cancel
              </button>
              <button type="submit" className="btn-primary" disabled={submitting}>
                {submitting ? (
                  <>
                    <Loader2 size={14} className="animate-spin" /> Connecting...
                  </>
                ) : (
                  "Connect"
                )}
              </button>
            </div>
          </form>
        )}
      </Modal>

      <ConfirmDialog
        open={!!disconnecting}
        title="Disconnect integration"
        message={`Disconnect ${disconnecting?.name}? Automations relying on it will stop working.`}
        confirmLabel="Disconnect"
        onCancel={() => setDisconnecting(null)}
        onConfirm={handleDisconnect}
        loading={disconnectLoading}
      />
    </div>
  );
}