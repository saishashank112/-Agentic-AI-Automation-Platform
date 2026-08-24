import '../styles/globals.css';
import { useEffect } from 'react';
import { useAuthStore } from '../store/authStore';
import { useThemeStore } from '../store/themeStore';

export default function App({ Component, pageProps }) {
  const initialize = useAuthStore((state) => state.initialize);
  const initTheme = useThemeStore((state) => state.initTheme);

  useEffect(() => {
    initialize();
    initTheme();
  }, [initialize, initTheme]);

  return <Component {...pageProps} />;
}
