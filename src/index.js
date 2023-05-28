import React from 'react';
import ReactDOM from 'react-dom/client';
import './assets/styles/global.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import AuthProvider from './providers/AuthProvider';
import Router from './components/ui/Router';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <AuthProvider>
      <Router />
    </AuthProvider>
  </React.StrictMode>
);
