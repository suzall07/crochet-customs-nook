
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
  isNew?: boolean;
  isFeatured?: boolean;
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
    
    try {
      // Get existing cart from localStorage or initialize empty array
      const existingCart = JSON.parse(localStorage.getItem('cart') || '[]');
      
      // Check if product is already in cart
      const isInCart = existingCart.some((item: {id: number}) => item.id === product.id);
      
      if (!isInCart) {
        // Add product to cart
        const updatedCart = [...existingCart, product];
        localStorage.setItem('cart', JSON.stringify(updatedCart));
        
        toast({
          title: "Added to cart",
          description: `${product.name} has been added to your cart.`,
        });
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
  
  // Fallback image - wool/yarn themed
  const fallbackImage = "https://images.pexels.com/photos/6850711/pexels-photo-6850711.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1";
  
  // Handle image loading error
  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    console.error('Failed to load product image, using fallback');
    e.currentTarget.src = fallbackImage;
  };

  return (
    <div 
      className={cn("relative rounded-lg shadow-sm", className)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Link to={`/product/${product.id}`} className="block">
        <div className="relative overflow-hidden rounded-lg aspect-[4/5]">
          {/* Skeleton loader */}
          {!imageLoaded && (
            <div className="absolute inset-0 bg-gray-200 animate-pulse" />
          )}
          
          {/* Product image with lazy loading */}
          <img 
            src={product.image} 
            alt={product.name}
            loading="lazy"
            onLoad={() => setImageLoaded(true)}
            onError={handleImageError}
            className={cn(
              "w-full h-full object-cover transition-transform duration-500",
              isHovered ? "scale-105" : "scale-100",
              !imageLoaded && "opacity-0"
            )}
          />
          
          {/* Badges */}
          <div className="absolute top-2 left-2 flex flex-col gap-1">
            {product.isNew && (
              <span className="bg-crochet-600 text-white text-xs font-medium px-2 py-1 rounded">
                New
              </span>
            )}
            {product.isFeatured && (
              <span className="bg-black text-white text-xs font-medium px-2 py-1 rounded">
                Featured
              </span>
            )}
          </div>
        </div>
        
        {/* Product info */}
        <div className="p-3">
          <div className="text-xs text-muted-foreground">
            {product.category}
          </div>
          <h3 className="font-medium text-base text-crochet-900 mb-1 truncate">
            {product.name}
          </h3>
          <div className="font-medium text-crochet-800">
            Rs {product.price.toLocaleString()}
          </div>
          
          {/* Quick actions */}
          <div className="mt-3 flex justify-end">
            <Button 
              size="sm"
              className="bg-crochet-800 hover:bg-crochet-900 text-white text-xs"
              onClick={handleAddToCart}
            >
              <ShoppingCart className="h-3 w-3 mr-1" />
              Add to Cart
            </Button>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default ProductCard;
