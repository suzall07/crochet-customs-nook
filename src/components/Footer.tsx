
import { Link } from 'react-router-dom';
import { Mail, Phone, Instagram, Facebook, Twitter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-crochet-950 text-white">
      <div className="container max-w-7xl mx-auto px-4 sm:px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand column */}
          <div className="space-y-4">
            <h3 className="font-display text-2xl font-medium">Crochet with Limboo</h3>
            <p className="text-crochet-200 text-sm">
              Handcrafted crochet products made with love and attention to detail. 
              Each item is unique and customizable to your preferences.
            </p>
            <div className="flex space-x-4 pt-2">
              <a href="https://instagram.com" aria-label="Instagram" className="text-crochet-200 hover:text-white transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="https://facebook.com" aria-label="Facebook" className="text-crochet-200 hover:text-white transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="https://twitter.com" aria-label="Twitter" className="text-crochet-200 hover:text-white transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
            </div>
          </div>
          
          {/* Quick links */}
          <div>
            <h4 className="font-medium text-lg mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/shop" className="text-crochet-200 hover:text-white transition-colors">Shop All</Link>
              </li>
              <li>
                <Link to="/latest" className="text-crochet-200 hover:text-white transition-colors">Latest Crochet</Link>
              </li>
              <li>
                <Link to="/popular" className="text-crochet-200 hover:text-white transition-colors">Popular Items</Link>
              </li>
              <li>
                <Link to="/customize" className="text-crochet-200 hover:text-white transition-colors">Custom Orders</Link>
              </li>
              <li>
                <Link to="/about" className="text-crochet-200 hover:text-white transition-colors">About Us</Link>
              </li>
              <li>
                <Link to="/contact" className="text-crochet-200 hover:text-white transition-colors">Contact</Link>
              </li>
            </ul>
          </div>
          
          {/* Contact */}
          <div>
            <h4 className="font-medium text-lg mb-4">Contact Us</h4>
            <ul className="space-y-3">
              <li className="flex items-center">
                <Mail className="h-5 w-5 mr-2 text-crochet-300" />
                <a href="mailto:info@crochetwithlimboo.com" className="text-crochet-200 hover:text-white transition-colors">
                  info@crochetwithlimboo.com
                </a>
              </li>
              <li className="flex items-center">
                <Phone className="h-5 w-5 mr-2 text-crochet-300" />
                <a href="tel:+977980101097" className="text-crochet-200 hover:text-white transition-colors">
                  980101097
                </a>
              </li>
            </ul>
            <div className="mt-4">
              <h5 className="text-sm font-medium mb-2">Business Hours</h5>
              <p className="text-crochet-200 text-sm">
                Monday - Friday: 9am - 5pm<br />
                Saturday: 10am - 4pm<br />
                Sunday: Closed
              </p>
            </div>
          </div>
          
          {/* Newsletter */}
          <div>
            <h4 className="font-medium text-lg mb-4">Stay Connected</h4>
            <p className="text-crochet-200 text-sm mb-4">
              Subscribe to our newsletter for updates, special offers, and crafting tips.
            </p>
            <div className="space-y-2">
              <Input 
                type="email" 
                placeholder="Your email address" 
                className="bg-crochet-900 border-crochet-800 text-white placeholder:text-crochet-400"
              />
              <Button className="w-full bg-crochet-600 hover:bg-crochet-700">
                Subscribe
              </Button>
            </div>
          </div>
        </div>
        
        <div className="border-t border-crochet-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-crochet-300">
          <p>© {currentYear} Crochet with Limboo. All rights reserved.</p>
          <div className="mt-4 md:mt-0 space-x-6">
            <Link to="/privacy-policy" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link to="/terms-of-service" className="hover:text-white transition-colors">Terms of Service</Link>
            <Link to="/shipping-returns" className="hover:text-white transition-colors">Shipping & Returns</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
