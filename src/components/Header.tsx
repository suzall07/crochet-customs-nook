
import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  ShoppingCart, 
  User, 
  Search, 
  Menu, 
  X, 
  LogIn
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu when route changes
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

  // Simplified nav items
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
          {/* Logo */}
          <Link 
            to="/" 
            className="relative z-10 font-medium text-xl text-crochet-900"
          >
            Crochet with Limboo
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-5">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "text-sm transition-colors hover:text-crochet-700",
                  location.pathname === item.path 
                    ? "text-crochet-900 font-medium" 
                    : "text-crochet-800"
                )}
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Action Buttons - Removed Heart/Wishlist */}
          <div className="hidden md:flex items-center space-x-2">
            <Button 
              variant="ghost" 
              size="icon" 
              aria-label="Search"
              onClick={() => setIsSearchOpen(!isSearchOpen)}
            >
              <Search className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" aria-label="Cart">
              <ShoppingCart className="h-5 w-5" />
            </Button>
            <Button 
              variant="outline"
              className="ml-2"
              onClick={() => navigate("/admin")}
            >
              <LogIn className="h-4 w-4 mr-2" />
              Admin
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <Button 
            variant="ghost" 
            size="icon"
            className="md:hidden"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
          >
            {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>

        {/* Search Bar */}
        {isSearchOpen && (
          <div className="absolute left-0 right-0 top-full bg-white shadow-md p-4 animate-fade-in">
            <form onSubmit={handleSearch} className="flex items-center">
              <Input
                type="search"
                placeholder="Search for crochet items..."
                className="w-full"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                autoFocus
              />
              <Button type="submit" className="ml-2 bg-crochet-800">
                <Search className="h-4 w-4" />
              </Button>
              <Button 
                type="button" 
                variant="ghost" 
                size="sm"
                onClick={() => setIsSearchOpen(false)}
                className="ml-2"
              >
                Cancel
              </Button>
            </form>
          </div>
        )}
      </div>

      {/* Mobile Menu - Removed Wishlist */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-40 bg-white pt-16 animate-fade-in">
          <div className="container px-4 py-4">
            <form onSubmit={handleSearch} className="mb-6">
              <div className="flex items-center">
                <Input
                  type="search"
                  placeholder="Search for crochet items..."
                  className="w-full"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <Button type="submit" className="ml-2 bg-crochet-800">
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
                      ? "text-crochet-700 font-medium" 
                      : "text-crochet-900"
                  )}
                >
                  {item.name}
                </Link>
              ))}
              <Link 
                to="/admin" 
                className="text-lg py-2 border-b border-gray-100 flex items-center text-crochet-900"
              >
                <LogIn className="h-4 w-4 mr-2" />
                Admin Login
              </Link>
            </nav>
            
            <div className="mt-6 flex justify-around">
              <Button variant="ghost" size="icon" aria-label="Cart">
                <ShoppingCart className="h-5 w-5" />
                <span className="ml-2">Cart</span>
              </Button>
              <Button variant="ghost" size="icon" aria-label="Account">
                <User className="h-5 w-5" />
                <span className="ml-2">Account</span>
              </Button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
