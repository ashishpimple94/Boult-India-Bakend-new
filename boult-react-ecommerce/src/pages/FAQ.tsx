import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

export default function FAQ() {
  const [openFAQ, setOpenFAQ] = useState<number | null>(null);

  const faqs = [
    {
      question: "What products does Boult India offer?",
      answer: "Boult India offers a comprehensive range of vehicle care and maintenance products including engine oils, brake cleaners, chain lubricants, spray paints, anti-rust sprays, and various automotive care solutions for both two-wheelers and four-wheelers."
    },
    {
      question: "How do I place an order?",
      answer: "You can place an order by browsing our products, adding items to your cart, and proceeding to checkout. You can pay using various methods including credit/debit cards, UPI, net banking, or choose cash on delivery."
    },
    {
      question: "What are the shipping charges?",
      answer: "We offer free shipping on orders above ₹500. For orders below ₹500, a shipping charge of ₹50 applies. Express delivery is available for ₹100 extra, and cash on delivery has an additional charge of ₹25."
    },
    {
      question: "How long does delivery take?",
      answer: "Delivery time varies by location: Metro cities (2-4 days), Major cities (3-5 days), Other cities (5-7 days), and Remote areas (7-10 days). Express delivery is available for metro cities in 1-2 days."
    },
    {
      question: "Can I return a product?",
      answer: "Yes, you can return products within 30 days of delivery. Items must be unused, in original packaging with all tags attached. Contact our customer service to initiate a return."
    },
    {
      question: "How do I track my order?",
      answer: "Once your order is shipped, you'll receive a tracking number via email and SMS. You can track your package on our website or the courier partner's website."
    },
    {
      question: "What payment methods do you accept?",
      answer: "We accept credit/debit cards, UPI, net banking, digital wallets, and cash on delivery. All payments are processed securely through our payment gateway."
    },
    {
      question: "Are your products genuine?",
      answer: "Yes, all our products are 100% genuine and sourced directly from authorized manufacturers. We guarantee the authenticity and quality of every product we sell."
    },
    {
      question: "Do you offer bulk discounts?",
      answer: "Yes, we offer special pricing for bulk orders. Please contact our sales team at vtechmultisolutions@gmail.com for bulk order inquiries and custom pricing."
    },
    {
      question: "How can I contact customer support?",
      answer: "You can reach our customer support team via email at vtechmultisolutions@gmail.com or call us at +91 96651 54496. Our support hours are Monday to Friday, 9 AM to 6 PM IST."
    },
    {
      question: "Do you have a physical store?",
      answer: "Our main office is located at Office No. 404, Patel Plaza, Miramandal Chowk, Parivati, Pune-411009 Maharashtra. However, we primarily operate online to serve customers across India."
    },
    {
      question: "What if I receive a damaged product?",
      answer: "If you receive a damaged or defective product, please contact us immediately with photos of the damage. We'll arrange for a replacement or full refund at no additional cost to you."
    }
  ];

  const toggleFAQ = (index: number) => {
    setOpenFAQ(openFAQ === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-orange-500 to-orange-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl font-bold mb-4">Frequently Asked Questions</h1>
          <p className="text-xl text-orange-100">Find answers to common questions</p>
        </div>
      </section>

      {/* FAQ Content */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div key={index} className="border border-gray-200 bg-white shadow-sm">
              <button
                className="w-full px-6 py-4 text-left flex justify-between items-center hover:bg-gray-50 transition-colors"
                onClick={() => toggleFAQ(index)}
              >
                <h3 className="text-lg font-semibold text-gray-900 pr-4">
                  {faq.question}
                </h3>
                {openFAQ === index ? (
                  <ChevronUp className="text-orange-600 flex-shrink-0" size={20} />
                ) : (
                  <ChevronDown className="text-orange-600 flex-shrink-0" size={20} />
                )}
              </button>
              {openFAQ === index && (
                <div className="px-6 pb-4">
                  <p className="text-gray-700 leading-relaxed">{faq.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Contact Section */}
        <div className="mt-12 bg-orange-50 p-8 text-center">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">Still have questions?</h3>
          <p className="text-gray-700 mb-6">
            Can't find the answer you're looking for? Our customer support team is here to help.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="mailto:vtechmultisolutions@gmail.com"
              className="bg-orange-600 text-white px-6 py-3 font-semibold hover:bg-orange-700 transition-colors"
            >
              Email Support
            </a>
            <a
              href="tel:+919665154496"
              className="bg-white text-orange-600 border-2 border-orange-600 px-6 py-3 font-semibold hover:bg-orange-600 hover:text-white transition-colors"
            >
              Call Support
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}