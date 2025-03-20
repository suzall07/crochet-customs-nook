
import { useState, useEffect } from 'react';
import ProductCard, { Product } from '@/components/ProductCard';
import { Separator } from '@/components/ui/separator';

const Popular = () => {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    try {
      const storedProducts = localStorage.getItem('products');
      if (storedProducts) {
        const allProducts = JSON.parse(storedProducts);
        // Filter to show only "Popular Crochet" category products
        const popularProducts = allProducts.filter((p: Product) => p.category === "Popular Crochet");
        setProducts(popularProducts);
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
          const popularProducts = allProducts.filter((p: Product) => p.category === "Popular Crochet");
          setProducts(popularProducts);
        }
      } catch (error) {
        console.error('Error handling storage change:', error);
      }
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('productsUpdated', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('productsUpdated', handleStorageChange);
    };
  }, []);

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-display font-medium mb-2 text-amber-800">Popular Crochet Items</h1>
        <p className="text-amber-700 mb-8">Our most loved crochet items chosen by our customers</p>
        
        <Separator className="mb-8 bg-orange-200" />
        
        {products.length > 0 ? (
          <div className="product-grid">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-orange-50 rounded-lg">
            <p className="text-lg text-amber-700 mb-4">No products in this category yet.</p>
            <p className="text-amber-600">Products added to the "Popular Crochet" category will appear here.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Popular;
