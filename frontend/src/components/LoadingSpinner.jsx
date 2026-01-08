export default function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="space-y-4">
        <div className="flex justify-center">
          <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin" />
        </div>
        <p className="text-gray-600 text-center">Carregando...</p>
      </div>
    </div>
  )
}
