
import { useState } from 'react';
import ProductCard, { Product } from '@/components/ProductCard';
import { Separator } from '@/components/ui/separator';

// Updated mock data with yarn crochet images
const shopProducts: Product[] = [
  {
    id: 1,
    name: "Hand-knit Wool Sweater",
    price: 8999,
    image: "https://images.unsplash.com/photo-1626847152055-9bb0635fa1ee?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
    category: "Sweaters",
    isFeatured: true
  },
  {
    id: 2,
    name: "Crochet Baby Blanket",
    price: 4500,
    image: "https://images.unsplash.com/photo-1532774788000-afc4d8ce089f?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
    category: "Blankets",
    isNew: true
  },
  {
    id: 3,
    name: "Handmade Beanie Hat",
    price: 2999,
    image: "https://images.unsplash.com/photo-1594750852562-203fb71f0b91?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
    category: "Hats",
    isFeatured: true
  }
];

const Shop = () => {
  const [products] = useState<Product[]>(shopProducts);

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-medium mb-2">Shop</h1>
        <p className="text-muted-foreground mb-8">Browse our collection of handmade crochet items</p>
        
        <Separator className="mb-8" />
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Shop;
