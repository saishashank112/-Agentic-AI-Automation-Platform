import { useState, useEffect, useRef } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import {
  Bot,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Cpu,
  Zap,
  Activity,
  PlayCircle,
  Layers,
  RefreshCw,
  Sliders,
  CheckCircle2,
  AlertTriangle,
  FileText,
  Lock,
  Workflow,
  Radio,
  Terminal,
  Database,
  Search,
  ExternalLink,
  ChevronRight,
  GitBranch,
  CornerDownRight,
  Maximize2,
  RotateCcw,
  Check,
  Send,
  Eye,
  Shield,
  Gauge,
  Boxes,
} from 'lucide-react';
import { useAuthStore } from '../store/authStore';

export default function LandingPage() {
  const router = useRouter();
  const { isAuthenticated, loading } = useAuthStore();

  // Interactive Prompt-to-Workflow State
  const samplePrompts = [
    {
      id: 'invoice',
      title: 'Invoice Processing & Sheets Sync',
      text: 'Monitor Gmail for incoming vendor invoice PDFs, use AI to extract line items and tax, validate against purchase order schema, append rows to Google Sheets, and alert the finance channel on Slack.',
      nodes: [
        { id: '1', name: 'Gmail Monitor', type: 'trigger', status: 'COMPLETED', icon: 'Mail', time: '14ms' },
        { id: '2', name: 'LLM Invoice Parser', type: 'ai-agent', status: 'COMPLETED', icon: 'Cpu', time: '820ms', tokens: '450 tokens' },
        { id: '3', name: 'Schema Validator', type: 'validation', status: 'COMPLETED', icon: 'ShieldCheck', time: '4ms' },
        { id: '4', name: 'Sheets Append', type: 'integration', status: 'COMPLETED', icon: 'Database', time: '180ms' },
        { id: '5', name: 'Slack Dispatch', type: 'integration', status: 'COMPLETED', icon: 'Send', time: '92ms' },
      ],
      confidence: '98.6%',
      risk: 'LOW (12/100)',
    },
    {
      id: 'incident',
      title: 'Autonomous Incident Triage',
      text: 'Ingest Sentry error spikes, summarize stack trace root cause with AI, cross-reference git commit history, create Discord incident war-room, and escalate to on-call if severity is critical.',
      nodes: [
        { id: '1', name: 'Webhook Ingest', type: 'trigger', status: 'COMPLETED', icon: 'Radio', time: '8ms' },
        { id: '2', name: 'Root Cause Analyzer', type: 'ai-agent', status: 'COMPLETED', icon: 'Cpu', time: '940ms', tokens: '610 tokens' },
        { id: '3', name: 'Policy Evaluator', type: 'validation', status: 'COMPLETED', icon: 'ShieldCheck', time: '6ms' },
        { id: '4', name: 'Discord War-Room', type: 'integration', status: 'COMPLETED', icon: 'Send', time: '140ms' },
      ],
      confidence: '96.2%',
      risk: 'MEDIUM (34/100)',
    },
    {
      id: 'lead',
      title: 'Customer Feedback Intelligence',
      text: 'Scan customer satisfaction surveys, perform sentiment classification, flag refund demands above $1,000 for human approval, and sync positive testimonials to CRM.',
      nodes: [
        { id: '1', name: 'Form Webhook', type: 'trigger', status: 'COMPLETED', icon: 'Radio', time: '12ms' },
        { id: '2', name: 'Sentiment Agent', type: 'ai-agent', status: 'COMPLETED', icon: 'Cpu', time: '620ms', tokens: '380 tokens' },
        { id: '3', name: 'Approval Gate (> $1k)', type: 'approval', status: 'PAUSED', icon: 'Shield', time: 'Pending' },
        { id: '4', name: 'CRM Sync', type: 'integration', status: 'WAITING', icon: 'Database', time: 'Queued' },
      ],
      confidence: '94.8%',
      risk: 'ELEVATED (58/100)',
    },
  ];

  const [activePromptIdx, setActivePromptIdx] = useState(0);
  const [activeTab, setActiveTab] = useState('predict');
  const [selectedAgent, setSelectedAgent] = useState('planner');
  const [simulationRunning, setSimulationRunning] = useState(false);
  const [simulationPassed, setSimulationPassed] = useState(true);

  // Live telemetry feed state
  const [telemetryLogs, setTelemetryLogs] = useState([
    { id: 1, time: '15:24:01.102', agent: 'PLANNER', level: 'info', msg: 'Topological node execution graph calculated: 5 steps (Confidence 98.6%)' },
    { id: 2, time: '15:24:01.240', agent: 'EXECUTION', level: 'info', msg: 'Gmail Trigger received 1 payload (Vendor_Invoice_INV-8492.pdf)' },
    { id: 3, time: '15:24:02.060', agent: 'EXECUTION', level: 'info', msg: 'AI Extraction Agent transformed unstructured document into JSON schema' },
    { id: 4, time: '15:24:02.068', agent: 'VALIDATION', level: 'success', msg: 'Validation Agent: 8/8 strict schema rules passed with zero type coercions' },
    { id: 5, time: '15:24:02.248', agent: 'MONITORING', level: 'success', msg: 'Execution completed in 1.14s • Tokens: 450 • Cost: $0.000675' },
  ]);

  const activePrompt = samplePrompts[activePromptIdx];

  const handleSimulate = () => {
    setSimulationRunning(true);
    setTimeout(() => {
      setSimulationRunning(false);
      setSimulationPassed(true);
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-[#05060A] text-[#F8FAFC] flex flex-col font-sans selection:bg-[#6366F1] selection:text-white relative overflow-x-hidden">
      <Head>
        <title>Agentflow AI — The AI Operating System for Autonomous Operations</title>
        <meta
          name="description"
          content="Agentflow AI is an intelligent autonomous operations platform where cooperating AI agents design, execute, monitor, predict, recover, and govern mission-critical business workflows."
        />
      </Head>

      {/* Atmospheric Background Layers */}
      <div className="fixed inset-0 pointer-events-none z-0">
        {/* Radial Indigo Aura */}
        <div className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[1200px] h-[600px] bg-gradient-to-b from-[#6366F1]/18 via-[#8B5CF6]/10 to-transparent blur-[140px] rounded-full animate-pulse-glow" />
        {/* Cyan Telemetry Halo */}
        <div className="absolute top-[35%] right-[-10%] w-[600px] h-[500px] bg-gradient-to-br from-[#22D3EE]/10 via-[#6366F1]/05 to-transparent blur-[120px] rounded-full" />
        {/* Deep Violet Base Glow */}
        <div className="absolute bottom-[10%] left-[-5%] w-[700px] h-[500px] bg-gradient-to-tr from-[#6D28D9]/15 via-transparent to-transparent blur-[130px] rounded-full" />
        {/* Geometric Fine Grid Overlay */}
        <div className="absolute inset-0 bg-grid-pattern opacity-60" />
      </div>

      {/* =========================================================================
          01. FLOATING ENTERPRISE GLASS NAVBAR (PERMANENTLY FIXED ON TOP)
          ========================================================================= */}
      <div className="fixed top-4 left-0 right-0 z-50 px-4 sm:px-6 max-w-7xl mx-auto w-full pointer-events-none">
        <header className="pointer-events-auto rounded-2xl border border-white/10 bg-[#080B12]/85 backdrop-blur-2xl px-5 py-3 shadow-[0_20px_50px_rgba(0,0,0,0.6)] flex items-center justify-between transition-all">
          <div className="flex items-center space-x-8">
            <Link href="/" className="flex items-center space-x-3 group">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-[#6366F1] to-[#8B5CF6] shadow-lg shadow-[#6366F1]/30 group-hover:scale-105 transition">
                <Bot className="h-5 w-5 text-white" />
              </div>
              <div className="flex flex-col">
                <span className="font-extrabold text-base tracking-tight text-white leading-none flex items-center space-x-1.5">
                  <span>Agentflow</span>
                  <span className="text-[#818CF8]">AI</span>
                </span>
                <span className="text-[9px] text-[#94A3B8] font-mono tracking-wider uppercase mt-0.5">Control Plane v1.0</span>
              </div>
            </Link>

            <nav className="hidden md:flex items-center space-x-1 text-xs font-medium text-[#94A3B8]">
              <a href="#agents" className="px-3 py-1.5 rounded-lg hover:text-white hover:bg-white/[0.05] transition">Architecture</a>
              <a href="#prompt" className="px-3 py-1.5 rounded-lg hover:text-white hover:bg-white/[0.05] transition">Prompt-to-Flow</a>
              <a href="#intelligence" className="px-3 py-1.5 rounded-lg hover:text-white hover:bg-white/[0.05] transition">Intelligence Triad</a>
              <a href="#control-tower" className="px-3 py-1.5 rounded-lg hover:text-white hover:bg-white/[0.05] transition">Control Tower</a>
              <a href="#integrations" className="px-3 py-1.5 rounded-lg hover:text-white hover:bg-white/[0.05] transition">Ecosystem</a>
              <a href="#security" className="px-3 py-1.5 rounded-lg hover:text-white hover:bg-white/[0.05] transition">Security</a>
            </nav>
          </div>

          <div className="flex items-center space-x-3">
            <Link
              href="/login"
              className="px-4 py-2 rounded-xl text-xs font-semibold text-[#94A3B8] hover:text-white hover:bg-white/[0.06] border border-transparent hover:border-white/10 transition"
            >
              Sign In
            </Link>
            <Link
              href="/register"
              className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-[#6366F1] to-[#8B5CF6] hover:from-[#4f46e5] hover:to-[#7c3aed] shadow-lg shadow-[#6366F1]/30 flex items-center space-x-1.5 transition hover:scale-[1.02]"
            >
              <span>Launch Platform</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </header>
      </div>

      {/* =========================================================================
          02. CINEMATIC HERO SECTION
          ========================================================================= */}
      <section className="relative z-10 pt-28 pb-20 px-4 sm:px-6 max-w-7xl mx-auto flex flex-col items-center text-center">
        {/* Small Glass Pill */}
        <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full border border-[#6366F1]/30 bg-[#6366F1]/10 text-[#818CF8] text-xs font-semibold tracking-wide mb-8 shadow-sm backdrop-blur-md">
          <Sparkles className="h-3.5 w-3.5 text-[#818CF8] animate-pulse" />
          <span className="font-mono uppercase text-[11px] tracking-wider">Autonomous Operations Intelligence</span>
        </div>

        {/* Master Headline */}
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white max-w-5xl leading-[1.08] mb-6">
          Turn Intent Into{' '}
          <span className="bg-gradient-to-r from-[#818CF8] via-[#A78BFA] to-[#C084FC] bg-clip-text text-transparent">
            Autonomous Operations.
          </span>
        </h1>

        {/* Supporting Narrative */}
        <p className="text-[#94A3B8] text-base sm:text-lg max-w-3xl leading-relaxed mb-10 font-normal">
          Describe what your operation should accomplish. Agentflow AI designs the workflow, coordinates specialized AI agents, executes across your tools, and intelligently self-heals when reality changes.
        </p>

        {/* Hero CTAs */}
        <div className="flex flex-col sm:flex-row items-center gap-4 mb-16 w-full sm:w-auto">
          <Link
            href="/register"
            className="w-full sm:w-auto px-8 py-4 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-[#6366F1] to-[#8B5CF6] hover:from-[#4f46e5] hover:to-[#7c3aed] shadow-[0_0_30px_rgba(99,102,241,0.4)] flex items-center justify-center space-x-2.5 transition hover:scale-105"
          >
            <span>Build Your First Workflow</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
          <a
            href="#control-tower"
            className="w-full sm:w-auto px-7 py-4 rounded-xl text-sm font-semibold text-[#F8FAFC] bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 hover:border-white/20 backdrop-blur-xl flex items-center justify-center space-x-2 transition"
          >
            <ShieldCheck className="h-4 w-4 text-[#22D3EE]" />
            <span>Explore the Control Plane</span>
          </a>
        </div>

        {/* =========================================================================
            HERO PRODUCT VISUALIZATION: AUTONOMOUS CONTROL PLANE SUBSTRATE
            ========================================================================= */}
        <div className="w-full max-w-5xl relative mt-4">
          {/* Ambient Glow under Visualization */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#6366F1]/20 via-[#8B5CF6]/10 to-transparent blur-3xl rounded-3xl -z-10" />

          {/* Main Glass Control Plane Window */}
          <div className="rounded-3xl border border-white/10 bg-[#080B12]/90 backdrop-blur-2xl p-6 sm:p-8 shadow-[0_30px_100px_rgba(0,0,0,0.8)] text-left relative overflow-hidden">
            {/* Top Window Bar */}
            <div className="flex items-center justify-between pb-6 border-b border-white/[0.08] mb-6">
              <div className="flex items-center space-x-3">
                <div className="flex space-x-1.5">
                  <div className="w-3 h-3 rounded-full bg-rose-500/80" />
                  <div className="w-3 h-3 rounded-full bg-amber-500/80" />
                  <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
                </div>
                <span className="text-xs font-mono text-[#94A3B8] pl-2 border-l border-white/10">
                  AGENTIC_SUBSTRATE // RUN_08492
                </span>
              </div>

              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[11px] font-mono font-medium">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                  <span>LIVE EXECUTION</span>
                </div>
              </div>
            </div>

            {/* Visual Multi-Agent Pipeline Graph */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-3 relative py-4">
              {/* Agent 1 */}
              <div className="p-4 rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-md flex flex-col justify-between space-y-3 relative group hover:border-[#6366F1]/50 transition">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono text-[#818CF8] uppercase">01 • Planner</span>
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white">Topological Sort</h4>
                  <p className="text-[10px] text-[#94A3B8] mt-0.5">Calculates node DAG</p>
                </div>
                <div className="pt-2 border-t border-white/[0.06] flex items-center justify-between text-[10px] font-mono text-[#64748B]">
                  <span>Conf: 98%</span>
                  <span className="text-[#818CF8]">120ms</span>
                </div>
              </div>

              {/* Agent 2 */}
              <div className="p-4 rounded-2xl border border-[#6366F1]/40 bg-[#6366F1]/[0.06] backdrop-blur-md flex flex-col justify-between space-y-3 relative shadow-[0_0_20px_rgba(99,102,241,0.15)]">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono text-[#818CF8] uppercase">02 • Execution</span>
                  <span className="w-2 h-2 rounded-full bg-[#6366F1] animate-pulse" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white">OAuth Dispatch</h4>
                  <p className="text-[10px] text-[#94A3B8] mt-0.5">Gmail + LLM Transform</p>
                </div>
                <div className="pt-2 border-t border-white/[0.06] flex items-center justify-between text-[10px] font-mono text-[#64748B]">
                  <span>Tokens: 450</span>
                  <span className="text-emerald-400">820ms</span>
                </div>
              </div>

              {/* Agent 3 */}
              <div className="p-4 rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-md flex flex-col justify-between space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono text-[#22D3EE] uppercase">03 • Validation</span>
                  <ShieldCheck className="h-3.5 w-3.5 text-[#22D3EE]" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white">Strict Schema</h4>
                  <p className="text-[10px] text-[#94A3B8] mt-0.5">JSON type verification</p>
                </div>
                <div className="pt-2 border-t border-white/[0.06] flex items-center justify-between text-[10px] font-mono text-[#64748B]">
                  <span>Zero Error</span>
                  <span className="text-[#22D3EE]">4ms</span>
                </div>
              </div>

              {/* Agent 4 */}
              <div className="p-4 rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-md flex flex-col justify-between space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono text-emerald-400 uppercase">04 • Self-Heal</span>
                  <Zap className="h-3.5 w-3.5 text-emerald-400" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white">Root Cause RCA</h4>
                  <p className="text-[10px] text-[#94A3B8] mt-0.5">Auto-remediation</p>
                </div>
                <div className="pt-2 border-t border-white/[0.06] flex items-center justify-between text-[10px] font-mono text-[#64748B]">
                  <span>Standby</span>
                  <span className="text-emerald-400">Ready</span>
                </div>
              </div>

              {/* Agent 5 */}
              <div className="p-4 rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-md flex flex-col justify-between space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono text-purple-400 uppercase">05 • Monitor</span>
                  <Activity className="h-3.5 w-3.5 text-purple-400" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white">Audit & Sockets</h4>
                  <p className="text-[10px] text-[#94A3B8] mt-0.5">Real-time telemetry</p>
                </div>
                <div className="pt-2 border-t border-white/[0.06] flex items-center justify-between text-[10px] font-mono text-[#64748B]">
                  <span>Latency</span>
                  <span className="text-purple-400">82ms</span>
                </div>
              </div>
            </div>

            {/* Bottom Live Telemetry HUD Bar */}
            <div className="mt-6 pt-5 border-t border-white/[0.08] grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div>
                <span className="text-[10px] font-mono text-[#64748B] uppercase">AI Confidence</span>
                <p className="text-sm font-extrabold text-white mt-0.5 font-mono text-emerald-400">98.6%</p>
              </div>
              <div>
                <span className="text-[10px] font-mono text-[#64748B] uppercase">Predicted Risk</span>
                <p className="text-sm font-extrabold text-white mt-0.5 font-mono text-[#818CF8]">LOW (12/100)</p>
              </div>
              <div>
                <span className="text-[10px] font-mono text-[#64748B] uppercase">Total Execution</span>
                <p className="text-sm font-extrabold text-white mt-0.5 font-mono">1.14s</p>
              </div>
              <div>
                <span className="text-[10px] font-mono text-[#64748B] uppercase">Substrate State</span>
                <p className="text-sm font-extrabold text-emerald-400 mt-0.5 font-mono flex items-center space-x-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block" />
                  <span>AUTONOMOUS</span>
                </p>
              </div>
            </div>
          </div>

          {/* Floating Telemetry Micro-Cards */}
          <div className="hidden lg:block absolute -top-8 -left-12 p-4 rounded-2xl border border-white/10 bg-[#080B12]/80 backdrop-blur-xl shadow-2xl animate-float-slow text-left">
            <span className="text-[10px] font-mono text-[#818CF8] uppercase">Self-Healing Substrate</span>
            <p className="text-sm font-bold text-white mt-0.5">14 Incidents Auto-Recovered</p>
            <span className="text-[10px] text-emerald-400 font-mono">✓ Zero Downtime</span>
          </div>

          <div className="hidden lg:block absolute -bottom-6 -right-10 p-4 rounded-2xl border border-white/10 bg-[#080B12]/80 backdrop-blur-xl shadow-2xl animate-float-reverse text-left">
            <span className="text-[10px] font-mono text-[#22D3EE] uppercase">Control Tower Policy</span>
            <p className="text-sm font-bold text-white mt-0.5">Deterministic Safety Gate</p>
            <span className="text-[10px] text-[#94A3B8] font-mono">Human Approvals: Active</span>
          </div>
        </div>
      </section>

      {/* =========================================================================
          03. SOCIAL PROOF & CAPABILITIES STRIP
          ========================================================================= */}
      <section className="border-y border-white/[0.08] bg-white/[0.01] py-8 px-4 sm:px-6 relative z-10">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-center gap-3 sm:gap-6">
          {[
            'REAL-TIME EXECUTION',
            'MULTI-AGENT ORCHESTRATION',
            'OAUTH INTEGRATIONS',
            'AUDITABLE AI TRAILS',
            'AUTONOMOUS SELF-HEALING',
            'DETERMINISTIC GOVERNANCE',
          ].map((item, idx) => (
            <div
              key={idx}
              className="px-4 py-2 rounded-xl border border-white/[0.08] bg-white/[0.02] backdrop-blur-md text-[11px] font-mono font-semibold tracking-wider text-[#94A3B8] hover:text-white hover:border-white/20 transition"
            >
              ◈ {item}
            </div>
          ))}
        </div>
      </section>

      {/* =========================================================================
          04. "THE PROBLEM" — AUTOMATION BREAKS WHEN REALITY CHANGES
          ========================================================================= */}
      <section className="py-24 px-4 sm:px-6 max-w-7xl mx-auto relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-mono text-rose-400 uppercase tracking-widest">The Fragility Paradigm</span>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight mt-3 mb-4">
            Automation breaks when reality changes.
          </h2>
          <p className="text-[#94A3B8] text-sm sm:text-base leading-relaxed">
            Conventional automation tools are brittle sequential scripts. A schema drift, an expired OAuth token, or an unformatted invoice breaks the chain, causing silent failures and manual chaos.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Fragile Traditional Way */}
          <div className="rounded-3xl border border-rose-500/20 bg-gradient-to-b from-rose-950/20 to-[#080B12]/80 p-8 backdrop-blur-xl relative overflow-hidden">
            <div className="flex items-center justify-between mb-6">
              <span className="text-xs font-mono font-bold text-rose-400 uppercase tracking-wider">Traditional Automation</span>
              <span className="px-2.5 py-1 rounded-full bg-rose-500/10 text-rose-400 border border-rose-500/20 text-[10px] font-mono font-bold">FRAGILE</span>
            </div>

            <div className="space-y-4">
              <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.06] flex items-center justify-between text-xs text-[#94A3B8]">
                <span>Static Workflow Script</span>
                <span className="text-emerald-400 font-mono">Triggered</span>
              </div>
              <div className="flex justify-center text-[#64748B] font-mono text-xs">↓</div>
              <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-between text-xs text-rose-300">
                <span className="flex items-center space-x-2">
                  <AlertTriangle className="h-4 w-4 text-rose-400" />
                  <span>Unexpected Missing Field (invoice_amount)</span>
                </span>
                <span className="text-rose-400 font-mono font-bold">FAILURE</span>
              </div>
              <div className="flex justify-center text-rose-500/40 font-mono text-xs">↓</div>
              <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.06] text-xs text-[#64748B] flex items-center justify-between">
                <span>Silent Abort / Unrecoverable Error</span>
                <span className="text-rose-400 font-mono">Process Terminated</span>
              </div>
              <div className="flex justify-center text-rose-500/40 font-mono text-xs">↓</div>
              <div className="p-3.5 rounded-xl bg-rose-950/40 border border-rose-500/20 text-xs text-rose-200 font-mono text-center">
                Manual developer debugging required (3.5 hours downtime)
              </div>
            </div>
          </div>

          {/* Autonomous Agentflow Way */}
          <div className="rounded-3xl border border-[#6366F1]/30 bg-gradient-to-b from-[#6366F1]/10 to-[#080B12]/90 p-8 backdrop-blur-xl relative overflow-hidden shadow-[0_0_50px_rgba(99,102,241,0.15)]">
            <div className="flex items-center justify-between mb-6">
              <span className="text-xs font-mono font-bold text-[#818CF8] uppercase tracking-wider">Agentflow AI Operating System</span>
              <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] font-mono font-bold">SELF-HEALING</span>
            </div>

            <div className="space-y-4">
              <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/[0.08] flex items-center justify-between text-xs text-white">
                <span>1. Understand Intent & Topological Plan</span>
                <span className="text-emerald-400 font-mono">Planner Agent</span>
              </div>
              <div className="flex justify-center text-[#818CF8] font-mono text-xs">↓</div>
              <div className="p-3.5 rounded-xl bg-[#6366F1]/10 border border-[#6366F1]/30 flex items-center justify-between text-xs text-[#818CF8]">
                <span>2. AI Extraction Encountered Schema Drift</span>
                <span className="text-[#818CF8] font-mono">Root Cause Agent</span>
              </div>
              <div className="flex justify-center text-[#818CF8] font-mono text-xs">↓</div>
              <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-between text-xs text-emerald-300">
                <span className="flex items-center space-x-2">
                  <Zap className="h-4 w-4 text-emerald-400" />
                  <span>3. Auto-Healed Field Mapping & Partial Re-Run</span>
                </span>
                <span className="text-emerald-400 font-mono font-bold">RECOVERED</span>
              </div>
              <div className="flex justify-center text-emerald-500/40 font-mono text-xs">↓</div>
              <div className="p-3.5 rounded-xl bg-emerald-950/30 border border-emerald-500/20 text-xs text-emerald-200 font-mono text-center">
                Workflow completed in 1.14s with full audit trail in Control Tower
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          05. CORE 5-AGENT ARCHITECTURE SHOWCASE
          ========================================================================= */}
      <section id="agents" className="py-24 px-4 sm:px-6 max-w-7xl mx-auto border-t border-white/[0.08] relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-mono text-[#818CF8] uppercase tracking-widest">Multi-Agent Substrate</span>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight mt-3 mb-4">
            Five agents. One operational intelligence layer.
          </h2>
          <p className="text-[#94A3B8] text-sm sm:text-base leading-relaxed">
            Operations aren't executed by single black-box prompts. Agentflow partitions tasks across cooperating specialized agents for deterministic execution, strict validation, and automated resilience.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {[
            {
              id: 'planner',
              name: 'Planner Agent',
              role: 'Topology & Ordering',
              desc: 'Calculates acyclic DAG execution order, estimates token footprints, and evaluates upfront confidence.',
              icon: Workflow,
              color: 'text-[#818CF8]',
              border: 'border-[#6366F1]/30',
            },
            {
              id: 'execution',
              name: 'Execution Agent',
              role: 'OAuth & Transformation',
              desc: 'Dispatches real-world actions to Gmail, Slack, Discord, and Google Sheets with AES-256 decrypted tokens.',
              icon: Cpu,
              color: 'text-[#6366F1]',
              border: 'border-[#6366F1]/30',
            },
            {
              id: 'validation',
              name: 'Validation Agent',
              role: 'Schema Enforcement',
              desc: 'Ensures LLM JSON schemas strictly match target data contracts before touching external services.',
              icon: ShieldCheck,
              color: 'text-[#22D3EE]',
              border: 'border-[#22D3EE]/30',
            },
            {
              id: 'recovery',
              name: 'Recovery & Healing',
              role: 'Autonomous Remediation',
              desc: 'Performs Root Cause Analysis, synthesizes dynamic graph patches, and re-executes affected subgraphs.',
              icon: Zap,
              color: 'text-emerald-400',
              border: 'border-emerald-500/30',
            },
            {
              id: 'monitoring',
              name: 'Monitoring Agent',
              role: 'Audit & Telemetry',
              desc: 'Streams millisecond-accurate Socket.IO events, manages Agent Memory, and logs immutable MongoDB timelines.',
              icon: Activity,
              color: 'text-purple-400',
              border: 'border-purple-500/30',
            },
          ].map((agent) => {
            const Icon = agent.icon;
            return (
              <div
                key={agent.id}
                className="p-6 rounded-2xl border border-white/10 bg-white/[0.02] backdrop-blur-xl hover:border-white/20 transition flex flex-col justify-between space-y-4"
              >
                <div className="space-y-3">
                  <div className={`p-3 rounded-xl bg-white/[0.04] w-fit ${agent.color}`}>
                    <Icon className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-white">{agent.name}</h3>
                    <span className="text-[10px] font-mono text-[#818CF8] uppercase tracking-wider">{agent.role}</span>
                  </div>
                  <p className="text-xs text-[#94A3B8] leading-relaxed">{agent.desc}</p>
                </div>

                <div className="pt-3 border-t border-white/[0.06] text-[10px] font-mono text-emerald-400 flex items-center space-x-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  <span>State: Active & Synchronized</span>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* =========================================================================
          06. PROMPT-TO-WORKFLOW INTERACTIVE SHOWCASE
          ========================================================================= */}
      <section id="prompt" className="py-24 px-4 sm:px-6 max-w-7xl mx-auto border-t border-white/[0.08] relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          {/* Left Description & Prompts Selection */}
          <div className="lg:col-span-5 space-y-6 text-left">
            <div>
              <span className="text-xs font-mono text-[#818CF8] uppercase tracking-widest">Natural Language Synthesis</span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mt-2">
                Describe the outcome. Agentflow designs the operation.
              </h2>
            </div>
            <p className="text-[#94A3B8] text-sm leading-relaxed">
              No complex node wiring required. Describe your operational goal in plain English, and the AI Planner synthesizes an executable multi-node topology with typed data bindings in seconds.
            </p>

            {/* Prompt Selector Buttons */}
            <div className="space-y-2 pt-2">
              <span className="text-xs font-mono text-[#64748B] uppercase">Select Sample Operations:</span>
              <div className="flex flex-col space-y-2">
                {samplePrompts.map((p, idx) => (
                  <button
                    key={p.id}
                    onClick={() => setActivePromptIdx(idx)}
                    className={`p-3.5 rounded-xl border text-left text-xs font-medium transition flex items-center justify-between ${
                      activePromptIdx === idx
                        ? 'border-[#6366F1] bg-[#6366F1]/10 text-white shadow-lg shadow-[#6366F1]/10'
                        : 'border-white/10 bg-white/[0.02] text-[#94A3B8] hover:bg-white/[0.05]'
                    }`}
                  >
                    <span>{p.title}</span>
                    <ChevronRight className={`h-4 w-4 ${activePromptIdx === idx ? 'text-[#818CF8]' : 'text-[#64748B]'}`} />
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Right Interactive Prompt Box & Synthesized Graph */}
          <div className="lg:col-span-7 space-y-4">
            {/* Natural Language Prompt Input Box */}
            <div className="rounded-2xl border border-white/10 bg-[#080B12]/90 p-5 backdrop-blur-xl shadow-2xl text-left">
              <div className="flex items-center justify-between text-xs text-[#94A3B8] pb-3 border-b border-white/[0.08]">
                <span className="font-mono flex items-center space-x-1.5">
                  <Sparkles className="h-3.5 w-3.5 text-[#818CF8]" />
                  <span>NATURAL_LANGUAGE_PROMPT</span>
                </span>
                <span className="text-[10px] font-mono text-emerald-400">LLM Planner Ready</span>
              </div>
              <p className="text-xs sm:text-sm text-slate-200 py-3 leading-relaxed font-mono">
                "{activePrompt.text}"
              </p>
              <div className="flex items-center justify-between pt-2 border-t border-white/[0.06] text-xs">
                <span className="text-[11px] text-[#64748B] font-mono">Confidence: {activePrompt.confidence} • Risk: {activePrompt.risk}</span>
                <div className="flex items-center space-x-1 text-[#818CF8] font-bold text-xs">
                  <span>Synthesized Graph</span>
                  <Check className="h-3.5 w-3.5" />
                </div>
              </div>
            </div>

            {/* Rendered Workflow Nodes */}
            <div className="p-6 rounded-2xl border border-white/10 bg-white/[0.02] backdrop-blur-xl space-y-3 text-left">
              <span className="text-[10px] font-mono text-[#64748B] uppercase tracking-wider">Synthesized Execution Pipeline ({activePrompt.nodes.length} Nodes)</span>

              <div className="space-y-2.5">
                {activePrompt.nodes.map((n, i) => (
                  <div
                    key={n.id}
                    className="p-3 rounded-xl border border-white/[0.08] bg-[#080B12]/80 flex items-center justify-between hover:border-[#6366F1]/40 transition"
                  >
                    <div className="flex items-center space-x-3">
                      <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#6366F1]/10 text-[#818CF8] text-xs font-mono font-bold">
                        0{i + 1}
                      </span>
                      <div>
                        <h4 className="text-xs font-bold text-white">{n.name}</h4>
                        <span className="text-[10px] text-[#94A3B8] font-mono">{n.type}</span>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3 text-xs font-mono">
                      {n.tokens && <span className="text-[#64748B] hidden sm:inline">{n.tokens}</span>}
                      <span className="text-[#818CF8]">{n.time}</span>
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          n.status === 'COMPLETED'
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                            : n.status === 'PAUSED'
                            ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                            : 'bg-white/[0.05] text-[#94A3B8]'
                        }`}
                      >
                        {n.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          07. THE INTELLIGENCE TRIAD: PREDICT, RECOVER, GOVERN
          ========================================================================= */}
      <section id="intelligence" className="py-24 px-4 sm:px-6 max-w-7xl mx-auto border-t border-white/[0.08] relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-mono text-[#22D3EE] uppercase tracking-widest">Autonomous Reliability</span>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight mt-3 mb-4">
            Automation that thinks beyond the happy path.
          </h2>
          <p className="text-[#94A3B8] text-sm sm:text-base leading-relaxed">
            True autonomous operations require three non-negotiable capabilities: the ability to simulate risk before running, self-heal runtime failures, and involve human operators when stakes are high.
          </p>
        </div>

        {/* 3 Large Asymmetric Glass Panels */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Panel 01: Predict */}
          <div className="rounded-3xl border border-[#22D3EE]/20 bg-gradient-to-b from-[#22D3EE]/[0.05] to-[#080B12]/80 p-8 backdrop-blur-xl flex flex-col justify-between space-y-6 hover:border-[#22D3EE]/40 transition">
            <div className="space-y-4 text-left">
              <span className="px-3 py-1 rounded-full bg-[#22D3EE]/10 text-[#22D3EE] border border-[#22D3EE]/20 text-[10px] font-mono font-bold uppercase">
                01 • PREDICT
              </span>
              <h3 className="text-xl font-bold text-white">AI Workflow Simulation</h3>
              <p className="text-xs text-[#94A3B8] leading-relaxed">
                Test an operation before it touches production. The Digital Twin agent evaluates API dependencies, schema risks, and cost estimates.
              </p>

              <div className="p-4 rounded-xl bg-black/40 border border-white/[0.06] space-y-2 font-mono text-xs">
                <div className="flex justify-between text-[#94A3B8]">
                  <span>RISK SCORE</span>
                  <span className="text-[#22D3EE] font-bold">18 / 100</span>
                </div>
                <div className="flex justify-between text-[#94A3B8]">
                  <span>Potential Failures</span>
                  <span className="text-amber-400">1 (Missing field)</span>
                </div>
                <div className="flex justify-between text-[#94A3B8]">
                  <span>External APIs</span>
                  <span className="text-white">3 (Gmail, Sheets, Slack)</span>
                </div>
                <div className="flex justify-between text-[#94A3B8]">
                  <span>Estimated Runtime</span>
                  <span className="text-white">1.14s</span>
                </div>
              </div>
            </div>

            <button
              onClick={handleSimulate}
              disabled={simulationRunning}
              className="w-full py-3 rounded-xl bg-[#22D3EE]/10 hover:bg-[#22D3EE]/20 text-[#22D3EE] border border-[#22D3EE]/30 text-xs font-mono font-bold transition flex items-center justify-center space-x-2"
            >
              <RefreshCw className={`h-3.5 w-3.5 ${simulationRunning ? 'animate-spin' : ''}`} />
              <span>{simulationRunning ? 'Running Sandbox Simulation...' : 'Run Digital Twin Simulation'}</span>
            </button>
          </div>

          {/* Panel 02: Recover */}
          <div className="rounded-3xl border border-emerald-500/20 bg-gradient-to-b from-emerald-500/[0.05] to-[#080B12]/80 p-8 backdrop-blur-xl flex flex-col justify-between space-y-6 hover:border-emerald-500/40 transition">
            <div className="space-y-4 text-left">
              <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] font-mono font-bold uppercase">
                02 • RECOVER
              </span>
              <h3 className="text-xl font-bold text-white">Self-Healing Operations</h3>
              <p className="text-xs text-[#94A3B8] leading-relaxed">
                When reality breaks the workflow, Agentflow diagnoses the root cause, applies schema patches, and re-executes only the affected subgraphs.
              </p>

              <div className="p-4 rounded-xl bg-black/40 border border-white/[0.06] space-y-2 font-mono text-xs">
                <div className="flex items-center space-x-2 text-rose-400">
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-400" />
                  <span>RUNTIME FAILED</span>
                </div>
                <div className="flex items-center space-x-2 text-[#818CF8]">
                  <span>↳ ROOT CAUSE ANALYZED</span>
                </div>
                <div className="flex items-center space-x-2 text-amber-400">
                  <span>↳ PROPOSED PATCH APPLIED</span>
                </div>
                <div className="flex items-center space-x-2 text-emerald-400">
                  <span>↳ PARTIAL RE-RUN PASSED</span>
                </div>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-mono text-center">
              ✓ Automated Field Remapping Active
            </div>
          </div>

          {/* Panel 03: Govern */}
          <div id="control-tower" className="rounded-3xl border border-[#818CF8]/20 bg-gradient-to-b from-[#818CF8]/[0.05] to-[#080B12]/80 p-8 backdrop-blur-xl flex flex-col justify-between space-y-6 hover:border-[#818CF8]/40 transition">
            <div className="space-y-4 text-left">
              <span className="px-3 py-1 rounded-full bg-[#818CF8]/10 text-[#818CF8] border border-[#818CF8]/20 text-[10px] font-mono font-bold uppercase">
                03 • GOVERN
              </span>
              <h3 className="text-xl font-bold text-white">Human Control Tower</h3>
              <p className="text-xs text-[#94A3B8] leading-relaxed">
                Autonomous when safe. Human when necessary. High-risk financial transactions or low-confidence AI steps trigger deterministic human review.
              </p>

              <div className="p-4 rounded-xl bg-black/40 border border-white/[0.06] space-y-2 font-mono text-xs">
                <div className="flex justify-between text-[#94A3B8]">
                  <span>AI CONFIDENCE</span>
                  <span className="text-amber-400 font-bold">72.4%</span>
                </div>
                <div className="flex justify-between text-[#94A3B8]">
                  <span>ACTION</span>
                  <span className="text-rose-400">REQUIRES APPROVAL</span>
                </div>
                <div className="flex justify-between text-[#94A3B8]">
                  <span>INVOICE AMOUNT</span>
                  <span className="text-white font-bold">$8,750.00</span>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <button className="flex-1 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-mono font-bold transition">
                APPROVE
              </button>
              <button className="flex-1 py-2.5 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] border border-white/10 text-[#94A3B8] text-xs font-mono font-bold transition">
                REVIEW
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          08. REAL-TIME TELEMETRY & AUDIT STREAM
          ========================================================================= */}
      <section className="py-24 px-4 sm:px-6 max-w-7xl mx-auto border-t border-white/[0.08] relative z-10">
        <div className="rounded-3xl border border-white/10 bg-[#080B12]/90 p-8 backdrop-blur-2xl text-left relative overflow-hidden shadow-2xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/[0.08]">
            <div className="flex items-center space-x-3">
              <Terminal className="h-5 w-5 text-[#22D3EE]" />
              <div>
                <h3 className="text-sm font-bold text-white font-mono">REAL_TIME_EXECUTION_TELEMETRY</h3>
                <span className="text-[10px] text-[#94A3B8]">Socket.IO sub-millisecond event audit log</span>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] font-mono">
                ● Connected to Stream
              </span>
            </div>
          </div>

          <div className="py-4 space-y-2 font-mono text-xs overflow-x-auto">
            {telemetryLogs.map((log) => (
              <div
                key={log.id}
                className="flex items-start space-x-4 p-2.5 rounded-lg bg-white/[0.02] border border-white/[0.04] hover:bg-white/[0.04] transition"
              >
                <span className="text-[#64748B] text-[11px] whitespace-nowrap">{log.time}</span>
                <span
                  className={`px-1.5 py-0.5 rounded text-[9px] font-bold tracking-wider ${
                    log.agent === 'PLANNER'
                      ? 'bg-[#6366F1]/20 text-[#818CF8]'
                      : log.agent === 'EXECUTION'
                      ? 'bg-blue-500/20 text-blue-400'
                      : log.agent === 'VALIDATION'
                      ? 'bg-[#22D3EE]/20 text-[#22D3EE]'
                      : 'bg-purple-500/20 text-purple-400'
                  }`}
                >
                  {log.agent}
                </span>
                <span className="text-slate-300 text-xs">{log.msg}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* =========================================================================
          09. INTEGRATION ECOSYSTEM
          ========================================================================= */}
      <section id="integrations" className="py-24 px-4 sm:px-6 max-w-7xl mx-auto border-t border-white/[0.08] relative z-10 text-center">
        <span className="text-xs font-mono text-[#818CF8] uppercase tracking-widest">Enterprise Ecosystem</span>
        <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight mt-3 mb-4">
          Your existing stack. One intelligent operating layer.
        </h2>
        <p className="text-[#94A3B8] text-sm sm:text-base max-w-2xl mx-auto leading-relaxed mb-12">
          Connect your tools with granular OAuth scopes and hardware-grade AES-256 encrypted credential storage.
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {[
            { name: 'Gmail', desc: 'OAuth Read/Send', icon: 'M' },
            { name: 'Slack', desc: 'Bot & Channels', icon: '#' },
            { name: 'Discord', desc: 'Webhooks & War-Rooms', icon: 'D' },
            { name: 'Google Sheets', desc: 'Data Tables & Rows', icon: 'S' },
            { name: 'Gemini AI', desc: 'Multimodal LLM', icon: '✦' },
            { name: 'OpenRouter', desc: 'Dynamic Fallbacks', icon: 'OR' },
          ].map((item, idx) => (
            <div
              key={idx}
              className="p-5 rounded-2xl border border-white/10 bg-white/[0.02] backdrop-blur-md flex flex-col items-center justify-center space-y-2 hover:border-[#6366F1]/40 transition group"
            >
              <div className="w-10 h-10 rounded-xl bg-white/[0.05] border border-white/10 flex items-center justify-center text-sm font-mono font-bold text-white group-hover:scale-110 transition">
                {item.icon}
              </div>
              <span className="text-xs font-bold text-white">{item.name}</span>
              <span className="text-[10px] text-[#94A3B8] font-mono">{item.desc}</span>
            </div>
          ))}
        </div>
      </section>

      {/* =========================================================================
          10. ENTERPRISE SECURITY & METRICS
          ========================================================================= */}
      <section id="security" className="py-24 px-4 sm:px-6 max-w-7xl mx-auto border-t border-white/[0.08] relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6 text-left">
            <div>
              <span className="text-xs font-mono text-emerald-400 uppercase tracking-widest">Enterprise Trust</span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mt-2">
                Intelligence with total accountability.
              </h2>
            </div>
            <p className="text-[#94A3B8] text-sm leading-relaxed">
              Every operation executed by Agentflow AI maintains a complete immutable execution record. All credentials are encrypted at rest with AES-256-CBC and secrets are never logged in cleartext.
            </p>

            <div className="space-y-3 pt-2">
              {[
                { title: 'AES-256-CBC Credential Encryption', desc: 'Tokens encrypted with server secret keys' },
                { title: 'Granular OAuth Scopes', desc: 'Minimal permission access for Gmail and Google Sheets' },
                { title: 'Deterministic Policy Engine', desc: 'Rule-based execution constraints & financial guards' },
                { title: 'Immutable Execution Timeline', desc: 'Complete replayability and audit compliance' },
              ].map((s, i) => (
                <div key={i} className="flex items-start space-x-3 p-3 rounded-xl bg-white/[0.02] border border-white/[0.06]">
                  <ShieldCheck className="h-5 w-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-xs font-bold text-white">{s.title}</h4>
                    <p className="text-[11px] text-[#94A3B8]">{s.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Metrics Column */}
          <div className="grid grid-cols-2 gap-4">
            <div className="p-6 rounded-2xl border border-white/10 bg-[#080B12]/80 backdrop-blur-xl text-left">
              <span className="text-3xl sm:text-4xl font-extrabold text-white font-mono">5</span>
              <h4 className="text-xs font-bold text-[#818CF8] mt-2 uppercase tracking-wider">Cooperating Agents</h4>
              <p className="text-[11px] text-[#94A3B8] mt-1">Planner, Execution, Validation, Recovery, Monitoring</p>
            </div>

            <div className="p-6 rounded-2xl border border-white/10 bg-[#080B12]/80 backdrop-blur-xl text-left">
              <span className="text-3xl sm:text-4xl font-extrabold text-emerald-400 font-mono">100%</span>
              <h4 className="text-xs font-bold text-emerald-400 mt-2 uppercase tracking-wider">Auditable Runs</h4>
              <p className="text-[11px] text-[#94A3B8] mt-1">Every token, node output, and error logged to MongoDB</p>
            </div>

            <div className="p-6 rounded-2xl border border-white/10 bg-[#080B12]/80 backdrop-blur-xl text-left">
              <span className="text-3xl sm:text-4xl font-extrabold text-[#22D3EE] font-mono">&lt; 100ms</span>
              <h4 className="text-xs font-bold text-[#22D3EE] mt-2 uppercase tracking-wider">Telemetry Latency</h4>
              <p className="text-[11px] text-[#94A3B8] mt-1">Real-time Socket.IO operational updates</p>
            </div>

            <div className="p-6 rounded-2xl border border-white/10 bg-[#080B12]/80 backdrop-blur-xl text-left">
              <span className="text-3xl sm:text-4xl font-extrabold text-purple-400 font-mono">24 / 7</span>
              <h4 className="text-xs font-bold text-purple-400 mt-2 uppercase tracking-wider">Self-Healing</h4>
              <p className="text-[11px] text-[#94A3B8] mt-1">Automatic retry with backoff and prompt repairs</p>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          11. FINAL CINEMATIC CTA
          ========================================================================= */}
      <section className="py-28 px-4 sm:px-6 max-w-6xl mx-auto text-center relative z-10">
        <div className="rounded-3xl border border-white/10 bg-gradient-to-b from-[#6366F1]/20 via-[#080B12]/90 to-[#080B12] p-10 sm:p-16 backdrop-blur-2xl shadow-[0_0_80px_rgba(99,102,241,0.25)] relative overflow-hidden">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-[#6366F1]/20 blur-[100px] rounded-full pointer-events-none" />

          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight max-w-3xl mx-auto mb-6">
            Give your operations an intelligence layer.
          </h2>

          <p className="text-[#94A3B8] text-sm sm:text-base max-w-xl mx-auto leading-relaxed mb-10">
            From first natural-language prompt to observable execution and self-healing recovery, deploy resilient operations in minutes.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/register"
              className="w-full sm:w-auto px-8 py-4 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-[#6366F1] to-[#8B5CF6] hover:from-[#4f46e5] hover:to-[#7c3aed] shadow-xl shadow-[#6366F1]/30 flex items-center justify-center space-x-2 transition hover:scale-105"
            >
              <span>Launch Agentflow Now</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/login"
              className="w-full sm:w-auto px-7 py-4 rounded-xl text-sm font-semibold text-white bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 transition"
            >
              Sign In to Console
            </Link>
          </div>
        </div>
      </section>

      {/* =========================================================================
          12. MINIMALIST ENTERPRISE FOOTER
          ========================================================================= */}
      <footer className="border-t border-white/[0.08] py-12 px-4 sm:px-6 relative z-10 bg-[#05060A]">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 text-xs text-[#94A3B8]">
          <div className="flex items-center space-x-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-tr from-[#6366F1] to-[#8B5CF6]">
              <Bot className="h-4 w-4 text-white" />
            </div>
            <div>
              <p className="font-bold text-white">Agentflow AI</p>
              <p className="text-[10px] text-[#64748B]">Autonomous AI Operations Platform</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-6">
            <a href="#agents" className="hover:text-white transition">Architecture</a>
            <a href="#prompt" className="hover:text-white transition">Prompt Engine</a>
            <a href="#intelligence" className="hover:text-white transition">Intelligence Triad</a>
            <a href="#control-tower" className="hover:text-white transition">Control Tower</a>
            <a href="#security" className="hover:text-white transition">Security</a>
            <Link href="/login" className="hover:text-white transition">Console</Link>
          </div>

          <div className="text-[11px] text-[#64748B] font-mono">
            © 2026 Agentflow AI. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
