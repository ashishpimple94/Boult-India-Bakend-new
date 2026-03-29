import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { Menu, X, LogOut, User, BarChart3, Package, ShoppingBag, Palette } from 'lucide-react';
import { AdminAuthProvider, useAdminAuth } from './context/AdminAuthContext';
import ErrorBoundary from './components/ErrorBoundary';
import ProtectedRoute from './components/ProtectedRoute';
import AdminLogin from './pages/AdminLogin';
import Dashboard from './pages/Dashboard';
import Orders from './pages/Orders';
import Products from './pages/Products';
import Banners from './pages/Banners';
import './App.css';

function AdminDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const { user, logout } = useAdminAuth();

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="flex h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Sidebar */}
      <div className={`${sidebarOpen ? 'w-64' : 'w-20'} bg-gradient-to-b from-indigo-600 via-purple-600 to-pink-600 text-white transition-all duration-300 flex flex-col shadow-2xl`}>
        {/* Logo */}
        <div className="p-4 border-b border-white/20 flex items-center justify-between backdrop-blur-sm">
          <div className="flex items-center gap-3">
            <img 
              src="/logo1.png" 
              alt="Boult Logo"
              className="h-8 w-auto object-contain bg-white rounded px-1"
              onError={(e: any) => {
                e.target.src = "/logo2.png";
              }}
            />
            {sidebarOpen && <h1 className="text-xl font-heading font-bold">Admin</h1>}
          </div>
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 hover:bg-white/20 rounded-lg transition-all duration-300"
          >
            {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2">
          <Link
            to="/"
            className="flex items-center gap-3 p-3 hover:bg-white/20 transition-all duration-300 font-body font-medium rounded-xl backdrop-blur-sm hover:shadow-lg hover:scale-105"
          >
            <BarChart3 className="text-2xl" />
            {sidebarOpen && <span>Dashboard</span>}
          </Link>
          <Link
            to="/orders"
            className="flex items-center gap-3 p-3 hover:bg-white/20 transition-all duration-300 font-body font-medium rounded-xl backdrop-blur-sm hover:shadow-lg hover:scale-105"
          >
            <Package className="text-2xl" />
            {sidebarOpen && <span>Orders</span>}
          </Link>
          <Link
            to="/products"
            className="flex items-center gap-3 p-3 hover:bg-white/20 transition-all duration-300 font-body font-medium rounded-xl backdrop-blur-sm hover:shadow-lg hover:scale-105"
          >
            <ShoppingBag className="text-2xl" />
            {sidebarOpen && <span>Products</span>}
          </Link>
          <Link
            to="/banners"
            className="flex items-center gap-3 p-3 hover:bg-white/20 transition-all duration-300 font-body font-medium rounded-xl backdrop-blur-sm hover:shadow-lg hover:scale-105"
          >
            <Palette className="text-2xl" />
            {sidebarOpen && <span>Banners</span>}
          </Link>
        </nav>

        {/* User Info & Logout */}
        <div className="p-4 border-t border-white/20">
          {sidebarOpen && user && (
            <div className="mb-3 p-3 bg-white/20 rounded-xl backdrop-blur-sm">
              <div className="flex items-center gap-2 mb-1">
                <User size={16} />
                <span className="text-sm font-semibold">{user.name}</span>
              </div>
              <p className="text-xs text-blue-200">{user.role.replace('_', ' ').toUpperCase()}</p>
            </div>
          )}
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 p-3 hover:bg-red-500/90 transition-all duration-300 font-body font-medium rounded-xl w-full text-left hover:shadow-lg hover:scale-105"
          >
            <LogOut size={20} />
            {sidebarOpen && <span>Logout</span>}
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white/80 backdrop-blur-md shadow-xl p-6 border-b border-gray-200/50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <img 
                src="/logo1.png" 
                alt="Boult Logo"
                className="h-10 w-auto object-contain"
                onError={(e: any) => {
                  e.target.src = "/logo2.png";
                }}
              />
              <div>
                <h2 className="text-2xl font-heading font-bold text-gray-800">Boult India</h2>
                <p className="text-sm text-gray-600 font-body">Admin Dashboard</p>
              </div>
            </div>
            {user && (
              <div className="flex items-center gap-3 bg-gradient-to-r from-indigo-50 to-purple-50 px-5 py-3 rounded-xl shadow-md border border-indigo-100">
                <User size={20} className="text-indigo-600" />
                <div>
                  <p className="text-sm font-semibold text-gray-800">{user.name}</p>
                  <p className="text-xs text-gray-600">{user.email}</p>
                </div>
              </div>
            )}
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-auto p-6 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/orders" element={<Orders />} />
            <Route path="/products" element={<Products />} />
            <Route path="/banners" element={<Banners />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <AdminAuthProvider>
        <Router>
          <Routes>
            <Route path="/login" element={<AdminLogin />} />
            <Route path="/*" element={
              <ProtectedRoute>
                <AdminDashboard />
              </ProtectedRoute>
            } />
          </Routes>
        </Router>
      </AdminAuthProvider>
    </ErrorBoundary>
  );
}

export default App;
