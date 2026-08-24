import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import ProtectedRoute from '../../components/ProtectedRoute';
import AppShell from '../../components/AppShell';
import { ArrowLeft, Pause, Play, XCircle, Cpu, ShieldAlert, Coins, Activity, CheckCircle2 } from 'lucide-react';
import api from '../../services/api';
import { getSocket } from '../../services/socket';

export default function ExecutionDetail() {
  const router = useRouter();
  const { id } = router.query;
  const [execution, setExecution] = useState(null);
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchDetails = async () => {
    if (!id) return;
    try {
      const [execRes, logsRes] = await Promise.all([
        api.get(`/executions/${id}`),
        api.get(`/executions/${id}/timeline`),
      ]);
      setExecution(execRes.data.data);
      setLogs(logsRes.data.data || []);
    } catch (err) {
      console.error('Error fetching execution details:', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDetails();

    if (id) {
      const socket = getSocket();
      socket.emit('join_execution', id);

      const handleAgentEvent = (event) => {
        setLogs((prev) => [...prev, event]);
        fetchDetails();
      };

      socket.on('agent_event', handleAgentEvent);

      return () => {
        socket.off('agent_event', handleAgentEvent);
        socket.emit('leave_execution', id);
      };
    }
  }, [id]);

  const handlePause = async () => {
    try {
      await api.post(`/executions/${id}/pause`);
      fetchDetails();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleResume = async () => {
    try {
      await api.post(`/executions/${id}/resume`);
      fetchDetails();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleCancel = async () => {
    try {
      await api.post(`/executions/${id}/cancel`);
      fetchDetails();
    } catch (err) {
      alert(err.message);
    }
  };

  const getAgentBadge = (agent) => {
    switch (agent) {
      case 'planner':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 uppercase">Planner</span>;
      case 'execution':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 uppercase">Execution</span>;
      case 'validation':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 uppercase">Validation</span>;
      case 'recovery':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20 uppercase">Auto-Healing</span>;
      case 'monitoring':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-purple-500/10 text-purple-400 border border-purple-500/20 uppercase">Monitoring</span>;
      default:
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-700 text-slate-300 uppercase">{agent}</span>;
    }
  };

  return (
    <ProtectedRoute>
      <AppShell>
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Top Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl bg-dark-800 border border-dark-700">
            <div className="flex items-center space-x-3">
              <button onClick={() => router.push('/executions')} className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-dark-700">
                <ArrowLeft className="h-4 w-4" />
              </button>
              <div>
                <h1 className="text-base font-bold text-white tracking-tight">
                  Execution Run #{id ? id.substring(id.length - 8) : ''}
                </h1>
                <p className="text-xs text-slate-400">
                  Workflow: {execution?.workflowId?.name || 'Automation'} • LangGraph Substrate: {execution?.langGraphStatus}
                </p>
              </div>
            </div>

            {/* Execution Controls */}
            <div className="flex items-center space-x-3">
              {execution?.status === 'RUNNING' && (
                <button
                  onClick={handlePause}
                  className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-amber-500/10 text-amber-400 hover:bg-amber-500/20 border border-amber-500/20 text-xs font-semibold"
                >
                  <Pause className="h-3.5 w-3.5" />
                  <span>Pause</span>
                </button>
              )}

              {execution?.status === 'PAUSED' && (
                <button
                  onClick={handleResume}
                  className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 border border-emerald-500/20 text-xs font-semibold"
                >
                  <Play className="h-3.5 w-3.5" />
                  <span>Resume</span>
                </button>
              )}

              {(execution?.status === 'RUNNING' || execution?.status === 'PENDING') && (
                <button
                  onClick={handleCancel}
                  className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 border border-rose-500/20 text-xs font-semibold"
                >
                  <XCircle className="h-3.5 w-3.5" />
                  <span>Cancel</span>
                </button>
              )}
            </div>
          </div>

          {/* Unique Feature Widget: Token Usage & Cost Telemetry */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl border border-dark-700 bg-dark-800 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Total Tokens Consumed</span>
                <p className="text-lg font-bold text-white mt-0.5">
                  {execution?.tokenUsage?.totalTokens || 0} <span className="text-xs text-slate-400 font-normal">tokens</span>
                </p>
              </div>
              <div className="p-2.5 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
                <Coins className="h-5 w-5" />
              </div>
            </div>

            <div className="p-4 rounded-xl border border-dark-700 bg-dark-800 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Estimated Run Cost</span>
                <p className="text-lg font-bold text-emerald-400 mt-0.5">
                  {execution?.estimatedCost || '$0.000000'}
                </p>
              </div>
              <div className="p-2.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                <Activity className="h-5 w-5" />
              </div>
            </div>

            <div className="p-4 rounded-xl border border-dark-700 bg-dark-800 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Autonomous Self-Healing</span>
                <p className="text-lg font-bold text-amber-400 mt-0.5">Active Substrate</p>
              </div>
              <div className="p-2.5 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-400">
                <ShieldAlert className="h-5 w-5" />
              </div>
            </div>
          </div>

          {/* Grid Layout: Log Timeline (Left 2 cols) & Output Inspector (Right 1 col) */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Live Agent Timeline */}
            <div className="lg:col-span-2 rounded-2xl border border-dark-700 bg-dark-800 p-6 flex flex-col">
              <div className="flex items-center justify-between mb-4 pb-3 border-b border-dark-700">
                <div className="flex items-center space-x-2">
                  <Cpu className="h-5 w-5 text-indigo-400" />
                  <h2 className="text-sm font-bold text-white">Live Agent & Auto-Healing Timeline Stream</h2>
                </div>
                <span className="text-[10px] text-emerald-400 font-mono flex items-center space-x-1">
                  <span className="h-2 w-2 rounded-full bg-emerald-400 animate-ping inline-block"></span>
                  <span>Socket.IO Stream Connected</span>
                </span>
              </div>

              <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2">
                {logs.length === 0 ? (
                  <p className="text-xs text-slate-500 text-center py-12">Waiting for agent execution telemetry events...</p>
                ) : (
                  logs.map((log, index) => (
                    <div
                      key={log.id || index}
                      className="p-3.5 rounded-xl bg-dark-900 border border-dark-700/80 space-y-1.5 text-xs font-mono"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          {getAgentBadge(log.agent)}
                          <span className="text-slate-400 text-[10px]">
                            {new Date(log.timestamp).toLocaleTimeString()}
                          </span>
                        </div>
                        <span
                          className={`text-[10px] font-bold capitalize ${
                            log.level === 'success'
                              ? 'text-emerald-400'
                              : log.level === 'error'
                              ? 'text-rose-400'
                              : log.level === 'warning'
                              ? 'text-amber-400'
                              : 'text-indigo-300'
                          }`}
                        >
                          [{log.level}]
                        </span>
                      </div>
                      <p className="text-slate-200 leading-relaxed font-sans">{log.message}</p>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Run Details & Output Inspector */}
            <div className="rounded-2xl border border-dark-700 bg-dark-800 p-6 flex flex-col space-y-4">
              <h2 className="text-sm font-bold text-white pb-3 border-b border-dark-700">Output Payload Inspector</h2>

              <div>
                <span className="text-[11px] font-semibold text-slate-400 block mb-1">Status</span>
                <span className="text-xs font-bold text-white">{execution?.status}</span>
              </div>

              <div>
                <span className="text-[11px] font-semibold text-slate-400 block mb-1">Total Duration</span>
                <span className="text-xs text-white font-mono">{execution?.duration ? `${execution.duration}ms` : 'In Progress...'}</span>
              </div>

              <div className="flex-1">
                <span className="text-[11px] font-semibold text-slate-400 block mb-1.5">Node Execution Outputs</span>
                <pre className="p-3 rounded-xl bg-dark-900 border border-dark-700 text-[10px] text-emerald-400 font-mono overflow-x-auto max-h-80">
                  {JSON.stringify(execution?.outputs || {}, null, 2)}
                </pre>
              </div>
            </div>
          </div>
        </div>
      </AppShell>
    </ProtectedRoute>
  );
}
