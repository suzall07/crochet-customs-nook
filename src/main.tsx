
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { initializeDefaultData, checkSessionStatus } from './utils/authUtils';

// Initialize default data and check session status on app load
initializeDefaultData();
checkSessionStatus();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
