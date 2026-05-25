import { Route, Routes } from 'react-router-dom'
import Layout from './components/Layout'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<h1>Dashboard</h1>} />
        <Route path="clientes" element={<h1>Clientes</h1>} />
        <Route path="categorias" element={<h1>Categorías</h1>} />
        <Route path="productos" element={<h1>Productos</h1>} />
        <Route path="inventario" element={<h1>Inventario</h1>} />
        <Route path="pedidos" element={<h1>Pedidos</h1>} />
        <Route path="reportes" element={<h1>Reportes</h1>} />
      </Route>
    </Routes>
  )
}

export default App