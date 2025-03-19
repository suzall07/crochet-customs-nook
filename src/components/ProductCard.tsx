
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Heart, Eye } from 'lucide-react';
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
  const { toast } = useToast();
  
  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    toast({
      title: "Added to cart",
      description: `${product.name} has been added to your cart.`,
    });
  };
  
  const handleAddToWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    toast({
      title: "Added to wishlist",
      description: `${product.name} has been added to your wishlist.`,
    });
  };

  return (
    <div 
      className={cn("product-card group", className)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Link to={`/product/${product.id}`} className="block">
        <div className="relative overflow-hidden rounded-lg aspect-[4/5]">
          {/* Product image with lazy loading and transition */}
          <img 
            src={product.image} 
            alt={product.name}
            loading="lazy"
            className={cn(
              "w-full h-full object-cover transition-transform duration-700",
              isHovered ? "scale-105" : "scale-100"
            )}
          />
          
          {/* Badges */}
          <div className="absolute top-4 left-4 flex flex-col gap-2">
            {product.isNew && (
              <span className="bg-crochet-600 text-white text-xs font-medium px-3 py-1 rounded">
                New
              </span>
            )}
            {product.isFeatured && (
              <span className="bg-black text-white text-xs font-medium px-3 py-1 rounded">
                Featured
              </span>
            )}
          </div>
          
          {/* Quick actions overlay */}
          <div className={cn(
            "absolute inset-0 bg-black/10 flex items-center justify-center opacity-0 transition-opacity duration-300",
            isHovered ? "opacity-100" : "opacity-0"
          )}>
            <Button
              variant="outline"
              size="icon"
              className="bg-white hover:bg-white/90 text-crochet-900"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                window.location.href = `/product/${product.id}`;
              }}
            >
              <Eye className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        {/* Product info */}
        <div className="pt-4 pb-2 px-1">
          <div className="text-xs text-muted-foreground mb-1">
            {product.category}
          </div>
          <h3 className="font-medium text-base sm:text-lg text-crochet-900 mb-1 truncate">
            {product.name}
          </h3>
          <div className="font-medium text-crochet-800">
            ${product.price.toFixed(2)}
          </div>
        </div>
        
        {/* Product actions */}
        <div className="product-actions">
          <Button 
            variant="outline"
            size="sm"
            className="bg-white hover:bg-white/90 text-crochet-900 border-crochet-200"
            onClick={handleAddToWishlist}
          >
            <Heart className="h-4 w-4 mr-2" />
            Wishlist
          </Button>
          
          <Button 
            size="sm"
            className="bg-crochet-800 hover:bg-crochet-900 text-white"
            onClick={handleAddToCart}
          >
            <ShoppingCart className="h-4 w-4 mr-2" />
            Add to Cart
          </Button>
        </div>
      </Link>
    </div>
  );
};

export default ProductCard;
