
import { Link } from 'react-router-dom';
import { Mail, Phone } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-gray-900 text-white">
      <div className="container max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Brand column */}
          <div className="space-y-4">
            <h3 className="font-display text-2xl font-medium">Crochet with Limboo</h3>
            <p className="text-gray-200 text-sm">
              Handcrafted crochet products made with love and attention to detail. 
              Each item is unique and customizable to your preferences.
            </p>
          </div>
          
          {/* Contact */}
          <div>
            <h4 className="font-medium text-lg mb-4">Contact Us</h4>
            <ul className="space-y-3">
              <li className="flex items-center">
                <Mail className="h-5 w-5 mr-2 text-gray-300" />
                <a href="mailto:info@crochetwithlimboo.com" className="text-gray-200 hover:text-white transition-colors">
                  info@crochetwithlimboo.com
                </a>
              </li>
              <li className="flex items-center">
                <Phone className="h-5 w-5 mr-2 text-gray-300" />
                <a href="tel:+977980101097" className="text-gray-200 hover:text-white transition-colors">
                  980101097
                </a>
              </li>
            </ul>
            <div className="mt-4">
              <h5 className="text-sm font-medium mb-2">Business Hours</h5>
              <p className="text-gray-200 text-sm">
                Sunday - Friday: 10am - 8pm<br />
                Saturday: Closed
              </p>
            </div>
          </div>
        </div>
        
        <div className="border-t border-gray-800 mt-8 pt-6 text-center text-sm text-gray-300">
          <p>© {currentYear} Crochet with Limboo. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
