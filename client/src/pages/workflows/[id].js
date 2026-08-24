import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import ProtectedRoute from '../../components/ProtectedRoute';
import AppShell from '../../components/AppShell';
import NodePalette from '../../components/NodePalette';
import WorkflowCanvas from '../../components/WorkflowCanvas';
import NodeConfigPanel from '../../components/NodeConfigPanel';
import { ArrowLeft, Save, Play, RefreshCw } from 'lucide-react';
import { useWorkflowStore } from '../../store/workflowStore';
import api from '../../services/api';

export default function WorkflowEditor() {
  const router = useRouter();
  const { id } = router.query;
  const { fetchWorkflowById, currentWorkflow, saveWorkflow, activeNodes, setNodes, selectedNode, setSelectedNode } = useWorkflowStore();
  const [name, setName] = useState('');
  const [executing, setExecuting] = useState(false);

  useEffect(() => {
    if (id) {
      fetchWorkflowById(id).then((wf) => {
        if (wf) setName(wf.name);
      });
    }
  }, [id]);

  const handleAddNode = (type) => {
    const newNode = {
      id: `node-${Date.now()}`,
      type,
      position: { x: 250, y: 150 + activeNodes.length * 80 },
      data: { label: `New ${type.toUpperCase()}` },
    };
    setNodes([...activeNodes, newNode]);
  };

  const handleDeleteNode = (nodeId) => {
    setNodes(activeNodes.filter((n) => n.id !== nodeId));
    setSelectedNode(null);
  };

  const handleSave = async () => {
    await saveWorkflow({
      ...currentWorkflow,
      name,
    });
    alert('Workflow graph saved successfully.');
  };

  const handleExecute = async () => {
    if (!id) return;
    setExecuting(true);
    try {
      const res = await api.post(`/workflows/${id}/execute`);
      const exec = res.data.data;
      router.push(`/executions/${exec._id}`);
    } catch (err) {
      alert(`Execution Error: ${err.message}`);
    } finally {
      setExecuting(false);
    }
  };

  return (
    <ProtectedRoute>
      <AppShell>
        <div className="h-[calc(100vh-7rem)] flex flex-col space-y-3">
          {/* Header Toolbar */}
          <div className="flex items-center justify-between p-3.5 rounded-xl bg-dark-800 border border-dark-700">
            <div className="flex items-center space-x-3">
              <button onClick={() => router.push('/workflows')} className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-dark-700">
                <ArrowLeft className="h-4 w-4" />
              </button>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="bg-transparent text-sm font-bold text-white focus:outline-none border-b border-transparent focus:border-brand-500 px-1 py-0.5"
              />
              <span className="px-2 py-0.5 text-[10px] font-bold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 rounded-full">
                v{currentWorkflow?.version || 1}
              </span>
            </div>

            <div className="flex items-center space-x-3">
              <button
                onClick={handleExecute}
                disabled={executing}
                className="flex items-center space-x-2 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-md transition disabled:opacity-50"
              >
                <Play className="h-3.5 w-3.5" />
                <span>{executing ? 'Triggering...' : 'Execute Chain'}</span>
              </button>

              <button
                onClick={handleSave}
                className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-xs font-semibold shadow-md transition"
              >
                <Save className="h-4 w-4" />
                <span>Save Graph</span>
              </button>
            </div>
          </div>

          {/* Main 3-Column Layout */}
          <div className="flex-1 flex border border-dark-700 rounded-2xl overflow-hidden">
            {/* Left Node Palette */}
            <NodePalette onAddNode={handleAddNode} />

            {/* Center Canvas */}
            <WorkflowCanvas onNodeSelect={(node) => setSelectedNode(node)} />

            {/* Right Configuration Side Panel */}
            {selectedNode && (
              <NodeConfigPanel
                node={selectedNode}
                onClose={() => setSelectedNode(null)}
                onDelete={handleDeleteNode}
              />
            )}
          </div>
        </div>
      </AppShell>
    </ProtectedRoute>
  );
}
