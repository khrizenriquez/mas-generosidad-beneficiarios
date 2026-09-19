import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import { AnonymousAnalytics } from './app/AnonymousAnalytics.jsx';
import { AppProviders } from './app/AppProviders.jsx';
import './styles/global.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AppProviders>
      <App />
    </AppProviders>
    <AnonymousAnalytics />
  </React.StrictMode>,
);
