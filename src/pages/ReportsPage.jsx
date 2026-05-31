import { useEffect, useState } from 'react'

import {
  bestSellingProducts,
  monthlyIncome,
  topCustomers,
  lowStockProducts,
  topCategories
} from '../data/reports'

function ReportsPage() {

  const [reports, setReports] = useState({
    bestSelling: [],
    monthlyIncome: [],
    topCustomers: [],
    lowStock: [],
    topCategories: []
  })

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  function loadReports() {

    try {

      setLoading(true)
      setError(null)

      setReports({
        bestSelling: bestSellingProducts,
        monthlyIncome: monthlyIncome,
        topCustomers: topCustomers,
        lowStock: lowStockProducts,
        topCategories: topCategories
      })

    } catch (e) {

      setError('Error cargando reportes')

    } finally {

      setLoading(false)

    }
  }

  useEffect(() => {
    loadReports()
  }, [])

  if (loading) {
    return (
      <p className="center-text">
        Cargando reportes...
      </p>
    )
  }

  if (error) {
    return (
      <p className="error-text center-text">
        {error}
      </p>
    )
  }

  return (
    <section>

      <div className="page-header">
        <div>
          <h2>Reportes</h2>

          <p>
            Estadísticas generales del sistema
          </p>
        </div>
      </div>

      
      <div className="card">

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

            {reports.bestSelling.map((item, index) => (

              <tr key={item.productId}>
                <td>{index + 1}</td>
                <td>{item.productName}</td>
                <td>{item.totalQuantitySold}</td>
              </tr>

            ))}

          </tbody>

        </table>

      </div>

     
      <div
        className="dashboard-panel"
        style={{ marginTop: 24 }}
      >

        <h3>Top productos vendidos</h3>

        <p>
          Productos con mayor salida
        </p>

        <div className="bar-chart">

          {reports.bestSelling.map((item) => {

            const maxSales = Math.max(
              ...reports.bestSelling.map(
                (p) => p.totalQuantitySold
              )
            )

            const heightPercent =
              (item.totalQuantitySold / maxSales) * 100

            return (
              <div
                key={item.productId}
                className="bar-col"
              >

                <span className="bar-label">
                  {item.totalQuantitySold}
                </span>

                <div
                  className="bar"
                  style={{
                    height: `${heightPercent}%`
                  }}
                />

                <span className="bar-month">
                  {item.productName}
                </span>

              </div>
            )
          })}

        </div>

      </div>

   
      <div className="card">

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

            {reports.monthlyIncome.map((item, index) => (

              <tr key={index}>

                <td>{item.year}</td>

                <td>{item.month}</td>

                <td>
                  $
                  {Number(item.totalIncome)
                    .toLocaleString()}
                </td>

              </tr>

            ))}

          </tbody>

        </table>

      </div>

    
      <div
        className="dashboard-panel"
        style={{ marginTop: 24 }}
      >

        <h3>Ingresos mensuales</h3>

        <p>
          Comportamiento financiero
        </p>

        <div className="bar-chart">

          {reports.monthlyIncome.map((item) => {

            const maxIncome = Math.max(
              ...reports.monthlyIncome.map(
                (m) => m.totalIncome
              )
            )

            const heightPercent =
              (item.totalIncome / maxIncome) * 100

            return (
              <div
                key={`${item.year}-${item.month}`}
                className="bar-col"
              >

                <span className="bar-label">
                  $
                  {(item.totalIncome / 1000000)
                    .toFixed(1)}M
                </span>

                <div
                  className="bar"
                  style={{
                    height: `${heightPercent}%`
                  }}
                />

                <span className="bar-month">
                  {item.month}
                </span>

              </div>
            )
          })}

        </div>

      </div>

    
      <div className="card">

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

            {reports.topCustomers.map((customer, index) => (

              <tr key={customer.customerId}>

                <td>{index + 1}</td>

                <td>{customer.customerName}</td>

                <td>
                  $
                  {Number(customer.totalSpent)
                    .toLocaleString()}
                </td>

              </tr>

            ))}

          </tbody>

        </table>

      </div>

     
      <div
        className="dashboard-panel"
        style={{ marginTop: 24 }}
      >

        <h3>Clientes con mayor gasto</h3>

        <p>
          Clientes más importantes
        </p>

        <div className="bar-chart">

          {reports.topCustomers.map((customer) => {

            const maxSpent = Math.max(
              ...reports.topCustomers.map(
                (c) => c.totalSpent
              )
            )

            const heightPercent =
              (customer.totalSpent / maxSpent) * 100

            return (
              <div
                key={customer.customerId}
                className="bar-col"
              >

                <span className="bar-label">
                  $
                  {(customer.totalSpent / 1000000)
                    .toFixed(1)}M
                </span>

                <div
                  className="bar"
                  style={{
                    height: `${heightPercent}%`
                  }}
                />

                <span className="bar-month">
                  {customer.customerName}
                </span>

              </div>
            )
          })}

        </div>

      </div>

   
      <div className="card">

        <h3>
          Productos con bajo stock
        </h3>

        <table className="table">

          <thead>
            <tr>
              <th>Producto</th>
              <th>Stock</th>
              <th>Mínimo</th>
            </tr>
          </thead>

          <tbody>

            {reports.lowStock.map((product) => (

              <tr key={product.productId}>

                <td>{product.productName}</td>

                <td>
                  <span className="badge-error">
                    {product.availableStock}
                  </span>
                </td>

                <td>{product.minimumStock}</td>

              </tr>

            ))}

          </tbody>

        </table>

      </div>

     
      <div className="card">

        <h3>
          Categorías más vendidas
        </h3>

        <table className="table">

          <thead>
            <tr>
              <th>#</th>
              <th>Categoría</th>
              <th>Total vendido</th>
            </tr>
          </thead>

          <tbody>

            {reports.topCategories.map((category, index) => (

              <tr key={category.categoryId}>

                <td>{index + 1}</td>

                <td>{category.categoryName}</td>

                <td>{category.totalQuantitySold}</td>

              </tr>

            ))}

          </tbody>

        </table>

      </div>

    
      <div
        className="dashboard-panel"
        style={{ marginTop: 24 }}
      >

        <h3>
          Categorías más vendidas
        </h3>

        <p>
          Rendimiento por categoría
        </p>

        <div className="bar-chart">

          {reports.topCategories.map((category) => {

            const maxCategory = Math.max(
              ...reports.topCategories.map(
                (c) => c.totalQuantitySold
              )
            )

            const heightPercent =
              (category.totalQuantitySold / maxCategory) * 100

            return (
              <div
                key={category.categoryId}
                className="bar-col"
              >

                <span className="bar-label">
                  {category.totalQuantitySold}
                </span>

                <div
                  className="bar"
                  style={{
                    height: `${heightPercent}%`
                  }}
                />

                <span className="bar-month">
                  {category.categoryName}
                </span>

              </div>
            )
          })}

        </div>

      </div>

    </section>
  )
}

export default ReportsPage