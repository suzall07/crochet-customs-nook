
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ShoppingCart, Heart, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import ProductCard, { Product } from '@/components/ProductCard';

// Mock data with updated images
const allProducts: Product[] = [
  {
    id: 1,
    name: "Hand-knit Wool Sweater",
    price: 8999,
    image: "https://images.unsplash.com/photo-1626847152055-9bb0635fa1ee?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
    category: "Sweaters",
    isFeatured: true
  },
  {
    id: 2,
    name: "Crochet Baby Blanket",
    price: 4500,
    image: "https://images.unsplash.com/photo-1532774788000-afc4d8ce089f?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
    category: "Blankets",
    isNew: true
  },
  {
    id: 3,
    name: "Handmade Beanie Hat",
    price: 2999,
    image: "https://images.unsplash.com/photo-1594750852562-203fb71f0b91?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
    category: "Hats",
    isFeatured: true
  },
  {
    id: 4,
    name: "Crochet Wall Hanging",
    price: 1999,
    image: "https://images.unsplash.com/photo-1601379327928-bedfaf9da2e0?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
    category: "Home Decor",
    isNew: true
  }
];

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [product, setProduct] = useState<Product | null>(null);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [cart, setCart] = useState<Product[]>([]);
  const [wishlist, setWishlist] = useState<Product[]>([]);

  useEffect(() => {
    // Find product by ID
    const foundProduct = allProducts.find(p => p.id === Number(id)) || null;
    setProduct(foundProduct);
    
    if (foundProduct) {
      // Get related products in the same category
      const related = allProducts
        .filter(p => p.category === foundProduct.category && p.id !== foundProduct.id)
        .slice(0, 4);
      setRelatedProducts(related);
    }
    
    // Scroll to top when product changes
    window.scrollTo(0, 0);
  }, [id]);

  const handleAddToCart = () => {
    if (product) {
      setCart(prev => [...prev, product]);
      
      toast({
        title: "Added to cart",
        description: `${product.name} has been added to your cart.`,
      });
    }
  };

  const handleAddToWishlist = () => {
    if (product) {
      setWishlist(prev => [...prev, product]);
      
      toast({
        title: "Added to wishlist",
        description: `${product.name} has been added to your wishlist.`,
      });
    }
  };

  if (!product) {
    return (
      <div className="min-h-screen pt-24 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-medium mb-2">Product not found</h2>
          <Button onClick={() => navigate("/shop")}>Back to Shop</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="container mx-auto px-4">
        <Button 
          variant="ghost" 
          className="mb-6"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          {/* Product Image */}
          <div className="rounded-lg overflow-hidden">
            {!imageLoaded && (
              <div className="w-full aspect-square bg-gray-200 animate-pulse" />
            )}
            <img 
              src={product.image} 
              alt={product.name} 
              className="w-full h-auto"
              loading="lazy"
              onLoad={() => setImageLoaded(true)}
              style={{ display: imageLoaded ? "block" : "none" }}
            />
          </div>
          
          {/* Product Info */}
          <div>
            <span className="text-sm text-muted-foreground">{product.category}</span>
            <h1 className="text-3xl font-medium mt-1 mb-2">{product.name}</h1>
            <p className="text-2xl font-medium mb-6">Rs {product.price.toLocaleString()}</p>
            
            <div className="mb-8">
              <h3 className="text-lg font-medium mb-2">Description</h3>
              <p className="text-muted-foreground">
                This beautiful handmade crochet item is crafted with care and attention to detail.
                Made from high-quality materials, it's designed to last for years to come.
              </p>
            </div>
            
            <div className="flex space-x-4">
              <Button 
                size="lg"
                className="flex-1 bg-crochet-800 hover:bg-crochet-900"
                onClick={handleAddToCart}
              >
                <ShoppingCart className="h-5 w-5 mr-2" />
                Add to Cart
              </Button>
              <Button 
                variant="outline" 
                size="lg"
                className="flex-1"
                onClick={handleAddToWishlist}
              >
                <Heart className="h-5 w-5 mr-2" />
                Add to Wishlist
              </Button>
            </div>
          </div>
        </div>
        
        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div>
            <h2 className="text-2xl font-medium mb-6">You might also like</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {relatedProducts.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetail;
