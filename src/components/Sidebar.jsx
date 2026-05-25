import { NavLink } from 'react-router-dom';

function Sidebar() {
  // Esta función asigna la clase 'active' automáticamente si la ruta coincide
  const navLinkClass = ({ isActive }) => isActive ? "nav-link active" : "nav-link";

  return (
    <aside className="sidebar">

      {/* HEADER */}
      <header className="sidebar-header">
        <h2 className="brand-title">Tienda Unimag</h2>
        <span className="brand-subtitle">Panel administrativo</span>
      </header>

      {/* NAVEGACIÓN PRINCIPAL */}
      <nav className="sidebar-nav" aria-label="Navegación principal">
        
        {/* Grupo: Operaciones */}
        <div className="nav-group">
          <h3 className="nav-title">Operaciones</h3>
          <ul className="nav-list">
            <li><NavLink to="/" className={navLinkClass} end>Dashboard</NavLink></li>
          </ul>
        </div>
        
        <hr className="divider" aria-hidden="true" />

        {/* Grupo: Catálogo */}
        <div className="nav-group">
          <h3 className="nav-title">Catálogo</h3>
          <ul className="nav-list">
            <li><NavLink to="/clientes" className={navLinkClass}>Clientes</NavLink></li>
            <li><NavLink to="/categorias" className={navLinkClass}>Categorías</NavLink></li>
            <li><NavLink to="/productos" className={navLinkClass}>Productos</NavLink></li>
            <li><NavLink to="/inventario" className={navLinkClass}>Inventario</NavLink></li>
          </ul>
        </div>

        <hr className="divider" aria-hidden="true" />

        {/* Grupo: Ventas */}
        <div className="nav-group">
          <h3 className="nav-title">Ventas</h3>
          <ul className="nav-list">
            <li><NavLink to="/pedidos" className={navLinkClass}>Pedidos</NavLink></li>
            <li><NavLink to="/reportes" className={navLinkClass}>Reportes</NavLink></li>
          </ul>
        </div>

      </nav>

      {/* FOOTER - PERFIL */}
      <footer className="sidebar-footer">
        <div className="profile-card">
          <div className="avatar" aria-hidden="true">AC</div>
          <div className="profile-info">
            <strong className="profile-name">Admin Comercial</strong>
            <span className="profile-email">tienda@unimag.edu.co</span>
          </div>
        </div>
      </footer>

    </aside>
  );
}

export default Sidebar;