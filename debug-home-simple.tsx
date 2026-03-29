import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

export default function DebugHome() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log('🚀 DEBUG: Component mounted');
    
    const testProducts = [
      { id: '1', name: 'Test Product 1', price: 100, images: ['/placeholder-product.svg'] },
      { id: '2', name: 'Test Product 2', price: 200, images: ['/placeholder-product.svg'] },
      { id: '3', name: 'Test Product 3', price: 300, images: ['/placeholder-product.svg'] },
      { id: '4', name: 'Test Product 4', price: 400, images: ['/placeholder-product.svg'] }
    ];
    
    console.log('📦 DEBUG: Setting products:', testProducts);
    setProducts(testProducts);
    setLoading(false);
    console.log('✅ DEBUG: Products set, loading false');
  }, []);

  console.log('🔄 DEBUG: Render - loading:', loading, 'products:', products.length);

  return (
    <div className="p-8">
      <h1 className="text-4xl font-bold mb-8">DEBUG: Featured Products</h1>
      
      {loading ? (
        <div className="text-center">
          <p>Loading...</p>
        </div>
      ) : products.length > 0 ? (
        <div className="grid grid-cols-4 gap-4">
          {products.map((product) => (
            <div key={product.id} className="border p-4 bg-white shadow">
              <h3 className="font-bold">{product.name}</h3>
              <p className="text-orange-600">₹{product.price}</p>
              <img src={product.images[0]} alt={product.name} className="w-full h-32 object-contain mt-2" />
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center">
          <p className="text-red-500">No products found!</p>
        </div>
      )}
    </div>
  );
}