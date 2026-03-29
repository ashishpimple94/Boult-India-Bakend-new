export default function ShippingPolicy() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-orange-500 to-orange-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl font-bold mb-4">Shipping Policy</h1>
          <p className="text-xl text-orange-100">Fast and reliable delivery across India</p>
        </div>
      </section>

      {/* Content */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="prose prose-lg max-w-none">
          <p className="text-gray-600 mb-8">Last updated: January 2026</p>

          <h2 className="text-2xl font-bold text-gray-900 mb-4">Shipping Areas</h2>
          <p className="text-gray-700 mb-6">
            We currently ship to all major cities and towns across India. For remote areas, 
            delivery may take additional time. We're constantly expanding our delivery network 
            to serve you better.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mb-4">Delivery Time</h2>
          <ul className="list-disc pl-6 text-gray-700 mb-6">
            <li><strong>Metro Cities:</strong> 2-4 business days</li>
            <li><strong>Major Cities:</strong> 3-5 business days</li>
            <li><strong>Other Cities:</strong> 5-7 business days</li>
            <li><strong>Remote Areas:</strong> 7-10 business days</li>
          </ul>

          <h2 className="text-2xl font-bold text-gray-900 mb-4">Shipping Charges</h2>
          <div className="bg-orange-50 p-6 mb-6">
            <ul className="list-disc pl-6 text-gray-700">
              <li><strong>Orders above ₹500:</strong> FREE shipping</li>
              <li><strong>Orders below ₹500:</strong> ₹50 shipping charge</li>
              <li><strong>Express Delivery:</strong> ₹100 (1-2 days in metro cities)</li>
              <li><strong>Cash on Delivery:</strong> Additional ₹25 charge</li>
            </ul>
          </div>

          <h2 className="text-2xl font-bold text-gray-900 mb-4">Order Processing</h2>
          <p className="text-gray-700 mb-6">
            Orders are processed within 1-2 business days. You'll receive a confirmation email 
            with tracking information once your order is shipped. Orders placed on weekends or 
            holidays will be processed on the next business day.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mb-4">Tracking Your Order</h2>
          <p className="text-gray-700 mb-6">
            Once your order is shipped, you'll receive a tracking number via email and SMS. 
            You can track your package status on our website or the courier partner's website.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mb-4">Delivery Partners</h2>
          <p className="text-gray-700 mb-6">
            We work with trusted delivery partners including Blue Dart, DTDC, and India Post 
            to ensure safe and timely delivery of your orders.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mb-4">Delivery Issues</h2>
          <ul className="list-disc pl-6 text-gray-700 mb-6">
            <li>If you're not available during delivery, our partner will attempt redelivery</li>
            <li>After 3 failed delivery attempts, the package will be returned to us</li>
            <li>Please ensure someone is available to receive the package</li>
            <li>Provide accurate address and contact information</li>
          </ul>

          <h2 className="text-2xl font-bold text-gray-900 mb-4">Contact Us</h2>
          <p className="text-gray-700">
            For shipping-related queries, please contact us:
            <br />
            Email: vtechmultisolutions@gmail.com
            <br />
            Phone: +91 96651 54496
          </p>
        </div>
      </section>
    </div>
  );
}