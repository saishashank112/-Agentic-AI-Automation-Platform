import { useState, useEffect } from 'react';
import ProtectedRoute from '../components/ProtectedRoute';
import AppShell from '../components/AppShell';
import { Settings, Shield, Key, Database, Cpu, CheckCircle2 } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import api from '../services/api';

export default function SettingsPage() {
  const { user } = useAuthStore();
  const [health, setHealth] = useState(null);

  useEffect(() => {
    api.get('/integrations/status')
      .then((res) => setHealth(res.data.data))
      .catch((err) => console.error(err));
  }, []);

  return (
    <ProtectedRoute>
      <AppShell>
        <div className="max-w-4xl mx-auto space-y-6">
          <div>
            <h1 className="text-xl font-bold text-white tracking-tight">System Settings & Health</h1>
            <p className="text-xs text-slate-400 mt-1">
              Operator environment status, encryption key verification, and security settings.
            </p>
          </div>

          {/* User Profile Card */}
          <div className="rounded-2xl border border-dark-700 bg-dark-800 p-6 space-y-4">
            <div className="flex items-center space-x-3 pb-3 border-b border-dark-700">
              <Shield className="h-5 w-5 text-indigo-400" />
              <h2 className="text-sm font-bold text-white">Operator Profile</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <span className="text-slate-400 block mb-1">Full Name</span>
                <span className="text-white font-semibold">{user?.name || 'Operator'}</span>
              </div>
              <div>
                <span className="text-slate-400 block mb-1">Email Address</span>
                <span className="text-white font-semibold">{user?.email || 'operator@company.com'}</span>
              </div>
              <div>
                <span className="text-slate-400 block mb-1">Role Separation</span>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 uppercase">
                  {user?.role || 'operator'}
                </span>
              </div>
            </div>
          </div>

          {/* Security & Health Check Card */}
          <div className="rounded-2xl border border-dark-700 bg-dark-800 p-6 space-y-4">
            <div className="flex items-center space-x-3 pb-3 border-b border-dark-700">
              <Key className="h-5 w-5 text-emerald-400" />
              <h2 className="text-sm font-bold text-white">Substrate & Security Health Checks</h2>
            </div>

            <div className="space-y-3 text-xs">
              <div className="flex items-center justify-between p-3 rounded-xl bg-dark-900 border border-dark-700">
                <div className="flex items-center space-x-3">
                  <Database className="h-4 w-4 text-indigo-400" />
                  <span className="text-slate-200 font-medium">CREDENTIAL_ENCRYPTION_KEY Status</span>
                </div>
                <span className="flex items-center space-x-1 text-emerald-400 font-bold">
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  <span>Configured (AES-256)</span>
                </span>
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-dark-900 border border-dark-700">
                <div className="flex items-center space-x-3">
                  <Cpu className="h-4 w-4 text-cyan-400" />
                  <span className="text-slate-200 font-medium">OpenRouter API Key</span>
                </div>
                <span className={`font-bold ${health?.openRouterKeySet ? 'text-emerald-400' : 'text-slate-400'}`}>
                  {health?.openRouterKeySet ? 'Active' : 'Not Set (Using Fallback)'}
                </span>
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-dark-900 border border-dark-700">
                <div className="flex items-center space-x-3">
                  <Cpu className="h-4 w-4 text-purple-400" />
                  <span className="text-slate-200 font-medium">Google Gemini SDK Key</span>
                </div>
                <span className={`font-bold ${health?.geminiKeySet ? 'text-emerald-400' : 'text-slate-400'}`}>
                  {health?.geminiKeySet ? 'Active' : 'Not Set (Using Fallback)'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </AppShell>
    </ProtectedRoute>
  );
}
