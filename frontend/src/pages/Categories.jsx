import { useEffect, useState } from 'react'
import { Upload, Plus, Edit2, X } from 'lucide-react'
import { categoryAPI, uploadAPI } from '../api'
import LoadingSpinner from '../components/LoadingSpinner'
import Modal from '../components/Modal'
import { validateCSVType, CSV_TYPES, getCSVTypeErrorMessage } from '../utils/csvValidator'

export default function Categories() {
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [uploading, setUploading] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [formData, setFormData] = useState({ name: '' })

  useEffect(() => {
    fetchCategories()
  }, [])

  const fetchCategories = async () => {
    try {
      const res = await categoryAPI.getAll()
      setCategories(res.data)
      setError(null)
    } catch (err) {
      setError('Erro ao carregar categorias')
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
      // Valida se é um CSV de categorias
      const isValid = await validateCSVType(file, CSV_TYPES.CATEGORIES)
      if (!isValid) {
        setError(getCSVTypeErrorMessage(CSV_TYPES.CATEGORIES))
        setUploading(false)
        return
      }

      await uploadAPI.categories(file)
      await fetchCategories()
    } catch (err) {
      setError('Erro ao fazer upload do arquivo')
    } finally {
      setUploading(false)
    }
  }

  const handleAddCategory = async (e) => {
    e.preventDefault()
    try {
      if (editingId) {
        await categoryAPI.update(editingId, formData)
      } else {
        await categoryAPI.create(formData)
      }
      setShowModal(false)
      setEditingId(null)
      setFormData({ name: '' })
      await fetchCategories()
      setError(null)
    } catch (err) {
      setError(err.response?.data?.detail || 'Erro ao salvar categoria')
    }
  }

  const handleEditCategory = (category) => {
    setEditingId(category.id)
    setFormData({ name: category.name })
    setShowModal(true)
  }

  if (loading) return <LoadingSpinner />

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <h2 className="text-3xl font-bold text-gray-800">Categorias</h2>
        <div className="flex gap-2 flex-col sm:flex-row">
          <button
            onClick={() => {
              setEditingId(null)
              setFormData({ name: '' })
              setShowModal(true)
            }}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus size={20} />
            Nova Categoria
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
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {categories.map((cat) => (
          <div
            key={cat.id}
            className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">ID: {cat.id}</p>
                <h3 className="text-lg font-semibold text-gray-800 mt-2">
                  {cat.name}
                </h3>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleEditCategory(cat)}
                  className="p-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                  title="Editar"
                >
                  <Edit2 size={18} />
                </button>
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold">
                  {cat.name.charAt(0).toUpperCase()}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {categories.length === 0 && (
        <div className="bg-gray-50 rounded-lg p-12 text-center">
          <p className="text-gray-500">Nenhuma categoria cadastrada</p>
        </div>
      )}

      {showModal && (
        <Modal title={editingId ? "Editar Categoria" : "Nova Categoria"} onClose={() => setShowModal(false)}>
          <form onSubmit={handleAddCategory} className="space-y-4">
            <input
              type="text"
              placeholder="Nome da Categoria"
              required
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
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
