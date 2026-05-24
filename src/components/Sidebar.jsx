

function Sidebar() {
  return (
    <div className="sidebar">
      <Link to="/">Dashboard</Link>
      <Link to="/clientes">Clientes</Link>
      <Link to="/categorias">Categorias</Link>
      <Link to="/productos">Productos</Link>
      <Link to="/inventario">Inventario</Link>
      <Link to="/pedidos">Pedidos</Link>
      <Link to="/reportes">Reportes</Link>
    </div>
  )
}

export default Sidebar