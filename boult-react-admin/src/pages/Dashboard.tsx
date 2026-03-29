import { useState, useEffect } from 'react';
import { TrendingUp, Package, Clock, Users, ShoppingCart, AlertCircle, Wifi, WifiOff, CreditCard, Smartphone, Building2, HelpCircle, CheckCircle, DollarSign } from 'lucide-react';
import { apiService } from '../services/api';

interface Order {
  id: string;
  customer: string;
  email: string;
  amount: number;
  status: string;
  date: string;
  address: string;
  phone: string;
  items?: any[];
}

export default function Dashboard() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [previousOrderCount, setPreviousOrderCount] = useState(0);
  const [newOrderAlert, setNewOrderAlert] = useState(false);
  const [stats, setStats] = useState({
    totalRevenue: 0,
    totalOrders: 0,
    pendingOrders: 0,
    uniqueCustomers: 0,
    completedOrders: 0,
  });
  const [loading, setLoading] = useState(true);
  const [backendConnected, setBackendConnected] = useState(true);
  const [lastUpdate, setLastUpdate] = useState<string>('');

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 15000); // Reduced to 15 seconds to be gentler on Render
    return () => clearInterval(interval);
  }, []);

  const fetchData = async () => {
    try {
      console.log('📊 Dashboard: Fetching orders...');
      const allOrders = await apiService.getOrders();
      console.log('📊 Dashboard: Received', allOrders.length, 'orders');
      
      // Backend is connected if we got data
      setBackendConnected(true);
      
      // Check for new orders
      if (previousOrderCount > 0 && allOrders.length > previousOrderCount) {
        setNewOrderAlert(true);
        
        // Auto-hide alert after 5 seconds
        setTimeout(() => {
          setNewOrderAlert(false);
        }, 5000);
      }
      
      setOrders(allOrders.slice(0, 10));
      setPreviousOrderCount(allOrders.length);
      setLastUpdate(new Date().toLocaleTimeString('en-IN'));

      // Calculate stats
      const totalRevenue = allOrders.reduce((sum: number, order: Order) => sum + (order.amount || 0), 0);
      const totalOrders = allOrders.length;
      const pendingOrders = allOrders.filter((o: Order) => o.status === 'pending').length;
      const completedOrders = allOrders.filter((o: Order) => o.status === 'delivered').length;
      const uniqueCustomers = new Set(allOrders.map((o: Order) => o.email)).size;

      console.log('📊 Dashboard Stats:', { totalRevenue, totalOrders, pendingOrders, completedOrders, uniqueCustomers });

      setStats({
        totalRevenue,
        totalOrders,
        pendingOrders,
        uniqueCustomers,
        completedOrders,
      });
    } catch (error) {
      console.error('❌ Dashboard: Error fetching data:', error);
      setBackendConnected(false);
      setStats({
        totalRevenue: 0,
        totalOrders: 0,
        pendingOrders: 0,
        uniqueCustomers: 0,
        completedOrders: 0,
      });
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'delivered': return 'bg-green-100 text-green-800 border-green-300';
      case 'shipped': return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'processing': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'pending': return 'bg-red-100 text-red-800 border-red-300';
      default: return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const getPaymentMethodDisplay = (paymentMethod: string) => {
    switch(paymentMethod) {
      case 'cod': return { text: 'COD', color: 'bg-yellow-100 text-yellow-800 border-yellow-300', icon: <CreditCard className="w-4 h-4" /> };
      case 'card': return { text: 'Card', color: 'bg-blue-100 text-blue-800 border-blue-300', icon: <CreditCard className="w-4 h-4" /> };
      case 'upi': return { text: 'UPI', color: 'bg-green-100 text-green-800 border-green-300', icon: <Smartphone className="w-4 h-4" /> };
      case 'netbanking': return { text: 'Net Banking', color: 'bg-purple-100 text-purple-800 border-purple-300', icon: <Building2 className="w-4 h-4" /> };
      default: return { text: 'Unknown', color: 'bg-gray-100 text-gray-800 border-gray-300', icon: <HelpCircle className="w-4 h-4" /> };
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-xl font-semibold text-gray-700">Loading dashboard...</p>
          <p className="text-sm text-gray-500 mt-2">Connecting to backend</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Connection Status - Only show if disconnected */}
      {!backendConnected && (
        <div className="p-4 flex items-center gap-3 bg-yellow-50 border border-yellow-200">
          <WifiOff className="text-yellow-600" size={20} />
          <div>
            <p className="text-yellow-800 font-body font-semibold">Connecting to Backend...</p>
            <p className="text-yellow-700 text-sm font-body">Please wait, fetching data...</p>
          </div>
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        <div className="stat-card bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-2xl p-6 rounded-2xl hover:shadow-2xl transition-all duration-300 animate-scale-in">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm font-body font-semibold mb-1">Total Revenue</p>
              <p className="text-4xl font-heading font-bold mt-2">₹{stats.totalRevenue.toLocaleString('en-IN')}</p>
              <p className="text-blue-100 text-xs mt-2 flex items-center gap-1">
                <DollarSign className="w-3 h-3" /> All time earnings
              </p>
            </div>
            <div className="bg-white/20 p-4 rounded-xl backdrop-blur-sm">
              <TrendingUp className="text-white" size={32} />
            </div>
          </div>
        </div>

        <div className="stat-card bg-gradient-to-br from-green-500 to-emerald-600 text-white shadow-2xl p-6 rounded-2xl hover:shadow-2xl transition-all duration-300 animate-scale-in" style={{animationDelay: '0.1s'}}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm font-body font-semibold mb-1">Total Orders</p>
              <p className="text-4xl font-heading font-bold mt-2">{stats.totalOrders}</p>
              <p className="text-green-100 text-xs mt-2 flex items-center gap-1">
                <Package className="w-3 h-3" /> Orders received
              </p>
            </div>
            <div className="bg-white/20 p-4 rounded-xl backdrop-blur-sm">
              <ShoppingCart className="text-white" size={32} />
            </div>
          </div>
        </div>

        <div className="stat-card bg-gradient-to-br from-orange-500 to-red-500 text-white shadow-2xl p-6 rounded-2xl hover:shadow-2xl transition-all duration-300 animate-scale-in" style={{animationDelay: '0.2s'}}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-orange-100 text-sm font-body font-semibold mb-1">Pending Orders</p>
              <p className="text-4xl font-heading font-bold mt-2">{stats.pendingOrders}</p>
              <p className="text-orange-100 text-xs mt-2">⏳ Awaiting action</p>
            </div>
            <div className="bg-white/20 p-4 rounded-xl backdrop-blur-sm">
              <Clock className="text-white" size={32} />
            </div>
          </div>
        </div>

        <div className="stat-card bg-gradient-to-br from-purple-500 to-indigo-600 text-white shadow-2xl p-6 rounded-2xl hover:shadow-2xl transition-all duration-300 animate-scale-in" style={{animationDelay: '0.3s'}}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100 text-sm font-semibold mb-1">Completed</p>
              <p className="text-4xl font-bold mt-2">{stats.completedOrders}</p>
              <p className="text-purple-100 text-xs mt-2 flex items-center gap-1">
                <CheckCircle className="w-3 h-3" /> Successfully delivered
              </p>
            </div>
            <div className="bg-white/20 p-4 rounded-xl backdrop-blur-sm">
              <Package className="text-white" size={32} />
            </div>
          </div>
        </div>

        <div className="stat-card bg-gradient-to-br from-pink-500 to-rose-600 text-white shadow-2xl p-6 rounded-2xl hover:shadow-2xl transition-all duration-300 animate-scale-in" style={{animationDelay: '0.4s'}}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-pink-100 text-sm font-semibold mb-1">Customers</p>
              <p className="text-4xl font-bold mt-2">{stats.uniqueCustomers}</p>
              <p className="text-pink-100 text-xs mt-2">👥 Unique buyers</p>
            </div>
            <div className="bg-white/20 p-4 rounded-xl backdrop-blur-sm">
              <Users className="text-white" size={32} />
            </div>
          </div>
        </div>
      </div>

      {/* Recent Orders */}
      <div className="bg-white/90 backdrop-blur-md shadow-2xl p-8 rounded-2xl border border-gray-100 animate-slide-up">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-3xl font-heading font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent flex items-center gap-3">
            Recent Orders
            {newOrderAlert && (
              <span className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-4 py-2 text-sm font-body rounded-full shadow-lg animate-pulse">
                🔔 New Order!
              </span>
            )}
          </h3>
          <button onClick={fetchData} className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white px-6 py-2 rounded-xl hover:shadow-lg transition-all duration-300 font-semibold text-sm hover:scale-105">
            ↻ Refresh
          </button>
        </div>
        
        {orders.length === 0 ? (
          <div className="text-center py-12">
            <AlertCircle size={48} className="text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">No orders yet</p>
          </div>
        ) : (
          <div className="overflow-x-auto rounded-xl">
            <table className="w-full professional-table">
              <thead>
                <tr className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
                  <th className="px-6 py-4 text-left text-sm font-bold">Order ID</th>
                  <th className="px-6 py-4 text-left text-sm font-bold">Customer</th>
                  <th className="px-6 py-4 text-left text-sm font-bold">Amount</th>
                  <th className="px-6 py-4 text-left text-sm font-bold">Payment</th>
                  <th className="px-6 py-4 text-left text-sm font-bold">Status</th>
                  <th className="px-6 py-4 text-left text-sm font-bold">Date</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => {
                  const paymentDisplay = getPaymentMethodDisplay((order as any).paymentMethod || 'unknown');
                  return (
                  <tr key={order.id} className="border-b border-gray-100 hover:bg-gradient-to-r hover:from-indigo-50 hover:to-purple-50 transition-all duration-300 hover:shadow-md">
                    <td className="px-6 py-4 text-sm font-semibold text-gray-900">{order.id}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">{order.customer}</td>
                    <td className="px-6 py-4 text-sm font-bold text-gray-900">₹{order.amount.toLocaleString('en-IN')}</td>
                    <td className="px-6 py-4 text-sm">
                      <span className={`status-badge ${paymentDisplay.color} flex items-center gap-2`}>
                        {paymentDisplay.icon}
                        {paymentDisplay.text}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <span className={`status-badge ${getStatusColor(order.status || 'pending')}`}>
                        {(order.status || 'pending').toUpperCase()}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">{new Date(order.date).toLocaleDateString('en-IN')}</td>
                  </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
