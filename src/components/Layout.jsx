import { Outlet } from 'react-router-dom'
import Sidebar from './Sidebar'
import Header from './Header'

function Layout() {
  return (
    <div style={{ display: 'flex', height: '100vh' }}>
      <Sidebar />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <Header />
            <main style={{ flex: 1, overflowY: 'auto',padding: '24px', width: '100%', boxSizing: 'border-box'}}>
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default Layout