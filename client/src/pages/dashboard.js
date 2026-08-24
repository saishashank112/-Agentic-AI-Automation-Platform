import { useState, useEffect } from 'react';
import Link from 'next/link';
import ProtectedRoute from '../components/ProtectedRoute';
import AppShell from '../components/AppShell';
import MetricGrid from '../components/MetricGrid';
import { Sparkles, GitFork, PlayCircle, Plus, ArrowUpRight, Activity } from 'lucide-react';
import api from '../services/api';

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchStats = async () => {
    try {
      const res = await api.get('/workflows/dashboard');
      setStats(res.data.data);
    } catch (err) {
      console.error('Error loading dashboard stats:', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  return (
    <ProtectedRoute>
      <AppShell>
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Header Banner */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-2xl bg-gradient-to-r from-brand-700/40 via-indigo-900/30 to-dark-800 border border-dark-700">
            <div>
              <h1 className="text-xl font-bold text-white tracking-tight">Operator Dashboard</h1>
              <p className="text-xs text-slate-300 mt-1">
                Monitor multi-agent execution pipelines and active integrations in real-time.
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <Link
                href="/workflows/builder"
                className="px-4 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-xs font-semibold shadow-lg shadow-brand-600/30 flex items-center space-x-2 transition"
              >
                <Sparkles className="h-4 w-4" />
                <span>Prompt to Workflow</span>
              </Link>
              <Link
                href="/workflows"
                className="px-4 py-2.5 rounded-xl bg-dark-700 hover:bg-dark-600 text-slate-200 text-xs font-semibold border border-dark-600 flex items-center space-x-2 transition"
              >
                <Plus className="h-4 w-4" />
                <span>New Blank Flow</span>
              </Link>
            </div>
          </div>

          {/* Metric Grid */}
          <MetricGrid stats={stats} />

          {/* Main Dashboard Section Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Recent Executions Column */}
            <div className="lg:col-span-2 rounded-2xl border border-dark-700 bg-dark-800 p-6 flex flex-col">
              <div className="flex items-center justify-between mb-4 pb-3 border-b border-dark-700">
                <div className="flex items-center space-x-2">
                  <PlayCircle className="h-5 w-5 text-indigo-400" />
                  <h2 className="text-sm font-bold text-white">Recent Execution Runs</h2>
                </div>
                <Link href="/executions" className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center space-x-1 font-medium">
                  <span>View All</span>
                  <ArrowUpRight className="h-3.5 w-3.5" />
                </Link>
              </div>

              <div className="space-y-3 flex-1">
                {!stats?.recentExecutions || stats.recentExecutions.length === 0 ? (
                  <p className="text-xs text-slate-500 text-center py-8">No recent execution runs logged yet.</p>
                ) : (
                  stats.recentExecutions.map((exec) => (
                    <div
                      key={exec._id}
                      className="flex items-center justify-between p-3.5 rounded-xl bg-dark-900/70 border border-dark-700/80 hover:border-dark-600 transition"
                    >
                      <div>
                        <p className="text-xs font-bold text-slate-200">Execution #{exec._id.substring(exec._id.length - 6)}</p>
                        <span className="text-[10px] text-slate-400">
                          {new Date(exec.createdAt).toLocaleString()} • Duration: {exec.duration || 0}ms
                        </span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <span
                          className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                            exec.status === 'COMPLETED'
                              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                              : exec.status === 'FAILED'
                              ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                              : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                          }`}
                        >
                          {exec.status}
                        </span>
                        <Link
                          href={`/executions/${exec._id}`}
                          className="px-2.5 py-1 text-[11px] font-medium text-slate-300 hover:text-white bg-dark-700 rounded-lg hover:bg-dark-600"
                        >
                          Logs
                        </Link>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* AI Agent Telemetry Activity Feed */}
            <div className="rounded-2xl border border-dark-700 bg-dark-800 p-6 flex flex-col">
              <div className="flex items-center space-x-2 mb-4 pb-3 border-b border-dark-700">
                <Activity className="h-5 w-5 text-cyan-400" />
                <h2 className="text-sm font-bold text-white">Agent Substrate Activity</h2>
              </div>

              <div className="space-y-4 text-xs text-slate-300">
                <div className="p-3.5 rounded-xl bg-dark-900/60 border border-dark-700 space-y-1">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="font-semibold text-indigo-400">Planner Agent</span>
                    <span className="text-[10px] text-slate-500">Substrate Ready</span>
                  </div>
                  <p className="text-slate-400 text-[11px]">Graph topological sorting active. Confidence target &gt; 90%.</p>
                </div>

                <div className="p-3.5 rounded-xl bg-dark-900/60 border border-dark-700 space-y-1">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="font-semibold text-emerald-400">Recovery Agent</span>
                    <span className="text-[10px] text-slate-500">Backoff Online</span>
                  </div>
                  <p className="text-slate-400 text-[11px]">Exponential backoff retry &amp; operator escalation configured.</p>
                </div>

                <div className="p-3.5 rounded-xl bg-dark-900/60 border border-dark-700 space-y-1">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="font-semibold text-purple-400">OAuth Security</span>
                    <span className="text-[10px] text-slate-500">AES-256-CBC</span>
                  </div>
                  <p className="text-slate-400 text-[11px]">Third-party tokens encrypted at rest via CREDENTIAL_ENCRYPTION_KEY.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </AppShell>
    </ProtectedRoute>
  );
}
