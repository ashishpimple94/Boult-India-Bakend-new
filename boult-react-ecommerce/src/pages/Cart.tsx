import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { Trash2, ArrowLeft } from 'lucide-react';
import ConfirmDialog from '../components/ConfirmDialog';
import Toast from '../components/Toast';

export default function Cart() {
  const { cart, removeFromCart, updateQuantity, getCartTotal } = useCart();
  const total = getCartTotal();
  const [removeConfirm, setRemoveConfirm] = useState<{ show: boolean; productId: string }>({ show: false, productId: '' });
  const [toast, setToast] = useState<{ show: boolean; message: string; type: 'success' | 'error' | 'info' }>({ show: false, message: '', type: 'info' });

  const handleRemove = (productId: string) => {
    setRemoveConfirm({ show: true, productId });
  };

  const confirmRemove = () => {
    removeFromCart(removeConfirm.productId);
    setRemoveConfirm({ show: false, productId: '' });
    setToast({ show: true, message: 'Item removed from cart', type: 'success' });
  };

  if (cart.items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-lg shadow-md p-12 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Your cart is empty</h2>
          <p className="text-gray-600 mb-8">Add items to your cart before checking out</p>
          <Link
            to="/products"
            className="inline-block bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <Link to="/products" className="flex items-center gap-2 text-blue-600 hover:text-blue-800 mb-8">
        <ArrowLeft size={20} />
        Continue Shopping
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Shopping Cart</h2>
            <div className="space-y-4">
              {cart.items.map((item) => (
                <div key={item.product.id} className="flex gap-4 pb-4 border-b border-gray-200 hover:bg-gray-50 p-3 rounded-lg transition">
                  {/* Product Image */}
                  <div className="w-24 h-24 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0 border border-gray-200">
                    <img
                      src={(item.product as any).images?.[0] || (item.product as any).image || '/placeholder-product.svg'}
                      alt={item.product.name}
                      className="w-full h-full object-contain"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        if (target.src !== '/placeholder-product.svg') {
                          target.src = '/placeholder-product.svg';
                        }
                      }}
                      loading="lazy"
                    />
                  </div>

                  {/* Product Details */}
                  <div className="flex-1">
                    <h3 className="font-bold text-gray-900 text-lg">{item.product.name}</h3>
                    <p className="text-sm text-gray-600 line-clamp-2">{item.product.description}</p>
                    {item.variant && (
                      <p className="text-xs font-semibold text-orange-600 mt-2 bg-orange-50 px-2 py-1 rounded w-fit">{item.variant}</p>
                    )}
                  </div>

                  {/* Quantity and Price */}
                  <div className="text-right flex flex-col justify-between">
                    <div>
                      <p className="text-2xl font-bold text-orange-600 mb-2">
                        ₹{(item.product.price * item.quantity).toLocaleString('en-IN')}
                      </p>
                      <p className="text-xs text-gray-500">₹{item.product.price.toLocaleString('en-IN')} each</p>
                    </div>
                    
                    <div className="flex items-center gap-2 justify-end mb-2">
                      <button
                        onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                        className="px-3 py-1 border border-gray-300 rounded-lg hover:bg-gray-200 font-bold text-gray-700"
                      >
                        −
                      </button>
                      <span className="px-4 py-1 font-bold text-gray-900 bg-gray-100 rounded-lg">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                        className="px-3 py-1 border border-gray-300 rounded-lg hover:bg-gray-200 font-bold text-gray-700"
                      >
                        +
                      </button>
                    </div>
                    
                    <button
                      onClick={() => handleRemove(item.product.id)}
                      className="text-red-600 hover:text-red-800 hover:bg-red-50 mt-2 flex items-center gap-1 justify-end px-2 py-1 rounded transition font-semibold text-sm"
                    >
                      <Trash2 size={16} />
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl shadow-lg p-6 sticky top-20 border border-orange-200">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Order Summary</h3>

            <div className="space-y-4 mb-6 pb-6 border-b border-orange-200">
              <div className="flex justify-between text-gray-700">
                <span className="font-medium">Subtotal</span>
                <span className="font-semibold">₹{total.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between text-gray-700">
                <span className="font-medium">Shipping Charges</span>
                <span className="text-gray-600 text-sm font-semibold">(May apply)</span>
              </div>
              <div className="flex justify-between text-gray-700">
                <span className="font-medium">Items</span>
                <span className="font-semibold">{cart.items.reduce((sum, item) => sum + item.quantity, 0)}</span>
              </div>
            </div>

            <div className="flex justify-between text-2xl font-bold text-gray-900 mb-6 bg-white p-3 rounded-lg">
              <span>Total</span>
              <span className="text-orange-600">₹{total.toLocaleString('en-IN')}</span>
            </div>

            <Link
              to="/checkout"
              className="w-full block text-center bg-gradient-to-r from-orange-600 to-orange-700 text-white py-3 rounded-lg font-bold hover:shadow-lg transition transform hover:scale-105"
            >
              Proceed to Checkout
            </Link>

            <Link
              to="/products"
              className="w-full block text-center text-orange-600 hover:text-orange-800 font-semibold mt-4 transition hover:bg-white p-2 rounded-lg"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>

      {/* Remove Confirmation Dialog */}
      <ConfirmDialog
        isOpen={removeConfirm.show}
        title="Remove Item"
        message="Are you sure you want to remove this item from your cart?"
        type="warning"
        confirmText="Remove"
        cancelText="Keep"
        onConfirm={confirmRemove}
        onCancel={() => setRemoveConfirm({ show: false, productId: '' })}
      />

      {/* Toast Notification */}
      {toast.show && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast({ ...toast, show: false })}
        />
      )}
    </div>
  );
}
