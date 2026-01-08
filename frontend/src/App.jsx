import { useState, useEffect } from 'react'
import Header from './components/Header'
import Sidebar from './components/Sidebar'
import Dashboard from './pages/Dashboard'
import Products from './pages/Products'
import Categories from './pages/Categories'
import Sales from './pages/Sales'

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard')
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  const renderPage = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard />
      case 'products':
        return <Products />
      case 'categories':
        return <Categories />
      case 'sales':
        return <Sales />
      default:
        return <Dashboard />
    }
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} sidebarOpen={sidebarOpen} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        <main className="flex-1 overflow-auto">
          <div className="fade-in">{renderPage()}</div>
        </main>
      </div>
    </div>
  )
}
