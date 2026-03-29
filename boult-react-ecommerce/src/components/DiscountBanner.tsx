import React, { useState } from 'react';
import { X, Tag, Percent } from 'lucide-react';

interface Offer {
  id: string;
  title: string;
  description: string;
  code?: string;
  discount: string;
  validUntil: string;
  bgColor: string;
}

export default function DiscountBanner() {
  const [isVisible, setIsVisible] = useState(true);
  const [currentOfferIndex, setCurrentOfferIndex] = useState(0);

  const offers: Offer[] = [
    {
      id: 'WELCOME10',
      title: 'Welcome Offer',
      description: 'Get 10% off on your first order',
      code: 'WELCOME10',
      discount: '10%',
      validUntil: '31 Mar 2026',
      bgColor: 'from-orange-500 to-red-500'
    }
  ];

  const currentOffer = offers[currentOfferIndex];

  React.useEffect(() => {
    const interval = setInterval(() => {
      setCurrentOfferIndex((prev) => (prev + 1) % offers.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [offers.length]);

  if (!isVisible) return null;

  return (
    <div className={`relative bg-gradient-to-r ${currentOffer.bgColor} text-white py-3 px-4 overflow-hidden`}>
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        <div className="flex items-center gap-3 flex-1">
          <div className="bg-white/20 p-2 rounded-full">
            {currentOffer.code ? <Tag size={20} /> : <Percent size={20} />}
          </div>
          <div className="flex-1">
            <p className="font-bold text-sm md:text-base">{currentOffer.title}</p>
            <p className="text-xs md:text-sm opacity-90">{currentOffer.description}</p>
          </div>
          {currentOffer.code && (
            <div className="hidden md:flex items-center gap-2 bg-white/20 px-4 py-2 rounded-lg backdrop-blur-sm">
              <span className="text-xs font-semibold">Code:</span>
              <span className="font-mono font-bold text-lg">{currentOffer.code}</span>
            </div>
          )}
          <div className="hidden sm:block text-right">
            <p className="text-xs opacity-75">Valid until</p>
            <p className="font-semibold text-sm">{currentOffer.validUntil}</p>
          </div>
        </div>
        <button
          onClick={() => setIsVisible(false)}
          className="p-1 hover:bg-white/20 rounded-full transition"
          aria-label="Close banner"
        >
          <X size={20} />
        </button>
      </div>
      
      {/* Offer indicators */}
      <div className="absolute bottom-1 left-1/2 -translate-x-1/2 flex gap-1">
        {offers.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentOfferIndex(index)}
            className={`w-2 h-2 rounded-full transition-all ${
              index === currentOfferIndex ? 'bg-white w-4' : 'bg-white/50'
            }`}
            aria-label={`Go to offer ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
