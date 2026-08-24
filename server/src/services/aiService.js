const axios = require('axios');
const env = require('../config/env');

const generateDeterministicWorkflow = (prompt) => {
  const lower = prompt.toLowerCase();

  let nodes = [
    {
      id: 'node-1',
      type: 'trigger',
      position: { x: 250, y: 50 },
      data: { label: 'Manual Trigger / Event', triggerType: 'manual' },
    },
  ];

  let edges = [];

  if (lower.includes('slack') || lower.includes('notification')) {
    nodes.push(
      {
        id: 'node-2',
        type: 'ai-agent',
        position: { x: 250, y: 180 },
        data: { label: 'AI Summarizer Agent', model: 'gpt-4o-mini', prompt: 'Summarize incoming data for alert' },
      },
      {
        id: 'node-3',
        type: 'slack',
        position: { x: 250, y: 310 },
        data: { label: 'Slack Notification', channel: '#ops-alerts', action: 'post_message' },
      }
    );
    edges.push(
      { id: 'e1-2', source: 'node-1', target: 'node-2', animated: true },
      { id: 'e2-3', source: 'node-2', target: 'node-3', animated: true }
    );
  } else if (lower.includes('email') || lower.includes('gmail')) {
    nodes.push(
      {
        id: 'node-2',
        type: 'ai-agent',
        position: { x: 250, y: 180 },
        data: { label: 'Draft Email Copy', model: 'gemini-1.5-flash', prompt: 'Generate professional email response' },
      },
      {
        id: 'node-3',
        type: 'gmail',
        position: { x: 250, y: 310 },
        data: { label: 'Send Email via Gmail', recipient: 'team@company.com', action: 'send_email' },
      }
    );
    edges.push(
      { id: 'e1-2', source: 'node-1', target: 'node-2', animated: true },
      { id: 'e2-3', source: 'node-2', target: 'node-3', animated: true }
    );
  } else if (lower.includes('sheet') || lower.includes('excel') || lower.includes('invoice')) {
    nodes.push(
      {
        id: 'node-2',
        type: 'ai-agent',
        position: { x: 150, y: 180 },
        data: { label: 'Extract Invoice Fields', model: 'gpt-4o-mini', prompt: 'Extract total, vendor, and line items' },
      },
      {
        id: 'node-3',
        type: 'google-sheets',
        position: { x: 150, y: 310 },
        data: { label: 'Append to Finance Sheet', range: 'Invoices!A:E', action: 'append_row' },
      },
      {
        id: 'node-4',
        type: 'discord',
        position: { x: 380, y: 310 },
        data: { label: 'Notify Discord Finance', channelId: '12345', action: 'post_message' },
      }
    );
    edges.push(
      { id: 'e1-2', source: 'node-1', target: 'node-2', animated: true },
      { id: 'e2-3', source: 'node-2', target: 'node-3', animated: true },
      { id: 'e2-4', source: 'node-2', target: 'node-4', animated: true }
    );
  } else {
    // Default generic automation workflow
    nodes.push(
      {
        id: 'node-2',
        type: 'ai-agent',
        position: { x: 250, y: 180 },
        data: { label: 'AI Processor Agent', prompt: `Process input for task: ${prompt}` },
      },
      {
        id: 'node-3',
        type: 'slack',
        position: { x: 250, y: 310 },
        data: { label: 'Notify Slack Channel', channel: '#general', action: 'post_message' },
      }
    );
    edges.push(
      { id: 'e1-2', source: 'node-1', target: 'node-2', animated: true },
      { id: 'e2-3', source: 'node-2', target: 'node-3', animated: true }
    );
  }

  return {
    name: prompt.length > 35 ? `${prompt.substring(0, 35)}...` : prompt,
    description: `Auto-generated workflow graph based on prompt: "${prompt}"`,
    nodes,
    edges,
    tags: ['ai-generated', 'agentic-flow'],
    triggerConfig: { type: 'manual' },
  };
};

const generateWorkflowFromPrompt = async (prompt) => {
  // Option 1: OpenRouter API if OPENROUTER_API_KEY is available
  if (env.OPENROUTER_API_KEY) {
    try {
      console.log('🤖 Invoking OpenRouter API for workflow generation...');
      const response = await axios.post(
        'https://openrouter.ai/api/v1/chat/completions',
        {
          model: 'meta-llama/llama-3.1-8b-instruct:free',
          messages: [
            {
              role: 'system',
              content: `You are an AI Workflow Builder. Output ONLY a valid JSON object with keys: name, description, nodes (array of {id, type, position:{x,y}, data:{label, ...}}), edges (array of {id, source, target, animated:true}), tags. Valid types: trigger, ai-agent, gmail, slack, discord, google-sheets.`,
            },
            {
              role: 'user',
              content: `Create a workflow for: ${prompt}`,
            },
          ],
        },
        {
          headers: {
            Authorization: `Bearer ${env.OPENROUTER_API_KEY}`,
            'Content-Type': 'application/json',
          },
          timeout: 10000,
        }
      );

      const content = response.data.choices[0].message.content;
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        if (parsed.nodes && parsed.edges) {
          return parsed;
        }
      }
    } catch (err) {
      console.warn('⚠️ OpenRouter API failed or timed out, falling back:', err.message);
    }
  }

  // Option 2: Google Gemini SDK if GEMINI_API_KEY is available
  if (env.GEMINI_API_KEY) {
    try {
      console.log('🤖 Invoking Google Gemini SDK for workflow generation...');
      const { GoogleGenerativeAI } = require('@google/generative-ai');
      const genAI = new GoogleGenerativeAI(env.GEMINI_API_KEY);
      const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

      const geminiPrompt = `Output ONLY JSON for a workflow graph with keys name, description, nodes, edges based on prompt: "${prompt}".`;
      const result = await model.generateContent(geminiPrompt);
      const text = result.response.text();
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        if (parsed.nodes && parsed.edges) {
          return parsed;
        }
      }
    } catch (err) {
      console.warn('⚠️ Gemini SDK failed or timed out, falling back:', err.message);
    }
  }

  // Option 3: Deterministic Rule-Based Builder Fallback
  console.log('⚡ Using Deterministic Rule-Based Builder Fallback');
  return generateDeterministicWorkflow(prompt);
};

module.exports = {
  generateWorkflowFromPrompt,
  generateDeterministicWorkflow,
};
