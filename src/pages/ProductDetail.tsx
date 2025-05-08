
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ShoppingCart, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import ProductCard, { Product } from '@/components/ProductCard';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';

interface Review {
  id: string;
  name: string;
  rating: number;
  comment: string;
  date: string;
}

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [product, setProduct] = useState<Product | null>(null);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [reviewName, setReviewName] = useState('');
  const [reviewComment, setReviewComment] = useState('');
  const [reviewRating, setReviewRating] = useState(5);
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const fallbackImage = "https://images.pexels.com/photos/6850711/pexels-photo-6850711.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1";

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    console.error('Failed to load product image, using fallback');
    e.currentTarget.src = fallbackImage;
  };

  // Check if customer is logged in
  useEffect(() => {
    const customerLoggedIn = localStorage.getItem('customerLoggedIn');
    if (customerLoggedIn === 'true') {
      setIsLoggedIn(true);
    }
  }, []);

  // Load all products first
  useEffect(() => {
    try {
      const storedProducts = localStorage.getItem('products');
      if (storedProducts) {
        setAllProducts(JSON.parse(storedProducts));
      } else {
        setAllProducts([]);
      }
    } catch (error) {
      console.error('Error loading products:', error);
      setAllProducts([]);
    }
  }, []);

  // Listen for product changes
  useEffect(() => {
    const handleStorageChange = () => {
      try {
        const storedProducts = localStorage.getItem('products');
        if (storedProducts) {
          setAllProducts(JSON.parse(storedProducts));
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

  // Find the current product and related products
  useEffect(() => {
    if (allProducts.length === 0 || !id) return;

    const foundProduct = allProducts.find(p => p.id === Number(id)) || null;
    setProduct(foundProduct);
    
    if (foundProduct) {
      const related = allProducts
        .filter(p => p.category === foundProduct.category && p.id !== foundProduct.id)
        .slice(0, 4);
      setRelatedProducts(related);
      
      const storedReviews = JSON.parse(localStorage.getItem(`product_reviews_${id}`) || '[]');
      setReviews(storedReviews);
    }
    
    window.scrollTo(0, 0);
    setImageLoaded(false);
  }, [id, allProducts]);

  const handleAddToCart = () => {
    if (!isLoggedIn) {
      toast({
        title: "Login Required",
        description: "Please login to add items to your cart.",
        variant: "destructive"
      });
      // Fix: Change the redirect URL to the correct path
      navigate('/login');
      return;
    }

    if (product) {
      const existingCart = JSON.parse(localStorage.getItem('cart') || '[]');
      
      if (!existingCart.some((item: Product) => item.id === product.id)) {
        const updatedCart = [...existingCart, product];
        localStorage.setItem('cart', JSON.stringify(updatedCart));
        
        toast({
          title: "Added to cart",
          description: `${product.name} has been added to your cart.`,
        });
        
        // Dispatch custom event to notify other components
        window.dispatchEvent(new Event('cartUpdated'));
      } else {
        toast({
          title: "Already in cart",
          description: `${product.name} is already in your cart.`,
        });
      }
    }
  };

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isLoggedIn) {
      toast({
        title: "Login Required",
        description: "Please login to leave a review.",
        variant: "destructive"
      });
      // Fix: Change the redirect URL to the correct path
      navigate('/login');
      return;
    }
    
    if (!reviewName.trim() || !reviewComment.trim()) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive"
      });
      return;
    }
    
    const newReview: Review = {
      id: Date.now().toString(),
      name: reviewName,
      rating: reviewRating,
      comment: reviewComment,
      date: new Date().toLocaleDateString()
    };
    
    const updatedReviews = [newReview, ...reviews];
    setReviews(updatedReviews);
    
    localStorage.setItem(`product_reviews_${id}`, JSON.stringify(updatedReviews));
    
    setReviewName('');
    setReviewComment('');
    setReviewRating(5);
    
    toast({
      title: "Review submitted",
      description: "Thank you for your feedback!"
    });
  };

  const getCurrentCustomer = () => {
    try {
      const customerData = localStorage.getItem('currentCustomer');
      if (customerData) {
        return JSON.parse(customerData);
      }
      return null;
    } catch (error) {
      console.error('Error getting customer data:', error);
      return null;
    }
  };

  useEffect(() => {
    // Prefill review name if customer is logged in
    const customer = getCurrentCustomer();
    if (customer && customer.name) {
      setReviewName(customer.name);
    }
  }, []);

  if (!product) {
    return (
      <div className="min-h-screen pt-24 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-medium mb-2">Product not found</h2>
          <Button onClick={() => navigate("/shop")} className="bg-amber-600 hover:bg-amber-700">Back to Shop</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="container mx-auto px-4">
        <Button 
          variant="ghost" 
          className="mb-6 text-amber-600 hover:bg-orange-50"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          <div className="rounded-lg overflow-hidden">
            {!imageLoaded && (
              <div className="w-full aspect-square bg-orange-100 animate-pulse" />
            )}
            <img 
              src={product.image} 
              alt={product.name} 
              className="w-full h-auto"
              loading="lazy"
              onLoad={() => setImageLoaded(true)}
              onError={handleImageError}
              style={{ display: imageLoaded ? "block" : "none" }}
            />
          </div>
          
          <div>
            <span className="text-sm text-muted-foreground">{product.category}</span>
            <h1 className="text-3xl font-medium mt-1 mb-2 text-amber-800">{product.name}</h1>
            <p className="text-2xl font-medium mb-6">Rs {product.price.toLocaleString()}</p>
            
            <div className="mb-8">
              <h3 className="text-lg font-medium mb-2">Description</h3>
              <p className="text-muted-foreground">
                {product.description || "This beautiful handmade crochet item is crafted with care and attention to detail. Made from high-quality materials, it's designed to last for years to come."}
              </p>
            </div>
            
            <div className="flex space-x-4">
              <Button 
                size="lg"
                className="flex-1 bg-amber-800 hover:bg-amber-900"
                onClick={handleAddToCart}
              >
                <ShoppingCart className="h-5 w-5 mr-2" />
                Add to Cart
              </Button>
            </div>
          </div>
        </div>
        
        <div className="mb-16">
          <h2 className="text-2xl font-medium mb-6 text-amber-800">Customer Reviews</h2>
          
          <div className="bg-orange-50 p-6 rounded-lg mb-8">
            <h3 className="text-lg font-medium mb-4">Leave a Review</h3>
            <form onSubmit={handleSubmitReview}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium mb-1">Your Name</label>
                  <Input 
                    id="name"
                    value={reviewName}
                    onChange={(e) => setReviewName(e.target.value)}
                    placeholder="Enter your name"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="rating" className="block text-sm font-medium mb-1">Rating</label>
                  <select 
                    id="rating"
                    className="w-full border border-orange-300 rounded-md px-3 py-2"
                    value={reviewRating}
                    onChange={(e) => setReviewRating(Number(e.target.value))}
                  >
                    <option value="5">5 Stars</option>
                    <option value="4">4 Stars</option>
                    <option value="3">3 Stars</option>
                    <option value="2">2 Stars</option>
                    <option value="1">1 Star</option>
                  </select>
                </div>
              </div>
              <div className="mb-4">
                <label htmlFor="comment" className="block text-sm font-medium mb-1">Your Review</label>
                <Textarea 
                  id="comment"
                  value={reviewComment}
                  onChange={(e) => setReviewComment(e.target.value)}
                  placeholder="Share your experience with this product"
                  rows={4}
                  required
                />
              </div>
              <Button 
                type="submit"
                className="bg-amber-600 hover:bg-amber-700"
              >
                Submit Review
              </Button>
              {!isLoggedIn && (
                <p className="mt-2 text-sm text-red-500">Please login to leave a review.</p>
              )}
            </form>
          </div>
          
          {reviews.length > 0 ? (
            <div className="space-y-6">
              {reviews.map((review) => (
                <div key={review.id} className="border-b border-gray-200 pb-6">
                  <div className="flex items-center mb-2">
                    <div className="font-medium">{review.name}</div>
                    <span className="mx-2 text-gray-400">•</span>
                    <div className="text-sm text-gray-500">{review.date}</div>
                  </div>
                  <div className="flex mb-2">
                    {[...Array(5)].map((_, i) => (
                      <svg 
                        key={i} 
                        className={`w-4 h-4 ${i < review.rating ? 'text-yellow-400' : 'text-gray-300'}`} 
                        fill="currentColor" 
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                      </svg>
                    ))}
                  </div>
                  <p className="text-black">{review.comment}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">No reviews yet. Be the first to review this product!</p>
          )}
        </div>
        
        {relatedProducts.length > 0 && (
          <div>
            <h2 className="text-2xl font-medium mb-6 text-amber-800">You might also like</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {relatedProducts.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        )}

        {/* Business Hours */}
        <div className="mt-16 p-6 bg-orange-50 rounded-lg border border-orange-100">
          <h2 className="text-xl font-medium mb-4 text-amber-800">Business Hours</h2>
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

export default ProductDetail;

