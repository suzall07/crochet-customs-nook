
import { useState, useEffect } from 'react';
import ProductCard, { Product } from '@/components/ProductCard';
import { Separator } from '@/components/ui/separator';

const Shop = () => {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    try {
      const storedProducts = localStorage.getItem('products');
      if (storedProducts) {
        const allProducts = JSON.parse(storedProducts);
        // Filter to show only "Shop" category products
        const shopProducts = allProducts.filter((p: Product) => p.category === "Shop");
        setProducts(shopProducts);
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
          const shopProducts = allProducts.filter((p: Product) => p.category === "Shop");
          setProducts(shopProducts);
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
        <h1 className="text-3xl font-display font-medium mb-2 text-black">Shop</h1>
        <p className="text-gray-600 mb-8">Browse our collection of handmade crochet items</p>
        
        <Separator className="mb-8 bg-gray-200" />
        
        {products.length > 0 ? (
          <div className="product-grid">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <p className="text-lg text-black mb-4">No products in this category yet.</p>
            <p className="text-gray-500">Products added to the "Shop" category will appear here.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Shop;
