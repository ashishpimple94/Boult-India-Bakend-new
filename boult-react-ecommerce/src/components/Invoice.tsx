/** @jsxImportSource react */
import React from 'react';
import { Download, Printer } from 'lucide-react';

interface InvoiceProps {
  order: {
    id: string;
    customer: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    state: string;
    pincode: string;
    amount: number;
    shippingCharges?: number;
    status: string;
    date: string;
    items: any[];
    paymentMethod?: string;
  };
  showPrintButton?: boolean;
}

const GST_RATE = 0.18; // 18% GST
const COMPANY_NAME = 'V Tech Multi Solutions';
const COMPANY_LOGO = '/logos/logo1.png'; // Local logo path

const Invoice: React.FC<InvoiceProps> = ({ order, showPrintButton = true }) => {
  const [isGeneratingPDF, setIsGeneratingPDF] = React.useState(false);
  const shippingCharges = order.shippingCharges || 0;
  const subtotal = order.amount / (1 + GST_RATE);
  const gstAmount = order.amount - subtotal;
  const grandTotal = order.amount + shippingCharges;

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPDF = async () => {
    setIsGeneratingPDF(true);
    try {
      const html2canvas = (await import('html2canvas')).default;
      const { jsPDF } = await import('jspdf');
      
      const element = document.getElementById('invoice-content');
      if (!element) return;

      // Generate canvas from invoice with better settings
      const canvasElement = await html2canvas(element, { 
        useCORS: true, 
        scale: 2,
        allowTaint: true,
        backgroundColor: '#ffffff',
        logging: false,
        windowHeight: element.scrollHeight,
        height: element.scrollHeight,
        width: element.scrollWidth,
        scrollX: 0,
        scrollY: 0
      });
      
      // Convert to image
      const imgData = canvasElement.toDataURL('image/png', 1.0);
      
      // Create PDF with proper dimensions
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
        compress: true
      });
      
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const margin = 10; // 10mm margin
      const contentWidth = pageWidth - (margin * 2);
      
      // Calculate image dimensions with margins
      const imgWidth = contentWidth;
      const imgHeight = (canvasElement.height * imgWidth) / canvasElement.width;
      
      // Add first page with margins
      pdf.addImage(imgData, 'PNG', margin, margin, imgWidth, imgHeight);
      
      // Add additional pages if needed
      let heightLeft = imgHeight - (pageHeight - margin * 2);
      let position = (pageHeight - margin * 2) - imgHeight;
      
      while (heightLeft > 0) {
        position = heightLeft - imgHeight + margin;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', margin, position, imgWidth, imgHeight);
        heightLeft -= (pageHeight - margin * 2);
      }
      
      // Save with proper filename
      const filename = `VTech_Invoice_${order.id}_${new Date().toISOString().split('T')[0]}.pdf`;
      pdf.save(filename);
    } catch (error) {
      console.error('Error generating PDF:', error);
      // Fallback to print
      window.print();
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-200">
      {/* Print/Download Buttons */}
      {showPrintButton && (
        <div className="flex gap-3 mb-6 pb-6 border-b border-gray-200 print:hidden">
          <button
            onClick={handlePrint}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-semibold"
          >
            <Printer size={18} />
            Print Invoice
          </button>
          <button
            onClick={handleDownloadPDF}
            disabled={isGeneratingPDF}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Download size={18} />
            {isGeneratingPDF ? 'Generating PDF...' : 'Download PDF'}
          </button>
        </div>
      )}

      {/* Invoice Content */}
      <div id="invoice-content" className="print:p-8 print:shadow-none print:border-none print:m-0 bg-white">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 sm:mb-8 pb-6 sm:pb-8 border-b-2 border-gray-300 gap-4">
          <div className="flex items-center gap-3 sm:gap-4">
            <img 
              src={COMPANY_LOGO} 
              alt="Company Logo" 
              className="h-12 sm:h-16 w-auto object-contain"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.style.display = 'none';
              }}
            />
            <div>
              <h1 className="text-xl sm:text-3xl font-bold text-gray-900">{COMPANY_NAME}</h1>
            </div>
          </div>
          <div className="text-left sm:text-right">
            <p className="text-lg sm:text-2xl font-bold text-orange-600">INVOICE</p>
            <p className="text-sm sm:text-base text-gray-600">Invoice #: {order.id}</p>
            <p className="text-sm sm:text-base text-gray-600">Date: {new Date(order.date).toLocaleDateString('en-IN')}</p>
          </div>
        </div>

        {/* Customer & Company Info */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8 mb-6 sm:mb-8">
          {/* Bill To */}
          <div>
            <h3 className="text-xs sm:text-sm font-bold text-gray-900 uppercase mb-2 sm:mb-3 border-b-2 border-orange-600 pb-2">Bill To</h3>
            <p className="font-bold text-gray-900 text-base sm:text-lg">{order.customer}</p>
            <p className="text-sm sm:text-base text-gray-600">{order.address}</p>
            <p className="text-sm sm:text-base text-gray-600">{order.city}, {order.state} {order.pincode}</p>
            <p className="text-sm sm:text-base text-gray-600 mt-2">Email: {order.email}</p>
            <p className="text-sm sm:text-base text-gray-600">Phone: {order.phone}</p>
          </div>

          {/* Company Info */}
          <div className="text-left sm:text-right">
            <h3 className="text-xs sm:text-sm font-bold text-gray-900 uppercase mb-2 sm:mb-3 border-b-2 border-orange-600 pb-2">From</h3>
            <p className="font-bold text-gray-900 text-base sm:text-lg">{COMPANY_NAME}</p>
            <p className="text-sm sm:text-base text-gray-600 mt-2">Vehicle Care Products</p>
            <p className="text-sm sm:text-base text-gray-600 mt-4">Status: <span className="font-bold text-orange-600">{order.status.toUpperCase()}</span></p>
          </div>
        </div>

        {/* Items Table */}
        <div className="mb-6 sm:mb-8 overflow-x-auto">
          <table className="w-full min-w-[600px]">
            <thead>
              <tr className="bg-gray-900 text-white">
                <th className="px-2 sm:px-4 py-2 sm:py-3 text-left font-bold text-xs sm:text-sm">Product</th>
                <th className="px-2 sm:px-4 py-2 sm:py-3 text-center font-bold text-xs sm:text-sm hidden sm:table-cell">Variant</th>
                <th className="px-2 sm:px-4 py-2 sm:py-3 text-center font-bold text-xs sm:text-sm">Qty</th>
                <th className="px-2 sm:px-4 py-2 sm:py-3 text-right font-bold text-xs sm:text-sm">Price</th>
                <th className="px-2 sm:px-4 py-2 sm:py-3 text-right font-bold text-xs sm:text-sm">Total</th>
              </tr>
            </thead>
            <tbody>
              {order.items && order.items.map((item: any, index: number) => (
                <tr key={index} className="border-b border-gray-200 hover:bg-gray-50">
                  <td className="px-2 sm:px-4 py-2 sm:py-3 text-gray-900 font-semibold text-xs sm:text-sm">
                    {item.name}
                    <span className="block sm:hidden text-xs text-gray-500 mt-1">{item.variant || 'Default'}</span>
                  </td>
                  <td className="px-2 sm:px-4 py-2 sm:py-3 text-center text-gray-600 text-xs sm:text-sm hidden sm:table-cell">{item.variant || 'Default'}</td>
                  <td className="px-2 sm:px-4 py-2 sm:py-3 text-center text-gray-600 text-xs sm:text-sm">{item.quantity}</td>
                  <td className="px-2 sm:px-4 py-2 sm:py-3 text-right text-gray-900 text-xs sm:text-sm">₹{item.price ? item.price.toLocaleString('en-IN') : '0'}</td>
                  <td className="px-2 sm:px-4 py-2 sm:py-3 text-right font-bold text-gray-900 text-xs sm:text-sm">₹{item.price && item.quantity ? (item.price * item.quantity).toLocaleString('en-IN') : '0'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Summary */}
        <div className="flex justify-end mb-6 sm:mb-8">
          <div className="w-full sm:w-96">
            <div className="bg-gray-50 rounded-lg p-4 sm:p-6 border border-gray-200">
              <div className="flex justify-between mb-3 pb-3 border-b border-gray-300">
                <span className="text-gray-700 font-semibold text-sm sm:text-base">Subtotal (Before GST):</span>
                <span className="text-gray-900 font-bold text-sm sm:text-base">₹{subtotal.toLocaleString('en-IN', { maximumFractionDigits: 2 })}</span>
              </div>
              <div className="flex justify-between mb-3 pb-3 border-b border-gray-300">
                <span className="text-gray-700 font-semibold text-sm sm:text-base">GST (18%):</span>
                <span className="text-orange-600 font-bold text-sm sm:text-base">₹{gstAmount.toLocaleString('en-IN', { maximumFractionDigits: 2 })}</span>
              </div>
              {shippingCharges > 0 && (
                <div className="flex justify-between mb-4 pb-4 border-b border-gray-300">
                  <span className="text-gray-700 font-semibold text-sm sm:text-base">Shipping Charges:</span>
                  <span className="text-blue-600 font-bold text-sm sm:text-base">₹{shippingCharges.toLocaleString('en-IN', { maximumFractionDigits: 2 })}</span>
                </div>
              )}
              <div className="flex justify-between bg-gradient-to-r from-orange-600 to-orange-700 text-white p-3 sm:p-4 rounded-lg">
                <span className="font-bold text-base sm:text-lg">Total Amount:</span>
                <span className="font-bold text-base sm:text-lg">₹{grandTotal.toLocaleString('en-IN', { maximumFractionDigits: 2 })}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Payment Method */}
        {order.paymentMethod && (
          <div className="mb-8 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <p className="text-sm text-blue-800">
              <span className="font-bold">Payment Method:</span> 
              {' '}
              {order.paymentMethod === 'cod' && 'Cash on Delivery (COD)'}
              {order.paymentMethod === 'card' && 'Credit/Debit Card'}
              {order.paymentMethod === 'upi' && 'UPI'}
              {order.paymentMethod === 'netbanking' && 'Net Banking'}
            </p>
          </div>
        )}

        {/* Footer */}
        <div className="border-t-2 border-gray-300 pt-6 text-center text-gray-600 text-sm">
          <p className="mb-2 font-semibold text-orange-600">Thank you for your business!</p>
          <p className="mb-2">For any queries, please contact us:</p>
          <p className="font-semibold">Email: support@vtechmultisolutions.com | Phone: +91-XXXXXXXXXX</p>
          <p className="mt-4 text-xs text-gray-500">This is a computer-generated invoice and does not require a signature.</p>
          <div className="mt-4 pt-4 border-t border-gray-200">
            <p className="text-xs text-gray-400">Generated by {COMPANY_NAME} - Professional Vehicle Care Solutions</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Invoice;
