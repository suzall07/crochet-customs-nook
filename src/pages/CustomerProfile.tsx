
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Package, Heart, Settings, ShoppingBag, MapPin, Calendar, Star } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { isCustomerLoggedIn, getCurrentCustomer, logoutCustomer } from '@/utils/authUtils';
import { getCustomerOrders, Order } from '@/utils/orderUtils';

const CustomerProfile = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [customer, setCustomer] = useState<any>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [wishlistItems, setWishlistItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const initializeProfile = async () => {
      try {
        // Check if customer is logged in
        if (!isCustomerLoggedIn()) {
          navigate('/login');
          return;
        }
        
        const customerData = getCurrentCustomer();
        if (customerData) {
          // Ensure customer has joinDate
          const enhancedCustomer = {
            ...customerData,
            joinDate: customerData.joinDate || customerData.createdAt || new Date().toISOString()
          };
          setCustomer(enhancedCustomer);
          await loadCustomerData(enhancedCustomer.id);
        } else {
          navigate('/login');
        }
      } catch (error) {
        console.error('Error initializing profile:', error);
        toast({
          title: "Error",
          description: "Failed to load profile data.",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    initializeProfile();
  }, [navigate, toast]);
  
  const loadCustomerData = async (customerId: string) => {
    try {
      // Load orders
      const customerOrders = getCustomerOrders(customerId);
      setOrders(customerOrders);
      
      // Load wishlist
      const wishlist = JSON.parse(localStorage.getItem(`wishlist_${customerId}`) || '[]');
      const products = JSON.parse(localStorage.getItem('products') || '[]');
      const wishlistProducts = products.filter((product: any) => 
        wishlist.includes(product.id)
      );
      setWishlistItems(wishlistProducts);
    } catch (error) {
      console.error('Error loading customer data:', error);
    }
  };
  
  const handleLogout = () => {
    try {
      logoutCustomer();
      toast({
        title: "Logged Out",
        description: "You have been successfully logged out.",
      });
      navigate('/');
    } catch (error) {
      console.error('Error during logout:', error);
      toast({
        title: "Error",
        description: "There was an issue logging out.",
        variant: "destructive"
      });
    }
  };
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered': return 'bg-green-100 text-green-800 border-green-200';
      case 'shipped': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'confirmed': return 'bg-orange-100 text-orange-800 border-orange-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };
  
  const getStatusText = (status: string) => {
    switch (status) {
      case 'confirmed': return 'Order Confirmed';
      case 'shipped': return 'Shipped';
      case 'delivered': return 'Delivered';
      default: return status.charAt(0).toUpperCase() + status.slice(1);
    }
  };
  
  const formatPrice = (price: number) => {
    return `Rs. ${price.toLocaleString()}`;
  };

  const getMemberSince = () => {
    if (!customer?.joinDate) return new Date().getFullYear();
    return new Date(customer.joinDate).getFullYear();
  };

  const getTotalSpent = () => {
    return orders.reduce((total, order) => total + order.total, 0);
  };

  const getReviewsCount = () => {
    return JSON.parse(localStorage.getItem(`reviews_${customer?.id}`) || '[]').length;
  };
  
  if (loading) {
    return (
      <div className="min-h-screen pt-24 flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-gray-600 font-medium">Loading your profile...</p>
        </div>
      </div>
    );
  }

  if (!customer) {
    return (
      <div className="min-h-screen pt-24 flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <p className="text-gray-600">Unable to load profile data.</p>
          <Button onClick={() => navigate('/login')} className="mt-4">
            Go to Login
          </Button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen pt-24 pb-16 bg-gray-50">
      <div className="container max-w-6xl mx-auto px-4">
        {/* Welcome Header */}
        <div className="mb-8 bg-white rounded-xl p-8 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-6">
              <div className="w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center shadow-inner">
                <User className="h-10 w-10 text-gray-600" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-1">Welcome back, {customer.name}!</h1>
                <p className="text-gray-600 font-medium">Member since {getMemberSince()}</p>
                <p className="text-sm text-gray-500 mt-1">{customer.email}</p>
              </div>
            </div>
            <Button 
              variant="outline" 
              onClick={handleLogout}
              className="border-gray-300 hover:bg-gray-50 font-medium"
            >
              Sign Out
            </Button>
          </div>
        </div>
        
        {/* Account Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="hover:shadow-lg transition-all duration-200 bg-white border border-gray-100">
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-3 bg-orange-100 rounded-xl">
                  <Package className="h-6 w-6 text-orange-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Orders</p>
                  <p className="text-2xl font-bold text-gray-900">{orders.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="hover:shadow-lg transition-all duration-200 bg-white border border-gray-100">
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-3 bg-green-100 rounded-xl">
                  <ShoppingBag className="h-6 w-6 text-green-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Spent</p>
                  <p className="text-2xl font-bold text-gray-900">{formatPrice(getTotalSpent())}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="hover:shadow-lg transition-all duration-200 bg-white border border-gray-100">
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-3 bg-red-100 rounded-xl">
                  <Heart className="h-6 w-6 text-red-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Wishlist Items</p>
                  <p className="text-2xl font-bold text-gray-900">{wishlistItems.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="hover:shadow-lg transition-all duration-200 bg-white border border-gray-100">
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-3 bg-blue-100 rounded-xl">
                  <Star className="h-6 w-6 text-blue-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Reviews Written</p>
                  <p className="text-2xl font-bold text-gray-900">{getReviewsCount()}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Main Content Tabs */}
        <Tabs defaultValue="orders" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 bg-white border border-gray-200 shadow-sm">
            <TabsTrigger value="orders" className="data-[state=active]:bg-gray-100 font-medium">Order History</TabsTrigger>
            <TabsTrigger value="wishlist" className="data-[state=active]:bg-gray-100 font-medium">My Wishlist</TabsTrigger>
            <TabsTrigger value="profile" className="data-[state=active]:bg-gray-100 font-medium">Account Settings</TabsTrigger>
          </TabsList>
          
          <TabsContent value="orders" className="space-y-4">
            <Card className="bg-white border border-gray-100 shadow-sm">
              <CardHeader className="border-b border-gray-100">
                <CardTitle className="flex items-center text-xl">
                  <Package className="h-5 w-5 mr-2" />
                  Your Order History
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                {orders.length === 0 ? (
                  <div className="text-center py-16">
                    <ShoppingBag className="h-20 w-20 text-gray-300 mx-auto mb-6" />
                    <h3 className="text-xl font-semibold text-gray-900 mb-3">No orders yet</h3>
                    <p className="text-gray-600 mb-8 max-w-md mx-auto">
                      You haven't placed any orders with us yet. Start shopping to build your order history and enjoy our handcrafted products!
                    </p>
                    <Button 
                      onClick={() => navigate('/shop')} 
                      className="bg-black hover:bg-gray-800 text-white px-8 py-3 font-medium"
                    >
                      Start Shopping
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {orders.map((order) => (
                      <div key={order.id} className="border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow bg-gradient-to-r from-gray-50 to-white">
                        <div className="flex items-center justify-between mb-6">
                          <div className="flex items-center space-x-4">
                            <div>
                              <p className="font-bold text-gray-900 text-lg">Order #{order.id}</p>
                              <div className="flex items-center text-sm text-gray-600 mt-2">
                                <Calendar className="h-4 w-4 mr-2" />
                                <span>Placed on {order.date}</span>
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <Badge className={`${getStatusColor(order.status)} mb-3 px-3 py-1 font-medium`}>
                              {getStatusText(order.status)}
                            </Badge>
                            <p className="text-2xl font-bold text-gray-900">
                              {formatPrice(order.total)}
                            </p>
                          </div>
                        </div>
                        
                        <div className="border-t border-gray-200 pt-6">
                          <h4 className="font-semibold text-gray-900 mb-4">Items Ordered:</h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {order.items.map((item) => (
                              <div key={item.id} className="flex items-center space-x-4 bg-white p-4 rounded-lg border border-gray-100 hover:shadow-sm transition-shadow">
                                <img 
                                  src={item.image} 
                                  alt={item.name}
                                  className="w-14 h-14 object-cover rounded-lg"
                                />
                                <div className="flex-1 min-w-0">
                                  <p className="text-sm font-semibold text-gray-900 truncate">
                                    {item.name}
                                  </p>
                                  <p className="text-sm text-gray-600 mt-1">
                                    Qty: {item.quantity} • {formatPrice(item.price)}
                                  </p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        {order.shippingAddress && (
                          <div className="border-t border-gray-200 pt-6 mt-6">
                            <div className="flex items-start space-x-3">
                              <MapPin className="h-5 w-5 text-gray-500 mt-0.5" />
                              <div>
                                <p className="text-sm font-semibold text-gray-900 mb-1">Shipping Address:</p>
                                <p className="text-sm text-gray-600 leading-relaxed">
                                  {order.shippingAddress.street}, {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zip}
                                </p>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="wishlist" className="space-y-4">
            <Card className="bg-white border border-gray-100 shadow-sm">
              <CardHeader className="border-b border-gray-100">
                <CardTitle className="flex items-center text-xl">
                  <Heart className="h-5 w-5 mr-2" />
                  My Wishlist
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                {wishlistItems.length === 0 ? (
                  <div className="text-center py-16">
                    <Heart className="h-20 w-20 text-gray-300 mx-auto mb-6" />
                    <h3 className="text-xl font-semibold text-gray-900 mb-3">Your wishlist is empty</h3>
                    <p className="text-gray-600 mb-8 max-w-md mx-auto">
                      Save your favorite handcrafted items for later by clicking the heart icon on products you love!
                    </p>
                    <Button 
                      onClick={() => navigate('/shop')} 
                      className="bg-black hover:bg-gray-800 text-white px-8 py-3 font-medium"
                    >
                      Browse Products
                    </Button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {wishlistItems.map((item) => (
                      <div key={item.id} className="border border-gray-200 rounded-xl p-5 hover:shadow-lg transition-all duration-200 bg-gradient-to-b from-white to-gray-50">
                        <img 
                          src={item.image} 
                          alt={item.name}
                          className="w-full h-48 object-cover rounded-lg mb-4"
                        />
                        <h3 className="font-semibold text-gray-900 mb-2">{item.name}</h3>
                        <p className="text-lg font-bold text-gray-900 mb-4">
                          {formatPrice(item.price)}
                        </p>
                        <Button 
                          size="sm" 
                          className="w-full bg-black hover:bg-gray-800 text-white font-medium"
                          onClick={() => navigate(`/products/${item.id}`)}
                        >
                          View Product
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="profile" className="space-y-4">
            <Card className="bg-white border border-gray-100 shadow-sm">
              <CardHeader className="border-b border-gray-100">
                <CardTitle className="flex items-center text-xl">
                  <Settings className="h-5 w-5 mr-2" />
                  Account Information
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                      Full Name
                    </label>
                    <div className="text-gray-900 bg-gray-50 px-4 py-3 rounded-lg border border-gray-200">
                      {customer.name}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                      Email Address
                    </label>
                    <div className="text-gray-900 bg-gray-50 px-4 py-3 rounded-lg border border-gray-200">
                      {customer.email}
                    </div>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Customer ID
                  </label>
                  <div className="text-gray-500 bg-gray-50 px-4 py-3 rounded-lg border border-gray-200 font-mono text-sm">
                    {customer.id}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Member Since
                  </label>
                  <div className="text-gray-900 bg-gray-50 px-4 py-3 rounded-lg border border-gray-200">
                    {new Date(customer.joinDate || new Date()).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </div>
                </div>
                
                <div className="pt-6 border-t border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Account Support</h3>
                  <p className="text-gray-600 mb-6 leading-relaxed">
                    Need help with your account? Have questions about your orders or want to update your information? Our support team is here to help you with any concerns.
                  </p>
                  <Button 
                    variant="outline" 
                    onClick={() => navigate('/contact')}
                    className="border-gray-300 hover:bg-gray-50 font-medium"
                  >
                    Contact Support
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default CustomerProfile;
