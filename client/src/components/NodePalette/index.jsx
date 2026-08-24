import { Play, Sparkles, Mail, MessageSquare, Bot, Table, Clock, GitBranch } from 'lucide-react';

const nodeTypes = [
  { type: 'trigger', label: 'Manual Trigger', icon: Play, color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' },
  { type: 'ai-agent', label: 'AI Agent Processor', icon: Sparkles, color: 'text-indigo-400 bg-indigo-500/10 border-indigo-500/20' },
  { type: 'gmail', label: 'Gmail Action', icon: Mail, color: 'text-rose-400 bg-rose-500/10 border-rose-500/20' },
  { type: 'slack', label: 'Slack Message', icon: MessageSquare, color: 'text-amber-400 bg-amber-500/10 border-amber-500/20' },
  { type: 'discord', label: 'Discord Bot', icon: Bot, color: 'text-purple-400 bg-purple-500/10 border-purple-500/20' },
  { type: 'google-sheets', label: 'Google Sheets', icon: Table, color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' },
];

export default function NodePalette({ onAddNode }) {
  const handleDragStart = (event, nodeType) => {
    event.dataTransfer.setData('application/reactflow', nodeType);
    event.dataTransfer.effectAllowed = 'move';
  };

  return (
    <div className="w-64 border-r border-dark-700 bg-dark-800 p-4 flex flex-col h-full overflow-y-auto">
      <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4">Node Palette</h3>
      <p className="text-xs text-slate-500 mb-3">Drag nodes onto canvas or click to insert.</p>

      <div className="space-y-2.5">
        {nodeTypes.map((item) => {
          const Icon = item.icon;
          return (
            <div
              key={item.type}
              draggable
              onDragStart={(e) => handleDragStart(e, item.type)}
              onClick={() => onAddNode && onAddNode(item.type)}
              className="flex items-center space-x-3 p-3 rounded-lg border border-dark-700 bg-dark-900/60 hover:bg-dark-700/80 hover:border-dark-600 cursor-grab active:cursor-grabbing transition group shadow-sm"
            >
              <div className={`p-2 rounded-md border ${item.color}`}>
                <Icon className="h-4 w-4" />
              </div>
              <span className="text-xs font-medium text-slate-200 group-hover:text-white">{item.label}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
