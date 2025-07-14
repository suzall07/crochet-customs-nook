
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { X, Minus, Plus, ShoppingBag, ArrowLeft, Trash } from 'lucide-react';
import { Product } from '@/components/ProductCard';
import { initiateKhaltiPayment } from '@/lib/khalti';

interface CartItem extends Product {
  quantity: number;
}

const Cart = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    zipCode: '',
    paymentMethod: 'cash-on-delivery'
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    loadCartItems();
    
    // Listen for storage events to update cart when it changes
    const handleStorageChange = () => {
      loadCartItems();
    };
    
    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('cartUpdated', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('cartUpdated', handleStorageChange);
    };
  }, []);

  const loadCartItems = () => {
    try {
      const storedCart = localStorage.getItem('cart');
      if (storedCart) {
        const parsedCart = JSON.parse(storedCart);
        
        // Convert simple cart to cart with quantities
        const cartWithQuantities: CartItem[] = [];
        parsedCart.forEach((item: Product) => {
          const existingItem = cartWithQuantities.find(i => i.id === item.id);
          if (existingItem) {
            existingItem.quantity += 1;
          } else {
            cartWithQuantities.push({ ...item, quantity: 1 });
          }
        });
        
        setCartItems(cartWithQuantities);
      } else {
        setCartItems([]);
      }
    } catch (error) {
      console.error('Error loading cart:', error);
      setCartItems([]);
    }
  };

  const updateQuantity = (id: number, newQuantity: number) => {
    if (newQuantity < 1) return;
    
    const updatedCart = cartItems.map(item => 
      item.id === id ? { ...item, quantity: newQuantity } : item
    );
    
    setCartItems(updatedCart);
    
    // Convert cartItems with quantities back to simple product array for storage
    const simplifiedCart: Product[] = [];
    updatedCart.forEach(item => {
      for (let i = 0; i < item.quantity; i++) {
        simplifiedCart.push({ ...item });
      }
    });
    
    localStorage.setItem('cart', JSON.stringify(simplifiedCart));
    
    // Dispatch custom event to notify other components
    window.dispatchEvent(new Event('cartUpdated'));
  };

  const removeItem = (id: number) => {
    const updatedCart = cartItems.filter(item => item.id !== id);
    setCartItems(updatedCart);
    
    // Convert cartItems with quantities back to simple product array for storage
    const simplifiedCart: Product[] = [];
    updatedCart.forEach(item => {
      for (let i = 0; i < item.quantity; i++) {
        simplifiedCart.push({ ...item });
      }
    });
    
    localStorage.setItem('cart', JSON.stringify(simplifiedCart));
    
    toast({
      title: "Item Removed",
      description: "Item has been removed from your cart."
    });
    
    // Dispatch custom event to notify other components
    window.dispatchEvent(new Event('cartUpdated'));
  };

  const clearCart = () => {
    setCartItems([]);
    localStorage.removeItem('cart');
    
    toast({
      title: "Cart Cleared",
      description: "All items have been removed from your cart."
    });
    
    // Dispatch custom event to notify other components
    window.dispatchEvent(new Event('cartUpdated'));
  };

  const calculateSubtotal = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const calculateTotal = () => {
    const subtotal = calculateSubtotal();
    return subtotal; // Can add tax, shipping etc. here
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCheckout = () => {
    setIsCheckingOut(true);
  };

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    
    try {
      // Create order details
      const orderId = `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 5).toUpperCase()}`;
      const newOrder = {
        id: orderId,
        customer: {
          name: formData.name,
          email: formData.email,
          address: `${formData.address}, ${formData.city}, ${formData.zipCode}`
        },
        items: cartItems,
        total: calculateTotal(),
        status: 'pending',
        date: new Date().toISOString(),
        paymentMethod: formData.paymentMethod
      };

      if (formData.paymentMethod === 'khalti') {
        // Process Khalti payment
        await initiateKhaltiPayment({
          amount: calculateTotal(),
          purchaseOrderId: orderId,
          purchaseOrderName: `Order ${orderId}`,
          customerInfo: {
            name: formData.name,
            email: formData.email,
          },
        });

        // Save order to localStorage before redirecting
        const existingOrders = JSON.parse(localStorage.getItem('orders') || '[]');
        localStorage.setItem('orders', JSON.stringify([...existingOrders, newOrder]));
        
        // Note: The Khalti library will handle redirecting to payment success page
        setIsProcessing(false);
      } else {
        // Handle other payment methods (cash on delivery, bank transfer)
        setTimeout(() => {
          // Save order to localStorage
          const existingOrders = JSON.parse(localStorage.getItem('orders') || '[]');
          localStorage.setItem('orders', JSON.stringify([...existingOrders, newOrder]));
          
          // Clear the cart
          localStorage.removeItem('cart');
          
          // Show success message
          toast({
            title: "Order Placed Successfully!",
            description: `Your order #${newOrder.id} has been placed. Thank you for shopping with us!`,
          });
          
          // Redirect to home page
          setIsProcessing(false);
          navigate('/');
          
          // Dispatch custom event to notify other components
          window.dispatchEvent(new Event('cartUpdated'));
        }, 2000);
      }
    } catch (error: any) {
      console.error('Error placing order:', error);
      toast({
        title: "Payment Error",
        description: error.message || "Failed to process payment. Please try again.",
        variant: "destructive"
      });
      setIsProcessing(false);
    }
  };

  // Handle the empty cart state
  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen pt-24 pb-16">
        <div className="container max-w-4xl mx-auto px-4">
          <div className="text-center py-12">
            <ShoppingBag className="h-16 w-16 mx-auto text-crochet-300 mb-4" />
            <h1 className="text-2xl font-medium mb-2">Your cart is empty</h1>
            <p className="text-muted-foreground mb-6">Start adding items to your cart and they will appear here</p>
            <Button 
              onClick={() => navigate('/shop')}
              className="bg-crochet-800"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Continue Shopping
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="container max-w-6xl mx-auto px-4">
        <h1 className="text-3xl font-medium mb-2">Your Cart</h1>
        <p className="text-muted-foreground mb-6">Review and checkout your items</p>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items Section */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader className="pb-3">
                <div className="flex justify-between items-center">
                  <CardTitle>Items ({cartItems.reduce((total, item) => total + item.quantity, 0)})</CardTitle>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={clearCart}
                    className="text-red-500"
                  >
                    <Trash className="h-4 w-4 mr-1" />
                    Clear Cart
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {cartItems.map((item) => (
                  <div key={item.id} className="mb-4">
                    <div className="flex items-center">
                      <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="h-full w-full object-cover object-center"
                        />
                      </div>
                      <div className="ml-4 flex-1">
                        <div className="flex justify-between">
                          <h3 className="text-base font-medium text-crochet-900">
                            {item.name}
                          </h3>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => removeItem(item.id)}
                            className="h-6 w-6 text-gray-400 hover:text-red-500"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                        <p className="mt-1 text-sm text-muted-foreground">{item.category}</p>
                        <div className="flex items-center justify-between mt-2">
                          <div className="flex items-center border rounded-md">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              className="h-8 w-8 rounded-none"
                              disabled={item.quantity <= 1}
                            >
                              <Minus className="h-3 w-3" />
                            </Button>
                            <span className="w-8 text-center">{item.quantity}</span>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className="h-8 w-8 rounded-none"
                            >
                              <Plus className="h-3 w-3" />
                            </Button>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-medium">
                              Rs {(item.price * item.quantity).toLocaleString()}
                            </p>
                            {item.quantity > 1 && (
                              <p className="text-xs text-muted-foreground">
                                (Rs {item.price.toLocaleString()} each)
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                    <Separator className="my-4" />
                  </div>
                ))}
                <div className="flex justify-between">
                  <Button 
                    variant="outline"
                    onClick={() => navigate('/shop')}
                  >
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Continue Shopping
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Order Summary Section */}
          <div className="lg:col-span-1">
            {!isCheckingOut ? (
              <Card>
                <CardHeader>
                  <CardTitle>Order Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between text-sm">
                    <span>Subtotal</span>
                    <span>Rs {calculateSubtotal().toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Shipping</span>
                    <span>Free</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between font-medium">
                    <span>Total</span>
                    <span>Rs {calculateTotal().toLocaleString()}</span>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button 
                    className="w-full bg-crochet-800"
                    onClick={handleCheckout}
                  >
                    Proceed to Checkout
                  </Button>
                </CardFooter>
              </Card>
            ) : (
              <Card>
                <CardHeader>
                  <CardTitle>Checkout</CardTitle>
                  <CardDescription>Please fill in your details to complete your order</CardDescription>
                </CardHeader>
                <form onSubmit={handlePlaceOrder}>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <label htmlFor="name" className="text-sm font-medium">Full Name *</label>
                      <input
                        id="name"
                        name="name"
                        type="text"
                        required
                        value={formData.name}
                        onChange={handleInputChange}
                        className="w-full p-2 border rounded-md"
                        placeholder="Enter your full name"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <label htmlFor="email" className="text-sm font-medium">Email Address *</label>
                      <input
                        id="email"
                        name="email"
                        type="email"
                        required
                        value={formData.email}
                        onChange={handleInputChange}
                        className="w-full p-2 border rounded-md"
                        placeholder="Enter your email"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <label htmlFor="phone" className="text-sm font-medium">Phone Number *</label>
                      <input
                        id="phone"
                        name="phone"
                        type="tel"
                        required
                        value={formData.phone}
                        onChange={handleInputChange}
                        className="w-full p-2 border rounded-md"
                        placeholder="Enter your phone number"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <label htmlFor="address" className="text-sm font-medium">Delivery Address *</label>
                      <textarea
                        id="address"
                        name="address"
                        required
                        value={formData.address}
                        onChange={handleInputChange}
                        className="w-full p-2 border rounded-md"
                        rows={3}
                        placeholder="Enter your full address"
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label htmlFor="city" className="text-sm font-medium">City *</label>
                        <input
                          id="city"
                          name="city"
                          type="text"
                          required
                          value={formData.city}
                          onChange={handleInputChange}
                          className="w-full p-2 border rounded-md"
                          placeholder="City"
                        />
                      </div>
                      <div className="space-y-2">
                        <label htmlFor="zipCode" className="text-sm font-medium">Zip Code *</label>
                        <input
                          id="zipCode"
                          name="zipCode"
                          type="text"
                          required
                          value={formData.zipCode}
                          onChange={handleInputChange}
                          className="w-full p-2 border rounded-md"
                          placeholder="Zip code"
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <label htmlFor="paymentMethod" className="text-sm font-medium">Payment Method *</label>
                      <select
                        id="paymentMethod"
                        name="paymentMethod"
                        required
                        value={formData.paymentMethod}
                        onChange={handleInputChange}
                        className="w-full p-2 border rounded-md"
                      >
                        <option value="cash-on-delivery">Cash on Delivery</option>
                        <option value="khalti">Khalti Digital Payment</option>
                        <option value="bank-transfer">Bank Transfer</option>
                      </select>
                    </div>
                    
                    <Separator />
                    
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Subtotal</span>
                        <span>Rs {calculateSubtotal().toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Shipping</span>
                        <span>Free</span>
                      </div>
                      <div className="flex justify-between font-medium text-base">
                        <span>Total</span>
                        <span>Rs {calculateTotal().toLocaleString()}</span>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="flex flex-col space-y-2">
                    <Button 
                      type="submit"
                      className="w-full bg-crochet-800"
                      disabled={isProcessing}
                    >
                      {isProcessing ? (
                        <>
                          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Processing...
                        </>
                      ) : (
                        'Place Order'
                      )}
                    </Button>
                    <Button 
                      type="button"
                      variant="outline"
                      className="w-full"
                      onClick={() => setIsCheckingOut(false)}
                      disabled={isProcessing}
                    >
                      Back to Cart
                    </Button>
                  </CardFooter>
                </form>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
