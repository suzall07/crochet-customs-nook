
import { useEffect } from 'react';
import Hero from '@/components/Hero';
import FeaturedProducts from '@/components/FeaturedProducts';

const Index = () => {
  // Scroll to top on page load
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <Hero />
      
      {/* Featured Products Section */}
      <FeaturedProducts />
      
      {/* Testimonials */}
      <section className="container mx-auto px-4 py-12">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-medium">What Our Customers Say</h2>
          <p className="text-muted-foreground mt-2">
            Read reviews from customers who love our handcrafted crochet items
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Testimonial 1 */}
          <div className="bg-white p-4 rounded-lg shadow-sm border border-crochet-100">
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 rounded-full bg-crochet-100 flex items-center justify-center text-crochet-700 font-medium">
                R
              </div>
              <div className="ml-4">
                <h4 className="font-medium">Ragita</h4>
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                    </svg>
                  ))}
                </div>
              </div>
            </div>
            <p className="text-crochet-700">
              "The quality of the baby blanket I ordered is exceptional. The stitches are so even and the yarn is incredibly soft. My daughter loves it!"
            </p>
          </div>
          
          {/* Testimonial 2 */}
          <div className="bg-white p-4 rounded-lg shadow-sm border border-crochet-100">
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 rounded-full bg-crochet-100 flex items-center justify-center text-crochet-700 font-medium">
                A
              </div>
              <div className="ml-4">
                <h4 className="font-medium">Anish</h4>
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                    </svg>
                  ))}
                </div>
              </div>
            </div>
            <p className="text-crochet-700">
              "I ordered a custom sweater and the attention to detail is amazing. It fits perfectly and the color is exactly what I wanted. Worth every rupee."
            </p>
          </div>
          
          {/* Testimonial 3 */}
          <div className="bg-white p-4 rounded-lg shadow-sm border border-crochet-100">
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 rounded-full bg-crochet-100 flex items-center justify-center text-crochet-700 font-medium">
                S
              </div>
              <div className="ml-4">
                <h4 className="font-medium">Sonal</h4>
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                    </svg>
                  ))}
                </div>
              </div>
            </div>
            <p className="text-crochet-700">
              "The items I purchased are beautiful and unique. They've added so much charm to my living room. Shipping was fast too!"
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
