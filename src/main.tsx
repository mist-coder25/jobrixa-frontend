import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import posthog from 'posthog-js';

// Initialize PostHog
posthog.init('phc_ohWpg8eh6iehNTiKbG7R3JT5oWENrdgX4QV2ViPWr5QS', {
  api_host: 'https://app.posthog.com',
  autocapture: true,
  capture_pageview: true,
});

createRoot(document.getElementById('root')!).render(
    <App />
)
