import React, { useCallback } from 'react';
import {
  ReactFlow,
  Controls,
  Background,
  applyNodeChanges,
  applyEdgeChanges,
  addEdge,
  Handle,
  Position,
} from '@xyflow/react';
import { Play, Sparkles, Mail, MessageSquare, Bot, Table } from 'lucide-react';
import { useWorkflowStore } from '../../store/workflowStore';

// Custom Node Renderer Component
const CustomNode = ({ id, type, data, selected }) => {
  const getIcon = () => {
    switch (type) {
      case 'trigger':
        return <Play className="h-4 w-4 text-emerald-400" />;
      case 'ai-agent':
        return <Sparkles className="h-4 w-4 text-indigo-400" />;
      case 'gmail':
        return <Mail className="h-4 w-4 text-rose-400" />;
      case 'slack':
        return <MessageSquare className="h-4 w-4 text-amber-400" />;
      case 'discord':
        return <Bot className="h-4 w-4 text-purple-400" />;
      case 'google-sheets':
        return <Table className="h-4 w-4 text-emerald-400" />;
      default:
        return <Sparkles className="h-4 w-4 text-slate-400" />;
    }
  };

  return (
    <div
      className={`min-w-[180px] rounded-xl border bg-dark-800 p-3 shadow-xl transition-all ${
        selected ? 'border-brand-500 ring-2 ring-brand-500/30' : 'border-dark-700 hover:border-dark-600'
      }`}
    >
      <Handle type="target" position={Position.Top} className="w-2.5 h-2.5 bg-brand-500 border-2 border-dark-900" />
      <div className="flex items-center space-x-2.5">
        <div className="p-1.5 rounded-lg bg-dark-900 border border-dark-700">{getIcon()}</div>
        <div className="overflow-hidden">
          <p className="text-xs font-bold text-slate-100 truncate">{data?.label || id}</p>
          <p className="text-[10px] text-slate-400 capitalize">{type}</p>
        </div>
      </div>
      <Handle type="source" position={Position.Bottom} className="w-2.5 h-2.5 bg-brand-500 border-2 border-dark-900" />
    </div>
  );
};

const nodeTypes = {
  trigger: CustomNode,
  'ai-agent': CustomNode,
  gmail: CustomNode,
  slack: CustomNode,
  discord: CustomNode,
  'google-sheets': CustomNode,
};

export default function WorkflowCanvas({ onNodeSelect }) {
  const { activeNodes, activeEdges, setNodes, setEdges, setSelectedNode } = useWorkflowStore();

  const onNodesChange = useCallback(
    (changes) => {
      setNodes(applyNodeChanges(changes, activeNodes));
    },
    [activeNodes, setNodes]
  );

  const onEdgesChange = useCallback(
    (changes) => {
      setEdges(applyEdgeChanges(changes, activeEdges));
    },
    [activeEdges, setEdges]
  );

  const onConnect = useCallback(
    (connection) => {
      setEdges(addEdge({ ...connection, animated: true }, activeEdges));
    },
    [activeEdges, setEdges]
  );

  const onNodeClick = (event, node) => {
    setSelectedNode(node);
    if (onNodeSelect) onNodeSelect(node);
  };

  const onDragOver = useCallback((event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback(
    (event) => {
      event.preventDefault();
      const type = event.dataTransfer.getData('application/reactflow');
      if (!type) return;

      const position = {
        x: event.clientX - 350,
        y: event.clientY - 120,
      };

      const newNode = {
        id: `node-${Date.now()}`,
        type,
        position,
        data: { label: `New ${type.toUpperCase()}` },
      };

      setNodes([...activeNodes, newNode]);
    },
    [activeNodes, setNodes]
  );

  return (
    <div className="flex-1 h-full w-full bg-dark-900 relative" onDragOver={onDragOver} onDrop={onDrop}>
      <ReactFlow
        nodes={activeNodes}
        edges={activeEdges}
        nodeTypes={nodeTypes}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onNodeClick={onNodeClick}
        fitView
      >
        <Background color="#334155" gap={20} size={1} />
        <Controls />
      </ReactFlow>
    </div>
  );
}
