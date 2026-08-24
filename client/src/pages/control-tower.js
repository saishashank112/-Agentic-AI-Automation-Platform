import { useState, useEffect } from 'react';
import ProtectedRoute from '../components/ProtectedRoute';
import AppShell from '../components/AppShell';
import { ShieldCheck, Pause, Play, Check, X, Edit3, AlertTriangle, Cpu, Plus, Trash2 } from 'lucide-react';
import api from '../services/api';

export default function ControlTower() {
  const [approvals, setApprovals] = useState([]);
  const [policies, setPolicies] = useState([]);
  const [activeTab, setActiveTab] = useState('approvals'); // 'approvals' | 'policies'
  const [loading, setLoading] = useState(true);

  // Modify Modal State
  const [modifyTarget, setModifyTarget] = useState(null);
  const [modifiedValue, setModifiedValue] = useState('');

  // New Policy State
  const [newPolicyName, setNewPolicyName] = useState('');
  const [newPolicyField, setNewPolicyField] = useState('invoice.amount');
  const [newPolicyVal, setNewPolicyVal] = useState('500000');

  const fetchData = async () => {
    setLoading(true);
    try {
      const [appRes, polRes] = await Promise.all([
        api.get('/approvals'),
        api.get('/policies'),
      ]);
      setApprovals(appRes.data.data || []);
      setPolicies(polRes.data.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleApprove = async (id) => {
    try {
      await api.post(`/approvals/${id}/approve`);
      fetchData();
    } catch (err) {
      alert(`Approve Error: ${err.message}`);
    }
  };

  const handleReject = async (id) => {
    try {
      await api.post(`/approvals/${id}/reject`, { reason: 'Operator rejected in Control Tower' });
      fetchData();
    } catch (err) {
      alert(`Reject Error: ${err.message}`);
    }
  };

  const handleModifySubmit = async () => {
    if (!modifyTarget) return;
    try {
      await api.post(`/approvals/${modifyTarget._id}/modify`, {
        modifiedInput: { value: modifiedValue },
      });
      setModifyTarget(null);
      fetchData();
    } catch (err) {
      alert(`Modify Error: ${err.message}`);
    }
  };

  const handleCreatePolicy = async (e) => {
    e.preventDefault();
    if (!newPolicyName.trim()) return;
    try {
      await api.post('/policies', {
        name: newPolicyName,
        conditions: { field: newPolicyField, operator: '>', value: parseFloat(newPolicyVal) || 500000 },
        action: 'REQUIRE_HUMAN_APPROVAL',
      });
      setNewPolicyName('');
      fetchData();
    } catch (err) {
      alert(`Policy Error: ${err.message}`);
    }
  };

  const handleDeletePolicy = async (id) => {
    try {
      await api.delete(`/policies/${id}`);
      fetchData();
    } catch (err) {
      alert(`Delete Policy Error: ${err.message}`);
    }
  };

  const pendingApprovals = approvals.filter((a) => a.status === 'PENDING');

  return (
    <ProtectedRoute>
      <AppShell>
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Top Banner */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-2xl bg-gradient-to-r from-brand-700/40 via-indigo-900/30 to-dark-800 border border-dark-700">
            <div>
              <div className="flex items-center space-x-2">
                <ShieldCheck className="h-6 w-6 text-indigo-400" />
                <h1 className="text-xl font-bold text-white tracking-tight">Human-in-the-Loop AI Control Tower</h1>
              </div>
              <p className="text-xs text-slate-300 mt-1">
                Centralized AI operations governance plane. Review pending approval requests, inspect explainability reasoning, and enforce automation policies.
              </p>
            </div>
          </div>

          {/* Stat Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="p-4 rounded-xl border border-dark-700 bg-dark-800">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Pending Approvals</span>
              <p className="text-2xl font-bold text-amber-400 mt-1">{pendingApprovals.length}</p>
            </div>

            <div className="p-4 rounded-xl border border-dark-700 bg-dark-800">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Autonomy Score</span>
              <p className="text-2xl font-bold text-emerald-400 mt-1">87%</p>
            </div>

            <div className="p-4 rounded-xl border border-dark-700 bg-dark-800">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Active Policies</span>
              <p className="text-2xl font-bold text-indigo-400 mt-1">{policies.length}</p>
            </div>

            <div className="p-4 rounded-xl border border-dark-700 bg-dark-800">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Prevented Risk Incidents</span>
              <p className="text-2xl font-bold text-cyan-400 mt-1">12</p>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex space-x-3 border-b border-dark-700 pb-2">
            <button
              onClick={() => setActiveTab('approvals')}
              className={`px-4 py-2 text-xs font-semibold rounded-lg transition ${
                activeTab === 'approvals' ? 'bg-brand-600 text-white' : 'text-slate-400 hover:bg-dark-800'
              }`}
            >
              Pending Approvals ({pendingApprovals.length})
            </button>
            <button
              onClick={() => setActiveTab('policies')}
              className={`px-4 py-2 text-xs font-semibold rounded-lg transition ${
                activeTab === 'policies' ? 'bg-brand-600 text-white' : 'text-slate-400 hover:bg-dark-800'
              }`}
            >
              Automation Policy Engine ({policies.length})
            </button>
          </div>

          {/* Tab 1: Pending Approvals Grid */}
          {activeTab === 'approvals' && (
            <div className="space-y-4">
              {pendingApprovals.length === 0 ? (
                <div className="p-12 text-center border border-dark-700 rounded-2xl bg-dark-800/40 text-slate-500 text-xs">
                  Zero pending approval requests. All autonomous agent flows are running within safe confidence thresholds.
                </div>
              ) : (
                pendingApprovals.map((req) => (
                  <div key={req._id} className="p-6 rounded-2xl border border-amber-500/30 bg-dark-800 space-y-4 shadow-xl">
                    <div className="flex items-center justify-between pb-3 border-b border-dark-700">
                      <div className="flex items-center space-x-3">
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20">
                          {req.reason}
                        </span>
                        <h3 className="text-sm font-bold text-white">Approval Request #{req._id.substring(req._id.length - 6)}</h3>
                      </div>
                      <span className="text-xs font-bold text-rose-400">Risk: {req.riskLevel}</span>
                    </div>

                    {/* Explainability Breakdown */}
                    <div className="p-4 rounded-xl bg-dark-900 border border-dark-700 space-y-2 text-xs">
                      <h4 className="font-bold text-indigo-300 uppercase tracking-wider text-[10px]">WHY AM I BEING ASKED?</h4>
                      <p className="text-slate-200 leading-relaxed">{req.description}</p>
                      <div className="flex items-center space-x-4 pt-2 text-[11px] text-slate-400">
                        <span>AI Confidence: <strong className="text-white">{(req.confidence * 100).toFixed(0)}%</strong></span>
                        <span>Node ID: <strong className="text-white">{req.nodeId}</strong></span>
                      </div>
                    </div>

                    {/* Action Controls */}
                    <div className="flex items-center justify-end space-x-3 pt-2">
                      <button
                        onClick={() => {
                          setModifyTarget(req);
                          setModifiedValue(JSON.stringify(req.inputSnapshot || {}, null, 2));
                        }}
                        className="flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-dark-700 hover:bg-dark-600 text-slate-200 text-xs font-semibold border border-dark-600"
                      >
                        <Edit3 className="h-3.5 w-3.5" />
                        <span>Modify & Approve</span>
                      </button>

                      <button
                        onClick={() => handleReject(req._id)}
                        className="flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 text-xs font-semibold"
                      >
                        <X className="h-3.5 w-3.5" />
                        <span>Reject</span>
                      </button>

                      <button
                        onClick={() => handleApprove(req._id)}
                        className="flex items-center space-x-1.5 px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-lg"
                      >
                        <Check className="h-4 w-4" />
                        <span>Approve & Resume</span>
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* Tab 2: Policy Engine */}
          {activeTab === 'policies' && (
            <div className="space-y-6">
              {/* Create Policy Form */}
              <form onSubmit={handleCreatePolicy} className="p-5 rounded-2xl border border-dark-700 bg-dark-800 space-y-4">
                <h3 className="text-sm font-bold text-white">Create New Governance Policy</h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <input
                    type="text"
                    required
                    value={newPolicyName}
                    onChange={(e) => setNewPolicyName(e.target.value)}
                    placeholder="Policy Name (e.g. High Value Invoice Guard)"
                    className="px-3 py-2 rounded-xl bg-dark-900 border border-dark-700 text-xs text-white focus:outline-none focus:border-brand-500"
                  />
                  <input
                    type="text"
                    required
                    value={newPolicyField}
                    onChange={(e) => setNewPolicyField(e.target.value)}
                    placeholder="Field Path (e.g. invoice.amount)"
                    className="px-3 py-2 rounded-xl bg-dark-900 border border-dark-700 text-xs text-white focus:outline-none focus:border-brand-500"
                  />
                  <input
                    type="number"
                    required
                    value={newPolicyVal}
                    onChange={(e) => setNewPolicyVal(e.target.value)}
                    placeholder="Threshold Value (e.g. 500000)"
                    className="px-3 py-2 rounded-xl bg-dark-900 border border-dark-700 text-xs text-white focus:outline-none focus:border-brand-500"
                  />
                </div>
                <button type="submit" className="px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-xs font-semibold flex items-center space-x-2">
                  <Plus className="h-4 w-4" />
                  <span>Add Policy Rule</span>
                </button>
              </form>

              {/* Policy Rules List */}
              <div className="space-y-3">
                {policies.map((p) => (
                  <div key={p._id} className="flex items-center justify-between p-4 rounded-xl bg-dark-800 border border-dark-700">
                    <div>
                      <h4 className="text-xs font-bold text-white">{p.name}</h4>
                      <p className="text-[11px] text-slate-400">
                        IF <code className="text-indigo-400">{p.conditions?.field}</code> {p.conditions?.operator} {p.conditions?.value} → <strong>{p.action}</strong>
                      </p>
                    </div>
                    <button onClick={() => handleDeletePolicy(p._id)} className="p-1.5 text-slate-400 hover:text-rose-400 rounded-lg">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Modify Modal */}
          {modifyTarget && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
              <div className="w-full max-w-lg bg-dark-800 border border-dark-700 rounded-2xl p-6 space-y-4">
                <h3 className="text-sm font-bold text-white">Modify Input Before Approval</h3>
                <p className="text-xs text-slate-400">Edit payload fields before approving execution resumption.</p>
                <textarea
                  rows={6}
                  value={modifiedValue}
                  onChange={(e) => setModifiedValue(e.target.value)}
                  className="w-full p-3 rounded-xl bg-dark-900 border border-dark-700 text-xs text-emerald-400 font-mono focus:outline-none"
                />
                <div className="flex justify-end space-x-3">
                  <button onClick={() => setModifyTarget(null)} className="px-4 py-2 rounded-xl text-xs text-slate-400 hover:text-white">
                    Cancel
                  </button>
                  <button onClick={handleModifySubmit} className="px-5 py-2 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-xs font-bold">
                    Save & Approve
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </AppShell>
    </ProtectedRoute>
  );
}
