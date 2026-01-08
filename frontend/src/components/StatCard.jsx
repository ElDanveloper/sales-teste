export default function StatCard({ title, value, icon: Icon, color }) {
  return (
    <div className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-500 text-sm font-medium">{title}</p>
          <p className="text-2xl font-bold text-gray-800 mt-2">{value}</p>
        </div>
        <div className={`${color} rounded-lg p-3 text-white`}>
          <Icon size={24} />
        </div>
      </div>
    </div>
  )
}
