import React from 'react';

export default function WhatsAppButton() {
  const phoneNumber = '919665154496'; // +91 96651 54496
  const message = 'Hello! I have a question about Boult India products.';
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 bg-green-500 hover:bg-green-600 text-white p-4 rounded-full shadow-lg transition-all duration-300 hover:scale-110 group"
      aria-label="Chat on WhatsApp"
    >
      {/* Genuine WhatsApp Icon SVG */}
      <svg 
        viewBox="0 0 32 32" 
        className="w-7 h-7 animate-pulse"
        fill="currentColor"
      >
        <path d="M16 0c-8.837 0-16 7.163-16 16 0 2.825 0.737 5.607 2.137 8.048l-2.137 7.952 7.933-2.127c2.42 1.37 5.173 2.127 8.067 2.127 8.837 0 16-7.163 16-16s-7.163-16-16-16zM16 29.467c-2.482 0-4.908-0.646-7.07-1.87l-0.507-0.292-4.713 1.262 1.262-4.669-0.292-0.508c-1.207-2.100-1.847-4.507-1.847-6.924 0-7.435 6.050-13.485 13.485-13.485s13.485 6.050 13.485 13.485c0 7.435-6.050 13.485-13.485 13.485zM21.960 18.828c-0.216-0.108-1.277-0.631-1.474-0.703s-0.342-0.108-0.486 0.108c-0.144 0.216-0.558 0.703-0.684 0.847s-0.252 0.162-0.468 0.054c-0.216-0.108-0.912-0.336-1.737-1.073-0.642-0.573-1.075-1.281-1.201-1.497s-0.013-0.333 0.095-0.441c0.097-0.097 0.216-0.252 0.324-0.378s0.144-0.216 0.216-0.36c0.072-0.144 0.036-0.270-0.018-0.378s-0.486-1.171-0.666-1.603c-0.176-0.421-0.354-0.364-0.486-0.370-0.126-0.006-0.270-0.007-0.414-0.007s-0.378 0.054-0.576 0.270c-0.198 0.216-0.756 0.739-0.756 1.802s0.774 2.090 0.882 2.234c0.108 0.144 1.525 2.329 3.694 3.266 0.516 0.223 0.919 0.356 1.233 0.456 0.518 0.165 0.989 0.142 1.362 0.086 0.415-0.062 1.277-0.522 1.457-1.026s0.180-0.936 0.126-1.026c-0.054-0.090-0.198-0.144-0.414-0.252z"/>
      </svg>
      
      <span className="absolute right-full mr-3 top-1/2 -translate-y-1/2 bg-gray-900 text-white px-3 py-2 rounded-lg text-sm whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
        Chat with us on WhatsApp
      </span>
    </a>
  );
}
