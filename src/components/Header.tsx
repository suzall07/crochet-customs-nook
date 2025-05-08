
import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  ShoppingCart, 
  User, 
  Search, 
  Menu, 
  X, 
  LogIn,
  LogOut
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { isCustomerLoggedIn, getCurrentCustomer, logoutCustomer } from '@/utils/authUtils';
import { useToast } from '@/components/ui/use-toast';

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [cartItemCount, setCartItemCount] = useState(0);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [customerName, setCustomerName] = useState('');
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();

  // Check login status
  useEffect(() => {
    const checkLoginStatus = () => {
      const loggedIn = isCustomerLoggedIn();
      setIsLoggedIn(loggedIn);
      
      if (loggedIn) {
        const customer = getCurrentCustomer();
        if (customer) {
          setCustomerName(customer.name);
        }
      }
    };
    
    checkLoginStatus();
    
    // Listen for login/logout events
    window.addEventListener('customerAuthChanged', checkLoginStatus);
    
    return () => {
      window.removeEventListener('customerAuthChanged', checkLoginStatus);
    };
  }, [location.pathname]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const updateCartCount = () => {
      try {
        // Use customer specific cart if logged in
        const customer = getCurrentCustomer();
        const cartKey = customer ? `cart_${customer.id}` : 'cart';
        const cart = JSON.parse(localStorage.getItem(cartKey) || '[]');
        setCartItemCount(cart.length);
      } catch (error) {
        console.error('Error reading cart data:', error);
        setCartItemCount(0);
      }
    };
    
    updateCartCount();
    
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'cart' || e.key?.startsWith('cart_')) {
        updateCartCount();
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    
    const handleCustomEvent = () => updateCartCount();
    window.addEventListener('cartUpdated', handleCustomEvent);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('cartUpdated', handleCustomEvent);
    };
  }, [isLoggedIn]);

  useEffect(() => {
    setIsMobileMenuOpen(false);
    setIsSearchOpen(false);
  }, [location]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
      setIsSearchOpen(false);
    }
  };
  
  const handleLogout = () => {
    logoutCustomer();
    setIsLoggedIn(false);
    setCustomerName('');
    toast({
      title: "Logged Out",
      description: "You have been successfully logged out.",
    });
    
    // Dispatch custom event to notify other components
    window.dispatchEvent(new Event('customerAuthChanged'));
    
    // Redirect to home page
    navigate('/');
  };

  const navItems = [
    { name: "Home", path: "/" },
    { name: "Shop", path: "/shop" },
    { name: "Popular Crochet", path: "/popular" },
    { name: "About Us", path: "/about" },
    { name: "Contact", path: "/contact" },
  ];

  return (
    <header 
      className={cn(
        "fixed top-0 left-0 right-0 z-50 py-3 transition-all duration-300",
        isScrolled 
          ? "bg-white/90 backdrop-blur-sm shadow-sm" 
          : "bg-transparent"
      )}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between">
          <Link 
            to="/" 
            className="relative z-10 font-display text-xl text-red-800 font-medium"
          >
            Crochet with Limboo
          </Link>

          <nav className="hidden md:flex items-center space-x-6">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "text-sm transition-colors hover:text-red-700",
                  location.pathname === item.path 
                    ? "text-red-800 font-medium" 
                    : "text-red-600"
                )}
              >
                {item.name}
              </Link>
            ))}
          </nav>

          <div className="hidden md:flex items-center space-x-2">
            <Button 
              variant="ghost" 
              size="icon" 
              aria-label="Search"
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className="text-red-700 hover:text-red-900 hover:bg-red-50"
            >
              <Search className="h-5 w-5" />
            </Button>
            <Button 
              variant="ghost" 
              size="icon" 
              aria-label="Cart" 
              className="relative text-red-700 hover:text-red-900 hover:bg-red-50"
              onClick={() => navigate("/cart")}
            >
              <ShoppingCart className="h-5 w-5" />
              {cartItemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-accent text-accent-foreground text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                  {cartItemCount}
                </span>
              )}
            </Button>
            
            {isLoggedIn ? (
              <div className="flex items-center gap-2">
                <span className="text-sm text-red-700">Hello, {customerName}</span>
                <Button 
                  variant="outline"
                  className="ml-2 border-red-200 text-red-700 hover:bg-red-50 hover:text-red-900"
                  onClick={handleLogout}
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </Button>
              </div>
            ) : (
              <Button 
                variant="outline"
                className="ml-2 border-red-200 text-red-700 hover:bg-red-50 hover:text-red-900"
                onClick={() => navigate("/login")}
              >
                <User className="h-4 w-4 mr-2" />
                Customer Login
              </Button>
            )}
            
            <Button 
              variant="outline"
              className="ml-2 border-red-200 text-red-700 hover:bg-red-50 hover:text-red-900"
              onClick={() => navigate("/admin")}
            >
              <LogIn className="h-4 w-4 mr-2" />
              Admin
            </Button>
          </div>

          <Button 
            variant="ghost" 
            size="icon"
            className="md:hidden text-red-700 hover:text-red-900 hover:bg-red-50"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
          >
            {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>

        {isSearchOpen && (
          <div className="absolute left-0 right-0 top-full bg-white shadow-md p-4 animate-fade-in">
            <form onSubmit={handleSearch} className="flex items-center">
              <Input
                type="search"
                placeholder="Search for crochet items..."
                className="w-full border-red-200 focus-visible:ring-red-400"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                autoFocus
              />
              <Button type="submit" className="ml-2 bg-red-700 hover:bg-red-800">
                <Search className="h-4 w-4" />
              </Button>
              <Button 
                type="button" 
                variant="ghost" 
                size="sm"
                onClick={() => setIsSearchOpen(false)}
                className="ml-2 text-red-700"
              >
                Cancel
              </Button>
            </form>
          </div>
        )}
      </div>

      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-40 bg-white pt-16 animate-fade-in">
          <div className="container px-4 py-4">
            <form onSubmit={handleSearch} className="mb-6">
              <div className="flex items-center">
                <Input
                  type="search"
                  placeholder="Search for crochet items..."
                  className="w-full border-red-200"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <Button type="submit" className="ml-2 bg-red-700 hover:bg-red-800">
                  <Search className="h-4 w-4" />
                </Button>
              </div>
            </form>
            
            <nav className="flex flex-col space-y-3">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={cn(
                    "text-lg py-2 border-b border-gray-100",
                    location.pathname === item.path 
                      ? "text-red-700 font-medium" 
                      : "text-red-600"
                  )}
                >
                  {item.name}
                </Link>
              ))}
              
              {isLoggedIn ? (
                <>
                  <div className="text-lg py-2 border-b border-gray-100 flex items-center justify-between text-red-600">
                    <span>Hello, {customerName}</span>
                    <Button 
                      variant="ghost" 
                      className="text-red-700"
                      onClick={handleLogout}
                    >
                      <LogOut className="h-4 w-4 mr-2" />
                      Logout
                    </Button>
                  </div>
                </>
              ) : (
                <Link 
                  to="/login" 
                  className="text-lg py-2 border-b border-gray-100 flex items-center text-red-600"
                >
                  <User className="h-4 w-4 mr-2" />
                  Customer Login
                </Link>
              )}
              
              <Link 
                to="/admin" 
                className="text-lg py-2 border-b border-gray-100 flex items-center text-red-600"
              >
                <LogIn className="h-4 w-4 mr-2" />
                Admin Login
              </Link>
            </nav>
            
            <div className="mt-6 flex justify-around">
              <Button 
                variant="ghost" 
                className="flex items-center text-red-700"
                onClick={() => navigate("/cart")}
              >
                <ShoppingCart className="h-5 w-5 mr-2" />
                <span>Cart ({cartItemCount})</span>
              </Button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
