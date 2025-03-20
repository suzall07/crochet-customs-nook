
import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import ProductCard, { Product } from '@/components/ProductCard';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search as SearchIcon } from 'lucide-react';

// Mock data - all products with reliable images
const allProducts: Product[] = [
  {
    id: 1,
    name: "Hand-knit Wool Sweater",
    price: 8999,
    image: "https://images.pexels.com/photos/6850711/pexels-photo-6850711.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    category: "Sweaters",
    isFeatured: true
  },
  {
    id: 2,
    name: "Crochet Baby Blanket",
    price: 4500,
    image: "https://images.pexels.com/photos/6850490/pexels-photo-6850490.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    category: "Baby",
    isNew: true
  },
  {
    id: 3,
    name: "Handmade Beanie Hat",
    price: 2999,
    image: "https://images.pexels.com/photos/6850483/pexels-photo-6850483.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    category: "Accessories",
    isFeatured: true
  },
  {
    id: 4,
    name: "Crochet Plant Hanger",
    price: 1999,
    image: "https://images.pexels.com/photos/6858602/pexels-photo-6858602.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    category: "Home Decor",
    isNew: true
  },
  {
    id: 5,
    name: "Crochet Table Runner",
    price: 3599,
    image: "https://images.pexels.com/photos/3432889/pexels-photo-3432889.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    category: "Home Decor"
  },
  {
    id: 6,
    name: "Wool Mittens",
    price: 1499,
    image: "https://images.pexels.com/photos/6858600/pexels-photo-6858600.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    category: "Accessories"
  },
  {
    id: 7,
    name: "Crochet Market Bag",
    price: 2199,
    image: "https://images.pexels.com/photos/6858606/pexels-photo-6858606.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    category: "Accessories",
    isNew: true
  },
  {
    id: 8,
    name: "Baby Booties",
    price: 999,
    image: "https://images.pexels.com/photos/6933754/pexels-photo-6933754.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    category: "Baby"
  }
];

const Search = () => {
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  
  // Parse query parameter from URL
  useEffect(() => {
    const query = new URLSearchParams(location.search).get('q') || '';
    setSearchQuery(query);
    
    if (query) {
      performSearch(query);
    } else {
      setSearchResults([]);
    }
  }, [location.search]);
  
  const performSearch = (query: string) => {
    const normalizedQuery = query.toLowerCase().trim();
    
    // Filter products based on query
    const results = allProducts.filter(product => 
      product.name.toLowerCase().includes(normalizedQuery) || 
      product.category.toLowerCase().includes(normalizedQuery)
    );
    
    setSearchResults(results);
  };
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Update URL with search query
    const searchParams = new URLSearchParams(location.search);
    searchParams.set('q', searchQuery);
    window.history.pushState(
      {},
      '',
      `${location.pathname}?${searchParams.toString()}`
    );
    
    performSearch(searchQuery);
  };

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-medium mb-6">Search Results</h1>
        
        <form onSubmit={handleSearch} className="mb-8 max-w-xl">
          <div className="flex gap-2">
            <Input
              type="search"
              placeholder="Search for crochet items..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1"
            />
            <Button type="submit" className="bg-crochet-800">
              <SearchIcon className="h-4 w-4 mr-2" />
              Search
            </Button>
          </div>
        </form>
        
        <Separator className="mb-8" />
        
        {searchQuery ? (
          <>
            <p className="mb-6">
              {searchResults.length === 0 
                ? "No results found" 
                : `Found ${searchResults.length} results for "${searchQuery}"`}
            </p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {searchResults.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </>
        ) : (
          <p>Enter a search term to find products</p>
        )}
      </div>
    </div>
  );
};

export default Search;
