import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { Lock } from 'lucide-react';
import Modal from '../components/Modal';

export default function Checkout() {
  const navigate = useNavigate();
  const { cart, getCartTotal, clearCart } = useCart();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    flatNumber: '',
    streetAddress: '',
    city: '',
    state: '',
    pincode: '',
    paymentMethod: 'cod',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [connectionTest, setConnectionTest] = useState<string>('');

  const total = getCartTotal();

  // Test connection function
  const testConnection = async () => {
    try {
      const backendUrl = process.env.REACT_APP_BACKEND_URL || 'http://localhost:5000';
      console.log('🔄 Testing connection to:', backendUrl);
      
      const response = await fetch(`${backendUrl}/health`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        },
      });
      
      console.log('📊 Response status:', response.status);
      console.log('📊 Response ok:', response.ok);
      
      if (response.ok) {
        const data = await response.json();
        setConnectionTest(`✅ Connection successful! Backend status: ${data.status}`);
        console.log('✅ Connection test passed:', data);
      } else {
        setConnectionTest(`❌ Connection failed with status: ${response.status}`);
      }
    } catch (error) {
      console.error('❌ Connection test error:', error);
      setConnectionTest(`❌ Connection error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  // Test Razorpay endpoint directly
  const testRazorpay = async () => {
    try {
      const backendUrl = process.env.REACT_APP_BACKEND_URL || 'http://localhost:5000';
      console.log('🔄 Testing Razorpay endpoint:', `${backendUrl}/api/razorpay/create-order`);
      console.log('🔄 Current window location:', window.location.origin);
      
      const requestBody = {
        amount: 1000,
        orderId: 'DEBUG_TEST_' + Date.now(),
        customer: 'Debug Test User'
      };
      
      console.log('🔄 Request body:', requestBody);
      
      const response = await fetch(`${backendUrl}/api/razorpay/create-order`, {
        method: 'POST',
        mode: 'cors', // Explicitly set CORS mode
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(requestBody)
      });
      
      console.log('📊 Razorpay Response status:', response.status);
      console.log('📊 Razorpay Response ok:', response.ok);
      console.log('📊 Razorpay Response headers:', Object.fromEntries(response.headers.entries()));
      
      if (response.ok) {
        const data = await response.json();
        setConnectionTest(`✅ Razorpay test successful! Order ID: ${data.order?.id}`);
        console.log('✅ Razorpay test passed:', data);
      } else {
        const errorText = await response.text();
        setConnectionTest(`❌ Razorpay test failed: ${response.status} - ${errorText}`);
        console.error('❌ Razorpay test failed:', errorText);
      }
    } catch (error) {
      console.error('❌ Razorpay test error:', error);
      console.error('❌ Error stack:', error.stack);
      setConnectionTest(`❌ Razorpay error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Load Razorpay script
  useEffect(() => {
    const loadRazorpayScript = () => {
      return new Promise((resolve, reject) => {
        // Check if Razorpay is already loaded
        if ((window as any).Razorpay) {
          console.log('✅ Razorpay already loaded');
          resolve(true);
          return;
        }

        // Check if script is already in DOM
        const existingScript = document.querySelector('script[src="https://checkout.razorpay.com/v1/checkout.js"]');
        if (existingScript) {
          console.log('🔄 Razorpay script already exists in DOM, waiting for load...');
          existingScript.addEventListener('load', () => {
            console.log('✅ Existing Razorpay script loaded');
            resolve(true);
          });
          existingScript.addEventListener('error', () => {
            console.error('❌ Existing Razorpay script failed to load');
            reject(new Error('Failed to load Razorpay script'));
          });
          return;
        }

        console.log('🔄 Creating new Razorpay script...');
        const script = document.createElement('script');
        script.src = 'https://checkout.razorpay.com/v1/checkout.js';
        script.async = true;
        script.onload = () => {
          console.log('✅ Razorpay script loaded successfully');
          console.log('✅ Razorpay object available:', !!(window as any).Razorpay);
          resolve(true);
        };
        script.onerror = (error) => {
          console.error('❌ Failed to load Razorpay script:', error);
          reject(new Error('Failed to load Razorpay script'));
        };
        document.head.appendChild(script);
      });
    };

    loadRazorpayScript().catch(error => {
      console.error('Razorpay script loading error:', error);
      setError('Failed to load payment system. Please refresh the page and try again.');
    });
  }, []);

  const handleRazorpayPayment = async (orderId: string, orderItems: any[]) => {
    try {
      const backendUrl = process.env.REACT_APP_BACKEND_URL || 'http://localhost:5000';
      console.log('🔄 Using backend URL:', backendUrl);
      console.log('🔄 Environment variables:', {
        REACT_APP_BACKEND_URL: process.env.REACT_APP_BACKEND_URL,
        NODE_ENV: process.env.NODE_ENV
      });

      // Step 1: Create Razorpay order on backend
      console.log('🔄 Creating Razorpay order...');
      
      const requestBody = {
        amount: total,
        orderId: orderId,
        customer: `${formData.firstName} ${formData.lastName}`,
      };
      
      console.log('🔄 Request body:', requestBody);
      
      const createOrderResponse = await fetch(`${backendUrl}/api/razorpay/create-order`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(requestBody),
      });

      console.log('📊 Response status:', createOrderResponse.status);
      console.log('📊 Response ok:', createOrderResponse.ok);
      console.log('📊 Response headers:', Object.fromEntries(createOrderResponse.headers.entries()));

      if (!createOrderResponse.ok) {
        const contentType = createOrderResponse.headers.get('content-type');
        let errorMessage = `HTTP ${createOrderResponse.status}: Failed to create payment order`;
        
        if (contentType && contentType.includes('application/json')) {
          try {
            const errorData = await createOrderResponse.json();
            errorMessage = errorData.error || errorMessage;
            console.error('❌ API Error:', errorData);
          } catch (e) {
            console.error('❌ Error parsing error response:', e);
          }
        } else {
          const text = await createOrderResponse.text();
          console.error('❌ Non-JSON response:', text);
          errorMessage = 'Backend error. Please check server logs.';
        }
        
        throw new Error(errorMessage);
      }

      const responseData = await createOrderResponse.json();
      console.log('✅ Razorpay order created:', responseData);
      
      if (!responseData.success || !responseData.order) {
        throw new Error('Invalid response from payment gateway');
      }

      const { order: razorpayOrder } = responseData;

      // Step 2: Check if Razorpay is loaded
      console.log('🔍 Checking Razorpay availability...');
      console.log('🔍 Window.Razorpay:', !!(window as any).Razorpay);
      console.log('🔍 Razorpay constructor:', typeof (window as any).Razorpay);
      
      if (!(window as any).Razorpay) {
        console.error('❌ Razorpay not available on window object');
        throw new Error('Razorpay script not loaded. Please refresh and try again.');
      }

      console.log('✅ Razorpay is available, creating modal...');

      // Step 3: Open Razorpay modal
      const options = {
        key: 'rzp_live_S9KdjLbjrue2F0', // Razorpay Key ID from backend
        amount: razorpayOrder.amount,
        currency: 'INR',
        name: 'V Tech Multi Solutions',
        description: 'Boult India - Premium Audio & Automotive Care',
        order_id: razorpayOrder.id,
        handler: async (response: any) => {
          try {
            // Step 4: Verify payment on backend
            const verifyResponse = await fetch(`${backendUrl}/api/razorpay/verify-payment`, {
              method: 'POST',
              headers: { 
                'Content-Type': 'application/json',
                'Accept': 'application/json'
              },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              }),
            });

            if (!verifyResponse.ok) {
              const contentType = verifyResponse.headers.get('content-type');
              let errorMessage = 'Payment verification failed';
              
              if (contentType && contentType.includes('application/json')) {
                try {
                  const errorData = await verifyResponse.json();
                  errorMessage = errorData.error || errorMessage;
                } catch (e) {
                  console.error('Error parsing error response:', e);
                }
              }
              
              throw new Error(errorMessage);
            }

            // Step 5: Save order with payment details
            const saveOrderResponse = await fetch(`${backendUrl}/api/save-order`, {
              method: 'POST',
              headers: { 
                'Content-Type': 'application/json',
                'Accept': 'application/json'
              },
              body: JSON.stringify({
                id: orderId,
                customer: `${formData.firstName} ${formData.lastName}`,
                email: formData.email,
                phone: formData.phone,
                address: `${formData.flatNumber}, ${formData.streetAddress}, ${formData.city}, ${formData.state} - ${formData.pincode}`,
                city: formData.city,
                state: formData.state,
                pincode: formData.pincode,
                amount: total,
                paymentMethod: formData.paymentMethod,
                items: orderItems,
                status: 'paid',
                paymentId: response.razorpay_payment_id,
                orderDate: new Date().toISOString(),
              }),
            });

            if (saveOrderResponse.ok) {
              clearCart();
              setIsSubmitting(false);
              navigate(`/order-confirmation?orderId=${orderId}`);
            } else {
              const contentType = saveOrderResponse.headers.get('content-type');
              let errorMessage = 'Failed to save order';
              
              if (contentType && contentType.includes('application/json')) {
                try {
                  const errorData = await saveOrderResponse.json();
                  errorMessage = errorData.error || errorMessage;
                } catch (e) {
                  console.error('Error parsing error response:', e);
                }
              }
              
              throw new Error(errorMessage);
            }
          } catch (error) {
            console.error('Payment verification error:', error);
            setError('Payment verification failed. Please contact support.');
            setIsSubmitting(false);
          }
        },
        prefill: {
          name: `${formData.firstName} ${formData.lastName}`,
          email: formData.email,
          contact: formData.phone,
        },
        theme: {
          color: '#ff6b35',
        },
        modal: {
          ondismiss: () => {
            console.log('💡 Payment modal closed by user');
            setIsSubmitting(false);
          },
        },
      };

      console.log('🔄 Razorpay options:', options);
      console.log('🔄 Creating Razorpay instance...');
      
      try {
        const rzp = new (window as any).Razorpay(options);
        console.log('✅ Razorpay instance created:', rzp);
        console.log('🔄 Opening Razorpay modal...');
        rzp.open();
        console.log('✅ Razorpay modal opened successfully');
      } catch (modalError) {
        console.error('❌ Error creating/opening Razorpay modal:', modalError);
        throw new Error(`Failed to open payment modal: ${modalError.message}`);
      }
    } catch (error) {
      console.error('Razorpay payment error:', error);
      
      // Check if it's a network error
      if (error instanceof TypeError && error.message.includes('fetch')) {
        setError('Network error: Unable to connect to payment server. Please check your internet connection and try again.');
      } else {
        setError(error instanceof Error ? error.message : 'Failed to initiate payment. Please try again.');
      }
      setIsSubmitting(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      const backendUrl = process.env.REACT_APP_BACKEND_URL || 'http://localhost:5000';
      const orderId = `ORDER_${Date.now()}`;

      // Format items with all details including image and productId
      const orderItems = cart.items.map(item => ({
        productId: item.product.id,
        name: item.product.name,
        variant: item.variant || 'Default',
        quantity: item.quantity,
        price: item.product.price,
        image: (item.product as any).images?.[0] || (item.product as any).image || '',
      }));

      // If COD, save order directly
      if (formData.paymentMethod === 'cod') {
        const response = await fetch(`${backendUrl}/api/save-order`, {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify({
            id: orderId,
            customer: `${formData.firstName} ${formData.lastName}`,
            email: formData.email,
            phone: formData.phone,
            address: `${formData.flatNumber}, ${formData.streetAddress}, ${formData.city}, ${formData.state} - ${formData.pincode}`,
            city: formData.city,
            state: formData.state,
            pincode: formData.pincode,
            amount: total,
            paymentMethod: formData.paymentMethod,
            items: orderItems,
            status: 'pending',
            orderDate: new Date().toISOString(),
          }),
        });

        if (response.ok) {
          clearCart();
          navigate(`/order-confirmation?orderId=${orderId}`);
        } else {
          const contentType = response.headers.get('content-type');
          let errorMessage = 'Failed to place order. Please try again.';
          
          if (contentType && contentType.includes('application/json')) {
            try {
              const errorData = await response.json();
              errorMessage = errorData.error || errorMessage;
            } catch (e) {
              console.error('Error parsing error response:', e);
            }
          }
          
          setError(errorMessage);
        }
      } else {
        // For card/UPI/netbanking, open Razorpay modal
        await handleRazorpayPayment(orderId, orderItems);
      }
    } catch (error) {
      console.error('Error placing order:', error);
      
      // Check if it's a network error
      if (error instanceof TypeError && error.message.includes('fetch')) {
        setError('Network error: Unable to connect to server. Please check your internet connection and try again.');
      } else {
        setError('Failed to place order. Please check your connection and try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (cart.items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
        <p className="text-gray-600 mb-4">Your cart is empty</p>
        <button
          onClick={() => navigate('/products')}
          className="text-blue-600 hover:text-blue-800"
        >
          Back to Products
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-4xl font-bold text-gray-900 mb-8">Checkout</h1>


      {error && (
        <Modal
          isOpen={!!error}
          onClose={() => setError('')}
          title="Order Error"
          size="md"
        >
          <div className="p-6">
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
              <p className="text-red-800 font-semibold mb-2">Unable to Place Order</p>
              <p className="text-red-700 text-sm">{error}</p>
            </div>
            <button
              onClick={() => setError('')}
              className="w-full bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 transition font-semibold"
            >
              Try Again
            </button>
          </div>
        </Modal>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Debug Panel - Only show in development */}
        {process.env.NODE_ENV === 'development' && (
          <div className="lg:col-span-3 mb-8">
            <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6">
              <h3 className="text-lg font-bold text-yellow-800 mb-4">🔧 Debug Panel (Development Only)</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <button
                  onClick={testConnection}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition text-sm"
                >
                  Test Backend Connection
                </button>
                <button
                  onClick={testRazorpay}
                  className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition text-sm"
                >
                  Test Razorpay Endpoint
                </button>
                <div className="text-sm text-gray-600">
                  <p><strong>Backend URL:</strong> {process.env.REACT_APP_BACKEND_URL || 'http://localhost:5000'}</p>
                  <p><strong>Node ENV:</strong> {process.env.NODE_ENV}</p>
                  <p><strong>All ENV vars:</strong> {JSON.stringify(Object.keys(process.env).filter(key => key.startsWith('REACT_APP_')))}</p>
                </div>
              </div>
              {connectionTest && (
                <div className="bg-white border border-gray-200 rounded-lg p-3">
                  <p className="text-sm font-mono">{connectionTest}</p>
                </div>
              )}
            </div>
          </div>
        )}
        {/* Checkout Form */}
        <div className="lg:col-span-2">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Shipping Information */}
            <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <span className="bg-orange-600 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm">1</span>
                Shipping Information
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">First Name *</label>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">Last Name *</label>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">Email *</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">Phone *</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                    required
                  />
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-gray-700 font-semibold mb-2">Flat Number / House No. *</label>
                <input
                  type="text"
                  name="flatNumber"
                  value={formData.flatNumber}
                  onChange={handleInputChange}
                  placeholder="e.g., 123, Apt 4B"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  required
                />
              </div>

              <div className="mb-4">
                <label className="block text-gray-700 font-semibold mb-2">Street Address *</label>
                <input
                  type="text"
                  name="streetAddress"
                  value={formData.streetAddress}
                  onChange={handleInputChange}
                  placeholder="e.g., Main Street, Bandra"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">City *</label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">State *</label>
                  <input
                    type="text"
                    name="state"
                    value={formData.state}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">Pincode *</label>
                  <input
                    type="text"
                    name="pincode"
                    value={formData.pincode}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Payment Method */}
            <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <span className="bg-orange-600 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm">2</span>
                Payment Method
              </h2>

              <div className="space-y-3">
                {/* Cash on Delivery */}
                <label className="flex items-center gap-3 p-4 border-2 rounded-lg cursor-pointer transition hover:shadow-md" style={{borderColor: formData.paymentMethod === 'cod' ? '#ff6b35' : '#e5e7eb', backgroundColor: formData.paymentMethod === 'cod' ? '#fff7f3' : 'white'}}>
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="cod"
                    checked={formData.paymentMethod === 'cod'}
                    onChange={handleInputChange}
                    className="w-4 h-4"
                  />
                  <div>
                    <p className="font-semibold text-gray-900">Cash on Delivery (COD)</p>
                    <p className="text-sm text-gray-600">Pay when you receive your order</p>
                  </div>
                </label>

                {/* Credit/Debit Card */}
                <label className="flex items-center gap-3 p-4 border-2 rounded-lg cursor-pointer transition hover:shadow-md" style={{borderColor: formData.paymentMethod === 'card' ? '#ff6b35' : '#e5e7eb', backgroundColor: formData.paymentMethod === 'card' ? '#fff7f3' : 'white'}}>
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="card"
                    checked={formData.paymentMethod === 'card'}
                    onChange={handleInputChange}
                    className="w-4 h-4"
                  />
                  <div>
                    <p className="font-semibold text-gray-900">Credit/Debit Card</p>
                    <p className="text-sm text-gray-600">Visa, Mastercard, American Express</p>
                  </div>
                </label>

                {/* UPI */}
                <label className="flex items-center gap-3 p-4 border-2 rounded-lg cursor-pointer transition hover:shadow-md" style={{borderColor: formData.paymentMethod === 'upi' ? '#ff6b35' : '#e5e7eb', backgroundColor: formData.paymentMethod === 'upi' ? '#fff7f3' : 'white'}}>
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="upi"
                    checked={formData.paymentMethod === 'upi'}
                    onChange={handleInputChange}
                    className="w-4 h-4"
                  />
                  <div>
                    <p className="font-semibold text-gray-900">UPI</p>
                    <p className="text-sm text-gray-600">Google Pay, PhonePe, Paytm, BHIM</p>
                  </div>
                </label>

                {/* Net Banking */}
                <label className="flex items-center gap-3 p-4 border-2 rounded-lg cursor-pointer transition hover:shadow-md" style={{borderColor: formData.paymentMethod === 'netbanking' ? '#ff6b35' : '#e5e7eb', backgroundColor: formData.paymentMethod === 'netbanking' ? '#fff7f3' : 'white'}}>
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="netbanking"
                    checked={formData.paymentMethod === 'netbanking'}
                    onChange={handleInputChange}
                    className="w-4 h-4"
                  />
                  <div>
                    <p className="font-semibold text-gray-900">Net Banking</p>
                    <p className="text-sm text-gray-600">All major banks supported</p>
                  </div>
                </label>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-gradient-to-r from-orange-600 to-orange-700 text-white py-4 rounded-lg font-bold text-lg hover:shadow-lg transition transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Placing Order...' : 'Place Order'}
            </button>
          </form>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl shadow-lg p-6 sticky top-20 border border-orange-200">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Order Summary</h3>

            <div className="space-y-3 mb-6 pb-6 border-b border-orange-200 max-h-64 overflow-y-auto">
              {cart.items.map((item) => (
                <div key={item.product.id} className="flex gap-3 bg-white p-3 rounded-lg hover:shadow-md transition">
                  {/* Product Image */}
                  <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0 border border-gray-200">
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
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-900 text-sm line-clamp-2">{item.product.name}</p>
                    <p className="text-xs text-gray-600">Qty: {item.quantity}</p>
                    {item.variant && (
                      <p className="text-xs text-orange-600 font-medium">{item.variant}</p>
                    )}
                    <p className="font-bold text-orange-600 text-sm mt-1">
                      ₹{(item.product.price * item.quantity).toLocaleString('en-IN')}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="space-y-3 mb-6 pb-6 border-b border-orange-200">
              <div className="flex justify-between text-gray-700">
                <span className="font-medium">Subtotal</span>
                <span className="font-semibold">₹{total.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between text-gray-700">
                <span className="font-medium">Shipping Charges</span>
                <span className="text-blue-600 font-semibold text-sm italic">Calculated based on delivery location</span>
              </div>
            </div>

            <div className="flex justify-between text-2xl font-bold text-gray-900 mb-6 bg-white p-3 rounded-lg">
              <span>Total</span>
              <span className="text-orange-600">₹{total.toLocaleString('en-IN')}</span>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center text-sm text-blue-800 mb-4">
              <p className="mb-2">
                <Lock className="inline mr-2" size={16} />
                Secure Checkout
              </p>
              <p>Your payment information is encrypted and secure</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
