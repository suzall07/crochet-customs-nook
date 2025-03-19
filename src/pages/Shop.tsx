
import { useState } from 'react';
import ProductCard, { Product } from '@/components/ProductCard';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

// Mock data
const shopProducts: Product[] = [
  {
    id: 1,
    name: "Hand-knit Wool Sweater",
    price: 8999,
    image: "https://images.unsplash.com/photo-1623421536546-fa1c86c52074?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
    category: "Sweaters",
    isFeatured: true
  },
  {
    id: 2,
    name: "Crochet Baby Blanket",
    price: 4500,
    image: "https://images.unsplash.com/photo-1586102901518-ca0f178acb5f?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
    category: "Baby",
    isNew: true
  },
  {
    id: 3,
    name: "Handmade Beanie Hat",
    price: 2999,
    image: "https://images.unsplash.com/photo-1638079399920-34c2394ee319?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
    category: "Accessories",
    isFeatured: true
  },
  {
    id: 4,
    name: "Crochet Plant Hanger",
    price: 1999,
    image: "https://images.unsplash.com/photo-1679752583774-8b5b0c2d8e75?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
    category: "Home Decor",
    isNew: true
  },
  {
    id: 5,
    name: "Crochet Table Runner",
    price: 3599,
    image: "https://images.unsplash.com/photo-1617005082133-5c6c0eb38b27?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
    category: "Home Decor"
  },
  {
    id: 6,
    name: "Wool Mittens",
    price: 1499,
    image: "https://images.unsplash.com/photo-1576035407865-975df3193c40?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
    category: "Accessories"
  },
  {
    id: 7,
    name: "Crochet Market Bag",
    price: 2199,
    image: "https://images.unsplash.com/photo-1591710668263-bee1e9db2a26?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
    category: "Accessories",
    isNew: true
  },
  {
    id: 8,
    name: "Baby Booties",
    price: 999,
    image: "https://images.unsplash.com/photo-1515488764276-beab7607c1e6?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
    category: "Baby"
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
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Shop;
