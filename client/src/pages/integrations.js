import { useState, useEffect } from 'react';
import ProtectedRoute from '../components/ProtectedRoute';
import AppShell from '../components/AppShell';
import { Puzzle, CheckCircle2, XCircle, RefreshCw, Key, ExternalLink } from 'lucide-react';
import api from '../services/api';

const providers = [
  { id: 'gmail', name: 'Gmail Integration', desc: 'Send automated emails and parse inbox messages', scopes: ['gmail.send', 'gmail.readonly'] },
  { id: 'slack', name: 'Slack Messaging', desc: 'Post automated notifications to Slack channels', scopes: ['chat:write', 'channels:read'] },
  { id: 'discord', name: 'Discord Bot', desc: 'Post announcements and messages via Discord Bot', scopes: ['bot', 'messages.read'] },
  { id: 'google-sheets', name: 'Google Sheets', desc: 'Append data rows and read spreadsheet ranges', scopes: ['spreadsheets'] },
];

export default function IntegrationsPage() {
  const [integrations, setIntegrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProvider, setSelectedProvider] = useState(null);
  const [manualToken, setManualToken] = useState('');

  const fetchIntegrations = async () => {
    setLoading(true);
    try {
      const res = await api.get('/integrations');
      setIntegrations(res.data.data || []);
    } catch (err) {
      console.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIntegrations();
  }, []);

  const handleConnectOAuth = async (providerId) => {
    try {
      const res = await api.get(`/integrations/oauth/${providerId}/start`);
      if (res.data.url) {
        window.location.href = res.data.url;
      }
    } catch (err) {
      alert(`OAuth Error: ${err.message}`);
    }
  };

  const handleSaveManual = async (providerId) => {
    try {
      await api.post('/integrations', {
        provider: providerId,
        credentials: { accessToken: manualToken, apiKey: manualToken },
      });
      alert(`Successfully saved credentials for ${providerId}`);
      setManualToken('');
      setSelectedProvider(null);
      fetchIntegrations();
    } catch (err) {
      alert(`Save Error: ${err.message}`);
    }
  };

  return (
    <ProtectedRoute>
      <AppShell>
        <div className="max-w-7xl mx-auto space-y-6">
          <div>
            <h1 className="text-xl font-bold text-white tracking-tight">Third-Party Integrations</h1>
            <p className="text-xs text-slate-400 mt-1">
              Connect external services via OAuth or API credentials. All tokens are encrypted at rest via AES-256-CBC.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {providers.map((p) => {
              const statusObj = integrations.find((i) => i.provider === p.id);
              const isConnected = statusObj ? statusObj.isConnected : false;

              return (
                <div
                  key={p.id}
                  className="rounded-2xl border border-dark-700 bg-dark-800 p-6 flex flex-col justify-between hover:border-dark-600 transition shadow-sm"
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <div className="p-2 rounded-xl bg-dark-900 border border-dark-700 text-indigo-400">
                          <Puzzle className="h-5 w-5" />
                        </div>
                        <h3 className="text-sm font-bold text-white">{p.name}</h3>
                      </div>

                      <span
                        className={`inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-[11px] font-semibold tracking-wide backdrop-blur-md transition ${
                          isConnected
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 shadow-sm shadow-emerald-500/10'
                            : 'bg-slate-500/10 text-slate-400 border border-slate-500/20'
                        }`}
                      >
                        {isConnected ? <CheckCircle2 className="h-3.5 w-3.5" /> : <XCircle className="h-3.5 w-3.5" />}
                        <span>{isConnected ? 'Connected' : 'Disconnected'}</span>
                      </span>
                    </div>

                    <p className="text-xs text-slate-400 mb-4">{p.desc}</p>
                  </div>

                  <div className="pt-4 border-t border-dark-700 space-y-3">
                    <div className="flex items-center justify-between">
                      <button
                        onClick={() => handleConnectOAuth(p.id)}
                        className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-xs font-semibold shadow-md transition"
                      >
                        <ExternalLink className="h-3.5 w-3.5" />
                        <span>{isConnected ? 'Reconnect OAuth' : 'Connect OAuth'}</span>
                      </button>

                      <button
                        onClick={() => setSelectedProvider(selectedProvider === p.id ? null : p.id)}
                        className="text-xs text-slate-400 hover:text-white flex items-center space-x-1"
                      >
                        <Key className="h-3.5 w-3.5" />
                        <span>API Key Entry</span>
                      </button>
                    </div>

                    {selectedProvider === p.id && (
                      <div className="p-3 rounded-xl bg-dark-900 border border-dark-700 space-y-2">
                        <input
                          type="password"
                          value={manualToken}
                          onChange={(e) => setManualToken(e.target.value)}
                          placeholder="Paste API Key / Access Token..."
                          className="w-full px-3 py-1.5 rounded-lg bg-dark-800 border border-dark-700 text-xs text-white focus:outline-none focus:border-brand-500"
                        />
                        <button
                          onClick={() => handleSaveManual(p.id)}
                          className="w-full py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold"
                        >
                          Save Credentials
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </AppShell>
    </ProtectedRoute>
  );
}
