import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, Filter, Grid3x3, List } from 'lucide-react';
import { products as staticProducts, Product } from '../data/products';
import { apiService } from '../services/api';

export default function Products() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const categories = ['all', 'soap', 'cleaner', 'lubricant', 'treatment', 'kit', 'cloth', 'restorer', 'coolant', 'repellent', 'paint', 'wash', 'dresser', 'spray', 'mask', 'polish', 'coating', 'test'];

  useEffect(() => {
    loadAllProducts();
  }, []);

  const loadAllProducts = async () => {
    try {
      setLoading(true);
      
      // Fetch products from backend API
      const backendProducts = await apiService.getProducts();
      console.log('📦 Raw backend products:', backendProducts);
      console.log('📦 Backend products count:', backendProducts?.length);
      
      // Check if backend products exist and are valid
      if (!backendProducts || !Array.isArray(backendProducts) || backendProducts.length === 0) {
        console.warn('⚠️ Backend returned no products, using static products:', staticProducts.length);
        setProducts(staticProducts);
        return;
      }
      
      // Normalize backend products - backend now returns full URLs
      const normalizedProducts = backendProducts.map(p => {
        const imageUrl = p.image || '/placeholder-product.svg';
        
        return {
          ...p,
          images: p.images || [imageUrl],
          image: imageUrl,
          rating: p.rating || 4.5,
          reviews: p.reviews || 0,
          variants: p.variants || []
        };
      });
      
      console.log('✅ Normalized products:', normalizedProducts.length);
      console.log('✅ First product image:', normalizedProducts[0]?.image);
      setProducts(normalizedProducts);
      
    } catch (error) {
      console.error('❌ Error loading products:', error);
      // Fallback to static products
      console.log('🔄 Falling back to static products:', staticProducts.length);
      setProducts(staticProducts);
    } finally {
      setLoading(false);
    }
  };

  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <div className="mb-12">
        <h1 className="text-5xl font-heading font-bold text-gray-900 mb-3">Our Products</h1>
        <p className="text-gray-600 text-lg font-body">Discover our complete range of premium vehicle care products</p>
      </div>

      {/* Search and Filter */}
      <div className="bg-white shadow-lg p-6 mb-8 space-y-4 border-b-4 border-orange-500">
        <div className="flex gap-4 flex-col md:flex-row md:items-center">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-3.5 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 focus:outline-none focus:border-orange-500 transition font-body"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter size={20} className="text-orange-600" />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-3 border-2 border-gray-200 focus:outline-none focus:border-orange-500 transition font-semibold text-gray-700 bg-white cursor-pointer hover:border-orange-300"
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat === 'all' ? 'All Categories' : cat.charAt(0).toUpperCase() + cat.slice(1)}
                </option>
              ))}
            </select>
          </div>
          <div className="flex gap-2 border-l-2 border-gray-200 pl-4">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 transition ${viewMode === 'grid' ? 'bg-orange-100 text-orange-600' : 'text-gray-600 hover:text-orange-600'}`}
              title="Grid View"
            >
              <Grid3x3 size={20} />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 transition ${viewMode === 'list' ? 'bg-orange-100 text-orange-600' : 'text-gray-600 hover:text-orange-600'}`}
              title="List View"
            >
              <List size={20} />
            </button>
          </div>
        </div>
        <div className="text-sm text-gray-600 font-body">
          Showing <span className="font-heading font-bold text-orange-600">{filteredProducts.length}</span> products
        </div>
      </div>

      {/* Products Grid/List */}
      {loading ? (
        <div className="text-center py-16">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
          <p className="text-gray-600 mt-4 font-semibold">Loading products...</p>
        </div>
      ) : filteredProducts.length > 0 ? (
        <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6' : 'space-y-4'}>
          {filteredProducts.map((product) => (
            <Link
              key={product.id}
              to={`/products/${product.id}`}
              className={viewMode === 'grid' ? 
                'group bg-white shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border-b-2 border-orange-200 hover:border-orange-500' :
                'group bg-white shadow-lg p-6 hover:shadow-2xl transition-all duration-300 flex gap-6 border-b-2 border-orange-200 hover:border-orange-500'
              }
            >
              {viewMode === 'grid' ? (
                <>
                  <div className="h-56 bg-gradient-to-br from-gray-50 to-gray-100 overflow-hidden flex items-center justify-center relative">
                    <img
                      src={product.images[0] || '/placeholder-product.svg'}
                      alt={product.name}
                      className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-300"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        if (target.src !== '/placeholder-product.svg') {
                          target.src = '/placeholder-product.svg';
                        }
                      }}
                      loading="lazy"
                    />
                    {product.onSale && product.discount && (
                      <div className="absolute top-3 right-3 bg-gradient-to-r from-red-600 to-red-500 text-white px-4 py-2 text-base font-bold shadow-2xl rounded-lg transform -rotate-3 border-2 border-white">
                        {Math.abs(product.discount)}% OFF
                      </div>
                    )}
                    {product.featured && (
                      <div className="absolute top-3 left-3 bg-gradient-to-r from-orange-600 to-orange-500 text-white px-3 py-1.5 text-xs font-bold shadow-lg rounded-md">
                        ⭐ FEATURED
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="font-heading font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-orange-600 transition">{product.name}</h3>
                    <p className="text-sm text-gray-600 font-body mb-3 line-clamp-2">{product.description}</p>
                    
                    <div className="flex items-center gap-1 mb-3">
                      <span className="text-yellow-400">★</span>
                      <span className="text-sm font-body font-semibold text-gray-900">{product.rating}</span>
                      <span className="text-xs text-gray-500 font-body">({product.reviews})</span>
                    </div>

                    {/* Price with Offer Display */}
                    {product.onSale && (product.discount || (product.originalPrice && product.originalPrice > product.price)) ? (() => {
                      // Calculate original price from discount if not set properly
                      const salePrice = product.price;
                      const origPrice = (product.originalPrice && product.originalPrice > salePrice) 
                        ? product.originalPrice 
                        : product.discount 
                          ? Math.round(salePrice / (1 - product.discount / 100))
                          : null;
                      const discountAmt = origPrice ? origPrice - salePrice : 0;
                      const discountPct = product.discount || (origPrice ? Math.round((discountAmt / origPrice) * 100) : 0);
                      
                      return origPrice ? (
                        <div className="space-y-2">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-sm text-gray-400 line-through">₹{origPrice}</span>
                            <span className="text-xl font-heading font-bold text-orange-600">₹{salePrice}</span>
                          </div>
                          <div className="flex items-center gap-1 flex-wrap">
                            <span className="bg-gradient-to-r from-orange-500 to-red-500 text-white text-xs font-bold px-2 py-1 rounded-full shadow-sm">
                              ₹{discountAmt} OFF
                            </span>
                            <span className="bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-full shadow-sm">
                              {discountPct}% OFF
                            </span>
                            <span className="text-xs bg-orange-100 text-orange-700 px-2 py-1 font-body font-semibold">
                              {product.category}
                            </span>
                          </div>
                        </div>
                      ) : (
                        <div className="flex justify-between items-center">
                          <span className="text-lg font-heading font-bold text-orange-600">₹{salePrice}</span>
                          <span className="text-xs bg-orange-100 text-orange-700 px-2 py-1 font-body font-semibold">
                            {product.category}
                          </span>
                        </div>
                      );
                    })() : (
                      <div className="flex justify-between items-center">
                        <span className="text-lg font-heading font-bold text-orange-600">₹{product.price}</span>
                        <span className="text-xs bg-orange-100 text-orange-700 px-2 py-1 font-body font-semibold">
                          {product.category}
                        </span>
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <>
                  <div className="w-32 h-32 bg-gradient-to-br from-gray-50 to-gray-100 flex-shrink-0 overflow-hidden flex items-center justify-center relative">
                    <img
                      src={product.images[0] || '/placeholder-product.svg'}
                      alt={product.name}
                      className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-300"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        if (target.src !== '/placeholder-product.svg') {
                          target.src = '/placeholder-product.svg';
                        }
                      }}
                      loading="lazy"
                    />
                    {product.onSale && product.discount && (
                      <div className="absolute top-2 right-2 bg-gradient-to-r from-red-600 to-red-500 text-white px-3 py-1.5 text-sm font-bold shadow-xl rounded-lg border-2 border-white">
                        {Math.abs(product.discount)}% OFF
                      </div>
                    )}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-heading font-bold text-lg text-gray-900 mb-2 group-hover:text-orange-600 transition">{product.name}</h3>
                    <p className="text-sm text-gray-600 font-body mb-3">{product.description}</p>
                    
                    <div className="flex items-center gap-4 mb-3">
                      <div className="flex items-center gap-1">
                        <span className="text-yellow-400">★</span>
                        <span className="text-sm font-semibold text-gray-900">{product.rating}</span>
                        <span className="text-xs text-gray-500">({product.reviews})</span>
                      </div>
                      <span className="text-xs bg-orange-100 text-orange-700 px-3 py-1 font-semibold">
                        {product.category}
                      </span>
                    </div>

                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2 flex-wrap">
                        {product.onSale && product.originalPrice && product.originalPrice > product.price ? (
                          <>
                            <span className="text-lg text-gray-400 line-through">₹{product.originalPrice}</span>
                            <span className="text-2xl font-bold text-orange-600">₹{product.price}</span>
                            {(() => {
                              const discount = product.originalPrice - product.price;
                              const discountPercent = Math.round((discount / product.originalPrice) * 100);
                              
                              // Show both badges for all discounts
                              return (
                                <>
                                  <span className="bg-gradient-to-r from-orange-500 to-red-500 text-white text-xs font-bold px-2 py-1 rounded-full shadow">
                                    ₹{discount} OFF
                                  </span>
                                  <span className="bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                                    {discountPercent}% OFF
                                  </span>
                                </>
                              );
                            })()}
                          </>
                        ) : (
                          <span className="text-2xl font-bold text-orange-600">₹{product.price}</span>
                        )}
                      </div>
                      <button className="bg-gradient-to-r from-orange-500 to-orange-600 text-white px-6 py-2 font-bold hover:from-orange-600 hover:to-orange-700 transition transform hover:scale-105 shadow-md">
                        View Details
                      </button>
                    </div>
                  </div>
                </>
              )}
            </Link>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-gray-50">
          <p className="text-gray-600 text-lg font-semibold">No products found</p>
          <p className="text-gray-500 mt-2">Try adjusting your search or filter criteria</p>
        </div>
      )}
    </div>
  );
}
