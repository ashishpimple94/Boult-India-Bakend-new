import React, { useState } from 'react';
import { Send, Building, TruckIcon, Megaphone, HelpCircle } from 'lucide-react';
import Toast from './Toast';

interface EnquiryFormProps {
  type?: 'distributor' | 'marketing' | 'logistics' | 'general';
  onClose?: () => void;
}

export default function EnquiryForm({ type = 'general', onClose }: EnquiryFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    enquiryType: type,
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const enquiryTypes = [
    { value: 'distributor', label: 'Distributor Partnership', icon: Building },
    { value: 'marketing', label: 'Marketing Agency', icon: Megaphone },
    { value: 'logistics', label: 'Logistics Partnership', icon: TruckIcon },
    { value: 'general', label: 'General Enquiry', icon: HelpCircle },
  ];

  const currentType = enquiryTypes.find(t => t.value === formData.enquiryType);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const backendUrl = process.env.REACT_APP_BACKEND_URL || 'http://localhost:5000';
      const response = await fetch(`${backendUrl}/api/enquiries`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          submittedAt: new Date().toISOString(),
        }),
      });

      if (response.ok) {
        setToast({ message: 'Enquiry submitted successfully! We will contact you soon.', type: 'success' });
        setFormData({
          name: '',
          email: '',
          phone: '',
          company: '',
          enquiryType: type,
          message: '',
        });
        setTimeout(() => {
          if (onClose) onClose();
        }, 2000);
      } else {
        throw new Error('Failed to submit enquiry');
      }
    } catch (error) {
      console.error('Error submitting enquiry:', error);
      setToast({ message: 'Failed to submit enquiry. Please try again.', type: 'error' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 max-w-2xl mx-auto">
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      <div className="flex items-center gap-3 mb-6">
        {currentType && <currentType.icon size={32} className="text-orange-600" />}
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Business Enquiry</h2>
          <p className="text-gray-600 text-sm">Fill out the form and we'll get back to you within 24 hours</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Enquiry Type */}
        <div>
          <label className="block text-gray-700 font-semibold mb-2">Enquiry Type *</label>
          <select
            name="enquiryType"
            value={formData.enquiryType}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
            required
          >
            {enquiryTypes.map(type => (
              <option key={type.value} value={type.value}>{type.label}</option>
            ))}
          </select>
        </div>

        {/* Name */}
        <div>
          <label className="block text-gray-700 font-semibold mb-2">Full Name *</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
            required
          />
        </div>

        {/* Email and Phone */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

        {/* Company Name */}
        <div>
          <label className="block text-gray-700 font-semibold mb-2">
            Company Name {formData.enquiryType !== 'general' && '*'}
          </label>
          <input
            type="text"
            name="company"
            value={formData.company}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
            required={formData.enquiryType !== 'general'}
          />
        </div>

        {/* Message */}
        <div>
          <label className="block text-gray-700 font-semibold mb-2">Message *</label>
          <textarea
            name="message"
            value={formData.message}
            onChange={handleInputChange}
            rows={5}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 resize-none"
            placeholder="Tell us about your requirements..."
            required
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-gradient-to-r from-orange-600 to-orange-700 text-white py-3 rounded-lg font-bold hover:shadow-lg transition transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {isSubmitting ? (
            'Submitting...'
          ) : (
            <>
              <Send size={20} />
              Submit Enquiry
            </>
          )}
        </button>
      </form>
    </div>
  );
}
