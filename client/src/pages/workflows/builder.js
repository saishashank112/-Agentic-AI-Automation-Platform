import { useState } from 'react';
import { useRouter } from 'next/router';
import ProtectedRoute from '../../components/ProtectedRoute';
import AppShell from '../../components/AppShell';
import WorkflowCanvas from '../../components/WorkflowCanvas';
import { Sparkles, Save, Play, ArrowLeft } from 'lucide-react';
import { useWorkflowStore } from '../../store/workflowStore';

export default function WorkflowBuilder() {
  const router = useRouter();
  const { generateFromPrompt, saveWorkflow, generating, activeNodes } = useWorkflowStore();
  const [prompt, setPrompt] = useState('');
  const [name, setName] = useState('New AI Workflow');

  const handleGenerate = async (e) => {
    e.preventDefault();
    if (!prompt.trim()) return;
    const graph = await generateFromPrompt(prompt);
    if (graph?.name) {
      setName(graph.name);
    }
  };

  const handleSave = async () => {
    const saved = await saveWorkflow({
      name,
      description: `Generated from prompt: "${prompt}"`,
      status: 'active',
    });
    if (saved?._id) {
      router.push(`/workflows/${saved._id}`);
    }
  };

  return (
    <ProtectedRoute>
      <AppShell>
        <div className="h-[calc(100vh-7rem)] flex flex-col space-y-4">
          {/* Header Toolbar */}
          <div className="flex items-center justify-between p-4 rounded-xl bg-dark-800 border border-dark-700">
            <div className="flex items-center space-x-3">
              <button
                onClick={() => router.push('/workflows')}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-dark-700"
              >
                <ArrowLeft className="h-4 w-4" />
              </button>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="bg-transparent text-sm font-bold text-white focus:outline-none focus:border-b border-brand-500 px-1 py-0.5"
              />
            </div>

            <div className="flex items-center space-x-3">
              <button
                onClick={handleSave}
                disabled={activeNodes.length === 0}
                className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-500 disabled:opacity-50 text-white text-xs font-semibold shadow-md transition"
              >
                <Save className="h-4 w-4" />
                <span>Save to Canvas</span>
              </button>
            </div>
          </div>

          {/* Prompt Input Bar */}
          <form onSubmit={handleGenerate} className="flex items-center space-x-3 p-3 rounded-2xl bg-dark-800 border border-dark-700 shadow-lg">
            <Sparkles className="h-5 w-5 text-brand-400 ml-2" />
            <input
              type="text"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="e.g. When a client submits an invoice email, extract fields with AI and append to Google Sheet and notify Slack #finance"
              className="flex-1 bg-transparent text-xs text-white placeholder-slate-500 focus:outline-none"
            />
            <button
              type="submit"
              disabled={generating || !prompt.trim()}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-500 hover:to-indigo-500 disabled:opacity-50 text-white text-xs font-bold shadow-md transition flex items-center space-x-2"
            >
              {generating ? (
                <span>Generating Graph...</span>
              ) : (
                <>
                  <span>Generate Graph</span>
                  <Sparkles className="h-3.5 w-3.5" />
                </>
              )}
            </button>
          </form>

          {/* Canvas Area */}
          <div className="flex-1 rounded-2xl border border-dark-700 overflow-hidden relative">
            <WorkflowCanvas />
          </div>
        </div>
      </AppShell>
    </ProtectedRoute>
  );
}
