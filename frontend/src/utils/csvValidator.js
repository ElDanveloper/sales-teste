/**
 * Validadores para tipos de CSV
 */

export const CSV_TYPES = {
  PRODUCTS: 'products',
  CATEGORIES: 'categories',
  SALES: 'sales'
}

const EXPECTED_HEADERS = {
  [CSV_TYPES.PRODUCTS]: ['id', 'name', 'category_id', 'price', 'stock', 'description'],
  [CSV_TYPES.CATEGORIES]: ['id', 'name', 'description'],
  [CSV_TYPES.SALES]: ['id', 'product_id', 'quantity', 'total_price', 'date']
}

/**
 * Valida se um CSV corresponde ao tipo esperado
 * @param {File} file - Arquivo CSV
 * @param {string} expectedType - Tipo esperado (products, categories, sales)
 * @returns {Promise<boolean>}
 */
export async function validateCSVType(file, expectedType) {
  return new Promise((resolve) => {
    const reader = new FileReader()
    
    reader.onload = (e) => {
      try {
        const text = e.target.result
        const lines = text.trim().split('\n')
        
        if (lines.length === 0) {
          resolve(false)
          return
        }
        
        // Pega a primeira linha (cabeçalho)
        const header = lines[0].split(',').map(col => col.trim().toLowerCase())
        
        // Pega os headers esperados
        const expectedHeaders = EXPECTED_HEADERS[expectedType]
        
        if (!expectedHeaders) {
          resolve(false)
          return
        }
        
        // Verifica se pelo menos 50% dos headers esperados estão presentes
        const matches = expectedHeaders.filter(h => header.includes(h))
        const matchPercentage = matches.length / expectedHeaders.length
        
        resolve(matchPercentage >= 0.5)
      } catch (error) {
        console.error('Erro ao validar CSV:', error)
        resolve(false)
      }
    }
    
    reader.readAsText(file)
  })
}

/**
 * Retorna mensagem de erro para tipo de CSV inválido
 */
export function getCSVTypeErrorMessage(expectedType) {
  const typeNames = {
    [CSV_TYPES.PRODUCTS]: 'Produtos',
    [CSV_TYPES.CATEGORIES]: 'Categorias',
    [CSV_TYPES.SALES]: 'Vendas'
  }
  return `CSV inválido! Certifique-se de que está enviando um arquivo de ${typeNames[expectedType]}.`
}
