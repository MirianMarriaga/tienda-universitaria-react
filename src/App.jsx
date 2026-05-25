import './App.css'
import { Route, Routes } from 'react-router-dom'
import Sidebar from './components/Sidebar.jsx';

function App() { 
  return (
    <>
      {/* 3. Colocamos tu menú lateral a la izquierda */}
      <Sidebar />

      {/* 4. Colocamos las rutas a la derecha envueltas en un main */}
      <main style={{ flex: 1, padding: '30px', overflowY: 'auto' }}>
        <Routes> 
          <Route path="/" element={<h1>Dashboard</h1>} />
          <Route path="/clientes" element={<h1>Clientes</h1>} />
          <Route path="/categorias" element={<h1>Categorias</h1>} />
          <Route path="/productos" element={<h1>Productos</h1>} />
          <Route path="/inventario" element={<h1>Inventario</h1>} />
          <Route path="/pedidos" element={<h1>Pedidos</h1>} />
          <Route path="/reportes" element={<h1>Reportes</h1>} />
        </Routes>
      </main>

    </>
  )
}

export default App
