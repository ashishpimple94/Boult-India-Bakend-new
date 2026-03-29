import React, { useState } from 'react';
import { XCircle, AlertTriangle } from 'lucide-react';
import Toast from './Toast';

interface OrderCancellationProps {
  orderId: string;
  orderStatus: string;
  orderDate: string;
  onCancelled?: () => void;
}

export default function OrderCancellation({
  orderId,
  orderStatus,
  orderDate,
  onCancelled,
}: OrderCancellationProps) {
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [cancelReason, setCancelReason] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  // Check if order can be cancelled (within 24 hours and not shipped)
  const canCancel = () => {
    if (orderStatus === 'shipped' || orderStatus === 'delivered' || orderStatus === 'cancelled') {
      return false;
    }

    const orderTime = new Date(orderDate).getTime();
    const currentTime = new Date().getTime();
    const hoursSinceOrder = (currentTime - orderTime) / (1000 * 60 * 60);

    return hoursSinceOrder < 24; // Can cancel within 24 hours
  };

  const getTimeRemaining = () => {
    const orderTime = new Date(orderDate).getTime();
    const currentTime = new Date().getTime();
    const hoursSinceOrder = (currentTime - orderTime) / (1000 * 60 * 60);
    const hoursRemaining = Math.max(0, 24 - hoursSinceOrder);

    if (hoursRemaining === 0) return 'Cancellation period expired';
    if (hoursRemaining < 1) return `${Math.round(hoursRemaining * 60)} minutes remaining`;
    return `${Math.round(hoursRemaining)} hours remaining`;
  };

  const handleCancelOrder = async () => {
    if (!cancelReason.trim()) {
      setToast({ message: 'Please provide a reason for cancellation', type: 'error' });
      return;
    }

    setIsSubmitting(true);

    try {
      const backendUrl = process.env.REACT_APP_BACKEND_URL || 'http://localhost:5000';
      const response = await fetch(`${backendUrl}/api/update-order`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderId,
          status: 'cancelled',
          cancelReason,
          cancelledAt: new Date().toISOString(),
        }),
      });

      if (response.ok) {
        setToast({ message: 'Order cancelled successfully', type: 'success' });
        setShowCancelDialog(false);
        if (onCancelled) onCancelled();
      } else {
        throw new Error('Failed to cancel order');
      }
    } catch (error) {
      console.error('Error cancelling order:', error);
      setToast({ message: 'Failed to cancel order. Please contact support.', type: 'error' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const cancellationReasons = [
    'Changed my mind',
    'Found a better price elsewhere',
    'Ordered by mistake',
    'Delivery time too long',
    'Want to modify order',
    'Other',
  ];

  if (!canCancel()) {
    return (
      <div className="bg-gray-50 border border-gray-200 rounded-xl p-6">
        <div className="flex items-start gap-3 text-gray-600">
          <AlertTriangle size={24} className="flex-shrink-0 mt-1" />
          <div>
            <h4 className="font-bold text-gray-900 mb-2">Cancellation Not Available</h4>
            {orderStatus === 'shipped' || orderStatus === 'delivered' ? (
              <p className="text-sm">
                This order has already been {orderStatus}. Please contact support for returns or refunds.
              </p>
            ) : orderStatus === 'cancelled' ? (
              <p className="text-sm">This order has already been cancelled.</p>
            ) : (
              <p className="text-sm">
                The cancellation period (24 hours) has expired. Please contact support for assistance.
              </p>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      <div className="bg-orange-50 border border-orange-200 rounded-xl p-6">
        <div className="flex items-start gap-3 mb-4">
          <XCircle size={24} className="text-orange-600 flex-shrink-0 mt-1" />
          <div className="flex-1">
            <h4 className="font-bold text-gray-900 mb-2">Cancel Order</h4>
            <p className="text-sm text-gray-600 mb-2">
              You can cancel this order within 24 hours of placement, before it's shipped.
            </p>
            <p className="text-sm font-semibold text-orange-600">
              {getTimeRemaining()}
            </p>
          </div>
        </div>

        <button
          onClick={() => setShowCancelDialog(true)}
          className="w-full bg-red-600 hover:bg-red-700 text-white py-3 rounded-lg font-bold transition"
        >
          Cancel This Order
        </button>
      </div>

      {/* Cancellation Dialog */}
      {showCancelDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full">
            <div className="p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Cancel Order</h3>
              
              <p className="text-gray-600 mb-4">
                Are you sure you want to cancel this order? This action cannot be undone.
              </p>

              <div className="mb-4">
                <label className="block text-gray-700 font-semibold mb-2">
                  Reason for Cancellation *
                </label>
                <select
                  value={cancelReason}
                  onChange={(e) => setCancelReason(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 mb-3"
                  required
                >
                  <option value="">Select a reason</option>
                  {cancellationReasons.map((reason) => (
                    <option key={reason} value={reason}>
                      {reason}
                    </option>
                  ))}
                </select>

                {cancelReason === 'Other' && (
                  <textarea
                    placeholder="Please specify your reason..."
                    onChange={(e) => setCancelReason(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 resize-none"
                    rows={3}
                  />
                )}
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setShowCancelDialog(false)}
                  disabled={isSubmitting}
                  className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Keep Order
                </button>
                <button
                  onClick={handleCancelOrder}
                  disabled={isSubmitting}
                  className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? 'Cancelling...' : 'Yes, Cancel Order'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
