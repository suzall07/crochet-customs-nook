
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
        <h1 className="text-3xl font-display font-medium mb-2 text-blue-800">Shop</h1>
        <p className="text-blue-600 mb-8">Browse our collection of handmade crochet items</p>
        
        <Separator className="mb-8 bg-blue-200" />
        
        {products.length > 0 ? (
          <div className="product-grid">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-blue-50 rounded-lg">
            <p className="text-lg text-blue-700 mb-4">No products in this category yet.</p>
            <p className="text-blue-500">Products added to the "Shop" category will appear here.</p>
          </div>
        )}

        {/* Business Hours */}
        <div className="business-hours-card">
          <h2 className="text-xl font-medium mb-4 text-blue-800">Business Hours</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="mb-2"><span className="font-medium">Monday - Friday:</span> 9:00 AM - 6:00 PM</p>
              <p className="mb-2"><span className="font-medium">Saturday:</span> 10:00 AM - 4:00 PM</p>
              <p><span className="font-medium">Sunday:</span> Closed</p>
            </div>
            <div>
              <p className="mb-2"><span className="font-medium">Phone:</span> +1 (555) 123-4567</p>
              <p className="mb-2"><span className="font-medium">Email:</span> contact@crochetstudio.com</p>
              <p><span className="font-medium">Address:</span> 123 Yarn Street, Crafty City</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Shop;
