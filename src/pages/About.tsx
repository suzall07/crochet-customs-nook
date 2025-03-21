
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

const About = () => {
  return (
    <div className="min-h-screen pt-24 pb-16">
      {/* Simple About Section */}
      <section className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-display font-medium mb-6 text-center text-amber-800">About Crochet with Limboo</h1>
          
          <div className="bg-white p-8 rounded-lg shadow-sm border border-orange-100">
            <p className="text-lg text-amber-900 mb-6">
              Started in 2025 at the beginning of my crochet journey, Crochet with Limboo has grown from a personal hobby into a small business dedicated to creating beautiful handcrafted items.
            </p>
            
            <p className="text-lg text-amber-900 mb-6">
              Each piece is made with love and attention to detail, using high-quality yarns and materials. We take pride in creating unique items that bring joy and warmth to your home and daily life.
            </p>
            
            <p className="text-lg text-amber-900 mb-8">
              Our passion is to share the beauty of handmade crochet with you, and we're grateful for your support on this creative journey.
            </p>
            
            <div className="flex justify-center">
              <Button 
                asChild
                className="bg-amber-700 hover:bg-amber-800 text-white"
              >
                <a href="/contact">
                  Contact Us
                  <ArrowRight className="ml-2 h-5 w-5" />
                </a>
              </Button>
            </div>
          </div>
          
          {/* FAQ Section - Limited to 2 questions */}
          <div className="mt-12">
            <h2 className="text-2xl font-display font-medium mb-6 text-center text-amber-800">Frequently Asked Questions</h2>
            
            <div className="space-y-4">
              <div className="bg-white p-6 rounded-lg shadow-sm border border-orange-100">
                <h3 className="font-medium text-xl mb-2 text-amber-800">How long does it take to make a custom order?</h3>
                <p className="text-amber-700">
                  Custom orders typically take 1-2 weeks to complete, depending on the complexity and our current workload. We'll provide you with a specific timeframe when you place your order.
                </p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-sm border border-orange-100">
                <h3 className="font-medium text-xl mb-2 text-amber-800">Do you ship internationally?</h3>
                <p className="text-amber-700">
                  No, since it's a small business we are not able to. We currently only ship within our local area.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
