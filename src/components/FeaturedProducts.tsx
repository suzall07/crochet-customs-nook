
import { useState, useEffect } from 'react';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ProductCard, { Product } from './ProductCard';
import { Link } from 'react-router-dom';

const FeaturedProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    // Load products from localStorage
    try {
      const storedProducts = localStorage.getItem('products');
      if (storedProducts) {
        const allProducts = JSON.parse(storedProducts);
        // Filter for featured or new products - limit to 4
        const featuredProducts = allProducts.filter((p: Product) => p.isFeatured || p.isNew);
        
        if (featuredProducts.length > 0) {
          setProducts(featuredProducts.slice(0, 4));
        } else {
          setProducts([]);
        }
      } else {
        setProducts([]);
      }
    } catch (error) {
      console.error('Error loading products:', error);
      setProducts([]);
    }
  }, []);

  // Listen for product changes
  useEffect(() => {
    const handleStorageChange = () => {
      try {
        const storedProducts = localStorage.getItem('products');
        if (storedProducts) {
          const allProducts = JSON.parse(storedProducts);
          const featuredProducts = allProducts.filter((p: Product) => p.isFeatured || p.isNew);
          
          if (featuredProducts.length > 0) {
            setProducts(featuredProducts.slice(0, 4));
          } else {
            setProducts([]);
          }
        }
      } catch (error) {
        console.error('Error handling storage change:', error);
      }
    };

    window.addEventListener('storage', handleStorageChange);
    // Custom event for product updates
    window.addEventListener('productsUpdated', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('productsUpdated', handleStorageChange);
    };
  }, []);

  if (products.length === 0) {
    return null; // Don't show the section if there are no products
  }

  return (
    <section className="page-container bg-orange-50 py-16 rounded-lg">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-display font-medium text-amber-800">Featured Creations</h2>
        <p className="text-amber-700 mt-2 max-w-xl mx-auto">
          Discover our handpicked collection of unique crochet items
        </p>
      </div>
      
      <div className="product-grid">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} className="animate-scale-in" />
        ))}
      </div>
      
      <div className="mt-12 text-center">
        <Button 
          asChild
          className="primary-button px-8 py-2"
        >
          <Link to="/shop">
            View All Products
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </div>
    </section>
  );
};

export default FeaturedProducts;
