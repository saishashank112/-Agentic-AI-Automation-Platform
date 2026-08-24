import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import {
  LayoutDashboard,
  GitFork,
  Sparkles,
  PlayCircle,
  Puzzle,
  Settings,
  LogOut,
  Bell,
  X,
  Bot,
  Activity,
  Sun,
  Moon,
  CheckCheck,
  Send,
  ShieldCheck,
  Zap,
} from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { useThemeStore } from '../../store/themeStore';
import api from '../../services/api';

export default function AppShell({ children }) {
  const router = useRouter();
  const { user, logout } = useAuthStore();
  const { theme, toggleTheme } = useThemeStore();
  const [notifications, setNotifications] = useState([]);
  const [notifOpen, setNotifOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Control Tower', href: '/control-tower', icon: ShieldCheck },
    { name: 'AI Optimizer', href: '/optimizations', icon: Zap },
    { name: 'Workflows', href: '/workflows', icon: GitFork },
    { name: 'AI Builder', href: '/workflows/builder', icon: Sparkles },
    { name: 'Executions', href: '/executions', icon: PlayCircle },
    { name: 'Integrations', href: '/integrations', icon: Puzzle },
    { name: 'Settings', href: '/settings', icon: Settings },
  ];

  const fetchNotifications = async () => {
    try {
      const res = await api.get('/notifications');
      const data = res.data.data || [];
      setNotifications(data);
      setUnreadCount(data.filter((n) => !n.isRead).length);
    } catch (err) {
      console.warn('Error fetching notifications:', err.message);
    }
  };

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 8000);
    return () => clearInterval(interval);
  }, []);

  const markRead = async (id) => {
    try {
      await api.put(`/notifications/${id}/read`);
      setNotifications((prev) => prev.map((n) => (n._id === id ? { ...n, isRead: true } : n)));
      setUnreadCount((prev) => Math.max(0, prev - 1));
    } catch (err) {
      console.error(err);
    }
  };

  const markAllRead = async () => {
    try {
      await api.put('/notifications/read-all');
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
      setUnreadCount(0);
    } catch (err) {
      console.error(err);
    }
  };

  const sendTestAlert = async () => {
    try {
      await api.post('/notifications/test');
      fetchNotifications();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-dark-900 text-slate-100">
      {/* Left Sidebar */}
      <aside className="w-64 border-r border-dark-700 bg-dark-800 flex flex-col justify-between">
        <div>
          <div className="flex items-center space-x-3 px-6 py-5 border-b border-dark-700">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-brand-600 to-indigo-400 shadow-lg shadow-brand-500/20">
              <Bot className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="font-bold text-base tracking-tight text-white leading-none">Agentflow AI</h1>
              <span className="text-[10px] text-indigo-400 font-medium">Ops Automation v1.0</span>
            </div>
          </div>

          <nav className="p-4 space-y-1.5">
            {navigation.map((item) => {
              const Icon = item.icon;
              const isActive = router.pathname === item.href || (item.href !== '/dashboard' && router.pathname.startsWith(item.href));
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center space-x-3 px-3.5 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 ${
                    isActive
                      ? 'bg-brand-600 text-white shadow-md shadow-brand-600/30'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-dark-700'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* User Profile & Footer */}
        <div className="p-4 border-t border-dark-700">
          <div className="flex items-center justify-between p-2 rounded-lg bg-dark-900 border border-dark-700 mb-2">
            <div className="flex items-center space-x-2.5 overflow-hidden">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-700 text-slate-200 text-xs font-bold">
                {user?.name?.[0]?.toUpperCase() || 'O'}
              </div>
              <div className="overflow-hidden">
                <p className="text-xs font-semibold text-white truncate">{user?.name || 'Operator'}</p>
                <span className="inline-block px-1.5 py-0.5 text-[9px] font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded">
                  {user?.role || 'operator'}
                </span>
              </div>
            </div>
            <button
              onClick={logout}
              title="Logout"
              className="p-1.5 text-slate-400 hover:text-rose-400 rounded-md hover:bg-dark-700 transition"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Container */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Header */}
        <header className="h-16 border-b border-dark-700 bg-dark-800/60 backdrop-blur px-6 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2 text-xs text-slate-400 bg-dark-900 px-3 py-1.5 rounded-full border border-dark-700">
              <Activity className="h-3.5 w-3.5 text-emerald-400 animate-pulse" />
              <span>Self-Healing Substrate: Active</span>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            {/* Dark / Light Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
              className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-dark-700 transition"
            >
              {theme === 'dark' ? <Sun className="h-5 w-5 text-amber-400" /> : <Moon className="h-5 w-5 text-indigo-400" />}
            </button>

            {/* Notification Bell */}
            <div className="relative">
              <button
                onClick={() => setNotifOpen(!notifOpen)}
                className="relative p-2 text-slate-400 hover:text-white rounded-lg hover:bg-dark-700 transition"
              >
                <Bell className="h-5 w-5" />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-indigo-500 text-[10px] font-bold text-white">
                    {unreadCount}
                  </span>
                )}
              </button>

              {/* Notification Drawer */}
              {notifOpen && (
                <div className="absolute right-0 mt-3 w-84 rounded-xl border border-dark-700 bg-dark-800 shadow-2xl z-50 overflow-hidden">
                  <div className="flex items-center justify-between px-4 py-3 border-b border-dark-700 bg-dark-900">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">Live Alerts</h3>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={sendTestAlert}
                        title="Trigger Test Alert"
                        className="p-1 text-slate-400 hover:text-indigo-400"
                      >
                        <Send className="h-3.5 w-3.5" />
                      </button>
                      <button
                        onClick={markAllRead}
                        title="Mark All Read"
                        className="p-1 text-slate-400 hover:text-emerald-400"
                      >
                        <CheckCheck className="h-3.5 w-3.5" />
                      </button>
                      <button onClick={() => setNotifOpen(false)} className="p-1 text-slate-400 hover:text-white">
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                  <div className="max-h-80 overflow-y-auto divide-y divide-dark-700/50">
                    {notifications.length === 0 ? (
                      <p className="p-4 text-xs text-slate-500 text-center">No notifications available</p>
                    ) : (
                      notifications.map((n) => (
                        <div
                          key={n._id}
                          onClick={() => markRead(n._id)}
                          className={`p-3.5 text-xs transition cursor-pointer hover:bg-dark-700/50 ${
                            !n.isRead ? 'bg-indigo-950/20' : ''
                          }`}
                        >
                          <div className="flex items-center justify-between mb-1">
                            <span
                              className={`font-semibold ${
                                n.type === 'success'
                                  ? 'text-emerald-400'
                                  : n.type === 'error'
                                  ? 'text-rose-400'
                                  : 'text-indigo-400'
                              }`}
                            >
                              {n.title}
                            </span>
                            <span className="text-[10px] text-slate-500">
                              {new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </div>
                          <p className="text-slate-300 text-[11px] leading-relaxed">{n.message}</p>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Dynamic Page Content */}
        <main className="flex-1 overflow-y-auto p-6 bg-dark-900">{children}</main>
      </div>
    </div>
  );
}
