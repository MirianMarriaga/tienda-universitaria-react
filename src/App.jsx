import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import heroImg from './assets/hero.png'
import './App.css'
import { Route, Routes } from 'react-router-dom'

function App() { 
  return (
    <>
      <Routes> 
        <Route path="/" element={<h1>Dashboard</h1>} />
        <Route path="/clientes" element={<h1>Clientes</h1>} />
        <Route path="/categorias" element={<h1>Categorias</h1>} />
        <Route path="/productos" element={<h1>Productos</h1>} />
        <Route path="/inventario" element={<h1>Inventario</h1>} />
        <Route path="/pedidos" element={<h1>Pedidos</h1>} />
        <Route path="/reportes" element={<h1>Reportes</h1>} />
      </Routes>
    </>
  )
}

export default App
