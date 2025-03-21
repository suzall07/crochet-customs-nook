
import { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import { LogIn } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import AdminProductList from '@/components/admin/AdminProductList';
import AdminOrderList from '@/components/admin/AdminOrderList'; 
import AdminCustomerList from '@/components/admin/AdminCustomerList';
import AdminHeroSlides from '@/components/admin/AdminHeroSlides';
import { checkAdminLogin } from '@/utils/authUtils';

const Admin = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [loginForm, setLoginForm] = useState({
    email: '',
    password: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [activeTab, setActiveTab] = useState('products');

  useEffect(() => {
    // Check if admin is already logged in
    const isAuth = checkAdminLogin();
    if (isAuth) {
      setIsLoggedIn(true);
    }
  }, []);

  const handleLoginChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setLoginForm(prev => ({ ...prev, [name]: value }));
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simple validation
    if (!loginForm.email || !loginForm.password) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive"
      });
      setIsLoading(false);
      return;
    }

    // Simulate authentication process
    setTimeout(() => {
      // Simple check - in a real app, this would validate against a backend
      if (loginForm.email === 'admin@example.com' && loginForm.password === 'password') {
        // Store admin auth in localStorage
        localStorage.setItem('adminAuth', JSON.stringify({
          email: loginForm.email,
          isAdmin: true,
          loginTime: new Date().toISOString()
        }));

        setIsLoggedIn(true);
        toast({
          title: "Success",
          description: "You have successfully logged in"
        });
      } else {
        toast({
          title: "Authentication failed",
          description: "Invalid email or password",
          variant: "destructive"
        });
      }
      setIsLoading(false);
    }, 1000);
  };

  const handleLogout = () => {
    localStorage.removeItem('adminAuth');
    setIsLoggedIn(false);
    toast({
      title: "Logged out",
      description: "You have been logged out successfully"
    });
  };

  const handleTabChange = (value: string) => {
    setActiveTab(value);
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-gray-50 pt-24 pb-16">
        <div className="container mx-auto px-4">
          <div className="max-w-md mx-auto bg-white rounded-lg overflow-hidden shadow-sm border border-gray-200">
            <div className="p-6">
              <div className="text-center mb-6">
                <h1 className="text-2xl font-bold text-gray-900">Admin Login</h1>
                <p className="text-sm text-gray-600 mt-1">
                  Please sign in to access the admin dashboard
                </p>
              </div>

              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                    Email Address
                  </label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={loginForm.email}
                    onChange={handleLoginChange}
                    className="mt-1"
                    placeholder="admin@example.com"
                  />
                </div>

                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                    Password
                  </label>
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    required
                    value={loginForm.password}
                    onChange={handleLoginChange}
                    className="mt-1"
                    placeholder="password"
                  />
                </div>

                <div className="pt-2">
                  <Button
                    type="submit"
                    className="w-full bg-amber-700 hover:bg-amber-800"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <span className="flex items-center justify-center">
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Signing in...
                      </span>
                    ) : (
                      <span className="flex items-center justify-center">
                        <LogIn className="mr-2 h-4 w-4" />
                        Sign in
                      </span>
                    )}
                  </Button>
                </div>
              </form>

              <div className="mt-4 text-center">
                <p className="text-sm text-gray-600">
                  Demo credentials: admin@example.com / password
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-16">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-medium text-gray-900">Admin Dashboard</h1>
          <Button 
            variant="outline" 
            onClick={handleLogout}
            className="border-amber-200 text-amber-800 hover:bg-amber-50"
          >
            Log out
          </Button>
        </div>

        <Tabs value={activeTab} onValueChange={handleTabChange} className="mb-8">
          <TabsList className="bg-orange-50 border border-orange-200">
            <TabsTrigger 
              value="products" 
              className="data-[state=active]:bg-amber-100 data-[state=active]:text-amber-900"
            >
              Products
            </TabsTrigger>
            <TabsTrigger 
              value="orders" 
              className="data-[state=active]:bg-amber-100 data-[state=active]:text-amber-900"
            >
              Orders
            </TabsTrigger>
            <TabsTrigger 
              value="customers" 
              className="data-[state=active]:bg-amber-100 data-[state=active]:text-amber-900"
            >
              Customers
            </TabsTrigger>
            <TabsTrigger 
              value="heroslides" 
              className="data-[state=active]:bg-amber-100 data-[state=active]:text-amber-900"
            >
              Hero Slides
            </TabsTrigger>
          </TabsList>

          <TabsContent value="products" className="pt-6">
            <AdminProductList />
          </TabsContent>
          
          <TabsContent value="orders" className="pt-6">
            <AdminOrderList />
          </TabsContent>
          
          <TabsContent value="customers" className="pt-6">
            <AdminCustomerList />
          </TabsContent>
          
          <TabsContent value="heroslides" className="pt-6">
            <AdminHeroSlides />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Admin;
