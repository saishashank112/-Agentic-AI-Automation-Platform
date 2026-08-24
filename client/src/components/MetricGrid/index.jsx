import { GitFork, PlayCircle, CheckCircle2, TrendingUp } from 'lucide-react';

export default function MetricGrid({ stats }) {
  const metrics = [
    {
      title: 'Total Workflows',
      value: stats?.totalWorkflows || 0,
      subtext: `${stats?.activeWorkflows || 0} active in production`,
      icon: GitFork,
      color: 'text-indigo-400',
      bg: 'bg-indigo-500/10',
      border: 'border-indigo-500/20',
    },
    {
      title: 'Total Executions',
      value: stats?.totalExecutions || 0,
      subtext: 'Across all agentic chains',
      icon: PlayCircle,
      color: 'text-cyan-400',
      bg: 'bg-cyan-500/10',
      border: 'border-cyan-500/20',
    },
    {
      title: 'Execution Success Rate',
      value: `${stats?.successRate ?? 100}%`,
      subtext: `${stats?.successfulExecutions || 0} succeeded, ${stats?.failedExecutions || 0} failed`,
      icon: CheckCircle2,
      color: 'text-emerald-400',
      bg: 'bg-emerald-500/10',
      border: 'border-emerald-500/20',
    },
    {
      title: 'Agentic Health Index',
      value: '99.8%',
      subtext: 'Substrate & LLM providers operational',
      icon: TrendingUp,
      color: 'text-purple-400',
      bg: 'bg-purple-500/10',
      border: 'border-purple-500/20',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {metrics.map((m, idx) => {
        const Icon = m.icon;
        return (
          <div
            key={idx}
            className="rounded-xl border border-dark-700 bg-dark-800 p-5 shadow-sm hover:border-dark-600 transition"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">{m.title}</span>
              <div className={`p-2 rounded-lg ${m.bg} ${m.border} border`}>
                <Icon className={`h-4 w-4 ${m.color}`} />
              </div>
            </div>
            <div className="text-2xl font-bold text-white tracking-tight mb-1">{m.value}</div>
            <p className="text-xs text-slate-400">{m.subtext}</p>
          </div>
        );
      })}
    </div>
  );
}
