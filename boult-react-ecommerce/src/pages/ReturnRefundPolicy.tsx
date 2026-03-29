export default function ReturnRefundPolicy() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-orange-500 to-orange-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl font-bold mb-4">Return & Refund Policy</h1>
          <p className="text-xl text-orange-100">Easy returns and hassle-free refunds</p>
        </div>
      </section>

      {/* Content */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="prose prose-lg max-w-none">
          <p className="text-gray-600 mb-8">Last updated: January 2026</p>

          <h2 className="text-2xl font-bold text-gray-900 mb-4">Return Policy</h2>
          <p className="text-gray-700 mb-6">
            We want you to be completely satisfied with your purchase. If you're not happy with your 
            order, you can return it within 30 days of delivery for a full refund or exchange.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mb-4">Return Conditions</h2>
          <ul className="list-disc pl-6 text-gray-700 mb-6">
            <li>Items must be unused and in original packaging</li>
            <li>All original tags and labels must be attached</li>
            <li>Return request must be initiated within 30 days of delivery</li>
            <li>Items must be in resalable condition</li>
            <li>Original receipt or proof of purchase required</li>
          </ul>

          <h2 className="text-2xl font-bold text-gray-900 mb-4">How to Return</h2>
          <ol className="list-decimal pl-6 text-gray-700 mb-6">
            <li>Contact our customer service team at vtechmultisolutions@gmail.com</li>
            <li>Provide your order number and reason for return</li>
            <li>We'll provide you with return instructions and shipping label</li>
            <li>Pack the item securely and ship it back to us</li>
            <li>We'll process your refund within 5-7 business days after receiving the item</li>
          </ol>

          <h2 className="text-2xl font-bold text-gray-900 mb-4">Refund Process</h2>
          <p className="text-gray-700 mb-6">
            Refunds will be processed to the original payment method within 5-7 business days after 
            we receive and inspect the returned item. Shipping charges are non-refundable unless 
            the return is due to our error.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mb-4">Exchanges</h2>
          <p className="text-gray-700 mb-6">
            We offer exchanges for defective or damaged items. If you receive a defective product, 
            contact us immediately and we'll arrange for a replacement at no additional cost.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mb-4">Non-Returnable Items</h2>
          <ul className="list-disc pl-6 text-gray-700 mb-6">
            <li>Items damaged by misuse or normal wear</li>
            <li>Items returned after 30 days</li>
            <li>Items without original packaging or tags</li>
          </ul>

          <h2 className="text-2xl font-bold text-gray-900 mb-4">Contact Us</h2>
          <p className="text-gray-700">
            For any questions about returns or refunds, please contact us:
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