import { useEffect, useState } from 'react'
import { Upload, Plus, Download } from 'lucide-react'
import { salesAPI, uploadAPI, productAPI } from '../api'
import LoadingSpinner from '../components/LoadingSpinner'
import Modal from '../components/Modal'
import { validateCSVType, CSV_TYPES, getCSVTypeErrorMessage } from '../utils/csvValidator'

export default function Sales() {
  const [sales, setSales] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [uploading, setUploading] = useState(false)
  const [products, setProducts] = useState([])
  const [showModal, setShowModal] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [editingData, setEditingData] = useState({})
  const [formData, setFormData] = useState({
    product_id: '',
    quantity: '',
    total_price: '',
    date: new Date().toISOString().slice(0, 10),
  })

  useEffect(() => {
    fetchSales()
    fetchProducts()
  }, [])

  const fetchSales = async () => {
    try {
      const res = await salesAPI.getAll()
      setSales(res.data)
      setError(null)
    } catch (err) {
      setError('Erro ao carregar vendas')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const fetchProducts = async () => {
    try {
      const res = await productAPI.getAll()
      setProducts(res.data)
    } catch (err) {
      console.error(err)
    }
  }

  const handleFileUpload = async (e) => {
    const file = e.target.files[0]
    if (!file) return

    setUploading(true)
    try {
      // Valida se é um CSV de vendas
      const isValid = await validateCSVType(file, CSV_TYPES.SALES)
      if (!isValid) {
        setError(getCSVTypeErrorMessage(CSV_TYPES.SALES))
        setUploading(false)
        return
      }

      await uploadAPI.sales(file)
      await fetchSales()
    } catch (err) {
      setError('Erro ao fazer upload do arquivo')
    } finally {
      setUploading(false)
    }
  }

  const handleAddSale = async (e) => {
    e.preventDefault()
    try {
      await salesAPI.create({
        product_id: parseInt(formData.product_id),
        quantity: parseInt(formData.quantity),
        total_price: parseFloat(formData.total_price),
        date: formData.date,
      })
      setShowModal(false)
      setFormData({
        product_id: '',
        quantity: '',
        total_price: '',
        date: new Date().toISOString().slice(0, 10),
      })
      await fetchSales()
    } catch (err) {
      setError('Erro ao adicionar venda')
    }
  }

  const handleEditStart = (sale) => {
    setEditingId(sale.id)
    setEditingData({
      quantity: sale.quantity,
      total_price: sale.total_price,
      date: sale.date,
    })
  }

  const handleEditCancel = () => {
    setEditingId(null)
    setEditingData({})
  }

  const handleEditSave = async () => {
    try {
      await salesAPI.update(editingId, {
        quantity: parseInt(editingData.quantity),
        total_price: parseFloat(editingData.total_price),
        date: editingData.date,
      })
      await fetchSales()
      setEditingId(null)
      setEditingData({})
    } catch (err) {
      setError('Erro ao atualizar venda')
    }
  }

  const handleEditChange = (field, value) => {
    setEditingData(prev => ({
      ...prev,
      [field]: value,
    }))
  }

  if (loading) return <LoadingSpinner />

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <h2 className="text-3xl font-bold text-gray-800">Vendas</h2>
        <div className="flex gap-2">
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus size={20} />
            Nova Venda
          </button>
          <label className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors cursor-pointer">
            <Upload size={20} />
            {uploading ? 'Enviando...' : 'Importar CSV'}
            <input
              type="file"
              accept=".csv"
              onChange={handleFileUpload}
              disabled={uploading}
              className="hidden"
            />
          </label>
          <button
            onClick={async () => {
              try {
                const csvData = [
                  ['id', 'product_id', 'quantity', 'total_price', 'date'],
                  ...sales.map(s => [s.id, s.product_id, s.quantity, s.total_price, s.date])
                ].map(row => row.join(',')).join('\n')
                
                const blob = new Blob([csvData], { type: 'text/csv' })
                const url = window.URL.createObjectURL(blob)
                const link = document.createElement('a')
                link.href = url
                link.download = 'vendas.csv'
                document.body.appendChild(link)
                link.click()
                link.remove()
              } catch (e) {
                console.error('Erro ao baixar CSV', e)
              }
            }}
            className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            <Download size={20} />
            Exportar CSV
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {sales.length > 0 && (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-100 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                  ID
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                  Produto
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                  Quantidade
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                  Total
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                  Data
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody>
              {sales.map((sale) => (
                <tr
                  key={sale.id}
                  className="border-b border-gray-200 hover:bg-gray-50 transition-colors"
                >
                  <td className="px-6 py-3 text-sm text-gray-700">{sale.id}</td>
                  <td className="px-6 py-3 text-sm text-gray-700">
                    {sale.product_id}
                  </td>
                  <td className="px-6 py-3 text-sm text-gray-700">
                    {editingId === sale.id ? (
                      <input
                        type="number"
                        value={editingData.quantity}
                        onChange={(e) => handleEditChange('quantity', e.target.value)}
                        className="px-2 py-1 border border-gray-300 rounded w-20 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    ) : (
                      sale.quantity
                    )}
                  </td>
                  <td className="px-6 py-3 text-sm font-semibold text-green-600">
                    {editingId === sale.id ? (
                      <input
                        type="number"
                        step="0.01"
                        value={editingData.total_price}
                        onChange={(e) => handleEditChange('total_price', e.target.value)}
                        className="px-2 py-1 border border-gray-300 rounded w-24 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    ) : (
                      `R$ ${sale.total_price.toLocaleString('pt-BR', {
                        minimumFractionDigits: 2,
                      })}`
                    )}
                  </td>
                  <td className="px-6 py-3 text-sm text-gray-700">
                    {editingId === sale.id ? (
                      <input
                        type="date"
                        value={editingData.date}
                        onChange={(e) => handleEditChange('date', e.target.value)}
                        className="px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    ) : (
                      new Date(sale.date).toLocaleDateString('pt-BR')
                    )}
                  </td>
                  <td className="px-6 py-3 text-sm space-x-2">
                    {editingId === sale.id ? (
                      <>
                        <button
                          onClick={handleEditSave}
                          className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 transition-colors text-xs"
                        >
                          Salvar
                        </button>
                        <button
                          onClick={handleEditCancel}
                          className="px-3 py-1 bg-gray-400 text-white rounded hover:bg-gray-500 transition-colors text-xs"
                        >
                          Cancelar
                        </button>
                      </>
                    ) : (
                      <button
                        onClick={() => handleEditStart(sale)}
                        className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors text-xs"
                      >
                        Editar
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {sales.length === 0 && (
        <div className="bg-gray-50 rounded-lg p-12 text-center">
          <p className="text-gray-500">Nenhuma venda registrada</p>
        </div>
      )}

      {showModal && (
        <Modal title="Nova Venda" onClose={() => setShowModal(false)}>
          <form onSubmit={handleAddSale} className="space-y-4">
            <select
              required
              value={formData.product_id}
              onChange={(e) => setFormData({ ...formData, product_id: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Selecione um produto</option>
              {products.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>

            <input
              type="number"
              placeholder="Quantidade"
              required
              value={formData.quantity}
              onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            <input
              type="number"
              step="0.01"
              placeholder="Total"
              required
              value={formData.total_price}
              onChange={(e) => setFormData({ ...formData, total_price: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            <input
              type="date"
              required
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            <div className="flex gap-2 pt-4">
              <button type="submit" className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                Adicionar
              </button>
              <button type="button" onClick={() => setShowModal(false)} className="flex-1 px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors">
                Cancelar
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  )
}
