
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

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
    
    // Check if admin exists in sessionStorage
    const storedAdmin = sessionStorage.getItem('admin');
    if (storedAdmin) {
      const admin = JSON.parse(storedAdmin);
      // Important fix: Don't check password === 'password' for registered users
      if (admin.email === email) {
        setIsLoggedIn(true);
        sessionStorage.setItem('adminLoggedIn', 'true');
        toast({
          title: "Login successful",
          description: "Welcome back to the admin panel",
        });
        return;
      }
    }
    
    // Demo login fallback
    if (email === 'admin@example.com' && password === 'password') {
      setIsLoggedIn(true);
      sessionStorage.setItem('adminLoggedIn', 'true');
      sessionStorage.setItem('admin', JSON.stringify({
        name: 'Admin User',
        email: 'admin@example.com',
        isLoggedIn: true
      }));
      toast({
        title: "Login successful",
        description: "Welcome to the admin panel",
      });
    } else {
      setError('Invalid email or password. Try admin@example.com / password or use your registered email');
      toast({
        title: "Login failed",
        description: "Invalid credentials. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Check if admin is already logged in
  useEffect(() => {
    const adminLoggedIn = sessionStorage.getItem('adminLoggedIn');
    if (adminLoggedIn === 'true') {
      setIsLoggedIn(true);
    }
  }, []);

  const handleLogout = () => {
    setIsLoggedIn(false);
    setEmail('');
    setPassword('');
    sessionStorage.removeItem('adminLoggedIn');
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
              <Button type="submit" className="w-full bg-crochet-800">Login</Button>
              <div className="text-center w-full">
                <Button 
                  type="button" 
                  variant="link" 
                  onClick={handleSignUp}
                  className="text-crochet-800"
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
          <TabsList className="mb-6">
            <TabsTrigger value="products">Products</TabsTrigger>
            <TabsTrigger value="orders">Orders</TabsTrigger>
            <TabsTrigger value="customers">Customers</TabsTrigger>
          </TabsList>
          
          <TabsContent value="products" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Products Management</CardTitle>
                <CardDescription>Manage your product catalog</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex justify-end mb-4">
                  <Button className="bg-crochet-800">Add New Product</Button>
                </div>
                <div className="border rounded-md">
                  <div className="grid grid-cols-12 gap-2 p-4 font-medium bg-muted">
                    <div className="col-span-1">ID</div>
                    <div className="col-span-3">Name</div>
                    <div className="col-span-2">Category</div>
                    <div className="col-span-2">Price</div>
                    <div className="col-span-2">Status</div>
                    <div className="col-span-2">Actions</div>
                  </div>
                  <Separator />
                  {[1, 2, 3, 4].map((id) => (
                    <div key={id} className="grid grid-cols-12 gap-2 p-4 items-center">
                      <div className="col-span-1">{id}</div>
                      <div className="col-span-3">Product Name {id}</div>
                      <div className="col-span-2">Category {id}</div>
                      <div className="col-span-2">Rs {(id * 1000).toLocaleString()}</div>
                      <div className="col-span-2">
                        <span className="inline-block px-2 py-1 rounded-full text-xs bg-green-100 text-green-800">
                          Active
                        </span>
                      </div>
                      <div className="col-span-2 flex space-x-2">
                        <Button variant="outline" size="sm">Edit</Button>
                        <Button variant="outline" size="sm" className="text-red-500">Delete</Button>
                      </div>
                      <Separator className="col-span-12 mt-2" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="orders">
            <Card>
              <CardHeader>
                <CardTitle>Order Management</CardTitle>
                <CardDescription>View and manage customer orders</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="border rounded-md">
                  <div className="grid grid-cols-12 gap-2 p-4 font-medium bg-muted">
                    <div className="col-span-1">ID</div>
                    <div className="col-span-3">Customer</div>
                    <div className="col-span-2">Date</div>
                    <div className="col-span-2">Amount</div>
                    <div className="col-span-2">Status</div>
                    <div className="col-span-2">Actions</div>
                  </div>
                  <Separator />
                  {[1, 2, 3].map((id) => (
                    <div key={id} className="grid grid-cols-12 gap-2 p-4 items-center">
                      <div className="col-span-1">#{id}000</div>
                      <div className="col-span-3">Customer {id}</div>
                      <div className="col-span-2">2025/03/{id}</div>
                      <div className="col-span-2">Rs {(id * 5000).toLocaleString()}</div>
                      <div className="col-span-2">
                        <span className="inline-block px-2 py-1 rounded-full text-xs bg-yellow-100 text-yellow-800">
                          Pending
                        </span>
                      </div>
                      <div className="col-span-2">
                        <Button variant="outline" size="sm">Details</Button>
                      </div>
                      <Separator className="col-span-12 mt-2" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="customers">
            <Card>
              <CardHeader>
                <CardTitle>Customer Management</CardTitle>
                <CardDescription>View and manage customer accounts</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="border rounded-md">
                  <div className="grid grid-cols-12 gap-2 p-4 font-medium bg-muted">
                    <div className="col-span-1">ID</div>
                    <div className="col-span-3">Name</div>
                    <div className="col-span-3">Email</div>
                    <div className="col-span-2">Orders</div>
                    <div className="col-span-3">Actions</div>
                  </div>
                  <Separator />
                  {['Ragita', 'Anish', 'Sonal'].map((name, index) => (
                    <div key={index} className="grid grid-cols-12 gap-2 p-4 items-center">
                      <div className="col-span-1">{index + 1}</div>
                      <div className="col-span-3">{name}</div>
                      <div className="col-span-3">{name.toLowerCase()}@example.com</div>
                      <div className="col-span-2">{index + 2}</div>
                      <div className="col-span-3 flex space-x-2">
                        <Button variant="outline" size="sm">View</Button>
                        <Button variant="outline" size="sm">Email</Button>
                      </div>
                      <Separator className="col-span-12 mt-2" />
                    </div>
                  ))}
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
