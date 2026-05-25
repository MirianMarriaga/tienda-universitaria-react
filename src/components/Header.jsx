import { useLocation, Link } from 'react-router-dom'
const routeNames = {
  '/': 'Dashboard',
  '/clientes': 'Clientes',
  '/categorias': 'Categorías',
  '/productos': 'Productos',
  '/inventario': 'Inventario',
  '/pedidos': 'Pedidos',
  '/reportes': 'Reportes',
}

function Header() {
  const location = useLocation()
  const current = routeNames[location.pathname] || 'Página'

  return (
    <header className="header-breadcrumb-container">
      <nav className="breadcrumb" aria-label="Breadcrumb">
        <Link to="/" className="breadcrumb-link">Inicio</Link>
        {location.pathname !== '/' && (
          <>
            <span className="breadcrumb-separator"> / </span>
            <span className="breadcrumb-current">{current}</span>
          </>
        )}
      </nav>
    </header>
  )
}

export default Header