import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { apiService } from '../services/api';

interface Banner {
  id: string;
  title: string;
  image: string;
  link?: string;
  active: boolean;
  order: number;
}

// Fallback banners if API fails
const fallbackBanners: Banner[] = [
  {
    id: '1',
    title: 'Boult Banner 1',
    image: '/Bner1.png',
    active: true,
    order: 0
  },
  {
    id: '2',
    title: 'Boult Banner 2',
    image: '/baner2.jpg',
    active: true,
    order: 1
  },
  {
    id: '3',
    title: 'Boult Banner 3',
    image: '/baner3.png',
    active: true,
    order: 2
  },
  {
    id: '4',
    title: 'Boult Banner 4',
    image: '/baner4.jpg',
    active: true,
    order: 3
  },
  {
    id: '5',
    title: 'Boult Banner 5',
    image: '/baner5.png',
    active: true,
    order: 4
  }
];

export default function BannerSlider() {
  const [banners, setBanners] = useState<Banner[]>(fallbackBanners);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [autoPlay, setAutoPlay] = useState(true);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadBanners();
  }, []);

  const loadBanners = async () => {
    try {
      const data = await apiService.getBanners();
      if (data && data.length > 0) {
        setBanners(data);
        console.log('✅ Loaded', data.length, 'banners from API');
      } else {
        console.log('⚠️ No banners from API, using fallback');
        setBanners(fallbackBanners);
      }
    } catch (error) {
      console.error('Error loading banners:', error);
      setBanners(fallbackBanners);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!autoPlay || banners.length === 0) return;
    
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % banners.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [autoPlay, banners.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % banners.length);
    setAutoPlay(false);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + banners.length) % banners.length);
    setAutoPlay(false);
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
    setAutoPlay(false);
  };

  if (loading || banners.length === 0) {
    return (
      <div className="relative w-screen left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] h-[180px] sm:h-[280px] md:h-96 lg:h-[500px] bg-gray-200 flex items-center justify-center">
        <div className="text-gray-500">Loading banners...</div>
      </div>
    );
  }

  return (
    <div className="relative w-screen left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] h-[180px] sm:h-[280px] md:h-96 lg:h-[500px] bg-gray-900 overflow-hidden group">
      {/* Slides */}
      <div className="relative w-full h-full">
        {banners.map((banner, index) => (
          <div
            key={banner.id}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              index === currentSlide ? 'opacity-100' : 'opacity-0'
            }`}
          >
            {banner.link ? (
              <a href={banner.link} className="block w-full h-full">
                <img
                  src={banner.image}
                  alt={banner.title}
                  className="w-full h-full object-contain object-center"
                />
              </a>
            ) : (
              <img
                src={banner.image}
                alt={banner.title}
                className="w-full h-full object-contain object-center"
              />
            )}
            {/* Overlay */}
            <div className="absolute inset-0 bg-black opacity-20"></div>
          </div>
        ))}
      </div>

      {/* Previous Button */}
      <button
        onClick={prevSlide}
        className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 z-10 bg-white/80 hover:bg-white text-gray-900 p-1.5 sm:p-2 rounded-full transition-all duration-300 opacity-50 sm:opacity-0 sm:group-hover:opacity-100"
        aria-label="Previous slide"
      >
        <ChevronLeft size={20} className="sm:w-6 sm:h-6" />
      </button>

      {/* Next Button */}
      <button
        onClick={nextSlide}
        className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 z-10 bg-white/80 hover:bg-white text-gray-900 p-1.5 sm:p-2 rounded-full transition-all duration-300 opacity-50 sm:opacity-0 sm:group-hover:opacity-100"
        aria-label="Next slide"
      >
        <ChevronRight size={20} className="sm:w-6 sm:h-6" />
      </button>

      {/* Dots */}
      <div className="absolute bottom-3 sm:bottom-4 left-1/2 -translate-x-1/2 z-10 flex gap-1.5 sm:gap-2">
        {banners.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full transition-all duration-300 ${
              index === currentSlide
                ? 'bg-orange-600 w-6 sm:w-8'
                : 'bg-white/50 hover:bg-white/75'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>

      {/* Slide Counter */}
      <div className="absolute top-2 sm:top-4 right-2 sm:right-4 z-10 bg-black/50 text-white px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-xs sm:text-sm font-semibold">
        {currentSlide + 1} / {banners.length}
      </div>
    </div>
  );
}
