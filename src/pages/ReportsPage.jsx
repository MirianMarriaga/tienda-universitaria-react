import { useState, useEffect } from 'react'

import {
    bestSellingProducts,
    monthlyIncome,
    topCustomers,
    lowStockProducts,
    topCategories
  } from '../data/reports'

function ReportsPage() {

  const [bestSelling, setBestSelling] = useState([])
  const [monthlyIncomeData, setMonthlyIncomeData] = useState([])
  const [topCustomersData, setTopCustomersData] = useState([])
  const [lowStock, setLowStock] = useState([])
  const [topCategoriesData, setTopCategoriesData] = useState([])

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  function loadReports() {
    try {
      setLoading(true)
      setError(null)

      setBestSelling(bestSellingProducts)
      setMonthlyIncomeData(monthlyIncome)
      setTopCustomersData(topCustomers)
      setLowStock(lowStockProducts)
      setTopCategoriesData(topCategories)

    } catch (e) {
      setError('Error cargando reportes')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadReports()
  }, [])

  if (loading) return <p>Cargando reportes...</p>
  if (error)   return <p style={{ color: 'red' }}>{error}</p>

  return (
    <section>

      <div className="page-header">
        <div>
          <h2>Reportes</h2>
          <p>Estadísticas generales del sistema</p>
        </div>
      </div>

     
      <div className="report-card">
        <h3>Productos más vendidos</h3>
        <table className="table">
          <thead>
            <tr>
              <th>#</th>
              <th>Producto</th>
              <th>Total vendido</th>
            </tr>
          </thead>
          <tbody>
            {bestSelling.map((item, index) => (
              <tr key={item.productId}>
                <td>{index + 1}</td>
                <td>{item.productName}</td>
                <td>{item.totalQuantitySold}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    
      <div className="report-card">
        <h3>Ingresos mensuales</h3>
        <table className="table">
          <thead>
            <tr>
              <th>Año</th>
              <th>Mes</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            {monthlyIncomeData.map((item, i) => (
              <tr key={i}>
                <td>{item.year}</td>
                <td>{item.month}</td>
                <td>${Number(item.totalIncome).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

   
      <div className="report-card">
        <h3>Mejores clientes</h3>
        <table className="table">
          <thead>
            <tr>
              <th>#</th>
              <th>Cliente</th>
              <th>Total gastado</th>
            </tr>
          </thead>
          <tbody>
            {topCustomersData.map((c, i) => (
              <tr key={c.customerId}>
                <td>{i + 1}</td>
                <td>{c.customerName}</td>
                <td>${Number(c.totalSpent).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    
      <div className="report-card">
        <h3>Productos con bajo stock</h3>
        <table className="table">
          <thead>
            <tr>
              <th>Producto</th>
              <th>Stock disponible</th>
              <th>Stock mínimo</th>
            </tr>
          </thead>
          <tbody>
            {lowStock.map(p => (
              <tr key={p.productId}>
                <td>{p.productName}</td>
                <td><span className="badge-red">{p.availableStock}</span></td>
                <td>{p.minimumStock}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      
      <div className="report-card">
        <h3>Categorías más vendidas</h3>
        <table className="table">
          <thead>
            <tr>
              <th>#</th>
              <th>Categoría</th>
              <th>Total vendido</th>
            </tr>
          </thead>
          <tbody>
            {topCategoriesData.map((c, i) => (
              <tr key={c.categoryId}>
                <td>{i + 1}</td>
                <td>{c.categoryName}</td>
                <td>{c.totalQuantitySold}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </section>
  )
}

export default ReportsPage