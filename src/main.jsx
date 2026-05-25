import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router';
import App from './App.jsx';
import { CategoryProvider } from './context/CategoryContext.jsx'
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <CategoryProvider>
      <App />
      </CategoryProvider>
    </BrowserRouter>
  </React.StrictMode>
);