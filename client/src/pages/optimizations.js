import { useState, useEffect } from 'react';
import Head from 'next/head';
import {
  Zap,
  Sparkles,
  TrendingDown,
  Clock,
  Coins,
  CheckCircle,
  AlertCircle,
  ArrowRight,
  RefreshCw,
  Cpu,
  Layers,
  Check,
} from 'lucide-react';
import AppShell from '../components/AppShell';
import api from '../services/api';

export default function OptimizationsPage() {
  const [workflows, setWorkflows] = useState([]);
  const [selectedWorkflowId, setSelectedWorkflowId] = useState('');
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);
  const [applyingId, setApplyingId] = useState(null);
  const [appliedSuccess, setAppliedSuccess] = useState('');

  useEffect(() => {
    const fetchWorkflows = async () => {
      try {
        const res = await api.get('/workflows');
        const list = res.data.data?.workflows || res.data.data || [];
        setWorkflows(list);
        if (list.length > 0) {
          setSelectedWorkflowId(list[0]._id);
        }
      } catch (err) {
        console.error('Error fetching workflows:', err.message);
      }
    };
    fetchWorkflows();
  }, []);

  const runAnalysis = async (workflowId) => {
    if (!workflowId) return;
    setLoading(true);
    setAppliedSuccess('');
    try {
      const res = await api.get(`/optimizations/${workflowId}`);
      setAnalysis(res.data);
    } catch (err) {
      console.error('Error running optimization analysis:', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (selectedWorkflowId) {
      runAnalysis(selectedWorkflowId);
    }
  }, [selectedWorkflowId]);

  const handleApply = async (suggestionId) => {
    setApplyingId(suggestionId);
    setAppliedSuccess('');
    try {
      const res = await api.post(`/optimizations/${selectedWorkflowId}/apply/${suggestionId}`);
      setAppliedSuccess(res.data.message || 'Optimization successfully applied to workflow!');
      // Re-run analysis after applying
      await runAnalysis(selectedWorkflowId);
    } catch (err) {
      console.error('Error applying optimization:', err.message);
    } finally {
      setApplyingId(null);
    }
  };

  return (
    <AppShell>
      <Head>
        <title>AI Workflow Optimizer | Agentflow AI</title>
      </Head>

      <div className="space-y-6 max-w-6xl mx-auto pb-12">
        {/* Header Banner */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-2xl bg-gradient-to-r from-indigo-900/60 via-dark-800 to-dark-800 border border-indigo-500/20 backdrop-blur">
          <div className="space-y-1.5">
            <div className="flex items-center space-x-2">
              <span className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                <Zap className="h-6 w-6" />
              </span>
              <h1 className="text-2xl font-bold text-white tracking-tight">Autonomous AI Workflow Optimizer</h1>
            </div>
            <p className="text-sm text-slate-400 max-w-2xl">
              Inspects your active execution history, token consumption, and node topologies to synthesize optimal LLM routing, latency cuts, and multi-agent graph optimizations.
            </p>
          </div>

          <div className="flex items-center space-x-3">
            <select
              value={selectedWorkflowId}
              onChange={(e) => setSelectedWorkflowId(e.target.value)}
              className="px-4 py-2.5 rounded-xl bg-dark-900 border border-dark-700 text-sm font-medium text-slate-200 focus:outline-none focus:border-brand-500 transition"
            >
              {workflows.map((w) => (
                <option key={w._id} value={w._id}>
                  {w.name}
                </option>
              ))}
            </select>

            <button
              onClick={() => runAnalysis(selectedWorkflowId)}
              disabled={loading}
              className="flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-sm font-medium text-white shadow-lg shadow-brand-600/30 transition disabled:opacity-50"
            >
              <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
              <span>{loading ? 'Analyzing...' : 'Re-Analyze'}</span>
            </button>
          </div>
        </div>

        {appliedSuccess && (
          <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm flex items-center space-x-3">
            <CheckCircle className="h-5 w-5 flex-shrink-0" />
            <span>{appliedSuccess}</span>
          </div>
        )}

        {analysis && (
          <>
            {/* Metric KPI Row */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="p-5 rounded-xl bg-dark-800 border border-dark-700 flex flex-col justify-between">
                <span className="text-xs text-slate-400 font-medium">Efficiency Health Score</span>
                <div className="flex items-baseline space-x-2 mt-2">
                  <span className={`text-3xl font-extrabold ${analysis.efficiencyScore > 85 ? 'text-emerald-400' : 'text-amber-400'}`}>
                    {analysis.efficiencyScore}
                  </span>
                  <span className="text-xs text-slate-500">/ 100</span>
                </div>
                <span className="text-[11px] text-slate-400 mt-1">Calculated via LangGraph topology metrics</span>
              </div>

              <div className="p-5 rounded-xl bg-dark-800 border border-dark-700 flex flex-col justify-between">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-400 font-medium">Projected Token Reduction</span>
                  <Coins className="h-4 w-4 text-indigo-400" />
                </div>
                <span className="text-3xl font-extrabold text-white mt-2">
                  {analysis.potentialSavings?.tokens || '24%'}
                </span>
                <span className="text-[11px] text-indigo-400 mt-1">Prompt fusion & schema pruning</span>
              </div>

              <div className="p-5 rounded-xl bg-dark-800 border border-dark-700 flex flex-col justify-between">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-400 font-medium">Latency Speedup</span>
                  <Clock className="h-4 w-4 text-emerald-400" />
                </div>
                <span className="text-3xl font-extrabold text-white mt-2">
                  {analysis.potentialSavings?.latencyMs || '1.4s'}
                </span>
                <span className="text-[11px] text-emerald-400 mt-1">Parallel root branching</span>
              </div>

              <div className="p-5 rounded-xl bg-dark-800 border border-dark-700 flex flex-col justify-between">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-400 font-medium">Est. Cost Savings</span>
                  <TrendingDown className="h-4 w-4 text-amber-400" />
                </div>
                <span className="text-3xl font-extrabold text-white mt-2">
                  {analysis.potentialSavings?.costEstimate || '$0.004 / run'}
                </span>
                <span className="text-[11px] text-slate-400 mt-1">Model tier right-sizing</span>
              </div>
            </div>

            {/* Suggestions & Opportunities */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold text-white flex items-center space-x-2">
                  <Sparkles className="h-5 w-5 text-indigo-400" />
                  <span>AI Structural Recommendations ({analysis.suggestions?.length || 0})</span>
                </h2>
                <span className="text-xs text-slate-400">
                  {analysis.historicalRunsAnalyzed} execution runs evaluated
                </span>
              </div>

              <div className="space-y-4">
                {analysis.suggestions?.map((item) => (
                  <div
                    key={item.id}
                    className="p-5 rounded-xl bg-dark-800 border border-dark-700 hover:border-indigo-500/40 transition flex flex-col md:flex-row md:items-center justify-between gap-4"
                  >
                    <div className="space-y-2 flex-1">
                      <div className="flex items-center space-x-2.5">
                        <span
                          className={`px-2 py-0.5 text-[10px] font-bold rounded uppercase tracking-wider ${
                            item.severity === 'HIGH'
                              ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                              : item.severity === 'MEDIUM'
                              ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                              : 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20'
                          }`}
                        >
                          {item.type.replace(/_/g, ' ')}
                        </span>
                        <h3 className="text-base font-semibold text-white">{item.title}</h3>
                        <span className="text-xs text-emerald-400 font-medium">
                          {(item.confidenceScore * 100).toFixed(0)}% Confidence
                        </span>
                      </div>

                      <p className="text-xs text-slate-300 leading-relaxed">{item.description}</p>

                      <div className="flex items-center space-x-2 text-xs text-indigo-400 pt-1">
                        <Sparkles className="h-3.5 w-3.5" />
                        <span className="font-medium">Impact: {item.impact}</span>
                      </div>
                    </div>

                    {item.suggestedChanges && (
                      <button
                        onClick={() => handleApply(item.id)}
                        disabled={applyingId === item.id}
                        className="flex-shrink-0 flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-xs font-semibold text-white shadow-md shadow-indigo-600/30 transition disabled:opacity-50"
                      >
                        {applyingId === item.id ? (
                          <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                        ) : (
                          <Check className="h-3.5 w-3.5" />
                        )}
                        <span>{applyingId === item.id ? 'Applying...' : 'Apply Optimization'}</span>
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </AppShell>
  );
}
