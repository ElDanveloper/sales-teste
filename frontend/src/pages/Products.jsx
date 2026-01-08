import { useEffect, useState } from 'react'
import { Upload, Search, Plus, Download } from 'lucide-react'
import { productAPI, uploadAPI, categoryAPI, exportAPI } from '../api'
import ProductTable from '../components/ProductTable'
import LoadingSpinner from '../components/LoadingSpinner'
import Modal from '../components/Modal'
import { validateCSVType, CSV_TYPES, getCSVTypeErrorMessage } from '../utils/csvValidator'

export default function Products() {
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')
  const [error, setError] = useState(null)
  const [uploading, setUploading] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    brand: '',
    category_id: '',
  })

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const [productsRes, categoriesRes] = await Promise.all([
        productAPI.getAll(),
        categoryAPI.getAll(),
      ])
      setProducts(productsRes.data)
      setCategories(categoriesRes.data)
    } catch (err) {
      setError('Erro ao carregar produtos')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleFileUpload = async (e) => {
    const file = e.target.files[0]
    if (!file) return

    setUploading(true)
    try {
      // Valida se é um CSV de produtos
      const isValid = await validateCSVType(file, CSV_TYPES.PRODUCTS)
      if (!isValid) {
        setError(getCSVTypeErrorMessage(CSV_TYPES.PRODUCTS))
        setUploading(false)
        return
      }

      await uploadAPI.products(file)
      await fetchData()
      setError(null)
    } catch (err) {
      setError('Erro ao fazer upload do arquivo')
    } finally {
      setUploading(false)
    }
  }

  const handleAddProduct = async (e) => {
    e.preventDefault()
    try {
      if (editingId) {
        await productAPI.update(editingId, {
          ...formData,
          price: parseFloat(formData.price),
          category_id: parseInt(formData.category_id),
        })
      } else {
        if (!categories.length) {
          setError('É necessário criar uma categoria antes de adicionar produtos')
          return
        }
        await productAPI.create({
          ...formData,
          price: parseFloat(formData.price),
          category_id: parseInt(formData.category_id),
        })
      }
      setShowModal(false)
      setEditingId(null)
      setFormData({
        name: '',
        description: '',
        price: '',
        brand: '',
        category_id: '',
      })
      await fetchData()
      setError(null)
    } catch (err) {
      setError(err.response?.data?.detail || 'Erro ao salvar produto')
    }
  }

  const handleEditProduct = (product) => {
    setEditingId(product.id)
    setFormData({
      name: product.name,
      description: product.description,
      price: product.price,
      brand: product.brand,
      category_id: product.category_id,
    })
    setShowModal(true)
  }

  const filteredProducts = products.filter(
    (p) => {
      const matchSearch = 
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.brand?.toLowerCase().includes(search.toLowerCase())
      const matchCategory = selectedCategory === '' || p.category_id === parseInt(selectedCategory)
      return matchSearch && matchCategory
    }
  )

  if (loading) return <LoadingSpinner />

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <h2 className="text-3xl font-bold text-gray-800">Produtos</h2>
        <div className="flex gap-2 flex-col sm:flex-row">
          <button
            onClick={() => {
              setEditingId(null)
              setFormData({
                name: '',
                description: '',
                price: '',
                brand: '',
                category_id: '',
              })
              setShowModal(true)
            }}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus size={20} />
            Novo Produto
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
                  ['id', 'name', 'description', 'price', 'category_id', 'brand'],
                  ...products.map(p => [p.id, p.name, p.description, p.price, p.category_id, p.brand || ''])
                ].map(row => row.join(',')).join('\n')
                
                const blob = new Blob([csvData], { type: 'text/csv' })
                const url = window.URL.createObjectURL(blob)
                const link = document.createElement('a')
                link.href = url
                link.download = 'produtos.csv'
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

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 flex items-center gap-2 px-4 py-2 bg-white rounded-lg border border-gray-200">
          <Search size={20} className="text-gray-400" />
          <input
            type="text"
            placeholder="Buscar por nome ou marca..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 outline-none text-gray-700"
          />
        </div>
        
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="px-4 py-2 bg-white rounded-lg border border-gray-200 outline-none text-gray-700"
        >
          <option value="">Todas as categorias</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>
      </div>

      <ProductTable
        products={filteredProducts}
        categories={categories}
        onDataChange={fetchData}
        onEdit={handleEditProduct}
      />

      {showModal && (
        <Modal title={editingId ? "Editar Produto" : "Novo Produto"} onClose={() => setShowModal(false)}>
          <form onSubmit={handleAddProduct} className="space-y-4">
            <input
              type="text"
              placeholder="Nome do Produto"
              required
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="text"
              placeholder="Descrição"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="number"
              placeholder="Preço"
              step="0.01"
              required
              value={formData.price}
              onChange={(e) =>
                setFormData({ ...formData, price: e.target.value })
              }
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="text"
              placeholder="Marca"
              value={formData.brand}
              onChange={(e) =>
                setFormData({ ...formData, brand: e.target.value })
              }
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <select
              required
              value={formData.category_id}
              onChange={(e) =>
                setFormData({ ...formData, category_id: e.target.value })
              }
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Selecione uma categoria</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
            <div className="flex gap-2 pt-4">
              <button
                type="submit"
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                {editingId ? 'Atualizar' : 'Adicionar'}
              </button>
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="flex-1 px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
              >
                Cancelar
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  )
}
