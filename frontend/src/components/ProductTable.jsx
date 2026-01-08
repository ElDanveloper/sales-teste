import { useState } from 'react'
import { Trash2, Edit2 } from 'lucide-react'
import { productAPI } from '../api'

export default function ProductTable({ products, categories, onDataChange, onEdit }) {
  const [loading, setLoading] = useState(false)

  const handleDelete = async (id) => {
    if (window.confirm('Tem certeza que deseja deletar este produto?')) {
      try {
        setLoading(true)
        await productAPI.delete(id)
        onDataChange()
      } catch (err) {
        console.error('Erro ao deletar:', err)
      } finally {
        setLoading(false)
      }
    }
  }

  const getCategoryName = (categoryId) => {
    return categories.find((c) => c.id === categoryId)?.name || 'N/A'
  }

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-100 border-b border-gray-200">
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                Nome
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                Marca
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                Categoria
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                Preço
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                Ações
              </th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr
                key={product.id}
                className="border-b border-gray-200 hover:bg-gray-50 transition-colors"
              >
                <td className="px-6 py-3 text-sm text-gray-700 font-medium">
                  {product.name}
                </td>
                <td className="px-6 py-3 text-sm text-gray-600">
                  {product.brand || '-'}
                </td>
                <td className="px-6 py-3 text-sm text-gray-600">
                  <span className="inline-block px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs">
                    {getCategoryName(product.category_id)}
                  </span>
                </td>
                <td className="px-6 py-3 text-sm font-semibold text-green-600">
                  R$ {product.price.toLocaleString('pt-BR', {
                    minimumFractionDigits: 2,
                  })}
                </td>
                <td className="px-6 py-3 text-sm space-x-2">
                  <button
                    onClick={() => onEdit && onEdit(product)}
                    className="inline-flex items-center gap-1 px-3 py-1 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                  >
                    <Edit2 size={16} />
                  </button>
                  <button
                    onClick={() => handleDelete(product.id)}
                    disabled={loading}
                    className="inline-flex items-center gap-1 px-3 py-1 text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                  >
                    <Trash2 size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {products.length === 0 && (
        <div className="p-12 text-center">
          <p className="text-gray-500">Nenhum produto encontrado</p>
        </div>
      )}
    </div>
  )
}
