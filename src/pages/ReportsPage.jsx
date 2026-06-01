import { useEffect, useState } from 'react'
import {
  getBestSellingProducts,
  getMonthlyIncome,
  getTopCustomers,
  getLowStockProducts,
  getTopCategories
} from '../services/ReportService'

const MONTH_NAMES = {
  1:'Enero', 2:'Febrero', 3:'Marzo', 4:'Abril', 5:'Mayo', 6:'Junio',
  7:'Julio', 8:'Agosto', 9:'Septiembre', 10:'Octubre', 11:'Noviembre', 12:'Diciembre'
}
const MONTH_SHORT = {
  1:'Ene', 2:'Feb', 3:'Mar', 4:'Abr', 5:'May', 6:'Jun',
  7:'Jul', 8:'Ago', 9:'Sep', 10:'Oct', 11:'Nov', 12:'Dic'
}
const DONUT_COLORS = ['#3b5bdb','#7048e8','#1c7ed6','#0ca678','#f59f00','#f03e3e']

function LineChart({ data, valueKey, labelKey }) {
  if (!data || data.length < 2) return null
  const values = data.map(d => d[valueKey])
  const max = Math.max(...values)
  const min = Math.min(...values)
  const range = max - min || 1
  const W = 560, H = 130
  const PAD = { top:12, right:12, bottom:28, left:12 }
  const iW = W - PAD.left - PAD.right
  const iH = H - PAD.top - PAD.bottom
  const pts = data.map((d, i) => ({
    x: PAD.left + (i / (data.length - 1)) * iW,
    y: PAD.top + iH - ((d[valueKey] - min) / range) * iH,
    label: d[labelKey],
    value: d[valueKey]
  }))
  const pathD = pts.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ')
  const areaD = `${pathD} L ${pts[pts.length-1].x} ${PAD.top+iH} L ${pts[0].x} ${PAD.top+iH} Z`
  return (
    <svg viewBox={`0 0 ${W} ${H}`} style={{ width:'100%', height:'auto', overflow:'visible', marginTop:16 }}>
      <defs>
        <linearGradient id="lg1" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#3b5bdb" stopOpacity="0.18"/>
          <stop offset="100%" stopColor="#3b5bdb" stopOpacity="0"/>
        </linearGradient>
      </defs>
      <path d={areaD} fill="url(#lg1)"/>
      <path d={pathD} fill="none" stroke="#3b5bdb" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
      {pts.map((p, i) => (
        <g key={i}>
          <circle cx={p.x} cy={p.y} r="4" fill="white" stroke="#3b5bdb" strokeWidth="2"/>
          <text x={p.x} y={PAD.top+iH+18} textAnchor="middle" fontSize="9" fill="#9ca3af">{p.label}</text>
        </g>
      ))}
    </svg>
  )
}

function HBarChart({ data, valueKey, labelKey, formatVal }) {
  if (!data || data.length === 0) return null
  const max = Math.max(...data.map(d => d[valueKey]))
  return (
    <div style={{ display:'flex', flexDirection:'column', gap:10, marginTop:16 }}>
      {data.map((item, i) => (
        <div key={i} style={{ display:'flex', alignItems:'center', gap:10 }}>
          <span style={{ fontSize:'0.78rem', color:'var(--text-sub)', width:120, flexShrink:0, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>
            {item[labelKey]}
          </span>
          <div style={{ flex:1, height:10, background:'var(--bg-page)', borderRadius:999, overflow:'hidden' }}>
            <div style={{ height:'100%', borderRadius:999, background:'linear-gradient(90deg,#3b5bdb,#6384f5)', width:`${(item[valueKey]/max)*100}%`, transition:'width 0.4s ease' }}/>
          </div>
          <span style={{ fontSize:'0.75rem', fontWeight:600, color:'var(--text-h)', width:70, textAlign:'right', flexShrink:0 }}>
            {formatVal ? formatVal(item[valueKey]) : item[valueKey]}
          </span>
        </div>
      ))}
    </div>
  )
}

function DonutChart({ data, valueKey, labelKey }) {
  if (!data || data.length === 0) return null
  const total = data.reduce((s, d) => s + d[valueKey], 0)
  const R = 58, r = 34, cx = 70, cy = 70
  let cum = -Math.PI / 2
  const slices = data.map((d, i) => {
    const angle = (d[valueKey] / total) * 2 * Math.PI
    const x1 = cx + R * Math.cos(cum), y1 = cy + R * Math.sin(cum)
    cum += angle
    const x2 = cx + R * Math.cos(cum), y2 = cy + R * Math.sin(cum)
    const x3 = cx + r * Math.cos(cum), y3 = cy + r * Math.sin(cum)
    const x4 = cx + r * Math.cos(cum - angle), y4 = cy + r * Math.sin(cum - angle)
    const large = angle > Math.PI ? 1 : 0
    return {
      path: `M ${x1} ${y1} A ${R} ${R} 0 ${large} 1 ${x2} ${y2} L ${x3} ${y3} A ${r} ${r} 0 ${large} 0 ${x4} ${y4} Z`,
      color: DONUT_COLORS[i % DONUT_COLORS.length],
      label: d[labelKey], value: d[valueKey]
    }
  })
  return (
    <div style={{ display:'flex', alignItems:'center', gap:24, marginTop:16 }}>
      <svg width="140" height="140" viewBox="0 0 140 140" style={{ flexShrink:0 }}>
        {slices.map((s, i) => <path key={i} d={s.path} fill={s.color} opacity="0.9"/>)}
        <text x={cx} y={cy-5} textAnchor="middle" fontSize="13" fontWeight="700" fill="#111827">{total}</text>
        <text x={cx} y={cy+10} textAnchor="middle" fontSize="8" fill="#9ca3af">total</text>
      </svg>
      <div style={{ display:'flex', flexDirection:'column', gap:7 }}>
        {slices.map((s, i) => (
          <div key={i} style={{ display:'flex', alignItems:'center', gap:8, fontSize:'0.78rem', color:'var(--text-body)' }}>
            <span style={{ width:9, height:9, borderRadius:'50%', background:s.color, flexShrink:0 }}/>
            <span>{s.label}</span>
            <span style={{ marginLeft:'auto', fontWeight:600, paddingLeft:12 }}>{s.value}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

function BarChart({ data, valueKey, labelKey }) {
  if (!data || data.length === 0) return null
  const max = Math.max(...data.map(d => d[valueKey]))
  return (
    <div style={{ display:'flex', alignItems:'flex-end', gap:10, height:140, marginTop:16 }}>
      {data.map((item, i) => (
        <div key={i} style={{ display:'flex', flexDirection:'column', alignItems:'center', flex:1, height:'100%', justifyContent:'flex-end' }}>
          <span style={{ fontSize:'0.65rem', color:'var(--text-sub)', marginBottom:4 }}>{item[valueKey]}</span>
          <div style={{ width:'100%', background:'linear-gradient(180deg,#3b5bdb 0%,#6384f5 100%)', borderRadius:'4px 4px 0 0', minHeight:4, height:`${(item[valueKey]/max)*100}%` }}/>
          <span style={{ fontSize:'0.7rem', color:'var(--text-sub)', marginTop:5, textAlign:'center' }}>
            {String(item[labelKey]).split(' ')[0]}
          </span>
        </div>
      ))}
    </div>
  )
}

function ErrorTab({ message }) {
  return (
    <div className="card" style={{ textAlign:'center', padding: 40 }}>
      <p style={{ fontSize:'1.5rem', marginBottom: 8 }}>⚠️</p>
      <p style={{ color:'var(--text-sub)', fontSize:'0.9rem' }}>{message}</p>
      <p style={{ color:'#9ca3af', fontSize:'0.78rem', marginTop: 4 }}>Revisa que el backend esté funcionando correctamente</p>
    </div>
  )
}

const TABS = [
  { key:'bestSelling',   label:'Más vendidos' },
  { key:'income',        label:'Ingresos'     },
  { key:'customers',     label:'Clientes top' },
  { key:'lowStock',      label:'Bajo stock'   },
  { key:'categories',    label:'Categorías'   },
]

const ERROR_KEY = {
  bestSelling: 'bestSelling',
  income:      'monthlyIncome',
  customers:   'topCustomers',
  lowStock:    'lowStock',
  categories:  'topCategories',
}

function ReportsPage() {
  const [reports, setReports] = useState({
    bestSelling:[], monthlyIncome:[], topCustomers:[], lowStock:[], topCategories:[]
  })
  const [errors, setErrors]   = useState({})
  const [loading, setLoading] = useState(false)
  const [activeTab, setActiveTab] = useState('bestSelling')

  async function loadReports() {
    setLoading(true)
    const [bestSelling, monthlyIncome, topCustomers, lowStock, topCategories] =
      await Promise.all([
        getBestSellingProducts().catch(e => ({ __error: e.message })),
        getMonthlyIncome()      .catch(e => ({ __error: e.message })),
        getTopCustomers()       .catch(e => ({ __error: e.message })),
        getLowStockProducts()   .catch(e => ({ __error: e.message })),
        getTopCategories()      .catch(e => ({ __error: e.message })),
      ])
    setReports({
      bestSelling:   Array.isArray(bestSelling)   ? bestSelling   : [],
      monthlyIncome: Array.isArray(monthlyIncome) ? monthlyIncome : [],
      topCustomers:  Array.isArray(topCustomers)  ? topCustomers  : [],
      lowStock:      Array.isArray(lowStock)      ? lowStock      : [],
      topCategories: Array.isArray(topCategories) ? topCategories : [],
    })
    setErrors({
      bestSelling:   bestSelling?.__error   ?? null,
      monthlyIncome: monthlyIncome?.__error ?? null,
      topCustomers:  topCustomers?.__error  ?? null,
      lowStock:      lowStock?.__error      ?? null,
      topCategories: topCategories?.__error ?? null,
    })
    setLoading(false)
  }

  useEffect(() => { loadReports() }, [])

  if (loading) return <p className="center-text muted-text">Cargando reportes...</p>

  return (
    <section>
      <div className="page-header">
        <div><h2>Reportes</h2><p>Estadísticas generales del sistema</p></div>
      </div>

      <div className="report-tabs">
        {TABS.map(t => (
          <button
            key={t.key}
            className={`report-tab${activeTab === t.key ? ' active' : ''}`}
            onClick={() => setActiveTab(t.key)}
          >
            {t.label}
            {errors[ERROR_KEY[t.key]] && (
              <span style={{ marginLeft:6, color:'#f03e3e' }}>●</span>
            )}
          </button>
        ))}
      </div>

      {activeTab === 'bestSelling' && (
        errors.bestSelling ? <ErrorTab message={errors.bestSelling}/> :
        <>
          <div className="card">
            <h3>Productos más vendidos</h3>
            <div className="table-wrapper" style={{ marginTop:0, boxShadow:'none', border:'none' }}>
              <table className="table">
                <thead><tr><th>#</th><th>Producto</th><th>Total vendido</th></tr></thead>
                <tbody>
                  {reports.bestSelling.length === 0
                    ? <tr><td colSpan={3} style={{ textAlign:'center', color:'var(--text-sub)' }}>Sin ventas en el último año</td></tr>
                    : reports.bestSelling.map((item, i) => (
                      <tr key={item.productId}>
                        <td style={{ color:'var(--text-sub)', fontWeight:600 }}>{i+1}</td>
                        <td style={{ fontWeight:500 }}>{item.productName}</td>
                        <td><span className="badge badge-blue">{item.totalQuantitySold} uds</span></td>
                      </tr>
                    ))
                  }
                </tbody>
              </table>
            </div>
          </div>
          <div className="dashboard-panel">
            <h3>Volumen por producto</h3>
            <p style={{ fontSize:'0.78rem', color:'var(--text-sub)' }}>Unidades vendidas por referencia</p>
            <BarChart data={reports.bestSelling} valueKey="totalQuantitySold" labelKey="productName"/>
          </div>
        </>
      )}

      {activeTab === 'income' && (
        errors.monthlyIncome ? <ErrorTab message={errors.monthlyIncome}/> :
        <>
          <div className="card">
            <h3>Ingresos mensuales</h3>
            <div className="table-wrapper" style={{ marginTop:0, boxShadow:'none', border:'none' }}>
              <table className="table">
                <thead><tr><th>Año</th><th>Mes</th><th>Total</th></tr></thead>
                <tbody>
                  {reports.monthlyIncome.length === 0
                    ? <tr><td colSpan={3} style={{ textAlign:'center', color:'var(--text-sub)' }}>Sin datos de ingresos</td></tr>
                    : reports.monthlyIncome.map((item, i) => (
                      <tr key={i}>
                        <td className="mono" style={{ color:'var(--text-sub)' }}>{item.year}</td>
                        <td style={{ fontWeight:500 }}>{MONTH_NAMES[Number(item.month)] ?? item.month}</td>
                        <td className="mono" style={{ fontWeight:600 }}>${Number(item.totalIncome).toLocaleString()}</td>
                      </tr>
                    ))
                  }
                </tbody>
              </table>
            </div>
          </div>
          <div className="dashboard-panel">
            <h3>Tendencia de ingresos</h3>
            <p style={{ fontSize:'0.78rem', color:'var(--text-sub)' }}>Evolución financiera mensual</p>
            <LineChart
              data={reports.monthlyIncome.map(m => ({ ...m, monthLabel: MONTH_SHORT[Number(m.month)] ?? m.month }))}
              valueKey="totalIncome"
              labelKey="monthLabel"
            />
          </div>
        </>
      )}

      {activeTab === 'customers' && (
        errors.topCustomers ? <ErrorTab message={errors.topCustomers}/> :
        <>
          <div className="card">
            <h3>Mejores clientes</h3>
            <div className="table-wrapper" style={{ marginTop:0, boxShadow:'none', border:'none' }}>
              <table className="table">
                <thead><tr><th>#</th><th>Cliente</th><th>Total gastado</th></tr></thead>
                <tbody>
                  {reports.topCustomers.length === 0
                    ? <tr><td colSpan={3} style={{ textAlign:'center', color:'var(--text-sub)' }}>Sin datos de clientes</td></tr>
                    : reports.topCustomers.map((c, i) => (
                      <tr key={c.customerId}>
                        <td style={{ color:'var(--text-sub)', fontWeight:600 }}>{i+1}</td>
                        <td style={{ fontWeight:500 }}>{c.customerName}</td>
                        <td className="mono" style={{ fontWeight:600 }}>${Number(c.totalSpent).toLocaleString()}</td>
                      </tr>
                    ))
                  }
                </tbody>
              </table>
            </div>
          </div>
          <div className="dashboard-panel">
            <h3>Gasto por cliente</h3>
            <p style={{ fontSize:'0.78rem', color:'var(--text-sub)' }}>Comparativa de clientes más importantes</p>
            <HBarChart
              data={reports.topCustomers}
              valueKey="totalSpent"
              labelKey="customerName"
              formatVal={v => `$${(v/1000).toFixed(0)}k`}
            />
          </div>
        </>
      )}

      {activeTab === 'lowStock' && (
        errors.lowStock ? <ErrorTab message={errors.lowStock}/> :
        <div className="card">
          <h3>Productos con bajo stock</h3>
          <div className="table-wrapper" style={{ marginTop:0, boxShadow:'none', border:'none' }}>
            <table className="table">
              <thead><tr><th>Producto</th><th>Stock disponible</th><th>Stock mínimo</th><th>Alerta</th></tr></thead>
              <tbody>
                {reports.lowStock.length === 0
                  ? <tr><td colSpan={4} style={{ textAlign:'center', color:'var(--text-sub)' }}>Sin productos con bajo stock</td></tr>
                  : reports.lowStock.map(p => (
                    <tr key={p.productId}>
                      <td style={{ fontWeight:500 }}>{p.productName}</td>
                      <td><span className="badge badge-red mono">{p.availableStock} uds</span></td>
                      <td className="mono" style={{ color:'var(--text-sub)' }}>{p.minimumStock} uds</td>
                      <td>{p.availableStock <= p.minimumStock && <span className="badge badge-red">Reabastecer</span>}</td>
                    </tr>
                  ))
                }
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'categories' && (
        errors.topCategories ? <ErrorTab message={errors.topCategories}/> :
        <>
          <div className="card">
            <h3>Categorías más vendidas</h3>
            <div className="table-wrapper" style={{ marginTop:0, boxShadow:'none', border:'none' }}>
              <table className="table">
                <thead><tr><th>#</th><th>Categoría</th><th>Total vendido</th></tr></thead>
                <tbody>
                  {reports.topCategories.length === 0
                    ? <tr><td colSpan={3} style={{ textAlign:'center', color:'var(--text-sub)' }}>Sin datos de categorías</td></tr>
                    : reports.topCategories.map((cat, i) => (
                      <tr key={cat.categoryId}>
                        <td style={{ color:'var(--text-sub)', fontWeight:600 }}>{i+1}</td>
                        <td style={{ fontWeight:500 }}>{cat.categoryName}</td>
                        <td><span className="badge badge-purple">{cat.totalQuantitySold} uds</span></td>
                      </tr>
                    ))
                  }
                </tbody>
              </table>
            </div>
          </div>
          <div className="dashboard-panel">
            <h3>Distribución por categoría</h3>
            <p style={{ fontSize:'0.78rem', color:'var(--text-sub)' }}>Participación de cada categoría en ventas</p>
            <DonutChart data={reports.topCategories} valueKey="totalQuantitySold" labelKey="categoryName"/>
          </div>
        </>
      )}
    </section>
  )
}

export default ReportsPage