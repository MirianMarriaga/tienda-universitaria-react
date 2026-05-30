import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router';
import App from './App.jsx';
import { CategoryProvider } from './context/CategoryContext.jsx'
import './index.css';
import { InventoryProvider } from './context/InventoryContext.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <CategoryProvider>
        <InventoryProvider>
          <App />
        </InventoryProvider>
      </CategoryProvider>
    </BrowserRouter>
  </React.StrictMode>
);