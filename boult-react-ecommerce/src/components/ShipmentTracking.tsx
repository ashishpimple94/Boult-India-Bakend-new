import React from 'react';
import { Package, TruckIcon, CheckCircle, Clock, XCircle } from 'lucide-react';

interface ShipmentTrackingProps {
  order: {
    id: string;
    status: string;
    trackingNumber?: string;
    shippedAt?: string;
    deliveredAt?: string;
    estimatedDelivery?: string;
  };
}

export default function ShipmentTracking({ order }: ShipmentTrackingProps) {
  const getStatusSteps = () => {
    const steps = [
      { key: 'pending', label: 'Order Placed', icon: Package, completed: true },
      { key: 'processing', label: 'Processing', icon: Clock, completed: false },
      { key: 'shipped', label: 'Shipped', icon: TruckIcon, completed: false },
      { key: 'delivered', label: 'Delivered', icon: CheckCircle, completed: false },
    ];

    const statusOrder = ['pending', 'processing', 'shipped', 'delivered'];
    const currentIndex = statusOrder.indexOf(order.status);

    return steps.map((step, index) => ({
      ...step,
      completed: index <= currentIndex,
      active: index === currentIndex,
    }));
  };

  const steps = getStatusSteps();

  if (order.status === 'cancelled') {
    return (
      <div className="bg-red-50 border border-red-200 rounded-xl p-6">
        <div className="flex items-center gap-3 text-red-800">
          <XCircle size={32} />
          <div>
            <h3 className="font-bold text-lg">Order Cancelled</h3>
            <p className="text-sm">This order has been cancelled</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h3 className="text-2xl font-bold text-gray-900 mb-6">Track Your Order</h3>

      {/* Tracking Number */}
      {order.trackingNumber && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <p className="text-sm text-gray-600 mb-1">Tracking Number</p>
          <p className="font-mono font-bold text-lg text-gray-900">{order.trackingNumber}</p>
        </div>
      )}

      {/* Estimated Delivery */}
      {order.estimatedDelivery && order.status !== 'delivered' && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
          <p className="text-sm text-gray-600 mb-1">Estimated Delivery</p>
          <p className="font-bold text-lg text-gray-900">
            {new Date(order.estimatedDelivery).toLocaleDateString('en-IN', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </p>
        </div>
      )}

      {/* Status Timeline */}
      <div className="relative">
        {steps.map((step, index) => {
          const Icon = step.icon;
          return (
            <div key={step.key} className="relative pb-8 last:pb-0">
              {/* Connecting Line */}
              {index < steps.length - 1 && (
                <div
                  className={`absolute left-6 top-12 w-0.5 h-full -ml-px ${
                    step.completed ? 'bg-green-500' : 'bg-gray-300'
                  }`}
                />
              )}

              {/* Step Content */}
              <div className="relative flex items-start gap-4">
                {/* Icon */}
                <div
                  className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center ${
                    step.completed
                      ? 'bg-green-500 text-white'
                      : step.active
                      ? 'bg-orange-500 text-white animate-pulse'
                      : 'bg-gray-200 text-gray-400'
                  }`}
                >
                  <Icon size={24} />
                </div>

                {/* Details */}
                <div className="flex-1 pt-2">
                  <h4
                    className={`font-bold text-lg ${
                      step.completed || step.active ? 'text-gray-900' : 'text-gray-400'
                    }`}
                  >
                    {step.label}
                  </h4>
                  {step.active && (
                    <p className="text-sm text-orange-600 font-semibold mt-1">
                      Current Status
                    </p>
                  )}
                  {step.completed && !step.active && (
                    <p className="text-sm text-green-600 mt-1">✓ Completed</p>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Delivery Date */}
      {order.deliveredAt && (
        <div className="mt-6 bg-green-50 border border-green-200 rounded-lg p-4">
          <p className="text-sm text-gray-600 mb-1">Delivered On</p>
          <p className="font-bold text-lg text-gray-900">
            {new Date(order.deliveredAt).toLocaleDateString('en-IN', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </p>
        </div>
      )}

      {/* Help Text */}
      <div className="mt-6 text-center text-sm text-gray-600">
        <p>Need help with your order?</p>
        <a href="/contact" className="text-orange-600 hover:text-orange-700 font-semibold">
          Contact Support
        </a>
      </div>
    </div>
  );
}
