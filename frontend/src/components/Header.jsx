import { Menu, X } from 'lucide-react'
import logo from '../assets/logo.png'

export default function Header({ sidebarOpen, setSidebarOpen }) {
  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="px-6 py-4 flex items-center justify-between">
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="lg:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
        <h1 className="text-2xl font-bold text-gray-800">SmartMart Solutions</h1>
        <img
          src={logo}
          alt="SmartMart Logo"
          className="w-10 h-10 rounded-full object-cover"
        />
      </div>
    </header>
  )
}
