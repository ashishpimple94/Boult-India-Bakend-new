import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Menu, X, User, LogIn } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { cart } = useCart();
  const { isAuthenticated, user } = useAuth();
  const cartCount = cart.items.length;

  return (
    <header className="bg-white shadow-md sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <img 
              src="/logos/logo1.png" 
              alt="Boult Logo"
              className="h-16 w-auto object-contain"
            />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <Link to="/" className="font-body font-medium text-gray-700 hover:text-orange-600 transition">
              Home
            </Link>
            <Link to="/products" className="font-body font-medium text-gray-700 hover:text-orange-600 transition">
              Products
            </Link>
            <Link to="/track-order" className="font-body font-medium text-gray-700 hover:text-orange-600 transition">
              Track Order
            </Link>
            <Link to="/about" className="font-body font-medium text-gray-700 hover:text-orange-600 transition">
              About
            </Link>
            <Link to="/contact" className="font-body font-medium text-gray-700 hover:text-orange-600 transition">
              Contact
            </Link>
          </nav>

          {/* Right Icons */}
          <div className="flex items-center gap-4">
            {/* User Account / Login */}
            {isAuthenticated ? (
              <Link 
                to="/account" 
                className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded-lg transition"
                title={`Welcome, ${user?.name || 'User'}`}
              >
                <User size={24} className="text-gray-700" />
                <span className="hidden sm:block text-sm font-medium text-gray-700">
                  {user?.name?.split(' ')[0] || 'Account'}
                </span>
              </Link>
            ) : (
              <Link 
                to="/login" 
                className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded-lg transition"
              >
                <LogIn size={24} className="text-gray-700" />
                <span className="hidden sm:block text-sm font-medium text-gray-700">Login</span>
              </Link>
            )}
            
            <Link to="/cart" className="relative p-2 hover:bg-gray-100 rounded-lg transition">
              <ShoppingCart size={24} className="text-gray-700" />
              {cartCount > 0 && (
                <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Link>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 hover:bg-gray-100 rounded-lg transition"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <nav className="md:hidden pb-4 space-y-2">
            <Link to="/" className="block px-4 py-2 font-body font-medium text-gray-700 hover:bg-gray-100 transition">
              Home
            </Link>
            <Link to="/products" className="block px-4 py-2 font-body font-medium text-gray-700 hover:bg-gray-100 transition">
              Products
            </Link>
            <Link to="/track-order" className="block px-4 py-2 font-body font-medium text-gray-700 hover:bg-gray-100 transition">
              Track Order
            </Link>
            <Link to="/about" className="block px-4 py-2 font-body font-medium text-gray-700 hover:bg-gray-100 transition">
              About
            </Link>
            <Link to="/contact" className="block px-4 py-2 font-body font-medium text-gray-700 hover:bg-gray-100 transition">
              Contact
            </Link>
          </nav>
        )}
      </div>
    </header>
  );
}
