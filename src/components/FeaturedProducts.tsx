
import { useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ProductCard, { Product } from './ProductCard';

// Mock data
const featuredProducts: Product[] = [
  {
    id: 1,
    name: "Hand-knit Wool Sweater",
    price: 8999,
    image: "https://images.unsplash.com/photo-1623421536546-fa1c86c52074",
    category: "Sweaters",
    isFeatured: true
  },
  {
    id: 2,
    name: "Crochet Baby Blanket",
    price: 4500,
    image: "https://images.unsplash.com/photo-1586102901518-ca0f178acb5f",
    category: "Baby",
    isNew: true
  },
  {
    id: 3,
    name: "Handmade Beanie Hat",
    price: 2999,
    image: "https://images.unsplash.com/photo-1638079399920-34c2394ee319",
    category: "Accessories",
    isFeatured: true
  },
  {
    id: 4,
    name: "Crochet Plant Hanger",
    price: 1999,
    image: "https://images.unsplash.com/photo-1679752583774-8b5b0c2d8e75",
    category: "Home Decor",
    isNew: true
  }
];

const FeaturedProducts = () => {
  const [products] = useState<Product[]>(featuredProducts);

  return (
    <section className="page-container">
      <div className="text-center mb-12">
        <h2 className="section-title">Featured Creations</h2>
        <p className="section-subtitle mx-auto">
          Discover our handpicked collection of unique crochet items crafted with love and attention to detail
        </p>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} className="animate-scale-in" />
        ))}
      </div>
      
      <div className="mt-12 text-center">
        <Button 
          asChild
          className="px-8 bg-crochet-800 hover:bg-crochet-900 button-effect"
        >
          <a href="/shop">
            View All Products
            <ArrowRight className="ml-2 h-5 w-5" />
          </a>
        </Button>
      </div>
    </section>
  );
};

export default FeaturedProducts;
