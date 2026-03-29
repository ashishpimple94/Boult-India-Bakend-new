import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { ShoppingCart, ArrowLeft, Star, Check, Truck, Shield } from 'lucide-react';
import { products as staticProducts } from '../data/products';
import { apiService } from '../services/api';
import ReviewForm from '../components/ReviewForm';
import ReviewList from '../components/ReviewList';

export default function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [selectedVariant, setSelectedVariant] = useState(0);
  const [activeTab, setActiveTab] = useState('description');
  const [addedToCart, setAddedToCart] = useState(false);
  const [selectedImage, setSelectedImage] = useState(0);

  useEffect(() => {
    loadProduct();
    window.scrollTo(0, 0);
  }, [id]);

  const loadProduct = async () => {
    try {
      setLoading(true);
      
      // Try to fetch single product from backend first
      try {
        const backendProduct = await apiService.getProductById(id!);
        if (backendProduct) {
          const normalizedProduct = {
            ...backendProduct,
            images: backendProduct.images || (backendProduct.image ? [backendProduct.image] : ['/placeholder-product.svg']),
            rating: backendProduct.rating || 4.5,
            reviews: backendProduct.reviews || 0,
            variants: backendProduct.variants || [],
            directions: backendProduct.directions || [],
            benefits: backendProduct.benefits || []
          };
          setProduct(normalizedProduct);
          return;
        }
      } catch (error) {
        console.log('Backend product not found, trying static...');
      }
      
      // Fallback to static products
      const staticProduct = staticProducts.find(p => p.id === id);
      setProduct(staticProduct);
      
    } catch (error) {
      console.error('Error loading product:', error);
      // Final fallback to static products
      const staticProduct = staticProducts.find(p => p.id === id);
      setProduct(staticProduct);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
        <p className="text-gray-600 mt-4 font-semibold">Loading product...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
        <p className="text-gray-600 text-lg mb-4">Product not found</p>
        <button
          onClick={() => navigate('/products')}
          className="text-orange-600 hover:text-orange-700 font-semibold"
        >
          Back to Products
        </button>
      </div>
    );
  }

  const handleAddToCart = () => {
    const variantPrice = product.variants && product.variants.length > 0 && product.variants[selectedVariant]
      ? product.variants[selectedVariant].price 
      : product.price;
    addToCart({ ...product, price: variantPrice }, quantity);
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Back Button */}
      <button
        onClick={() => navigate('/products')}
        className="flex items-center gap-2 text-orange-600 hover:text-orange-700 mb-8 font-semibold"
      >
        <ArrowLeft size={20} />
        Back to Products
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Product Images */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl overflow-hidden flex items-center justify-center w-full h-[600px]">
            <img
              src={product.images[selectedImage] || '/placeholder-product.svg'}
              alt={product.name}
              className="w-full h-full object-contain"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                if (target.src !== '/placeholder-product.svg') {
                  target.src = '/placeholder-product.svg';
                }
              }}
              loading="lazy"
            />
          </div>
          {product.images.length > 1 && (
            <div className="grid grid-cols-6 gap-2">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(idx)}
                  className={`bg-gray-100 rounded-lg overflow-hidden cursor-pointer hover:opacity-75 transition h-24 border-2 ${
                    selectedImage === idx ? 'border-orange-500' : 'border-transparent hover:border-orange-300'
                  }`}
                >
                  <img 
                    src={img || '/placeholder-product.svg'} 
                    alt={`${product.name} ${idx}`} 
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      if (target.src !== '/placeholder-product.svg') {
                        target.src = '/placeholder-product.svg';
                      }
                    }}
                    loading="lazy"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Details */}
        <div className="lg:col-span-1 space-y-6">
          {/* Header */}
          <div>
            <div className="flex items-start justify-between mb-4">
              <div>
                <h1 className="text-4xl font-bold text-gray-900 mb-2">{product.name}</h1>
                <p className="text-gray-600 text-lg">{product.category}</p>
              </div>
              {product.onSale && product.discount && (
                <div className="bg-red-500 text-white px-4 py-2 rounded-lg font-bold text-lg">
                  {Math.abs(product.discount)}% OFF
                </div>
              )}
            </div>

            {/* Rating */}
            <div className="flex items-center gap-3 pb-4 border-b border-gray-200">
              <div className="flex gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={18}
                    className={i < Math.floor(product.rating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}
                  />
                ))}
              </div>
              <span className="font-semibold text-gray-900">{product.rating}</span>
              <span className="text-gray-600">({product.reviews} reviews)</span>
            </div>
          </div>

          {/* Price Section */}
          <div className="bg-gradient-to-r from-orange-50 to-orange-100 rounded-xl p-6 border border-orange-200">
            <p className="text-gray-600 text-sm mb-2">Price</p>
            <div className="flex items-baseline gap-3 flex-wrap">
              <span className="text-4xl font-bold text-orange-600">
                ₹{product.variants && product.variants.length > 0 && product.variants[selectedVariant] 
                  ? product.variants[selectedVariant].price 
                  : product.price}
              </span>
              {product.onSale && (product.discount || (product.originalPrice && product.originalPrice > product.price)) && (() => {
                const salePrice = product.price;
                const origPrice = (product.originalPrice && product.originalPrice > salePrice)
                  ? product.originalPrice
                  : product.discount
                    ? Math.round(salePrice / (1 - product.discount / 100))
                    : null;
                if (!origPrice) return null;
                const discount = origPrice - salePrice;
                const discountPercent = product.discount || Math.round((discount / origPrice) * 100);
                
                return (
                  <>
                    <span className="text-2xl text-gray-400 line-through">
                      ₹{origPrice}
                    </span>
                    <span className="bg-gradient-to-r from-orange-500 to-red-500 text-white font-bold text-lg px-4 py-2 rounded-full shadow-lg animate-pulse">
                      ₹{discount} OFF
                    </span>
                    <span className="bg-green-500 text-white font-bold text-sm px-3 py-1 rounded-full">
                      {discountPercent}% OFF
                    </span>
                  </>
                );
              })()}
            </div>
          </div>

          {/* Variants */}
          {product.variants && product.variants.length > 1 && (
            <div>
              <label className="block font-semibold text-gray-900 mb-3">Select Size/Variant:</label>
              <div className="grid grid-cols-2 gap-3">
                {product.variants.map((variant, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedVariant(idx)}
                    className={`p-3 rounded-lg border-2 font-semibold transition ${
                      selectedVariant === idx
                        ? 'border-orange-600 bg-orange-50 text-orange-600'
                        : 'border-gray-200 bg-white text-gray-700 hover:border-orange-300'
                    }`}
                  >
                    {variant.name}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Quantity Selector */}
          <div className="flex items-center gap-4">
            <label className="font-semibold text-gray-900">Quantity:</label>
            <div className="flex items-center border-2 border-gray-300 rounded-lg">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="px-4 py-2 text-gray-600 hover:bg-gray-100 font-bold text-lg"
              >
                −
              </button>
              <span className="px-6 py-2 font-bold text-lg">{quantity}</span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="px-4 py-2 text-gray-600 hover:bg-gray-100 font-bold text-lg"
              >
                +
              </button>
            </div>
          </div>

          {/* Add to Cart Button */}
          <button
            onClick={handleAddToCart}
            className={`w-full flex items-center justify-center gap-2 py-4 rounded-lg font-bold text-white text-lg transition-all duration-300 ${
              addedToCart
                ? 'bg-green-600 hover:bg-green-700'
                : 'bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 shadow-lg hover:shadow-xl'
            }`}
          >
            <ShoppingCart size={24} />
            {addedToCart ? 'Added to Cart ✓' : 'Add to Cart'}
          </button>

          {/* Trust Badges */}
          <div className="grid grid-cols-3 gap-4 pt-4 border-t border-gray-200">
            <div className="text-center">
              <Truck className="w-8 h-8 text-orange-600 mx-auto mb-2" />
              <p className="text-sm font-semibold text-gray-900">Fast Delivery</p>
            </div>
            <div className="text-center">
              <Shield className="w-8 h-8 text-orange-600 mx-auto mb-2" />
              <p className="text-sm font-semibold text-gray-900">Quality Assured</p>
            </div>
            <div className="text-center">
              <Check className="w-8 h-8 text-orange-600 mx-auto mb-2" />
              <p className="text-sm font-semibold text-gray-900">Authentic</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs Section */}
      <div className="mt-16 border-t border-gray-200 pt-12">
        <div className="flex gap-8 border-b border-gray-200 mb-8">
          {['description', 'directions', 'benefits', 'reviews'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-4 font-semibold text-lg capitalize transition ${
                activeTab === tab
                  ? 'text-orange-600 border-b-2 border-orange-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              {tab === 'reviews' ? `Reviews (${product.reviews || 0})` : tab}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="max-w-3xl">
          {activeTab === 'description' && (
            <div className="space-y-4">
              <p className="text-gray-700 text-lg leading-relaxed">{product.description}</p>
            </div>
          )}

          {activeTab === 'directions' && product.directions && (
            <div className="space-y-3">
              {product.directions.map((direction, idx) => (
                <div key={idx} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                  <span className="font-bold text-orange-600 flex-shrink-0 w-6 h-6 flex items-center justify-center bg-orange-100 rounded-full">
                    {idx + 1}
                  </span>
                  <span className="text-gray-700">{direction}</span>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'benefits' && product.benefits && (
            <div className="space-y-3">
              {product.benefits.map((benefit, idx) => (
                <div key={idx} className="flex items-start gap-3 p-3 bg-gradient-to-r from-orange-50 to-transparent rounded-lg border border-orange-100">
                  <Star size={20} className="text-yellow-400 fill-yellow-400 flex-shrink-0 mt-1" />
                  <span className="text-gray-700">{benefit}</span>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'reviews' && (
            <div className="space-y-8">
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-6">Customer Reviews</h3>
                <ReviewList productId={product.id} />
              </div>
              <div className="border-t border-gray-200 pt-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-6">Write a Review</h3>
                <ReviewForm productId={product.id} productName={product.name} onReviewSubmitted={loadProduct} />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
