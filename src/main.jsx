import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router';
import App from './App.jsx';
import './index.css';
import { CategoryProvider } from './context/CategoryContext.jsx'
import { InventoryProvider } from './context/InventoryContext.jsx'
import { OrderProvider } from './context/OrderContext.jsx'
import { CustomerProvider } from './context/CustomerContext.jsx';
import { ProductProvider } from './context/ProductContext.jsx';
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <CategoryProvider>
        <InventoryProvider>
            <OrderProvider>
              <CustomerProvider>
                <ProductProvider>
              <App />
              </ProductProvider>
              </CustomerProvider>
            </OrderProvider>
        </InventoryProvider>
      </CategoryProvider>
    </BrowserRouter>
  </React.StrictMode>
);