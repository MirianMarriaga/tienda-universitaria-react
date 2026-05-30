import { Route, Routes } from 'react-router-dom'
import Layout from './components/Layout'
import CategoriesPage from './pages/CategoriesPage'
import InventoriesPage from './pages/InventoriesPage'
import OrdersPage from './pages/OrdersPage'
import DashboardPage from './pages/DashboardPage'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<DashboardPage />} />
        <Route path="clientes" element={<h1>Clientes</h1>} />
        <Route path="categorias" element={<CategoriesPage/>} />
        <Route path="productos" element={<h1>Productos</h1>} />
        <Route path="inventario" element={<InventoriesPage />} />       
        <Route path="pedidos" element={<OrdersPage />} />
        <Route path="reportes" element={<h1>Reportes</h1>} />
      </Route>
    </Routes>
  )
}

export default App