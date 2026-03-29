import React, { useState, useEffect } from 'react';
import { Search, Package } from 'lucide-react';
import ShipmentTracking from '../components/ShipmentTracking';
import OrderCancellation from '../components/OrderCancellation';
import Toast from '../components/Toast';

export default function TrackOrder() {
  const [orderId, setOrderId] = useState('');
  const [email, setEmail] = useState('');
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  // Auto-fill from localStorage if available
  useEffect(() => {
    const lastOrderId = localStorage.getItem('lastOrderId');
    const lastOrderEmail = localStorage.getItem('lastOrderEmail');
    if (lastOrderId) setOrderId(lastOrderId);
    if (lastOrderEmail) setEmail(lastOrderEmail);
  }, []);

  const handleTrackOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    setOrder(null);

    try {
      const backendUrl = process.env.REACT_APP_BACKEND_URL || 'http://localhost:5000';
      const response = await fetch(`${backendUrl}/api/orders/${orderId}`);

      if (response.ok) {
        const data = await response.json();
        
        // Verify email matches
        if (data.order.email.toLowerCase() === email.toLowerCase()) {
          setOrder(data.order);
        } else {
          setError('Order ID and email do not match. Please check your details.');
        }
      } else {
        setError('Order not found. Please check your Order ID.');
      }
    } catch (error) {
      console.error('Error tracking order:', error);
      setError('Failed to track order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleOrderCancelled = () => {
    setToast({ message: 'Order cancelled successfully', type: 'success' });
    // Refresh order data
    handleTrackOrder(new Event('submit') as any);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {toast && (
          <Toast
            message={toast.message}
            type={toast.type}
            onClose={() => setToast(null)}
          />
        )}

        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="bg-orange-100 p-4 rounded-full">
              <Package size={48} className="text-orange-600" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Track Your Order</h1>
          <p className="text-gray-600">
            Enter your Order ID and Email to track your order status and manage your delivery
          </p>
        </div>

        {/* Track Order Form */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <form onSubmit={handleTrackOrder} className="space-y-4">
            <div>
              <label className="block text-gray-700 font-semibold mb-2">
                Order ID *
              </label>
              <input
                type="text"
                value={orderId}
                onChange={(e) => setOrderId(e.target.value)}
                placeholder="e.g., ORDER_1234567890"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                required
              />
              <p className="text-sm text-gray-500 mt-1">
                You can find your Order ID in the confirmation email
              </p>
            </div>

            <div>
              <label className="block text-gray-700 font-semibold mb-2">
                Email Address *
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your.email@example.com"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                required
              />
              <p className="text-sm text-gray-500 mt-1">
                Enter the email address used during checkout
              </p>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-red-800 text-sm">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-orange-600 to-orange-700 text-white py-3 rounded-lg font-bold hover:shadow-lg transition transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                'Searching...'
              ) : (
                <>
                  <Search size={20} />
                  Track Order
                </>
              )}
            </button>
          </form>
        </div>

        {/* Order Details */}
        {order && (
          <div className="space-y-6">
            {/* Order Summary */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Order Details</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div>
                  <p className="text-sm text-gray-600">Order ID</p>
                  <p className="font-bold text-gray-900">{order.id}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Order Date</p>
                  <p className="font-bold text-gray-900">
                    {new Date(order.date).toLocaleDateString('en-IN', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Customer Name</p>
                  <p className="font-bold text-gray-900">{order.customer}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Total Amount</p>
                  <p className="font-bold text-orange-600 text-xl">
                    ₹{order.amount.toLocaleString('en-IN')}
                  </p>
                </div>
              </div>

              {/* Order Items */}
              <div className="border-t border-gray-200 pt-4">
                <h3 className="font-bold text-gray-900 mb-3">Order Items</h3>
                <div className="space-y-3">
                  {order.items.map((item: any, index: number) => (
                    <div key={index} className="flex gap-3 bg-gray-50 p-3 rounded-lg">
                      {item.image && (
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-16 h-16 object-contain rounded"
                        />
                      )}
                      <div className="flex-1">
                        <p className="font-semibold text-gray-900">{item.name}</p>
                        {item.variant && (
                          <p className="text-sm text-gray-600">{item.variant}</p>
                        )}
                        <p className="text-sm text-gray-600">
                          Qty: {item.quantity} × ₹{item.price.toLocaleString('en-IN')}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-gray-900">
                          ₹{(item.quantity * item.price).toLocaleString('en-IN')}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Delivery Address */}
              <div className="border-t border-gray-200 pt-4 mt-4">
                <h3 className="font-bold text-gray-900 mb-2">Delivery Address</h3>
                <p className="text-gray-700">{order.address}</p>
                <p className="text-gray-700">
                  {order.city}, {order.state} - {order.pincode}
                </p>
                <p className="text-gray-700 mt-2">
                  <span className="font-semibold">Phone:</span> {order.phone}
                </p>
              </div>
            </div>

            {/* Shipment Tracking */}
            <ShipmentTracking order={order} />

            {/* Order Cancellation */}
            {order.status !== 'cancelled' && order.status !== 'delivered' && (
              <OrderCancellation
                orderId={order.id}
                orderStatus={order.status}
                orderDate={order.date}
                onCancelled={handleOrderCancelled}
              />
            )}
          </div>
        )}

        {/* Help Section */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-xl p-6 text-center">
          <h3 className="font-bold text-gray-900 mb-2">Need Help?</h3>
          <p className="text-gray-600 mb-4">
            If you're having trouble tracking your order or need assistance, please contact our support team.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a
              href="/contact"
              className="px-6 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition font-semibold"
            >
              Contact Support
            </a>
            <a
              href="https://wa.me/919665154496"
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-semibold"
            >
              WhatsApp Us
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
