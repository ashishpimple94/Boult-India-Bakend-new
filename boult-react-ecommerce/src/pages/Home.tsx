import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Star, ShoppingCart } from 'lucide-react';
import BannerSlider from '../components/BannerSlider';
import { apiService } from '../services/api';

export default function Home() {
  const [featuredProducts, setFeaturedProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [visibleElements, setVisibleElements] = useState<string[]>([]);

  useEffect(() => {
    loadFeaturedProducts();
  }, []);

  const loadFeaturedProducts = async () => {
    try {
      // Fetch featured products from backend API
      const allProducts = await apiService.getProducts();
      
      if (allProducts && allProducts.length > 0) {
        // First try featured products
        let featured = allProducts.filter((p: any) => p.featured);
        
        // If no featured, take first 4
        if (featured.length === 0) {
          featured = allProducts.slice(0, 4);
        }
        
        // Normalize images
        const normalized = featured.slice(0, 4).map((p: any) => ({
          ...p,
          images: p.images?.length ? p.images : [p.image || '/placeholder-product.svg'],
          rating: p.rating || 4.5,
          reviews: p.reviews || 0
        }));
        
        setFeaturedProducts(normalized);
        console.log('✅ Loaded', normalized.length, 'featured products from API');
      }
    } catch (error) {
      console.error('❌ Failed to load featured products:', error);
      // Fallback to static
      setFeaturedProducts([
        { id: 'anti-rust-spray', name: 'Anti Rust Spray', price: 90, images: ['/Anti-Rust-Spray-500ml-Website-2.png'], rating: 4.6, reviews: 189, category: 'spray' },
        { id: 'battery-terminal-mask', name: 'Battery Terminal Mask', price: 265, images: ['/Battery-Terminal-Mask-front.png'], rating: 4.5, reviews: 156, category: 'mask' },
        { id: 'brake-parts-clean', name: 'Brake Parts Clean', price: 205, images: ['/Brake-Parts-front-clean.png'], rating: 4.6, reviews: 178, category: 'cleaner' },
        { id: 'all-in-one-polish', name: 'All in One Polish', price: 1800, images: ['/vkhj.png'], rating: 4.8, reviews: 245, category: 'polish' }
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setVisibleElements((prev) => {
            if (!prev.includes(entry.target.id)) {
              return [...prev, entry.target.id];
            }
            return prev;
          });
        }
      });
    }, { threshold: 0.1 });

    document.querySelectorAll('[data-scroll]').forEach((el) => {
      observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  const isVisible = (id: string) => visibleElements.includes(id);

  console.log('🔄 RENDER DEBUG: loading =', loading, ', products =', featuredProducts.length);

  return (
    <div className="space-y-12">
      {/* Banner Slider */}
      <section className="w-full">
        <BannerSlider />
      </section>

      {/* Featured Products - ANIMATED */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-12">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-orange-600 font-heading font-bold text-sm tracking-widest mb-2">DISCOVER</p>
              <h2 className="text-5xl font-heading font-bold text-gray-900">Featured Products</h2>
              <p className="text-gray-600 mt-3 text-lg font-body">Handpicked premium products for your vehicle care needs</p>
            </div>
            <Link 
              to="/products" 
              className="bg-gradient-to-r from-orange-500 to-orange-600 text-white px-8 py-3 font-heading font-bold hover:from-orange-600 hover:to-orange-700 transition transform hover:scale-105 shadow-lg"
            >
              View All →
            </Link>
          </div>
          <div className="h-1 w-20 bg-gradient-to-r from-orange-500 to-orange-600"></div>
        </div>

        {loading ? (
          <div className="text-center py-16">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
            <p className="text-gray-600 mt-4 font-semibold">Loading featured products...</p>
          </div>
        ) : featuredProducts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product, idx) => (
              <Link key={product.id} to={`/products/${product.id}`}>
                <div 
                  className="group bg-white shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-3 cursor-pointer h-full flex flex-col border-b-4 border-orange-200 hover:border-orange-500"
                >
                  {/* Image Container */}
                  <div className="relative h-64 bg-gradient-to-br from-gray-50 to-gray-100 overflow-hidden flex items-center justify-center">
                    <img
                      src={product.images[0] || '/placeholder-product.svg'}
                      alt={product.name}
                      className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-500"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = '/placeholder-product.svg';
                      }}
                    />
                    
                    {/* Overlay on hover */}
                    <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
                    
                    {/* Discount Badge */}
                    {product.onSale && product.discount && (
                      <div className="absolute top-4 right-4 bg-gradient-to-r from-red-600 to-red-500 text-white px-4 py-2 text-base font-bold shadow-2xl rounded-lg transform -rotate-3 border-2 border-white">
                        {Math.abs(product.discount)}% OFF
                      </div>
                    )}
                    
                    {/* Featured Badge */}
                    <div className="absolute top-4 left-4 bg-gradient-to-r from-orange-400 to-orange-500 text-white px-3 py-1.5 text-xs font-bold shadow-md rounded-md">
                      ⭐ FEATURED
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-5 flex-1 flex flex-col">
                    {/* Product Name */}
                    <h3 className="font-heading font-bold text-gray-900 mb-3 line-clamp-2 text-lg group-hover:text-orange-600 transition-colors">
                      {product.name}
                    </h3>
                    
                    {/* Rating */}
                    <div className="flex items-center gap-2 mb-4 pb-4 border-b border-gray-100">
                      <div className="flex gap-0.5">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            size={16}
                            className={i < Math.floor(product.rating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}
                          />
                        ))}
                      </div>
                      <span className="text-xs text-gray-600 font-body font-medium">
                        {product.rating}
                      </span>
                      <span className="text-xs text-gray-500 font-body">
                        ({product.reviews})
                      </span>
                    </div>

                    {/* Price Section */}
                    <div className="mb-5 flex-1">
                      <div className="flex items-baseline gap-2 flex-wrap">
                        {product.onSale && product.originalPrice && product.originalPrice > product.price ? (() => {
                          const discount = product.originalPrice - product.price;
                          const discountPercent = Math.round((discount / product.originalPrice) * 100);
                          
                          return (
                            <>
                              <span className="text-xl text-gray-400 line-through">₹{product.originalPrice}</span>
                              <span className="text-3xl font-heading font-bold text-orange-600">₹{product.price}</span>
                              <span className="bg-gradient-to-r from-orange-500 to-red-500 text-white text-sm font-bold px-2 py-1 rounded-full shadow">
                                ₹{discount} OFF
                              </span>
                              <span className="bg-green-500 text-white text-sm font-bold px-2 py-1 rounded-full">
                                {discountPercent}% OFF
                              </span>
                            </>
                          );
                        })() : (
                          <span className="text-3xl font-heading font-bold text-orange-600">₹{product.price}</span>
                        )}
                      </div>
                    </div>

                    {/* Button */}
                    <button className="w-full bg-gradient-to-r from-orange-500 to-orange-600 text-white py-3 font-heading font-bold hover:from-orange-600 hover:to-orange-700 transition-all duration-300 flex items-center justify-center gap-2 shadow-md hover:shadow-lg transform group-hover:scale-105">
                      <ShoppingCart size={20} />
                      <span>View Details</span>
                    </button>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 bg-red-50 border border-red-200">
            <p className="text-red-600 text-lg font-bold">❌ NO PRODUCTS FOUND!</p>
            <p className="text-red-500">Debug: {featuredProducts.length} products in array</p>
          </div>
        )}
      </section>

      {/* Banner Image 1 - After Featured Products */}
      <section className="w-full my-8">
        <div className="w-full">
          <img
            src="/Homebaner.png"
            alt="Boult Products Banner"
            className="w-full h-auto object-cover"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.style.display = 'none';
            }}
          />
        </div>
      </section>

      {/* Core Values Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-12">
          <div className="mb-8">
            <p className="text-orange-600 font-heading font-bold text-sm tracking-widest mb-2">OUR FOUNDATION</p>
            <h2 className="text-5xl font-heading font-bold text-gray-900 mb-3">Core Values</h2>
            <p className="text-gray-600 text-lg font-body">The principles that guide everything we do</p>
            <div className="h-1 w-20 bg-gradient-to-r from-orange-500 to-orange-600 mt-4"></div>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {[
            { title: 'Customer Centricity', description: 'We put our customers first in everything we do.' },
            { title: 'Techno-Driven Quality', description: 'We harness innovation and technology to deliver exceptional products' },
            { title: 'Integrity', description: 'We operate with transparency, honesty, and ethics.' },
            { title: 'Excellence', description: 'We strive for continuous improvement and operational excellence.' }
          ].map((value, idx) => (
            <div 
              key={idx} 
              className={`bg-white shadow-md p-6 hover:shadow-lg transition-all duration-300 border-b-4 border-orange-200 hover:border-orange-500 scroll-stagger ${isVisible(`value-${idx}`) ? 'visible' : ''}`}
              data-scroll
              id={`value-${idx}`}
            >
              <h3 className="text-lg font-heading font-bold text-orange-600 mb-3">{value.title}</h3>
              <p className="text-gray-600 text-sm font-body leading-relaxed">{value.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Banner Image 2 - After Core Values */}
      <section className="w-full my-8">
        <div className="w-full">
          <img
            src="/Homepagebaner2.png"
            alt="Boult Care Banner"
            className="w-full h-auto object-cover"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.style.display = 'none';
            }}
          />
        </div>
      </section>

      {/* Latest Blogs Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-12">
          <p className="text-orange-600 font-heading font-bold text-sm tracking-widest mb-2">INSIGHTS & TIPS</p>
          <h2 className="text-5xl font-heading font-bold text-gray-900 mb-3">Latest Blogs</h2>
          <p className="text-gray-600 text-lg font-body">Expert advice and tips for vehicle care</p>
          <div className="h-1 w-20 bg-gradient-to-r from-orange-500 to-orange-600 mt-4"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[
            {
              image: 'https://simbott.com/wp-content/uploads/2024/05/Automotive-Spray-Painting--1024x576.webp',
              title: 'Give Your Ride A New Life With Boult Spray Paint',
              subtitle: 'Restore, Refresh, Reimagine – The Power of Boult Spray Paint for Cars & Bikes'
            },
            {
              image: 'https://img.freepik.com/premium-photo/man-greasing-motorcycle-chain-close-up-hand_79405-13572.jpg',
              title: 'The Ultimate Duo For A Healthier Ride – Boult Chain Lubricant & Anti Rust Spray',
              subtitle: 'Smooth Chains, Rust-Free rides. The Essential Duo For Vehicle Maintenance.'
            },
            {
              image: 'https://img.freepik.com/premium-photo/engine-oil-splashing-isolated-white-background_1028938-293110.jpg',
              title: 'Keep Your Engine Younger, Longer With Boult Engine Oil Treatment',
              subtitle: 'More Miles, Less Trouble – The Engine Oil Upgrade Your Vehicle Needs'
            }
          ].map((blog, idx) => (
            <div 
              key={idx} 
              className={`bg-white shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 cursor-pointer group border-b-4 border-orange-200 hover:border-orange-500 scroll-scale-in ${isVisible(`blog-${idx}`) ? 'visible' : ''}`}
              data-scroll
              id={`blog-${idx}`}
            >
              <div className="h-48 overflow-hidden bg-gray-200">
                <img 
                  src={blog.image} 
                  alt={blog.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
              </div>
              <div className="p-6">
                <h3 className="text-lg font-heading font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-orange-600 transition-colors">{blog.title}</h3>
                <p className="text-sm text-gray-600 font-body line-clamp-2 mb-4">{blog.subtitle}</p>
                <a href="#" className="text-orange-600 font-body font-semibold hover:text-orange-700 transition flex items-center gap-2">
                  Read More →
                </a>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}