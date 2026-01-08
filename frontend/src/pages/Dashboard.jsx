import { useEffect, useState, useMemo } from 'react'
import { TrendingUp, Package, DollarSign, ShoppingCart } from 'lucide-react'
import { salesAPI, productAPI, categoryAPI, exportAPI } from '../api'
const POSTMAN_URL = import.meta.env.VITE_POSTMAN_URL || 'https://www.postman.com/lunar-rocket-812248/workspace/teste-prtico/request/41789058-07f3b3cb-099e-4812-9014-d5e823a52136?action=share&creator=41789058'
import StatCard from '../components/StatCard'
import LoadingSpinner from '../components/LoadingSpinner'
import { Column, Pie, Bar } from '@ant-design/plots'

export default function Dashboard() {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [products, setProducts] = useState(0)
  const [categories, setCategories] = useState(0)
  const [sales, setSales] = useState([])
  const [productList, setProductList] = useState([])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, productsRes, categoriesRes, salesRes] = await Promise.all([
          salesAPI.getStats(),
          productAPI.getAll(),
          categoryAPI.getAll(),
          salesAPI.getAll(),
        ])

        setStats(statsRes.data)
        setProducts(productsRes.data.length)
        setCategories(categoriesRes.data.length)
        setSales(salesRes.data)
        setProductList(productsRes.data)
      } catch (err) {
        setError('Erro ao carregar dados do dashboard')
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  // Evitar early returns que mudam a ordem dos hooks; renderizar condicionalmente

  const dailyRevenueData = useMemo(() => {
    const byDate = {}
    sales.forEach((s) => {
      const d = s.date?.slice(0, 10) || 'N/A'
      byDate[d] = (byDate[d] || 0) + (s.total_price || 0)
    })
    return Object.entries(byDate)
      .sort((a, b) => a[0].localeCompare(b[0]))
      .map(([date, revenue]) => ({ date, revenue }))
  }, [sales])

  const revenueByProductData = useMemo(() => {
    const nameById = {}
    productList.forEach((p) => {
      nameById[p.id] = p.name
    })
    const byProduct = {}
    sales.forEach((s) => {
      const name = nameById[s.product_id] || `Produto ${s.product_id}`
      byProduct[name] = (byProduct[name] || 0) + (s.total_price || 0)
    })
    return Object.entries(byProduct)
      .sort((a, b) => b[1] - a[1])
      .map(([type, value]) => ({ type, value }))
  }, [sales, productList])

  const topProductsData = useMemo(() => {
    const nameById = {}
    productList.forEach((p) => {
      nameById[p.id] = p.name
    })
    const byProduct = {}
    sales.forEach((s) => {
      const name = nameById[s.product_id] || `Produto ${s.product_id}`
      byProduct[name] = (byProduct[name] || 0) + (s.total_price || 0)
    })
    return Object.entries(byProduct)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([name, value]) => ({ name, value }))
  }, [sales, productList])

  const columnConfig = {
    data: dailyRevenueData,
    xField: 'date',
    yField: 'revenue',
    columnStyle: { radius: [4, 4, 0, 0] },
    color: '#1890FF',
    xAxis: { label: { autoHide: true, autoRotate: false } },
    label: { 
      position: 'top', 
      formatter: (datum) => {
        const val = Number(datum.revenue) || 0
        return val > 0 ? `R$ ${(val / 1000).toFixed(0)}k` : ''
      }
    },
    tooltip: {
      formatter: (datum) => ({
        name: 'Receita',
        value: `R$ ${Number(datum.revenue || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`,
      }),
    },
    animation: { appear: { animation: 'fade-in', duration: 800 } },
  }

  const pieConfig = {
    data: revenueByProductData,
    angleField: 'value',
    colorField: 'type',
    color: ['#1890FF', '#52C41A', '#FAAD14', '#F5222D', '#722ED1', '#13C2C2', '#EB2F96', '#FA8C16', '#A0D911', '#1677FF'],
    label: {
      type: 'outer',
      content: '{name}',
      formatter: (datum) => `${datum.type}\nR$ ${Number(datum.value).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`,
    },
    interactions: [{ type: 'element-active' }],
    legend: { position: 'bottom' },
    animation: { appear: { animation: 'fade-in', duration: 800 } },
    tooltip: {
      formatter: (datum) => ({
        name: datum.type,
        value: `R$ ${Number(datum.value).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`,
      }),
    },
  }

  const barConfig = {
    data: topProductsData,
    xField: 'value',
    yField: 'name',
    seriesField: 'name',
    color: '#1890FF',
    barStyle: { radius: [0, 4, 4, 0] },
    label: {
      position: 'right',
      formatter: (datum) => {
        const val = Number(datum.value) || 0
        return val > 0 ? `R$ ${val.toLocaleString('pt-BR', { minimumFractionDigits: 0 })}` : ''
      }
    },
    xAxis: { label: { formatter: (v) => `R$ ${((Number(v) || 0) / 1000).toFixed(0)}k` } },
    tooltip: {
      formatter: (datum) => ({
        name: 'Receita',
        value: `R$ ${Number(datum.value).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`,
      }),
    },
    animation: { appear: { animation: 'slide-up', duration: 800 } },
    legend: { position: 'top' },
  }

  return (
    <div className="p-6 space-y-6">
      {error && <div className="p-6 text-red-600">{error}</div>}

      {loading ? (
        <LoadingSpinner />
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard
              title="Receita Total"
              value={`R$ ${(stats?.total_revenue || 0).toLocaleString('pt-BR', {
                minimumFractionDigits: 2,
              })}`}
              icon={DollarSign}
              color="bg-green-500"
            />
            <StatCard
              title="Total de Vendas"
              value={stats?.total_sales_count || 0}
              icon={ShoppingCart}
              color="bg-blue-500"
            />
            <StatCard
              title="Produtos"
              value={products}
              icon={Package}
              color="bg-purple-500"
            />
            <StatCard
              title="Categorias"
              value={categories}
              icon={TrendingUp}
              color="bg-orange-500"
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-1">Receita por Dia</h3>
              <p className="text-sm text-gray-500 mb-4">Série temporal de vendas</p>
              {dailyRevenueData.length > 0 ? (
                <Column {...columnConfig} height={300} />
              ) : (
                <div className="text-gray-500 p-12 text-center">Sem dados de vendas ainda</div>
              )}
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-1">Receita por Produto</h3>
              <p className="text-sm text-gray-500 mb-4">Distribuição de receita por produto</p>
              {revenueByProductData.length > 0 ? (
                <Pie {...pieConfig} height={300} />
              ) : (
                <div className="text-gray-500 p-12 text-center">Sem dados de vendas por produto</div>
              )}
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6 mt-8">
            <h3 className="text-lg font-semibold text-gray-800 mb-1">Top 10 Produtos por Receita</h3>
            <p className="text-sm text-gray-500 mb-4">Produtos com maior faturamento</p>
            {topProductsData.length > 0 ? (
              <div style={{ height: Math.max(400, topProductsData.length * 40) }}>
                <Bar {...barConfig} height={Math.max(400, topProductsData.length * 40)} />
              </div>
            ) : (
              <div className="text-gray-500 p-12 text-center">Sem dados de vendas ainda</div>
            )}
          </div>

          {/* Export actions */}
          <div className="bg-white rounded-lg shadow p-6 mt-8">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Exportações</h3>
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={async () => {
                  try {
                    const res = await exportAPI.xlsx()
                    const url = window.URL.createObjectURL(new Blob([res.data]))
                    const link = document.createElement('a')
                    link.href = url
                    link.download = 'smartmart-report.xlsx'
                    document.body.appendChild(link)
                    link.click()
                    link.remove()
                  } catch (e) {
                    console.error('Erro ao baixar XLSX', e)
                  }
                }}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Baixar relatório XLSX
              </button>

              <button
                onClick={() => {
                  try {
                    window.open(POSTMAN_URL, '_blank')
                  } catch (e) {
                    console.error('Erro ao abrir Postman', e)
                  }
                }}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
              >
                Abrir no Postman
              </button>
            </div>
            {/* Hint removed per request */}
          </div>
        </>
      )}
    </div>
  )
}
