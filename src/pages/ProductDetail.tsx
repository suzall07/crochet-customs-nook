
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Star, ShoppingCart, Heart, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/components/ui/use-toast';
import WishlistButton from '@/components/WishlistButton';
import ProductImageGallery from '@/components/ProductImageGallery';
import { isCustomerLoggedIn, getCurrentCustomer } from '@/utils/authUtils';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    const loadProduct = () => {
      try {
        const products = JSON.parse(localStorage.getItem('products') || '[]');
        const foundProduct = products.find((p: any) => p.id === parseInt(id || '0'));
        
        if (foundProduct) {
          // Add multiple sample images for gallery demo
          const productWithImages = {
            ...foundProduct,
            images: [
              foundProduct.image,
              foundProduct.image, // Demo: duplicate for gallery
              foundProduct.image,
            ].filter(Boolean)
          };
          setProduct(productWithImages);
        }
      } catch (error) {
        console.error('Error loading product:', error);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      loadProduct();
    }
  }, [id]);

  const handleAddToCart = () => {
    if (!product) return;

    try {
      const customer = getCurrentCustomer();
      const cartKey = customer ? `cart_${customer.id}` : 'cart';
      const existingCart = JSON.parse(localStorage.getItem(cartKey) || '[]');
      
      const existingItemIndex = existingCart.findIndex((item: any) => item.id === product.id);
      
      if (existingItemIndex > -1) {
        existingCart[existingItemIndex].quantity += quantity;
      } else {
        existingCart.push({
          ...product,
          quantity: quantity
        });
      }
      
      localStorage.setItem(cartKey, JSON.stringify(existingCart));
      
      // Dispatch custom event to update cart count in header
      window.dispatchEvent(new Event('cartUpdated'));
      
      toast({
        title: "Added to Cart",
        description: `${product.name} has been added to your cart.`,
      });
    } catch (error) {
      console.error('Error adding to cart:', error);
      toast({
        title: "Error",
        description: "Failed to add item to cart.",
        variant: "destructive",
      });
    }
  };

  const formatPrice = (price: number) => {
    return `Rs. ${price.toLocaleString()}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-24 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading product...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen pt-24 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Product Not Found</h1>
          <p className="text-gray-600 mb-4">The product you're looking for doesn't exist.</p>
          <Button onClick={() => navigate('/shop')} className="bg-black hover:bg-gray-800">
            Back to Shop
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="container max-w-6xl mx-auto px-4">
        {/* Back Button */}
        <Button
          variant="ghost"
          onClick={() => navigate(-1)}
          className="mb-6 hover:bg-gray-100"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Product Images */}
          <div>
            <ProductImageGallery 
              images={product.images || [product.image]} 
              productName={product.name}
            />
          </div>

          {/* Product Information */}
          <div className="space-y-6">
            <div>
              <div className="flex items-start justify-between mb-2">
                <h1 className="text-3xl font-bold text-gray-900">{product.name}</h1>
                <WishlistButton 
                  productId={product.id} 
                  className="text-gray-400 hover:text-red-500"
                />
              </div>
              
              <div className="flex items-center space-x-4 mb-4">
                <span className="text-3xl font-bold text-gray-900">
                  {formatPrice(product.price)}
                </span>
                {product.category && (
                  <Badge variant="secondary" className="bg-gray-100 text-gray-800">
                    {product.category}
                  </Badge>
                )}
              </div>

              <div className="flex items-center space-x-2 mb-4">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-4 w-4 ${
                        i < 4 ? 'fill-gray-900 text-gray-900' : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-sm text-gray-600">(24 reviews)</span>
              </div>
            </div>

            <Separator />

            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Description</h3>
              <p className="text-gray-600 leading-relaxed">
                {product.description || 'This beautiful handmade crochet item is crafted with care and attention to detail. Perfect for adding a touch of warmth and personality to your home or wardrobe.'}
              </p>
            </div>

            <Separator />

            {/* Quantity and Add to Cart */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Quantity
                </label>
                <div className="flex items-center space-x-3">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="border-gray-300"
                  >
                    -
                  </Button>
                  <span className="text-lg font-medium w-12 text-center">{quantity}</span>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setQuantity(quantity + 1)}
                    className="border-gray-300"
                  >
                    +
                  </Button>
                </div>
              </div>

              <div className="flex space-x-4">
                <Button
                  onClick={handleAddToCart}
                  className="flex-1 bg-black hover:bg-gray-800 text-white"
                >
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  Add to Cart
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    handleAddToCart();
                    navigate('/cart');
                  }}
                  className="border-gray-300 hover:bg-gray-50"
                >
                  Buy Now
                </Button>
              </div>
            </div>

            <Separator />

            {/* Product Details */}
            <div>
              <h3 className="font-semibold text-gray-900 mb-3">Product Details</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Material:</span>
                  <span className="text-gray-900">100% Cotton Yarn</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Care Instructions:</span>
                  <span className="text-gray-900">Hand wash, lay flat to dry</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Handmade:</span>
                  <span className="text-gray-900">Yes</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Origin:</span>
                  <span className="text-gray-900">Nepal</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <div className="mt-16">
          <Card>
            <CardHeader>
              <CardTitle>Customer Reviews</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* Sample Review */}
                <div className="border-b pb-6">
                  <div className="flex items-center space-x-2 mb-2">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className="h-4 w-4 fill-gray-900 text-gray-900"
                        />
                      ))}
                    </div>
                    <span className="font-medium">Sarah K.</span>
                    <span className="text-sm text-gray-500">2 weeks ago</span>
                  </div>
                  <p className="text-gray-600">
                    "Absolutely beautiful craftsmanship! The quality is outstanding and it arrived exactly as pictured. Will definitely order again."
                  </p>
                </div>

                <div className="border-b pb-6">
                  <div className="flex items-center space-x-2 mb-2">
                    <div className="flex items-center">
                      {[...Array(4)].map((_, i) => (
                        <Star
                          key={i}
                          className="h-4 w-4 fill-gray-900 text-gray-900"
                        />
                      ))}
                      <Star className="h-4 w-4 text-gray-300" />
                    </div>
                    <span className="font-medium">Mike R.</span>
                    <span className="text-sm text-gray-500">1 month ago</span>
                  </div>
                  <p className="text-gray-600">
                    "Great product! My wife loves it. Fast shipping and excellent customer service."
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
