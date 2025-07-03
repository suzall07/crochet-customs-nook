
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useToast } from '@/components/ui/use-toast';

export interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
  category: string;
  description?: string;
  isNew?: boolean;
  isFeatured?: boolean;
  stock?: number;
}

interface ProductCardProps {
  product: Product;
  className?: string;
}

const ProductCard = ({ product, className }: ProductCardProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const { toast } = useToast();
  
  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Check stock availability
    if (product.stock !== undefined && product.stock <= 0) {
      toast({
        title: "Out of stock",
        description: `${product.name} is currently out of stock.`,
        variant: "destructive"
      });
      return;
    }
    
    try {
      const existingCart = JSON.parse(localStorage.getItem('cart') || '[]');
      
      const isInCart = existingCart.some((item: {id: number}) => item.id === product.id);
      
      if (!isInCart) {
        const updatedCart = [...existingCart, product];
        localStorage.setItem('cart', JSON.stringify(updatedCart));
        
        // Update product stock
        if (product.stock !== undefined) {
          const products = JSON.parse(localStorage.getItem('products') || '[]');
          const updatedProducts = products.map((p: Product) => 
            p.id === product.id ? { ...p, stock: p.stock! - 1 } : p
          );
          localStorage.setItem('products', JSON.stringify(updatedProducts));
          window.dispatchEvent(new Event('productsUpdated'));
        }
        
        toast({
          title: "Added to cart",
          description: `${product.name} has been added to your cart.`,
        });
        
        window.dispatchEvent(new Event('cartUpdated'));
      } else {
        toast({
          title: "Already in cart",
          description: `${product.name} is already in your cart.`,
        });
      }
    } catch (error) {
      console.error('Error adding to cart:', error);
      toast({
        title: "Error",
        description: "Could not add item to cart. Please try again.",
        variant: "destructive"
      });
    }
  };
  
  const fallbackImage = "https://images.pexels.com/photos/6850711/pexels-photo-6850711.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1";
  
  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    console.error('Failed to load product image, using fallback');
    e.currentTarget.src = fallbackImage;
  };

  const isOutOfStock = product.stock !== undefined && product.stock <= 0;
  const isLowStock = product.stock !== undefined && product.stock > 0 && product.stock <= 5;

  return (
    <div 
      className={cn("relative rounded-lg shadow-sm bg-white", className)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Link to={`/products/${product.id}`} className="block">
        <div className="relative overflow-hidden rounded-t-lg aspect-[4/5]">
          {!imageLoaded && (
            <div className="absolute inset-0 bg-orange-50 animate-pulse" />
          )}
          
          <img 
            src={product.image} 
            alt={product.name}
            loading="lazy"
            onLoad={() => setImageLoaded(true)}
            onError={handleImageError}
            className={cn(
              "w-full h-full object-cover transition-transform duration-500",
              isHovered ? "scale-105" : "scale-100",
              !imageLoaded && "opacity-0",
              isOutOfStock && "grayscale opacity-75"
            )}
          />
          
          <div className="absolute top-2 left-2 flex flex-col gap-1">
            {product.isNew && (
              <span className="bg-orange-200 text-orange-800 text-xs font-medium px-2 py-1 rounded">
                New
              </span>
            )}
            {product.isFeatured && (
              <span className="bg-accent text-accent-foreground text-xs font-medium px-2 py-1 rounded">
                Featured
              </span>
            )}
            {isOutOfStock && (
              <span className="bg-red-500 text-white text-xs font-medium px-2 py-1 rounded">
                Out of Stock
              </span>
            )}
            {isLowStock && (
              <span className="bg-yellow-500 text-white text-xs font-medium px-2 py-1 rounded">
                Low Stock
              </span>
            )}
          </div>
        </div>
        
        <div className="p-4">
          <div className="text-xs text-orange-500 font-medium">
            {product.category}
          </div>
          <h3 className="font-medium text-base text-amber-900 mb-1 truncate">
            {product.name}
          </h3>
          <div className="font-medium text-amber-800">
            Rs {product.price.toLocaleString()}
          </div>
          
          {product.stock !== undefined && (
            <div className="text-xs text-gray-600 mt-1">
              Stock: {product.stock} left
            </div>
          )}
          
          <div className="mt-3 flex justify-end">
            <Button 
              size="sm"
              className={cn(
                "text-xs",
                isOutOfStock 
                  ? "bg-gray-400 hover:bg-gray-400 cursor-not-allowed" 
                  : "bg-amber-800 hover:bg-amber-900 text-white"
              )}
              onClick={handleAddToCart}
              disabled={isOutOfStock}
            >
              <ShoppingCart className="h-3 w-3 mr-1" />
              {isOutOfStock ? "Out of Stock" : "Add to Cart"}
            </Button>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default ProductCard;
