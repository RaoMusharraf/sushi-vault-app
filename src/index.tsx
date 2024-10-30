import React from 'react';
import ReactDOM from 'react-dom/client'; // For React 18
import './styles.css';
import App from './App';

const rootElement = document.getElementById('root') as HTMLElement;

const root = ReactDOM.createRoot(rootElement); // Create a root for React 18
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);