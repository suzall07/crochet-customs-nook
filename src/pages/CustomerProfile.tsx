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
  
  useEffect(() => {
    // Check if customer is logged in
    if (!isCustomerLoggedIn()) {
      navigate('/login');
      return;
    }
    
    const customerData = getCurrentCustomer();
    if (customerData) {
      setCustomer(customerData);
      loadCustomerData(customerData.id);
    }
  }, [navigate]);
  
  const loadCustomerData = (customerId: string) => {
    // Load only real orders (no sample data)
    const customerOrders = getCustomerOrders(customerId);
    setOrders(customerOrders);
    
    // Load wishlist
    const wishlist = JSON.parse(localStorage.getItem(`wishlist_${customerId}`) || '[]');
    const products = JSON.parse(localStorage.getItem('products') || '[]');
    const wishlistProducts = products.filter((product: any) => 
      wishlist.includes(product.id)
    );
    setWishlistItems(wishlistProducts);
  };
  
  const handleLogout = () => {
    logoutCustomer();
    toast({
      title: "Logged Out",
      description: "You have been successfully logged out.",
    });
    navigate('/');
  };
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered': return 'bg-green-100 text-green-800 border-green-200';
      case 'shipped': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'confirmed': return 'bg-orange-100 text-orange-800 border-orange-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };
  
  const formatPrice = (price: number) => {
    return `Rs. ${price.toLocaleString()}`;
  };

  const getMemberSince = () => {
    const joinDate = customer?.joinDate || new Date().toISOString();
    return new Date(joinDate).getFullYear();
  };
  
  if (!customer) {
    return (
      <div className="min-h-screen pt-24 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading your account...</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen pt-24 pb-16 bg-gray-50">
      <div className="container max-w-6xl mx-auto px-4">
        {/* Welcome Header */}
        <div className="mb-8 bg-white rounded-lg p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center">
                <User className="h-8 w-8 text-gray-600" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Welcome back, {customer.name}!</h1>
                <p className="text-gray-600 mt-1">Member since {getMemberSince()}</p>
                <p className="text-sm text-gray-500">{customer.email}</p>
              </div>
            </div>
            <Button 
              variant="outline" 
              onClick={handleLogout}
              className="border-gray-300 hover:bg-gray-50"
            >
              Sign Out
            </Button>
          </div>
        </div>
        
        {/* Account Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="hover:shadow-md transition-shadow bg-white">
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-3 bg-orange-100 rounded-full">
                  <Package className="h-6 w-6 text-orange-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Orders</p>
                  <p className="text-2xl font-bold text-gray-900">{orders.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="hover:shadow-md transition-shadow bg-white">
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-3 bg-red-100 rounded-full">
                  <Heart className="h-6 w-6 text-red-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Wishlist Items</p>
                  <p className="text-2xl font-bold text-gray-900">{wishlistItems.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="hover:shadow-md transition-shadow bg-white">
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-3 bg-blue-100 rounded-full">
                  <Star className="h-6 w-6 text-blue-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Reviews Written</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {JSON.parse(localStorage.getItem(`reviews_${customer.id}`) || '[]').length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Main Content Tabs */}
        <Tabs defaultValue="orders" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 bg-white border">
            <TabsTrigger value="orders" className="data-[state=active]:bg-gray-100">Order History</TabsTrigger>
            <TabsTrigger value="wishlist" className="data-[state=active]:bg-gray-100">My Wishlist</TabsTrigger>
            <TabsTrigger value="profile" className="data-[state=active]:bg-gray-100">Account Settings</TabsTrigger>
          </TabsList>
          
          <TabsContent value="orders" className="space-y-4">
            <Card className="bg-white">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Package className="h-5 w-5 mr-2" />
                  Your Order History
                </CardTitle>
              </CardHeader>
              <CardContent>
                {orders.length === 0 ? (
                  <div className="text-center py-12">
                    <ShoppingBag className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-xl font-medium text-gray-900 mb-2">No orders yet</h3>
                    <p className="text-gray-600 mb-6">
                      You haven't placed any orders with us yet. Start shopping to build your order history!
                    </p>
                    <Button 
                      onClick={() => navigate('/shop')} 
                      className="bg-black hover:bg-gray-800 text-white px-6 py-2"
                    >
                      Start Shopping
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {orders.map((order) => (
                      <div key={order.id} className="border rounded-lg p-6 hover:shadow-sm transition-shadow bg-gray-50">
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center space-x-4">
                            <div>
                              <p className="font-semibold text-gray-900 text-lg">Order #{order.id}</p>
                              <div className="flex items-center text-sm text-gray-600 mt-1">
                                <Calendar className="h-4 w-4 mr-1" />
                                <span>Placed on {order.date}</span>
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <Badge className={`${getStatusColor(order.status)} mb-2`}>
                              {order.status === 'confirmed' ? 'Order Confirmed' : 
                               order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                            </Badge>
                            <p className="text-xl font-bold text-gray-900">
                              {formatPrice(order.total)}
                            </p>
                          </div>
                        </div>
                        
                        <div className="border-t pt-4">
                          <h4 className="font-medium text-gray-900 mb-3">Items Ordered:</h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {order.items.map((item) => (
                              <div key={item.id} className="flex items-center space-x-3 bg-white p-3 rounded border">
                                <img 
                                  src={item.image} 
                                  alt={item.name}
                                  className="w-12 h-12 object-cover rounded"
                                />
                                <div className="flex-1 min-w-0">
                                  <p className="text-sm font-medium text-gray-900 truncate">
                                    {item.name}
                                  </p>
                                  <p className="text-sm text-gray-600">
                                    Qty: {item.quantity} • {formatPrice(item.price)}
                                  </p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        {order.shippingAddress && (
                          <div className="border-t pt-4 mt-4">
                            <div className="flex items-start space-x-2">
                              <MapPin className="h-4 w-4 text-gray-500 mt-0.5" />
                              <div>
                                <p className="text-sm font-medium text-gray-900">Shipping Address:</p>
                                <p className="text-sm text-gray-600">
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
            <Card className="bg-white">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Heart className="h-5 w-5 mr-2" />
                  My Wishlist
                </CardTitle>
              </CardHeader>
              <CardContent>
                {wishlistItems.length === 0 ? (
                  <div className="text-center py-12">
                    <Heart className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-xl font-medium text-gray-900 mb-2">Your wishlist is empty</h3>
                    <p className="text-gray-600 mb-6">
                      Save your favorite items for later by clicking the heart icon on products!
                    </p>
                    <Button 
                      onClick={() => navigate('/shop')} 
                      className="bg-black hover:bg-gray-800 text-white px-6 py-2"
                    >
                      Browse Products
                    </Button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {wishlistItems.map((item) => (
                      <div key={item.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow bg-gray-50">
                        <img 
                          src={item.image} 
                          alt={item.name}
                          className="w-full h-48 object-cover rounded-lg mb-3"
                        />
                        <h3 className="font-medium text-gray-900 mb-1">{item.name}</h3>
                        <p className="text-lg font-bold text-gray-900 mb-3">
                          {formatPrice(item.price)}
                        </p>
                        <Button 
                          size="sm" 
                          className="w-full bg-black hover:bg-gray-800 text-white"
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
            <Card className="bg-white">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Settings className="h-5 w-5 mr-2" />
                  Account Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name
                    </label>
                    <div className="text-gray-900 bg-gray-50 px-4 py-3 rounded-lg border">
                      {customer.name}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address
                    </label>
                    <div className="text-gray-900 bg-gray-50 px-4 py-3 rounded-lg border">
                      {customer.email}
                    </div>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Customer ID
                  </label>
                  <div className="text-gray-500 bg-gray-50 px-4 py-3 rounded-lg border font-mono text-sm">
                    {customer.id}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Member Since
                  </label>
                  <div className="text-gray-900 bg-gray-50 px-4 py-3 rounded-lg border">
                    {new Date(customer.joinDate || new Date()).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </div>
                </div>
                
                <div className="pt-6 border-t">
                  <h3 className="text-lg font-medium text-gray-900 mb-3">Account Support</h3>
                  <p className="text-gray-600 mb-4">
                    Need help with your account? Have questions about your orders or want to update your information? Our support team is here to help.
                  </p>
                  <Button 
                    variant="outline" 
                    onClick={() => navigate('/contact')}
                    className="border-gray-300 hover:bg-gray-50"
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
