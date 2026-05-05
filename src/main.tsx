import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

if ('serviceWorker' in navigator) {
  // Unregister all old SWs first so stale caches never block updates,
  // then register the current (notification-only) SW.
  navigator.serviceWorker.getRegistrations().then((regs) => {
    Promise.all(regs.map((r) => r.unregister())).then(() => {
      navigator.serviceWorker.register(import.meta.env.BASE_URL + 'sw.js').catch(console.error);
    });
  });
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
