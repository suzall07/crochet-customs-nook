
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

const About = () => {
  return (
    <div className="min-h-screen pt-20">
      {/* Hero Section */}
      <div className="relative bg-crochet-800 text-white py-16 sm:py-24">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-crochet-900 to-crochet-800 opacity-90"></div>
          <img 
            src="https://images.unsplash.com/photo-1550507992-eb63ffee0847"
            alt="Background" 
            className="w-full h-full object-cover mix-blend-overlay opacity-30" 
          />
        </div>
        
        <div className="relative container max-w-7xl mx-auto px-4 sm:px-6 text-center">
          <div className="animate-fade-in">
            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-medium mb-4">
              Our Story
            </h1>
            <p className="text-lg sm:text-xl opacity-90 max-w-2xl mx-auto">
              Discover the passion and craftsmanship behind Crochet with Limboo
            </p>
          </div>
        </div>
      </div>
      
      {/* Our Story Section */}
      <section className="page-container py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="animate-slide-up">
            <h2 className="font-display text-3xl sm:text-4xl font-medium text-crochet-900 mb-6">
              The Beginning of Crochet with Limboo
            </h2>
            
            <div className="space-y-4 text-crochet-700">
              <p>
                Crochet with Limboo began as a personal passion project in 2018. What started as a hobby creating gifts for friends and family quickly blossomed into something more as word spread about the quality and beauty of each handcrafted piece.
              </p>
              <p>
                Founded by Maria Limboo, an artist with a background in textile design, our business is built on the belief that handmade items carry a special kind of magic – the personal touch of their creator and the stories woven into each stitch.
              </p>
              <p>
                Today, our small team of skilled artisans creates unique crochet pieces that blend traditional techniques with contemporary designs. Each item is carefully crafted using premium materials, ensuring both beauty and durability.
              </p>
            </div>
            
            <div className="mt-8">
              <Button 
                asChild
                className="bg-crochet-800 hover:bg-crochet-900 button-effect"
              >
                <a href="/contact">
                  Contact Us
                  <ArrowRight className="ml-2 h-5 w-5" />
                </a>
              </Button>
            </div>
          </div>
          
          <div className="relative animate-fade-in">
            <img 
              src="https://images.unsplash.com/photo-1620736372349-4c47fa838be5" 
              alt="Founder working on crochet" 
              className="rounded-xl shadow-lg w-full h-auto"
            />
            <div className="absolute -bottom-4 -right-4 bg-white rounded-lg p-4 shadow-lg border border-crochet-100">
              <p className="text-sm font-medium text-crochet-900">Maria Limboo</p>
              <p className="text-xs text-crochet-600">Founder & Lead Designer</p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Our Values */}
      <section className="bg-crochet-50 py-16">
        <div className="container max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <h2 className="section-title">Our Values</h2>
            <p className="section-subtitle mx-auto">
              The principles that guide our work and relationships
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Value 1 */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-crochet-100 animate-scale-in">
              <div className="w-12 h-12 bg-crochet-100 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-crochet-800" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
              <h3 className="font-medium text-xl mb-2 text-crochet-900">Crafted with Love</h3>
              <p className="text-crochet-700">
                We pour our heart and soul into every stitch, creating items that are not just products, but expressions of care and dedication.
              </p>
            </div>
            
            {/* Value 2 */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-crochet-100 animate-scale-in" style={{ animationDelay: "0.1s" }}>
              <div className="w-12 h-12 bg-crochet-100 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-crochet-800" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="font-medium text-xl mb-2 text-crochet-900">Quality Materials</h3>
              <p className="text-crochet-700">
                We use only premium yarns and materials, ensuring that your crochet items are not only beautiful but also durable and long-lasting.
              </p>
            </div>
            
            {/* Value 3 */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-crochet-100 animate-scale-in" style={{ animationDelay: "0.2s" }}>
              <div className="w-12 h-12 bg-crochet-100 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-crochet-800" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                </svg>
              </div>
              <h3 className="font-medium text-xl mb-2 text-crochet-900">Sustainable Practices</h3>
              <p className="text-crochet-700">
                We're committed to minimizing our environmental footprint by using eco-friendly materials and reducing waste in our production process.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Our Process */}
      <section className="page-container py-16">
        <div className="text-center mb-12">
          <h2 className="section-title">Our Craft Process</h2>
          <p className="section-subtitle mx-auto">
            From design concept to finished product, discover how we create our crochet masterpieces
          </p>
        </div>
        
        <div className="relative">
          {/* Process timeline line */}
          <div className="hidden md:block absolute left-1/2 transform -translate-x-1/2 h-full w-0.5 bg-crochet-200"></div>
          
          <div className="space-y-12 relative">
            {/* Step 1 */}
            <div className="md:grid md:grid-cols-2 md:gap-8 items-center">
              <div className="md:text-right animate-slide-up">
                <div className="hidden md:block absolute left-1/2 top-4 transform -translate-x-1/2 w-4 h-4 rounded-full bg-crochet-600 border-4 border-white"></div>
                <h3 className="font-medium text-xl mb-2 text-crochet-900">Design & Inspiration</h3>
                <p className="text-crochet-700">
                  Every piece begins with inspiration – from nature, architecture, fashion, or traditional patterns. We sketch designs and experiment with different techniques to create something unique.
                </p>
              </div>
              <div className="mt-4 md:mt-0 animate-fade-in">
                <img 
                  src="https://images.unsplash.com/photo-1544967082-d9d25d867d66" 
                  alt="Design process" 
                  className="rounded-lg shadow-sm w-full h-auto"
                />
              </div>
            </div>
            
            {/* Step 2 */}
            <div className="md:grid md:grid-cols-2 md:gap-8 items-center">
              <div className="md:order-2 animate-slide-up">
                <div className="hidden md:block absolute left-1/2 top-4 transform -translate-x-1/2 w-4 h-4 rounded-full bg-crochet-600 border-4 border-white"></div>
                <h3 className="font-medium text-xl mb-2 text-crochet-900">Material Selection</h3>
                <p className="text-crochet-700">
                  We carefully select yarns and materials that match our quality standards. The texture, color, durability, and feel are all considered to ensure the perfect result.
                </p>
              </div>
              <div className="mt-4 md:mt-0 md:order-1 animate-fade-in">
                <img 
                  src="https://images.unsplash.com/photo-1616683404707-634bea4de9f1" 
                  alt="Yarn selection" 
                  className="rounded-lg shadow-sm w-full h-auto"
                />
              </div>
            </div>
            
            {/* Step 3 */}
            <div className="md:grid md:grid-cols-2 md:gap-8 items-center">
              <div className="md:text-right animate-slide-up">
                <div className="hidden md:block absolute left-1/2 top-4 transform -translate-x-1/2 w-4 h-4 rounded-full bg-crochet-600 border-4 border-white"></div>
                <h3 className="font-medium text-xl mb-2 text-crochet-900">Crafting Process</h3>
                <p className="text-crochet-700">
                  This is where the magic happens. Our skilled artisans bring the design to life through careful stitching, paying attention to every detail and maintaining consistent tension and pattern.
                </p>
              </div>
              <div className="mt-4 md:mt-0 animate-fade-in">
                <img 
                  src="https://images.unsplash.com/photo-1566140967404-b8b3932483f5" 
                  alt="Crafting process" 
                  className="rounded-lg shadow-sm w-full h-auto"
                />
              </div>
            </div>
            
            {/* Step 4 */}
            <div className="md:grid md:grid-cols-2 md:gap-8 items-center">
              <div className="md:order-2 animate-slide-up">
                <div className="hidden md:block absolute left-1/2 top-4 transform -translate-x-1/2 w-4 h-4 rounded-full bg-crochet-600 border-4 border-white"></div>
                <h3 className="font-medium text-xl mb-2 text-crochet-900">Quality Assurance</h3>
                <p className="text-crochet-700">
                  Each finished piece undergoes thorough inspection to ensure it meets our high standards. We check for even stitches, proper sizing, and overall quality before it's ready for you.
                </p>
              </div>
              <div className="mt-4 md:mt-0 md:order-1 animate-fade-in">
                <img 
                  src="https://images.unsplash.com/photo-1620783770629-122b7f187703" 
                  alt="Quality inspection" 
                  className="rounded-lg shadow-sm w-full h-auto"
                />
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Team Section */}
      <section className="bg-crochet-50 py-16">
        <div className="container max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <h2 className="section-title">Meet Our Team</h2>
            <p className="section-subtitle mx-auto">
              The talented artisans behind our beautiful crochet creations
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Team Member 1 */}
            <div className="bg-white rounded-xl overflow-hidden shadow-sm border border-crochet-100 animate-scale-in">
              <img 
                src="https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e" 
                alt="Maria Limboo" 
                className="w-full aspect-square object-cover"
              />
              <div className="p-6">
                <h3 className="font-medium text-xl mb-1 text-crochet-900">Maria Limboo</h3>
                <p className="text-crochet-600 mb-4">Founder & Lead Designer</p>
                <p className="text-crochet-700">
                  With over 15 years of experience in textile design, Maria brings creativity and expertise to every design.
                </p>
              </div>
            </div>
            
            {/* Team Member 2 */}
            <div className="bg-white rounded-xl overflow-hidden shadow-sm border border-crochet-100 animate-scale-in" style={{ animationDelay: "0.1s" }}>
              <img 
                src="https://images.unsplash.com/photo-1580489944761-15a19d654956" 
                alt="Sarah Johnson" 
                className="w-full aspect-square object-cover"
              />
              <div className="p-6">
                <h3 className="font-medium text-xl mb-1 text-crochet-900">Sarah Johnson</h3>
                <p className="text-crochet-600 mb-4">Senior Crochet Artist</p>
                <p className="text-crochet-700">
                  Sarah specializes in intricate pattern work and has been creating stunning crochet pieces for over a decade.
                </p>
              </div>
            </div>
            
            {/* Team Member 3 */}
            <div className="bg-white rounded-xl overflow-hidden shadow-sm border border-crochet-100 animate-scale-in" style={{ animationDelay: "0.2s" }}>
              <img 
                src="https://images.unsplash.com/photo-1599566150163-29194dcaad36" 
                alt="David Chen" 
                className="w-full aspect-square object-cover"
              />
              <div className="p-6">
                <h3 className="font-medium text-xl mb-1 text-crochet-900">David Chen</h3>
                <p className="text-crochet-600 mb-4">Color Specialist</p>
                <p className="text-crochet-700">
                  With a background in color theory, David ensures our color palettes are harmonious and on-trend.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Call to Action */}
      <section className="relative py-16">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute inset-0 bg-crochet-900/70"></div>
          <img 
            src="https://images.unsplash.com/photo-1531984557360-89184e00f590" 
            alt="Background" 
            className="w-full h-full object-cover mix-blend-overlay" 
          />
        </div>
        
        <div className="relative container max-w-7xl mx-auto px-4 sm:px-6 text-center text-white">
          <h2 className="font-display text-3xl sm:text-4xl font-medium mb-4">Ready to Experience Our Craftsmanship?</h2>
          <p className="text-lg opacity-90 max-w-2xl mx-auto mb-8">
            Browse our collection of handmade crochet items or request a custom piece tailored to your preferences.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button 
              asChild
              className="bg-white text-crochet-900 hover:bg-white/90 button-effect"
            >
              <a href="/shop">
                Shop Collection
                <ArrowRight className="ml-2 h-5 w-5" />
              </a>
            </Button>
            <Button 
              asChild
              variant="outline" 
              className="border-white text-white hover:bg-white/10"
            >
              <a href="/customize">
                Custom Order
              </a>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
