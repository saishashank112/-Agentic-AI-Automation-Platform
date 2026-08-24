import { create } from 'zustand';
import api from '../services/api';

export const useWorkflowStore = create((set, get) => ({
  workflows: [],
  currentWorkflow: null,
  activeNodes: [],
  activeEdges: [],
  selectedNode: null,
  loading: false,
  generating: false,
  error: null,

  setNodes: (nodes) => set({ activeNodes: nodes }),
  setEdges: (edges) => set({ activeEdges: edges }),
  setSelectedNode: (node) => set({ selectedNode: node }),

  fetchWorkflows: async () => {
    set({ loading: true, error: null });
    try {
      const res = await api.get('/workflows');
      set({ workflows: res.data.data, loading: false });
    } catch (err) {
      set({ error: err.response?.data?.error || 'Failed to fetch workflows', loading: false });
    }
  },

  fetchWorkflowById: async (id) => {
    set({ loading: true, error: null });
    try {
      const res = await api.get(`/workflows/${id}`);
      const wf = res.data.data;
      set({
        currentWorkflow: wf,
        activeNodes: wf.nodes || [],
        activeEdges: wf.edges || [],
        loading: false,
      });
      return wf;
    } catch (err) {
      set({ error: err.response?.data?.error || 'Failed to fetch workflow', loading: false });
      return null;
    }
  },

  generateFromPrompt: async (prompt) => {
    set({ generating: true, error: null });
    try {
      const res = await api.post('/workflows/generate', { prompt });
      const graph = res.data.data;
      set({
        activeNodes: graph.nodes || [],
        activeEdges: graph.edges || [],
        generating: false,
      });
      return graph;
    } catch (err) {
      set({ error: err.response?.data?.error || 'AI Generation failed', generating: false });
      return null;
    }
  },

  saveWorkflow: async (workflowData) => {
    set({ loading: true, error: null });
    try {
      const payload = {
        ...workflowData,
        nodes: get().activeNodes,
        edges: get().activeEdges,
      };

      let res;
      if (get().currentWorkflow?._id) {
        res = await api.put(`/workflows/${get().currentWorkflow._id}`, payload);
      } else {
        res = await api.post('/workflows', payload);
      }

      const saved = res.data.data;
      set({ currentWorkflow: saved, loading: false });
      return saved;
    } catch (err) {
      set({ error: err.response?.data?.error || 'Failed to save workflow', loading: false });
      return null;
    }
  },

  updateNodeData: (nodeId, newData) => {
    const updatedNodes = get().activeNodes.map((n) => {
      if (n.id === nodeId) {
        return {
          ...n,
          data: { ...n.data, ...newData },
        };
      }
      return n;
    });
    set({ activeNodes: updatedNodes });
    if (get().selectedNode?.id === nodeId) {
      set({ selectedNode: { ...get().selectedNode, data: { ...get().selectedNode.data, ...newData } } });
    }
  },
}));
