import { BarChart3, Package, Tag, TrendingUp, X } from 'lucide-react'
import logo from '../assets/logo.png'

const menuItems = [
  { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
  { id: 'products', label: 'Produtos', icon: Package },
  { id: 'categories', label: 'Categorias', icon: Tag },
  { id: 'sales', label: 'Vendas', icon: TrendingUp },
]

export default function Sidebar({ activeTab, setActiveTab, sidebarOpen }) {
  return (
    <>
      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 lg:hidden z-30"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed lg:static left-0 top-0 h-screen w-64 bg-gray-900 text-white transform transition-transform duration-300 z-40 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0 overflow-y-auto`}
      >
        <div className="p-6 border-b border-gray-800">
          <div className="flex items-center gap-2">
            <img
              src={logo}
              alt="SmartMart Logo"
              className="w-8 h-8 rounded-lg object-cover"
            />
            <span className="font-bold text-lg">SmartMart</span>
          </div>
        </div>

        <nav className="p-4">
          {menuItems.map((item) => {
            const Icon = item.icon
            const isActive = activeTab === item.id
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id)
                  window.innerWidth < 1024 && setSidebarOpen(false)
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors mb-2 ${
                  isActive
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-300 hover:bg-gray-800'
                }`}
              >
                <Icon size={20} />
                <span className="font-medium">{item.label}</span>
              </button>
            )
          })}
        </nav>
      </aside>
    </>
  )
}
