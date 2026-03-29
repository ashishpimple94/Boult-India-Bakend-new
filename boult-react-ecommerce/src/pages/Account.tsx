import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { User, Package, LogOut, Mail, Phone, MapPin, Calendar, FileText } from 'lucide-react';
import OrderCancellation from '../components/OrderCancellation';
import Invoice from '../components/Invoice';

interface Order {
  id: string;
  customer: string;
  email: string;
  amount: number;
  shippingCharges?: number;
  status: string;
  date: string;
  items?: any[];
  address?: string;
}

export default function Account() {
  const navigate = useNavigate();
  const { user, logout, isAuthenticated, isLoading } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [activeTab, setActiveTab] = useState('profile');
  const [loadingOrders, setLoadingOrders] = useState(false);
  const [selectedOrderForInvoice, setSelectedOrderForInvoice] = useState<Order | null>(null);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate('/login');
    } else if (isAuthenticated && user) {
      fetchOrders();
    }
  }, [navigate, isAuthenticated, isLoading, user]);

  const fetchOrders = async () => {
    if (!user) return;
    
    try {
      setLoadingOrders(true);
      const backendUrl = process.env.REACT_APP_BACKEND_URL || 'http://localhost:5000';
      const response = await fetch(`${backendUrl}/api/orders`);
      const data = await response.json();
      
      if (data.success) {
        const allOrders = data.orders || [];
        // Filter orders for current user
        const userOrders = allOrders.filter((order: Order) => 
          order.email.toLowerCase() === user.email.toLowerCase()
        );
        setOrders(userOrders);
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoadingOrders(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return null; // Will redirect to login
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-4xl font-bold text-gray-900 mb-8">My Account</h1>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Sidebar */}
        <div className="md:col-span-1">
          <div className="bg-white rounded-xl shadow-lg p-6 space-y-4 border border-gray-100 h-fit sticky top-20">
            <button
              onClick={() => setActiveTab('profile')}
              className={`w-full text-left px-4 py-3 rounded-lg transition font-semibold flex items-center gap-2 ${
                activeTab === 'profile'
                  ? 'bg-gradient-to-r from-orange-600 to-orange-700 text-white'
                  : 'text-gray-700 hover:bg-orange-50'
              }`}
            >
              <User size={18} />
              Profile
            </button>
            <button
              onClick={() => setActiveTab('orders')}
              className={`w-full text-left px-4 py-3 rounded-lg transition font-semibold flex items-center gap-2 ${
                activeTab === 'orders'
                  ? 'bg-gradient-to-r from-orange-600 to-orange-700 text-white'
                  : 'text-gray-700 hover:bg-orange-50'
              }`}
            >
              <Package size={18} />
              Orders
            </button>
            <button
              onClick={handleLogout}
              className="w-full text-left px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg transition font-semibold flex items-center gap-2"
            >
              <LogOut size={18} />
              Logout
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="md:col-span-3">
          {activeTab === 'profile' && (
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <User size={24} className="text-orange-600" />
                Profile Information
              </h2>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <User size={16} className="text-gray-600" />
                      <label className="text-gray-600 text-sm font-semibold">Full Name</label>
                    </div>
                    <p className="text-gray-900 font-semibold">{user.name}</p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Mail size={16} className="text-gray-600" />
                      <label className="text-gray-600 text-sm font-semibold">Email Address</label>
                    </div>
                    <p className="text-gray-900 font-semibold">{user.email}</p>
                  </div>
                  {user.phone && (
                    <div className="bg-gray-50 rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Phone size={16} className="text-gray-600" />
                        <label className="text-gray-600 text-sm font-semibold">Phone Number</label>
                      </div>
                      <p className="text-gray-900 font-semibold">{user.phone}</p>
                    </div>
                  )}
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Calendar size={16} className="text-gray-600" />
                      <label className="text-gray-600 text-sm font-semibold">Member Since</label>
                    </div>
                    <p className="text-gray-900 font-semibold">
                      {user.createdAt ? new Date(user.createdAt).toLocaleDateString('en-IN') : 'N/A'}
                    </p>
                  </div>
                </div>
                
                {user.addresses && user.addresses.length > 0 && (
                  <div>
                    <div className="flex items-center gap-2 mb-4">
                      <MapPin size={20} className="text-orange-600" />
                      <h3 className="text-lg font-bold text-gray-900">Saved Addresses</h3>
                    </div>
                    <div className="space-y-3">
                      {user.addresses.map((address: any, index: number) => (
                        <div key={index} className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                          <div className="flex items-center gap-2 mb-2">
                            <span className={`px-2 py-1 rounded text-xs font-bold ${
                              address.type === 'home' ? 'bg-green-100 text-green-800' :
                              address.type === 'work' ? 'bg-blue-100 text-blue-800' :
                              'bg-gray-100 text-gray-800'
                            }`}>
                              {address.type?.toUpperCase() || 'OTHER'}
                            </span>
                            {address.isDefault && (
                              <span className="px-2 py-1 rounded text-xs font-bold bg-orange-100 text-orange-800">
                                DEFAULT
                              </span>
                            )}
                          </div>
                          <p className="text-gray-900 text-sm">
                            {address.flatNumber}, {address.streetAddress}, {address.city}, {address.state} - {address.pincode}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'orders' && (
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <Package size={24} className="text-orange-600" />
                My Orders
              </h2>
              {loadingOrders ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600 mx-auto mb-4"></div>
                  <p className="text-gray-600">Loading orders...</p>
                </div>
              ) : orders.length > 0 ? (
                <div className="space-y-6">
                  {orders.map((order) => (
                    <div key={order.id} className="border-2 border-gray-200 rounded-xl p-6 hover:shadow-lg transition">
                      {/* Order Header */}
                      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6 pb-6 border-b border-gray-200">
                        <div>
                          <p className="text-xs text-gray-600 font-semibold uppercase">Order ID</p>
                          <p className="text-sm font-bold text-gray-900 mt-1">{order.id}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-600 font-semibold uppercase">Subtotal</p>
                          <p className="text-sm font-semibold text-gray-900 mt-1">₹{order.amount ? order.amount.toLocaleString('en-IN') : '0'}</p>
                          {order.shippingCharges > 0 && (
                            <p className="text-xs text-gray-600 mt-1">+ Shipping: ₹{order.shippingCharges.toLocaleString('en-IN')}</p>
                          )}
                        </div>
                        <div>
                          <p className="text-xs text-gray-600 font-semibold uppercase">Total Amount</p>
                          <p className="text-lg font-bold text-orange-600 mt-1">
                            ₹{((order.amount || 0) + (order.shippingCharges || 0)).toLocaleString('en-IN')}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-600 font-semibold uppercase">Status</p>
                          <span className={`inline-block mt-1 px-3 py-1 rounded-full text-xs font-bold ${
                            order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                            order.status === 'shipped' ? 'bg-blue-100 text-blue-800' :
                            order.status === 'processing' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {(order.status || 'pending').toUpperCase()}
                          </span>
                        </div>
                        <div>
                          <p className="text-xs text-gray-600 font-semibold uppercase">Order Date</p>
                          <p className="text-sm font-semibold text-gray-900 mt-1">
                            {order.date ? new Date(order.date).toLocaleDateString('en-IN') : 'N/A'}
                          </p>
                        </div>
                      </div>

                      {/* Order Items */}
                      {order.items && order.items.length > 0 && (
                        <div className="mb-6">
                          <h3 className="text-lg font-bold text-gray-900 mb-4">Order Items</h3>
                          <div className="space-y-3">
                            {order.items.map((item: any, idx: number) => (
                              <div key={idx} className="bg-gray-50 rounded-lg p-4 border border-gray-200 hover:shadow-md transition">
                                <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
                                  {/* Product Image */}
                                  {item.image && (
                                    <div className="md:col-span-1">
                                      <div className="w-full h-24 bg-white rounded-lg border border-gray-300 overflow-hidden flex items-center justify-center">
                                        <img
                                          src={item.image}
                                          alt={item.name}
                                          className="w-full h-full object-contain"
                                        />
                                      </div>
                                    </div>
                                  )}
                                  
                                  {/* Product Details */}
                                  <div className={item.image ? 'md:col-span-5' : 'md:col-span-6'}>
                                    <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                                      <div>
                                        <p className="text-xs text-gray-600 font-semibold">Product</p>
                                        <p className="text-sm font-bold text-gray-900 mt-1">{item.name || 'N/A'}</p>
                                      </div>
                                      <div>
                                        <p className="text-xs text-gray-600 font-semibold">Variant</p>
                                        <p className="text-sm font-semibold text-gray-900 mt-1 bg-orange-100 text-orange-800 px-2 py-1 rounded inline-block">
                                          {item.variant || 'Default'}
                                        </p>
                                      </div>
                                      <div>
                                        <p className="text-xs text-gray-600 font-semibold">Quantity</p>
                                        <p className="text-sm font-bold text-gray-900 mt-1">{item.quantity || 0}</p>
                                      </div>
                                      <div>
                                        <p className="text-xs text-gray-600 font-semibold">Unit Price</p>
                                        <p className="text-sm font-bold text-orange-600 mt-1">₹{item.price ? item.price.toLocaleString('en-IN') : '0'}</p>
                                      </div>
                                      <div>
                                        <p className="text-xs text-gray-600 font-semibold">Total</p>
                                        <p className="text-sm font-bold text-orange-700 mt-1">₹{item.price && item.quantity ? (item.price * item.quantity).toLocaleString('en-IN') : '0'}</p>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Order Summary with Shipping Charges */}
                      <div className="bg-gradient-to-r from-orange-50 to-orange-100 rounded-lg p-6 border-2 border-orange-200 mb-4">
                        <h3 className="text-lg font-bold text-gray-900 mb-4">Order Summary</h3>
                        <div className="space-y-3">
                          <div className="flex justify-between items-center pb-2 border-b border-orange-200">
                            <span className="text-sm font-semibold text-gray-700">Subtotal</span>
                            <span className="text-sm font-bold text-gray-900">₹{order.amount ? order.amount.toLocaleString('en-IN') : '0'}</span>
                          </div>
                          {order.shippingCharges > 0 && (
                            <div className="flex justify-between items-center pb-2 border-b border-orange-200">
                              <span className="text-sm font-semibold text-gray-700">Shipping Charges</span>
                              <span className="text-sm font-bold text-orange-600">₹{order.shippingCharges.toLocaleString('en-IN')}</span>
                            </div>
                          )}
                          <div className="flex justify-between items-center pt-2">
                            <span className="text-lg font-bold text-gray-900">Grand Total</span>
                            <span className="text-xl font-bold text-orange-600">
                              ₹{((order.amount || 0) + (order.shippingCharges || 0)).toLocaleString('en-IN')}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Delivery Address */}
                      {order.address && (
                        <div className="bg-blue-50 rounded-lg p-4 border border-blue-200 mb-4">
                          <p className="text-xs text-blue-600 font-semibold uppercase mb-2">Delivery Address</p>
                          <p className="text-sm text-gray-900">{order.address}</p>
                        </div>
                      )}

                      {/* Delivery Information - Show when order is processing/shipped/delivered */}
                      {(order.status === 'processing' || order.status === 'shipped' || order.status === 'delivered') && (
                        <div className="space-y-3 mb-4">
                          {/* Processing Info */}
                          {order.status === 'processing' && ((order as any).deliveryDate || (order as any).courierPartner || (order as any).processingDateTime) && (
                            <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
                              <p className="text-xs text-purple-600 font-semibold uppercase mb-3">📦 Processing Information</p>
                              <div className="grid grid-cols-2 gap-4">
                                {(order as any).processingDateTime && (
                                  <div>
                                    <p className="text-xs text-gray-600 font-semibold">Processing Started</p>
                                    <p className="text-sm font-bold text-gray-900 mt-1">
                                      {new Date((order as any).processingDateTime).toLocaleString('en-IN', {
                                        day: 'numeric',
                                        month: 'short',
                                        year: 'numeric',
                                        hour: '2-digit',
                                        minute: '2-digit',
                                        hour12: true
                                      })}
                                    </p>
                                  </div>
                                )}
                                {(order as any).deliveryDate && (
                                  <div>
                                    <p className="text-xs text-gray-600 font-semibold">Expected Delivery</p>
                                    <p className="text-sm font-bold text-gray-900 mt-1">
                                      {new Date((order as any).deliveryDate).toLocaleDateString('en-IN', {
                                        day: 'numeric',
                                        month: 'short',
                                        year: 'numeric'
                                      })}
                                    </p>
                                  </div>
                                )}
                                {(order as any).courierPartner && (
                                  <div className="col-span-2">
                                    <p className="text-xs text-gray-600 font-semibold">Courier Partner</p>
                                    <p className="text-sm font-bold text-purple-700 mt-1">{(order as any).courierPartner}</p>
                                  </div>
                                )}
                              </div>
                            </div>
                          )}

                          {/* Shipped Info */}
                          {order.status === 'shipped' && (order as any).dispatchDateTime && (
                            <div className="bg-indigo-50 rounded-lg p-4 border border-indigo-200">
                              <p className="text-xs text-indigo-600 font-semibold uppercase mb-3">🚀 Shipment Information</p>
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <p className="text-xs text-gray-600 font-semibold">Dispatched On</p>
                                  <p className="text-sm font-bold text-gray-900 mt-1">
                                    {new Date((order as any).dispatchDateTime).toLocaleString('en-IN', {
                                      day: 'numeric',
                                      month: 'short',
                                      year: 'numeric',
                                      hour: '2-digit',
                                      minute: '2-digit',
                                      hour12: true
                                    })}
                                  </p>
                                </div>
                                {(order as any).courierPartner && (
                                  <div>
                                    <p className="text-xs text-gray-600 font-semibold">Courier Partner</p>
                                    <p className="text-sm font-bold text-indigo-700 mt-1">{(order as any).courierPartner}</p>
                                  </div>
                                )}
                              </div>
                            </div>
                          )}

                          {/* Delivered Info */}
                          {order.status === 'delivered' && (order as any).deliveredDateTime && (
                            <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                              <p className="text-xs text-green-600 font-semibold uppercase mb-3">✅ Delivery Completed</p>
                              <div>
                                <p className="text-xs text-gray-600 font-semibold">Delivered On</p>
                                <p className="text-sm font-bold text-gray-900 mt-1">
                                  {new Date((order as any).deliveredDateTime).toLocaleString('en-IN', {
                                    day: 'numeric',
                                    month: 'short',
                                    year: 'numeric',
                                    hour: '2-digit',
                                    minute: '2-digit',
                                    hour12: true
                                  })}
                                </p>
                              </div>
                            </div>
                          )}
                        </div>
                      )}

                      {/* Cancel Order Button */}
                      {order.status !== 'cancelled' && order.status !== 'delivered' && order.status !== 'shipped' && (
                        <div className="mt-4">
                          <OrderCancellation
                            orderId={order.id}
                            orderStatus={order.status}
                            orderDate={order.date}
                            onCancelled={() => {
                              // Refresh orders after cancellation
                              const fetchOrders = async () => {
                                try {
                                  const backendUrl = process.env.REACT_APP_BACKEND_URL || 'http://localhost:5000';
                                  const response = await fetch(`${backendUrl}/api/orders`);
                                  if (response.ok) {
                                    const data = await response.json();
                                    const userOrders = data.orders.filter((o: any) => o.email === user?.email);
                                    setOrders(userOrders);
                                  }
                                } catch (error) {
                                  console.error('Error refreshing orders:', error);
                                }
                              };
                              fetchOrders();
                            }}
                          />
                        </div>
                      )}

                      {/* View Invoice Button */}
                      <div className="mt-4">
                        <button
                          onClick={() => setSelectedOrderForInvoice(order)}
                          className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition font-semibold shadow-md hover:shadow-lg"
                        >
                          <FileText size={18} />
                          View Invoice
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <p className="text-gray-600 mb-4">No orders yet</p>
                  <a href="/products" className="text-orange-600 hover:text-orange-800 font-semibold">
                    Start Shopping
                  </a>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Invoice Modal */}
      {selectedOrderForInvoice && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-xl shadow-2xl max-w-5xl w-full max-h-[90vh] overflow-y-auto relative">
            <button
              onClick={() => setSelectedOrderForInvoice(null)}
              className="sticky top-4 right-4 float-right bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition font-semibold z-10 shadow-lg"
            >
              Close
            </button>
            <div className="p-4">
              <Invoice
                order={{
                  id: selectedOrderForInvoice.id,
                  customer: selectedOrderForInvoice.customer,
                  email: selectedOrderForInvoice.email,
                  phone: user?.phone || '',
                  address: selectedOrderForInvoice.address || '',
                  city: (selectedOrderForInvoice as any).city || '',
                  state: (selectedOrderForInvoice as any).state || '',
                  pincode: (selectedOrderForInvoice as any).pincode || '',
                  amount: selectedOrderForInvoice.amount,
                  shippingCharges: selectedOrderForInvoice.shippingCharges,
                  status: selectedOrderForInvoice.status,
                  date: selectedOrderForInvoice.date,
                  items: selectedOrderForInvoice.items || [],
                  paymentMethod: (selectedOrderForInvoice as any).paymentMethod
                }}
                showPrintButton={true}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
