import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import axios from 'axios';
import { CheckCircle, Package, Truck, MapPin, Phone, Mail, Calendar } from 'lucide-react';
import Invoice from '../components/Invoice';
import OrderCancellation from '../components/OrderCancellation';

interface Order {
  id: string;
  customer: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  amount: number;
  status: string;
  date: string;
  items: any[];
}

export default function OrderConfirmation() {
  const [searchParams] = useSearchParams();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const orderId = searchParams.get('orderId');
    if (orderId) {
      fetchOrder(orderId);
    }
  }, [searchParams]);

  // Save order details to localStorage for easy tracking later
  useEffect(() => {
    if (order) {
      localStorage.setItem('lastOrderId', order.id);
      localStorage.setItem('lastOrderEmail', order.email);
    }
  }, [order]);

  const fetchOrder = async (orderId: string) => {
    try {
      const backendUrl = process.env.REACT_APP_BACKEND_URL || 'http://localhost:5000';
      const response = await axios.get(`${backendUrl}/api/orders`);
      const allOrders = response.data.orders || [];
      const foundOrder = allOrders.find((o: Order) => o.id === orderId);
      if (foundOrder) {
        setOrder(foundOrder);
      }
    } catch (error) {
      console.error('Error fetching order:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleOrderCancelled = () => {
    // Refresh order data after cancellation
    const orderId = searchParams.get('orderId');
    if (orderId) {
      fetchOrder(orderId);
    }
  };

  if (loading) {
    return <div className="text-center py-12 text-gray-600">Loading order details...</div>;
  }

  if (!order) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
        <p className="text-gray-600 mb-4">Order not found</p>
        <Link to="/products" className="text-orange-600 hover:text-orange-800 font-semibold">
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Success Header */}
      <div className="text-center mb-12">
        <CheckCircle size={64} className="text-green-600 mx-auto mb-4" />
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Order Confirmed!</h1>
        <p className="text-gray-600 text-lg">Thank you for your purchase. Your order has been placed successfully.</p>
      </div>

      {/* Invoice Section */}
      <div className="mb-12">
        <Invoice order={order} showPrintButton={true} />
      </div>

      {/* Order Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        {/* Order Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Order Info Card */}
          <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl shadow-lg p-6 border border-orange-200">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Order Information</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600 font-semibold">Order ID</p>
                <p className="text-lg font-bold text-gray-900 mt-1">{order.id}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 font-semibold">Order Date</p>
                <p className="text-lg font-bold text-gray-900 mt-1">{new Date(order.date).toLocaleDateString('en-IN')}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 font-semibold">Total Amount</p>
                <p className="text-2xl font-bold text-orange-600 mt-1">₹{order.amount.toLocaleString('en-IN')}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 font-semibold">Status</p>
                <span className="inline-block mt-1 px-4 py-2 bg-yellow-100 text-yellow-800 rounded-full text-sm font-bold">
                  {order.status.toUpperCase()}
                </span>
              </div>
            </div>
          </div>

          {/* Delivery Address */}
          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
            <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <MapPin size={24} className="text-orange-600" />
              Delivery Address
            </h3>
            <div className="space-y-2 text-gray-700">
              <p className="font-semibold text-lg">{order.customer}</p>
              <p>{order.address}</p>
              <p>{order.city}, {order.state} {order.pincode}</p>
            </div>
          </div>

          {/* Contact Information */}
          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Contact Information</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <Mail size={20} className="text-orange-600" />
                <div>
                  <p className="text-sm text-gray-600">Email</p>
                  <p className="font-semibold text-gray-900">{order.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Phone size={20} className="text-orange-600" />
                <div>
                  <p className="text-sm text-gray-600">Phone</p>
                  <p className="font-semibold text-gray-900">{order.phone}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Order Items */}
          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
            <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Package size={24} className="text-orange-600" />
              Order Items
            </h3>
            <div className="space-y-3">
              {order.items && order.items.map((item: any, index: number) => (
                <div key={index} className="flex gap-4 pb-3 border-b border-gray-200 last:border-b-0">
                  {/* Product Image */}
                  {item.image && (
                    <div className="w-20 h-20 bg-gray-100 rounded-lg border border-gray-300 flex-shrink-0 overflow-hidden flex items-center justify-center">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-contain"
                      />
                    </div>
                  )}
                  
                  {/* Product Details */}
                  <div className="flex-1">
                    <p className="font-semibold text-gray-900">{item.name}</p>
                    <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                    {item.variant && <p className="text-xs text-orange-600 font-medium bg-orange-50 px-2 py-1 rounded inline-block mt-1">{item.variant}</p>}
                  </div>
                  
                  {/* Price */}
                  <div className="text-right">
                    <p className="text-sm text-gray-600">₹{item.price ? item.price.toLocaleString('en-IN') : '0'} each</p>
                    <p className="font-bold text-orange-600 text-lg">₹{item.price && item.quantity ? (item.price * item.quantity).toLocaleString('en-IN') : '0'}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Order Timeline */}
        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 h-fit sticky top-20">
          <h3 className="text-xl font-bold text-gray-900 mb-6">Order Status</h3>
          <div className="space-y-4">
            <div className="flex items-start gap-4">
              <div className="flex flex-col items-center">
                <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center text-white font-bold">
                  ✓
                </div>
                <div className="w-1 h-12 bg-green-600 mt-2"></div>
              </div>
              <div>
                <p className="font-bold text-gray-900">Order Placed</p>
                <p className="text-sm text-gray-600">{new Date(order.date).toLocaleDateString('en-IN')}</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="flex flex-col items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                  order.status === 'processing' || order.status === 'shipped' || order.status === 'delivered'
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-300 text-gray-600'
                }`}>
                  {order.status === 'processing' || order.status === 'shipped' || order.status === 'delivered' ? '✓' : '2'}
                </div>
                <div className={`w-1 h-12 mt-2 ${
                  order.status === 'shipped' || order.status === 'delivered' ? 'bg-green-600' : 'bg-gray-300'
                }`}></div>
              </div>
              <div>
                <p className="font-bold text-gray-900">Processing</p>
                <p className="text-sm text-gray-600">We're preparing your order</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="flex flex-col items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                  order.status === 'shipped' || order.status === 'delivered'
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-300 text-gray-600'
                }`}>
                  {order.status === 'shipped' || order.status === 'delivered' ? '✓' : '3'}
                </div>
                <div className={`w-1 h-12 mt-2 ${
                  order.status === 'delivered' ? 'bg-green-600' : 'bg-gray-300'
                }`}></div>
              </div>
              <div>
                <p className="font-bold text-gray-900">Shipped</p>
                <p className="text-sm text-gray-600">On its way to you</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                order.status === 'delivered'
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-300 text-gray-600'
              }`}>
                {order.status === 'delivered' ? '✓' : '4'}
              </div>
              <div>
                <p className="font-bold text-gray-900">Delivered</p>
                <p className="text-sm text-gray-600">Order completed</p>
              </div>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-gray-200">
            <p className="text-sm text-gray-600 mb-4">You will receive email updates about your order status.</p>
            <Link
              to="/products"
              className="w-full block text-center bg-gradient-to-r from-orange-600 to-orange-700 text-white py-3 rounded-lg font-bold hover:shadow-lg transition"
            >
              Continue Shopping
            </Link>
            
            <Link
              to="/track-order"
              className="w-full block text-center bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700 transition"
            >
              Track Your Order
            </Link>
          </div>
        </div>
      </div>

      {/* Order Cancellation Section - For Guest Users */}
      {order.status !== 'cancelled' && order.status !== 'delivered' && order.status !== 'shipped' && (
        <div className="mb-8">
          <OrderCancellation
            orderId={order.id}
            orderStatus={order.status}
            orderDate={order.date}
            onCancelled={handleOrderCancelled}
          />
        </div>
      )}

      {/* Help Section */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 text-center">
        <h3 className="font-bold text-gray-900 mb-2">Need Help?</h3>
        <p className="text-gray-600 mb-4">
          If you have any questions about your order, please don't hesitate to contact us.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            to="/contact"
            className="px-6 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition font-semibold"
          >
            Contact Support
          </Link>
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
  );
}
