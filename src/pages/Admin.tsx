
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { PlusCircle, Edit, Trash } from 'lucide-react';
import AdminProductList from '@/components/admin/AdminProductList';
import AdminOrderList from '@/components/admin/AdminOrderList';
import AdminCustomerList from '@/components/admin/AdminCustomerList';

const Admin = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [error, setError] = useState('');
  const { toast } = useToast();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    // Check if admin exists in localStorage
    const storedAdmin = localStorage.getItem('admin');
    if (storedAdmin) {
      const admin = JSON.parse(storedAdmin);
      // Check if the admin object has an email and password
      if (admin.email && admin.password) {
        // Case insensitive email comparison
        if (admin.email.toLowerCase() === email.toLowerCase() && admin.password === password) {
          setIsLoggedIn(true);
          localStorage.setItem('adminLoggedIn', 'true');
          toast({
            title: "Login successful",
            description: "Welcome back to the admin panel",
          });
          return;
        }
      }
    }
    
    // Demo login fallback
    if (email.toLowerCase() === 'admin@example.com' && password === 'password') {
      setIsLoggedIn(true);
      localStorage.setItem('adminLoggedIn', 'true');
      localStorage.setItem('admin', JSON.stringify({
        name: 'Admin User',
        email: 'admin@example.com',
        password: 'password',
        isLoggedIn: true
      }));
      toast({
        title: "Login successful",
        description: "Welcome to the admin panel",
      });
    } else {
      setError('Invalid email or password. Try admin@example.com / password or use your registered email & password');
      toast({
        title: "Login failed",
        description: "Invalid credentials. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Check if admin is already logged in
  useEffect(() => {
    const adminLoggedIn = localStorage.getItem('adminLoggedIn');
    if (adminLoggedIn === 'true') {
      setIsLoggedIn(true);
    }
  }, []);

  const handleLogout = () => {
    setIsLoggedIn(false);
    setEmail('');
    setPassword('');
    localStorage.removeItem('adminLoggedIn');
    toast({
      title: "Logged out",
      description: "You have been logged out successfully",
    });
  };

  const handleSignUp = () => {
    navigate('/admin/signup');
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen pt-24 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Admin Login</CardTitle>
            <CardDescription>
              Sign in to access the admin dashboard
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleLogin}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="admin@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <p className="text-xs text-muted-foreground">
                  For demo: use admin@example.com / password
                </p>
              </div>
              {error && <p className="text-sm text-red-600">{error}</p>}
            </CardContent>
            <CardFooter className="flex flex-col space-y-2">
              <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700">Login</Button>
              <div className="text-center w-full">
                <Button 
                  type="button" 
                  variant="link" 
                  onClick={handleSignUp}
                  className="text-blue-600"
                >
                  Don't have an account? Sign up
                </Button>
              </div>
            </CardFooter>
          </form>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-medium">Admin Dashboard</h1>
          <Button 
            variant="outline"
            onClick={handleLogout}
          >
            Logout
          </Button>
        </div>
        
        <Tabs defaultValue="products">
          <TabsList className="mb-6 bg-blue-100">
            <TabsTrigger value="products" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">Products</TabsTrigger>
            <TabsTrigger value="orders" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">Orders</TabsTrigger>
            <TabsTrigger value="customers" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">Customers</TabsTrigger>
            <TabsTrigger value="custom-orders" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">Custom Orders</TabsTrigger>
          </TabsList>
          
          <TabsContent value="products">
            <AdminProductList />
          </TabsContent>
          
          <TabsContent value="orders">
            <AdminOrderList />
          </TabsContent>
          
          <TabsContent value="customers">
            <AdminCustomerList />
          </TabsContent>
          
          <TabsContent value="custom-orders">
            <Card>
              <CardHeader>
                <CardTitle>Custom Order Requests</CardTitle>
                <CardDescription>Manage custom order requests from customers</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="border rounded-md">
                  <div className="grid grid-cols-12 gap-2 p-4 font-medium bg-blue-50">
                    <div className="col-span-1">ID</div>
                    <div className="col-span-2">Item Type</div>
                    <div className="col-span-3">Description</div>
                    <div className="col-span-2">Date</div>
                    <div className="col-span-2">Status</div>
                    <div className="col-span-2">Actions</div>
                  </div>
                  <Separator />
                  {(() => {
                    try {
                      const customOrders = JSON.parse(localStorage.getItem('customOrders') || '[]');
                      
                      if (customOrders.length === 0) {
                        return (
                          <div className="p-8 text-center text-muted-foreground">
                            No custom order requests yet.
                          </div>
                        );
                      }
                      
                      return customOrders.map((order: any, index: number) => (
                        <div key={order.id || index} className="grid grid-cols-12 gap-2 p-4 items-center">
                          <div className="col-span-1">#{(index + 1).toString().padStart(3, '0')}</div>
                          <div className="col-span-2">{order.itemType}</div>
                          <div className="col-span-3" title={order.description}>
                            {order.description.length > 50 ? `${order.description.substring(0, 50)}...` : order.description}
                          </div>
                          <div className="col-span-2">
                            {new Date(order.date).toLocaleDateString()}
                          </div>
                          <div className="col-span-2">
                            <span className={`inline-block px-2 py-1 rounded-full text-xs ${
                              order.status === 'Completed' ? 'bg-green-100 text-green-800' : 
                              order.status === 'In Progress' ? 'bg-blue-100 text-blue-800' : 
                              'bg-yellow-100 text-yellow-800'
                            }`}>
                              {order.status}
                            </span>
                          </div>
                          <div className="col-span-2 flex space-x-2">
                            <Button 
                              variant="outline" 
                              size="sm"
                              className="bg-blue-50 hover:bg-blue-100"
                              onClick={() => {
                                // Update status logic
                                const updatedOrders = customOrders.map((o: any) => 
                                  o.id === order.id ? 
                                  {...o, status: o.status === 'Pending' ? 'In Progress' : 
                                             o.status === 'In Progress' ? 'Completed' : 'Pending'} : o
                                );
                                localStorage.setItem('customOrders', JSON.stringify(updatedOrders));
                                toast({
                                  title: "Status Updated",
                                  description: `Order status changed to ${
                                    order.status === 'Pending' ? 'In Progress' : 
                                    order.status === 'In Progress' ? 'Completed' : 'Pending'
                                  }`,
                                });
                                // Force re-render
                                window.dispatchEvent(new Event('storage'));
                              }}
                            >
                              Update Status
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="text-red-500"
                              onClick={() => {
                                const updatedOrders = customOrders.filter((o: any) => o.id !== order.id);
                                localStorage.setItem('customOrders', JSON.stringify(updatedOrders));
                                toast({
                                  title: "Custom Order Deleted",
                                  description: "The custom order request has been deleted",
                                });
                                // Force re-render
                                window.dispatchEvent(new Event('storage'));
                              }}
                            >
                              Delete
                            </Button>
                          </div>
                          <Separator className="col-span-12 mt-2" />
                        </div>
                      ));
                    } catch (error) {
                      console.error('Error rendering custom orders:', error);
                      return (
                        <div className="p-8 text-center text-red-600">
                          Error loading custom orders.
                        </div>
                      );
                    }
                  })()}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Admin;
