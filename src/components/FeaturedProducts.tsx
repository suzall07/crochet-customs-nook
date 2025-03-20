
import { useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ProductCard, { Product } from './ProductCard';

// Mock data with reliable yarn crochet images
const featuredProducts: Product[] = [
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
    name: "Crochet Wall Hanging",
    price: 1999,
    image: "https://images.pexels.com/photos/6858602/pexels-photo-6858602.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    category: "Home Decor",
    isNew: true
  }
];

const FeaturedProducts = () => {
  const [products] = useState<Product[]>(featuredProducts);

  return (
    <section className="page-container">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-medium">Featured Creations</h2>
        <p className="text-muted-foreground mt-2">
          Discover our handpicked collection of unique crochet items
        </p>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} className="animate-scale-in" />
        ))}
      </div>
      
      <div className="mt-8 text-center">
        <Button 
          asChild
          className="px-6 bg-crochet-800 hover:bg-crochet-900"
        >
          <a href="/shop">
            View All Products
            <ArrowRight className="ml-2 h-4 w-4" />
          </a>
        </Button>
      </div>
    </section>
  );
};

export default FeaturedProducts;
