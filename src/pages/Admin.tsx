
import { useState } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

const Admin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const { toast } = useToast();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Simple demo login - in a real app, this would validate against a backend
    if (email === 'admin@example.com' && password === 'password') {
      setIsLoggedIn(true);
      toast({
        title: "Login successful",
        description: "Welcome to the admin panel",
      });
    } else {
      toast({
        title: "Login failed",
        description: "Invalid email or password. Try admin@example.com / password",
        variant: "destructive",
      });
    }
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
            </CardContent>
            <CardFooter>
              <Button type="submit" className="w-full bg-crochet-800">Login</Button>
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
            onClick={() => {
              setIsLoggedIn(false);
              setEmail('');
              setPassword('');
            }}
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
