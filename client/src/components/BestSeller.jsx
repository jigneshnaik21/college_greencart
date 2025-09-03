import React, { useState, useEffect } from 'react'
import ProductCard from './ProductCard'
import { useAppContext } from '../context/AppContext';

// Emergency mobile products that will always be available
const EMERGENCY_MOBILE_PRODUCTS = [
  { 
    _id: 'mob-1', 
    name: 'Fresh Apples', 
    offerPrice: 120, 
    price: 150,
    image: ['https://images.unsplash.com/photo-1568702846914-96b305d2aaeb?w=300&h=200&fit=crop'], 
    category: 'fruits',
    inStock: true,
    rating: 4.5
  },
  { 
    _id: 'mob-2', 
    name: 'Organic Bananas', 
    offerPrice: 80, 
    price: 100,
    image: ['https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=300&h=200&fit=crop'], 
    category: 'fruits',
    inStock: true,
    rating: 4.3
  },
  { 
    _id: 'mob-3', 
    name: 'Fresh Milk', 
    offerPrice: 45, 
    price: 50,
    image: ['https://images.unsplash.com/photo-1563636619-e9143da7973b?w=300&h=200&fit=crop'], 
    category: 'dairy',
    inStock: true,
    rating: 4.8
  },
  { 
    _id: 'mob-4', 
    name: 'Whole Wheat Bread', 
    offerPrice: 35, 
    price: 40,
    image: ['https://images.unsplash.com/photo-1549931319-a545dcf3bc73?w=300&h=200&fit=crop'], 
    category: 'bakery',
    inStock: true,
    rating: 4.2
  },
  { 
    _id: 'mob-5', 
    name: 'Basmati Rice', 
    offerPrice: 180, 
    price: 200,
    image: ['https://images.unsplash.com/photo-1586201375761-83865001e31c?w=300&h=200&fit=crop'], 
    category: 'grains',
    inStock: true,
    rating: 4.6
  },
  { 
    _id: 'mob-6', 
    name: 'Fresh Tomatoes', 
    offerPrice: 40, 
    price: 50,
    image: ['https://images.unsplash.com/photo-1546094096-0df4bcaaa337?w=300&h=200&fit=crop'], 
    category: 'vegetables',
    inStock: true,
    rating: 4.1
  }
];

const BestSeller = () => {
    const { products } = useAppContext();
    const [mobileProducts, setMobileProducts] = useState([]);
    const [isMobile, setIsMobile] = useState(false);
    
    // Mobile detection
    useEffect(() => {
        const mobileCheck = /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
        setIsMobile(mobileCheck);
        
        if (mobileCheck) {
            console.log('🚨 EMERGENCY: Mobile detected, setting up fallback products');
            setMobileProducts(EMERGENCY_MOBILE_PRODUCTS);
        }
    }, []);
    
    // Determine which products to show
    let productsToShow = [];
    
    if (isMobile) {
        // On mobile, use fallback products if API products are empty
        const apiProducts = Array.isArray(products) ? products.filter(product => product.inStock) : [];
        
        if (apiProducts.length > 0) {
            console.log('✅ MOBILE: Using API products:', apiProducts.length);
            productsToShow = apiProducts.slice(0, 6);
        } else {
            console.log('🚨 MOBILE: No API products, using emergency fallback');
            productsToShow = mobileProducts.slice(0, 6);
        }
    } else {
        // Desktop: use API products
        productsToShow = Array.isArray(products) 
            ? products.filter((product) => product.inStock).slice(0, 5)
            : [];
    }
    
    console.log('📱 MOBILE DEBUG: Products to show:', productsToShow.length);
    
  return (
    <div className='mt-16'>
      <p className='text-2xl md:text-3xl font-medium'>Best Sellers</p>
      {isMobile && productsToShow.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <p>Loading products...</p>
        </div>
      )}
      <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 md:gap-6 lg:grid-cols-5 mt-6'>
        {productsToShow.map((product, index) => (
            <ProductCard key={product._id || index} product={product}/>
        ))}
      </div>
    </div>
  )
}

export default BestSeller
