import { Route, Routes } from 'react-router-dom'
import Layout from './components/Layout'
import CategoriesPage from './pages/CategoriesPage'
import InventoriesPage from './pages/InventoriesPage'
import OrdersPage from './pages/OrdersPage'
import CustomersPage from './pages/CustomersPage'
import ProductsPage from './pages/ProductsPage'
import DashboardPage from './pages/DashboardPage'
import ReportsPage from './pages/ReportsPage'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<DashboardPage />} />
        <Route path="clientes" element={<CustomersPage />} />
        <Route path="categorias" element={<CategoriesPage/>} />
        <Route path="productos" element={<ProductsPage />} />
        <Route path="inventario" element={<InventoriesPage />} />       
        <Route path="pedidos" element={<OrdersPage />} />
        <Route path="reportes" element={<ReportsPage/>} />
      </Route>
    </Routes>
  )
}

export default App