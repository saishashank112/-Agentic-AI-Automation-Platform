import { useState, useEffect } from 'react';
import Link from 'next/link';
import ProtectedRoute from '../../components/ProtectedRoute';
import AppShell from '../../components/AppShell';
import { GitFork, Sparkles, Plus, Play, Copy, Trash2, Search } from 'lucide-react';
import api from '../../services/api';

export default function WorkflowsIndex() {
  const [workflows, setWorkflows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const fetchWorkflows = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/workflows?search=${encodeURIComponent(search)}`);
      const list = Array.isArray(res.data.data) ? res.data.data : (res.data.data?.workflows || []);
      setWorkflows(list);
    } catch (err) {
      console.error('Failed to fetch workflows:', err.message);
      setWorkflows([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWorkflows();
  }, [search]);

  const handleDuplicate = async (id) => {
    try {
      await api.post(`/workflows/${id}/duplicate`);
      fetchWorkflows();
    } catch (err) {
      alert(`Duplicate failed: ${err.message}`);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this workflow?')) return;
    try {
      await api.delete(`/workflows/${id}`);
      fetchWorkflows();
    } catch (err) {
      alert(`Delete failed: ${err.message}`);
    }
  };

  const handleExecute = async (id) => {
    try {
      const res = await api.post(`/workflows/${id}/execute`);
      alert(`Triggered Execution Run #${res.data.data._id}`);
    } catch (err) {
      alert(`Execution failed: ${err.message}`);
    }
  };

  return (
    <ProtectedRoute>
      <AppShell>
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-xl font-bold text-white tracking-tight">Workflows Library</h1>
              <p className="text-xs text-slate-400 mt-1">Manage, clone, and execute visual workflow graphs.</p>
            </div>
            <div className="flex items-center space-x-3">
              <Link
                href="/workflows/builder"
                className="px-4 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-xs font-semibold shadow-lg shadow-brand-600/30 flex items-center space-x-2 transition"
              >
                <Sparkles className="h-4 w-4" />
                <span>Generate via AI</span>
              </Link>
            </div>
          </div>

          {/* Search bar */}
          <div className="relative max-w-md">
            <Search className="h-4 w-4 absolute left-3.5 top-3 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search workflows by title..."
              className="w-full pl-10 pr-4 py-2 rounded-xl bg-dark-800 border border-dark-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-brand-500"
            />
          </div>

          {/* Grid of Workflows */}
          {loading ? (
            <p className="text-xs text-slate-400 py-12 text-center">Loading workflows...</p>
          ) : workflows.length === 0 ? (
            <div className="p-12 text-center border border-dashed border-dark-700 rounded-2xl bg-dark-800/40">
              <GitFork className="h-10 w-10 text-slate-500 mx-auto mb-3" />
              <h3 className="text-sm font-bold text-white">No Workflows Found</h3>
              <p className="text-xs text-slate-400 mt-1 mb-4">
                Describe an automation prompt or create your first workflow graph.
              </p>
              <Link
                href="/workflows/builder"
                className="inline-flex items-center space-x-2 px-4 py-2 rounded-xl bg-brand-600 text-white text-xs font-semibold"
              >
                <Sparkles className="h-4 w-4" />
                <span>Build with AI</span>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {workflows.map((wf) => (
                <div
                  key={wf._id}
                  className="rounded-2xl border border-dark-700 bg-dark-800 p-5 flex flex-col justify-between hover:border-dark-600 transition shadow-sm"
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                        v{wf.version || 1}
                      </span>
                      <span className="text-[10px] text-slate-500 uppercase font-semibold">{wf.status}</span>
                    </div>
                    <h3 className="text-sm font-bold text-white mb-1.5 line-clamp-1">{wf.name}</h3>
                    <p className="text-xs text-slate-400 mb-4 line-clamp-2">{wf.description || 'No description provided.'}</p>
                  </div>

                  <div className="pt-4 border-t border-dark-700 flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleExecute(wf._id)}
                        title="Trigger Execution"
                        className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 border border-emerald-500/20 text-xs font-semibold transition"
                      >
                        <Play className="h-3.5 w-3.5" />
                        <span>Run</span>
                      </button>
                      <button
                        onClick={() => handleDuplicate(wf._id)}
                        title="Duplicate"
                        className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-dark-700 transition"
                      >
                        <Copy className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(wf._id)}
                        title="Delete"
                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-dark-700 transition"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>

                    <Link
                      href={`/workflows/${wf._id}`}
                      className="text-xs text-brand-400 hover:text-brand-300 font-semibold"
                    >
                      Edit Canvas →
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </AppShell>
    </ProtectedRoute>
  );
}
