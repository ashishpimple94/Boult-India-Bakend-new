import React from 'react';
import EnquiryForm from '../components/EnquiryForm';
import { Building, TruckIcon, Megaphone, Package } from 'lucide-react';

export default function BusinessEnquiry() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Partner With Boult India
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Join hands with India's leading automotive care brand. We're looking for distributors, 
            marketing partners, and logistics providers to expand our reach.
          </p>
        </div>

        {/* Partnership Benefits */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <div className="bg-white rounded-xl shadow-lg p-6 text-center hover:shadow-xl transition">
            <div className="bg-orange-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Building size={32} className="text-orange-600" />
            </div>
            <h3 className="font-bold text-lg mb-2">Distributor Network</h3>
            <p className="text-gray-600 text-sm">
              Exclusive territory rights and competitive margins
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 text-center hover:shadow-xl transition">
            <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Megaphone size={32} className="text-blue-600" />
            </div>
            <h3 className="font-bold text-lg mb-2">Marketing Partners</h3>
            <p className="text-gray-600 text-sm">
              Collaborate on campaigns and brand building
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 text-center hover:shadow-xl transition">
            <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <TruckIcon size={32} className="text-green-600" />
            </div>
            <h3 className="font-bold text-lg mb-2">Logistics Partners</h3>
            <p className="text-gray-600 text-sm">
              Reliable delivery network across India
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 text-center hover:shadow-xl transition">
            <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Package size={32} className="text-purple-600" />
            </div>
            <h3 className="font-bold text-lg mb-2">Bulk Orders</h3>
            <p className="text-gray-600 text-sm">
              Special pricing for corporate and bulk purchases
            </p>
          </div>
        </div>

        {/* Enquiry Form */}
        <EnquiryForm type="distributor" />

        {/* Why Partner Section */}
        <div className="mt-16 bg-white rounded-xl shadow-lg p-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">
            Why Partner With Us?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="font-bold text-xl text-orange-600 mb-3">Quality Products</h3>
              <p className="text-gray-600">
                Premium automotive care products trusted by thousands of customers across India.
              </p>
            </div>
            <div>
              <h3 className="font-bold text-xl text-orange-600 mb-3">Strong Brand</h3>
              <p className="text-gray-600">
                Established brand presence with growing market share and customer loyalty.
              </p>
            </div>
            <div>
              <h3 className="font-bold text-xl text-orange-600 mb-3">Support & Training</h3>
              <p className="text-gray-600">
                Comprehensive training, marketing support, and dedicated account management.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
