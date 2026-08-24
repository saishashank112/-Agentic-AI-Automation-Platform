import { useState } from 'react';
import { X, Sparkles, AlertTriangle, ShieldCheck, Cpu, HelpCircle, ArrowRight } from 'lucide-react';
import api from '../../services/api';

export default function SimulationModal({ workflowId, onClose }) {
  const [simulation, setSimulation] = useState(null);
  const [loading, setLoading] = useState(false);
  const [scenarioInput, setScenarioInput] = useState('');

  const runSimulation = async (scenario = null) => {
    setLoading(true);
    try {
      const res = await api.post(`/workflows/${workflowId}/simulate`, { scenarioCondition: scenario });
      setSimulation(res.data.data);
    } catch (err) {
      alert(`Simulation Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleScenarioSubmit = (e) => {
    e.preventDefault();
    if (!scenarioInput.trim()) return;
    runSimulation(scenarioInput);
  };

  const getRiskBadge = (level) => {
    switch (level) {
      case 'CRITICAL':
        return <span className="px-3 py-1 rounded-full text-xs font-extrabold bg-rose-500/10 text-rose-400 border border-rose-500/20">CRITICAL RISK</span>;
      case 'HIGH':
        return <span className="px-3 py-1 rounded-full text-xs font-extrabold bg-amber-500/10 text-amber-400 border border-amber-500/20">HIGH RISK</span>;
      case 'MODERATE':
        return <span className="px-3 py-1 rounded-full text-xs font-extrabold bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">MODERATE RISK</span>;
      default:
        return <span className="px-3 py-1 rounded-full text-xs font-extrabold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">LOW RISK</span>;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="w-full max-w-3xl bg-dark-800 border border-dark-700 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-dark-700 bg-dark-900">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400">
              <Cpu className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white tracking-tight">AI Workflow Simulator / Digital Twin</h2>
              <span className="text-[10px] text-cyan-400 font-mono">🧪 SIMULATION MODE — Zero External Side Effects</span>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-white rounded-lg">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {!simulation ? (
            <div className="text-center py-12 space-y-4">
              <Sparkles className="h-12 w-12 text-brand-400 mx-auto animate-bounce" />
              <h3 className="text-base font-bold text-white">Digital Twin Predictive Analysis</h3>
              <p className="text-xs text-slate-400 max-w-md mx-auto">
                Predict execution risks, dependencies, and potential failure points before running against live third-party integrations.
              </p>
              <button
                onClick={() => runSimulation()}
                disabled={loading}
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-500 hover:to-indigo-500 text-white text-xs font-bold shadow-xl transition"
              >
                {loading ? 'Analyzing Graph...' : 'Start Digital Twin Simulation'}
              </button>
            </div>
          ) : (
            <>
              {/* Simulation Result Header Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-4 rounded-xl bg-dark-900 border border-dark-700 flex flex-col justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Risk Score</span>
                  <div className="flex items-center space-x-3 mt-1">
                    <span className="text-3xl font-extrabold text-white">{simulation.riskScore}</span>
                    <span className="text-xs text-slate-500">/ 100</span>
                    {getRiskBadge(simulation.riskLevel)}
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-dark-900 border border-dark-700 flex flex-col justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Predicted Duration</span>
                  <p className="text-xl font-bold text-emerald-400 mt-1">
                    ~{(simulation.estimatedDurationMs / 1000).toFixed(1)}s
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-dark-900 border border-dark-700 flex flex-col justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">External Integrations</span>
                  <p className="text-xs font-bold text-indigo-400 mt-1 capitalize">
                    {simulation.dependencies?.join(', ') || 'Internal Only'}
                  </p>
                </div>
              </div>

              {/* What-If Scenario Console */}
              <div className="p-4 rounded-xl bg-indigo-950/20 border border-indigo-500/20 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2 text-xs font-bold text-indigo-300">
                    <HelpCircle className="h-4 w-4" />
                    <span>What-If Scenario Console</span>
                  </div>
                  <span className="text-[10px] text-slate-400">Simulate edge cases</span>
                </div>

                <form onSubmit={handleScenarioSubmit} className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={scenarioInput}
                    onChange={(e) => setScenarioInput(e.target.value)}
                    placeholder='e.g. "What if Gmail API is unavailable?" or "What if invoice amount is missing?"'
                    className="flex-1 px-3 py-2 rounded-lg bg-dark-900 border border-dark-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-brand-500"
                  />
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-4 py-2 rounded-lg bg-brand-600 hover:bg-brand-500 text-white text-xs font-semibold"
                  >
                    Run Scenario
                  </button>
                </form>

                {simulation.scenarios?.scenario && (
                  <div className="p-2.5 rounded-lg bg-dark-900 border border-dark-700 text-xs space-y-1">
                    <span className="text-amber-400 font-semibold">Active Scenario:</span>
                    <p className="text-slate-300 text-[11px]">{simulation.scenarios.scenario}</p>
                  </div>
                )}
              </div>

              {/* Predicted Failures Section */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300">Predicted Failure Points</h4>
                {simulation.predictedFailures?.length === 0 ? (
                  <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs flex items-center space-x-2">
                    <ShieldCheck className="h-4 w-4" />
                    <span>Zero high-risk failure points detected in graph simulation.</span>
                  </div>
                ) : (
                  simulation.predictedFailures?.map((pf, idx) => (
                    <div key={idx} className="p-3.5 rounded-xl bg-dark-900 border border-dark-700 space-y-1">
                      <div className="flex items-center justify-between text-xs font-semibold">
                        <span className="text-rose-400">Node [{pf.nodeId}] — {pf.type}</span>
                        <span className="text-[10px] text-slate-400">Prob: {(pf.probability * 100).toFixed(0)}%</span>
                      </div>
                      <p className="text-xs text-slate-300">{pf.reason}</p>
                    </div>
                  ))
                )}
              </div>

              {/* Recommendations */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300">AI Recommendations</h4>
                <ul className="space-y-1.5 text-xs text-slate-400 list-disc list-inside">
                  {simulation.recommendations?.map((rec, idx) => (
                    <li key={idx} className="text-slate-300">{rec}</li>
                  ))}
                </ul>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
