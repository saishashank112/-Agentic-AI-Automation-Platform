import { useState, useEffect } from 'react';
import Link from 'next/link';
import ProtectedRoute from '../../components/ProtectedRoute';
import AppShell from '../../components/AppShell';
import { PlayCircle, Pause, Play, XCircle, Clock, RefreshCw } from 'lucide-react';
import api from '../../services/api';

export default function ExecutionsIndex() {
  const [executions, setExecutions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');

  const fetchExecutions = async () => {
    setLoading(true);
    try {
      const url = statusFilter ? `/executions?status=${statusFilter}` : '/executions';
      const res = await api.get(url);
      setExecutions(res.data.data || []);
    } catch (err) {
      console.error('Failed to fetch executions:', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExecutions();
  }, [statusFilter]);

  return (
    <ProtectedRoute>
      <AppShell>
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-xl font-bold text-white tracking-tight">Execution Audit Log</h1>
              <p className="text-xs text-slate-400 mt-1">
                Full timeline history and status of all multi-agent workflow runs.
              </p>
            </div>

            <div className="flex items-center space-x-3">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="bg-dark-800 border border-dark-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-brand-500"
              >
                <option value="">All Statuses</option>
                <option value="RUNNING">RUNNING</option>
                <option value="COMPLETED">COMPLETED</option>
                <option value="FAILED">FAILED</option>
                <option value="PAUSED">PAUSED</option>
                <option value="CANCELLED">CANCELLED</option>
              </select>

              <button
                onClick={fetchExecutions}
                className="p-2 rounded-xl bg-dark-800 border border-dark-700 hover:bg-dark-700 text-slate-300"
              >
                <RefreshCw className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Executions Table */}
          <div className="rounded-2xl border border-dark-700 bg-dark-800 overflow-hidden shadow-lg">
            <table className="w-full text-left text-xs">
              <thead className="bg-dark-900/80 border-b border-dark-700 text-slate-400 uppercase font-semibold text-[10px] tracking-wider">
                <tr>
                  <th className="px-6 py-4">Execution ID</th>
                  <th className="px-6 py-4">Workflow Name</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">LangGraph</th>
                  <th className="px-6 py-4">Duration</th>
                  <th className="px-6 py-4">Started At</th>
                  <th className="px-6 py-4 text-right">Timeline</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-dark-700/60">
                {loading ? (
                  <tr>
                    <td colSpan="7" className="px-6 py-8 text-center text-slate-500">
                      Loading execution log history...
                    </td>
                  </tr>
                ) : executions.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="px-6 py-8 text-center text-slate-500">
                      No executions logged yet.
                    </td>
                  </tr>
                ) : (
                  executions.map((exec) => (
                    <tr key={exec._id} className="hover:bg-dark-700/40 transition">
                      <td className="px-6 py-4 font-mono font-semibold text-slate-200">
                        #{exec._id.substring(exec._id.length - 8)}
                      </td>
                      <td className="px-6 py-4 font-medium text-white">
                        {exec.workflowId?.name || 'Automation Workflow'}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex px-2.5 py-1 rounded-full text-[10px] font-bold ${
                            exec.status === 'COMPLETED'
                              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                              : exec.status === 'FAILED'
                              ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                              : exec.status === 'RUNNING'
                              ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 animate-pulse'
                              : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                          }`}
                        >
                          {exec.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-slate-400">
                        {exec.langGraphStatus || 'not-installed'}
                      </td>
                      <td className="px-6 py-4 text-slate-400 font-mono">
                        {exec.duration ? `${exec.duration}ms` : '-'}
                      </td>
                      <td className="px-6 py-4 text-slate-400">
                        {new Date(exec.createdAt).toLocaleString()}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <Link
                          href={`/executions/${exec._id}`}
                          className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-brand-600/20 hover:bg-brand-600/40 text-brand-300 font-semibold text-[11px] transition"
                        >
                          <PlayCircle className="h-3.5 w-3.5" />
                          <span>View Live Log</span>
                        </Link>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </AppShell>
    </ProtectedRoute>
  );
}
