import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import './styles/global.css';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <a className="skip-link" href="#main">
      Skip to content
    </a>
    <App />
  </StrictMode>
);
