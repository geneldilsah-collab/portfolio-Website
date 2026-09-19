import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import '../assets/css/style.css';
import '../assets/css/interaction-overrides.css';
import '../assets/css/work-card-overrides.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
