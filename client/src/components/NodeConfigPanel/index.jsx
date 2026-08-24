import { useState, useEffect } from 'react';
import { X, Save, Trash2 } from 'lucide-react';
import { useWorkflowStore } from '../../store/workflowStore';

export default function NodeConfigPanel({ node, onClose, onDelete }) {
  const { updateNodeData } = useWorkflowStore();
  const [label, setLabel] = useState('');
  const [prompt, setPrompt] = useState('');
  const [model, setModel] = useState('gpt-4o-mini');
  const [recipient, setRecipient] = useState('');
  const [channel, setChannel] = useState('');
  const [action, setAction] = useState('');

  useEffect(() => {
    if (node) {
      setLabel(node.data?.label || '');
      setPrompt(node.data?.prompt || '');
      setModel(node.data?.model || 'gpt-4o-mini');
      setRecipient(node.data?.recipient || '');
      setChannel(node.data?.channel || node.data?.channelId || '');
      setAction(node.data?.action || '');
    }
  }, [node]);

  if (!node) return null;

  const handleSave = () => {
    updateNodeData(node.id, {
      label,
      prompt,
      model,
      recipient,
      channel,
      channelId: channel,
      action,
    });
  };

  return (
    <div className="w-80 border-l border-dark-700 bg-dark-800 p-5 flex flex-col h-full overflow-y-auto">
      <div className="flex items-center justify-between pb-4 border-b border-dark-700 mb-4">
        <div>
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">Node Configuration</h3>
          <span className="text-[10px] text-indigo-400 font-medium capitalize">Type: {node.type}</span>
        </div>
        <button onClick={onClose} className="p-1 text-slate-400 hover:text-white rounded">
          <X className="h-4 w-4" />
        </button>
      </div>

      <div className="space-y-4 flex-1">
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1.5">Node Title / Label</label>
          <input
            type="text"
            value={label}
            onChange={(e) => setLabel(e.target.value)}
            className="w-full rounded-lg bg-dark-900 border border-dark-700 px-3 py-2 text-xs text-white focus:outline-none focus:border-brand-500"
          />
        </div>

        {node.type === 'ai-agent' && (
          <>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">LLM Model</label>
              <select
                value={model}
                onChange={(e) => setModel(e.target.value)}
                className="w-full rounded-lg bg-dark-900 border border-dark-700 px-3 py-2 text-xs text-white focus:outline-none focus:border-brand-500"
              >
                <option value="gpt-4o-mini">OpenAI gpt-4o-mini</option>
                <option value="gemini-1.5-flash">Google Gemini 1.5 Flash</option>
                <option value="llama-3.1-8b">Meta Llama 3.1 8B</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Agent Prompt / Task</label>
              <textarea
                rows={4}
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Describe instructions for this AI node..."
                className="w-full rounded-lg bg-dark-900 border border-dark-700 px-3 py-2 text-xs text-white focus:outline-none focus:border-brand-500 resize-none"
              />
            </div>
          </>
        )}

        {node.type === 'gmail' && (
          <>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Recipient Email</label>
              <input
                type="email"
                value={recipient}
                onChange={(e) => setRecipient(e.target.value)}
                placeholder="ops@company.com"
                className="w-full rounded-lg bg-dark-900 border border-dark-700 px-3 py-2 text-xs text-white focus:outline-none focus:border-brand-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Gmail Action</label>
              <select
                value={action || 'send_email'}
                onChange={(e) => setAction(e.target.value)}
                className="w-full rounded-lg bg-dark-900 border border-dark-700 px-3 py-2 text-xs text-white focus:outline-none focus:border-brand-500"
              >
                <option value="send_email">Send Email</option>
                <option value="read_mail">Read Inbox Mail</option>
              </select>
            </div>
          </>
        )}

        {(node.type === 'slack' || node.type === 'discord') && (
          <>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Target Channel</label>
              <input
                type="text"
                value={channel}
                onChange={(e) => setChannel(e.target.value)}
                placeholder="#alerts or channel_id"
                className="w-full rounded-lg bg-dark-900 border border-dark-700 px-3 py-2 text-xs text-white focus:outline-none focus:border-brand-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Action</label>
              <select
                value={action || 'post_message'}
                onChange={(e) => setAction(e.target.value)}
                className="w-full rounded-lg bg-dark-900 border border-dark-700 px-3 py-2 text-xs text-white focus:outline-none focus:border-brand-500"
              >
                <option value="post_message">Post Message</option>
              </select>
            </div>
          </>
        )}
      </div>

      <div className="pt-4 border-t border-dark-700 flex items-center justify-between space-x-2">
        <button
          onClick={handleSave}
          className="flex-1 flex items-center justify-center space-x-2 px-3 py-2 rounded-lg bg-brand-600 hover:bg-brand-500 text-white text-xs font-semibold shadow-md transition"
        >
          <Save className="h-3.5 w-3.5" />
          <span>Apply Changes</span>
        </button>

        {onDelete && (
          <button
            onClick={() => onDelete(node.id)}
            title="Delete Node"
            className="p-2 rounded-lg bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 border border-rose-500/20 transition"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        )}
      </div>
    </div>
  );
}
