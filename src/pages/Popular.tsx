
import { useState } from 'react';
import ProductCard, { Product } from '@/components/ProductCard';
import { Separator } from '@/components/ui/separator';

// Mock data - popular products with updated reliable images
const popularProducts: Product[] = [
  {
    id: 1,
    name: "Hand-knit Wool Sweater",
    price: 8999,
    image: "https://images.pexels.com/photos/6850711/pexels-photo-6850711.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    category: "Sweaters",
    isFeatured: true
  },
  {
    id: 3,
    name: "Handmade Beanie Hat",
    price: 2999,
    image: "https://images.pexels.com/photos/6850483/pexels-photo-6850483.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    category: "Hats",
    isFeatured: true
  },
  {
    id: 6,
    name: "Wool Mittens",
    price: 1499,
    image: "https://images.pexels.com/photos/6850490/pexels-photo-6850490.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    category: "Mittens"
  },
  {
    id: 9,
    name: "Crochet Wall Hanging",
    price: 4999,
    image: "https://images.pexels.com/photos/6858602/pexels-photo-6858602.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    category: "Home Decor",
    isFeatured: true
  },
];

const Popular = () => {
  const [products] = useState<Product[]>(popularProducts);

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-medium mb-2">Popular Crochet Items</h1>
        <p className="text-muted-foreground mb-8">Our most loved crochet items chosen by our customers</p>
        
        <Separator className="mb-8" />
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Popular;
