import React from 'react';
import ReactDOM from 'react-dom/client'; // Correct import for React 18
import './globals.css';
import App from './App.tsx';

const root = ReactDOM.createRoot(document.getElementById('root')); // Use createRoot for React 18
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);