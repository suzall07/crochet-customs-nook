
import { useState } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { 
  Mail, 
  Phone, 
  MapPin, 
  Clock, 
  Send 
} from 'lucide-react';

const Contact = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      toast({
        title: "Message sent successfully",
        description: "Thank you for contacting us. We'll get back to you shortly.",
      });
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: ''
      });
      setIsSubmitting(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen pt-20">
      {/* Hero Section */}
      <div className="relative bg-crochet-800 text-white py-16 sm:py-24">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-crochet-900 to-crochet-800 opacity-90"></div>
          <img 
            src="https://images.unsplash.com/photo-1534030347209-467a5b0ad3e6"
            alt="Background" 
            className="w-full h-full object-cover mix-blend-overlay opacity-30" 
          />
        </div>
        
        <div className="relative container max-w-7xl mx-auto px-4 sm:px-6 text-center">
          <div className="animate-fade-in">
            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-medium mb-4">
              Get in Touch
            </h1>
            <p className="text-lg sm:text-xl opacity-90 max-w-2xl mx-auto">
              Have questions about our crochet products or custom orders? We'd love to hear from you!
            </p>
          </div>
        </div>
      </div>
      
      {/* Contact Information & Form */}
      <section className="page-container py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Information */}
          <div className="space-y-8 animate-slide-up">
            <h2 className="font-display text-3xl font-medium text-crochet-900">Contact Information</h2>
            
            <div className="space-y-6">
              <div className="flex items-start">
                <div className="bg-crochet-100 p-3 rounded-lg mr-4">
                  <Mail className="h-6 w-6 text-crochet-700" />
                </div>
                <div>
                  <h3 className="font-medium text-lg mb-1">Email</h3>
                  <p className="text-crochet-600 mb-1">For general inquiries:</p>
                  <a 
                    href="mailto:info@crochetwithlimboo.com" 
                    className="text-crochet-700 hover:text-crochet-900 hover:underline"
                  >
                    info@crochetwithlimboo.com
                  </a>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="bg-crochet-100 p-3 rounded-lg mr-4">
                  <Phone className="h-6 w-6 text-crochet-700" />
                </div>
                <div>
                  <h3 className="font-medium text-lg mb-1">Phone</h3>
                  <p className="text-crochet-600 mb-1">Customer support:</p>
                  <a 
                    href="tel:+1234567890" 
                    className="text-crochet-700 hover:text-crochet-900 hover:underline"
                  >
                    (123) 456-7890
                  </a>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="bg-crochet-100 p-3 rounded-lg mr-4">
                  <MapPin className="h-6 w-6 text-crochet-700" />
                </div>
                <div>
                  <h3 className="font-medium text-lg mb-1">Address</h3>
                  <p className="text-crochet-600">
                    123 Yarn Street<br />
                    Crochet Town, CT 12345<br />
                    United States
                  </p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="bg-crochet-100 p-3 rounded-lg mr-4">
                  <Clock className="h-6 w-6 text-crochet-700" />
                </div>
                <div>
                  <h3 className="font-medium text-lg mb-1">Business Hours</h3>
                  <p className="text-crochet-600">
                    Monday - Friday: 9am - 5pm<br />
                    Saturday: 10am - 4pm<br />
                    Sunday: Closed
                  </p>
                </div>
              </div>
            </div>
            
            <div className="bg-crochet-50 p-6 rounded-xl border border-crochet-100">
              <h3 className="font-medium text-lg mb-2">Custom Orders</h3>
              <p className="text-crochet-600 mb-4">
                Interested in a custom crochet item not listed in our store? 
                We'd be happy to discuss your ideas and create something unique for you.
              </p>
              <Button 
                asChild
                className="bg-crochet-700 hover:bg-crochet-800"
              >
                <a href="/customize">Request Custom Order</a>
              </Button>
            </div>
          </div>
          
          {/* Contact Form */}
          <div className="animate-slide-up">
            <h2 className="font-display text-3xl font-medium text-crochet-900 mb-6">Send a Message</h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label htmlFor="name" className="text-sm font-medium text-crochet-700">
                    Your Name *
                  </label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-lg border border-crochet-200 focus:ring-2 focus:ring-crochet-500 focus:border-transparent transition-colors"
                    placeholder="Enter your name"
                  />
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm font-medium text-crochet-700">
                    Email Address *
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-lg border border-crochet-200 focus:ring-2 focus:ring-crochet-500 focus:border-transparent transition-colors"
                    placeholder="Enter your email"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <label htmlFor="subject" className="text-sm font-medium text-crochet-700">
                  Subject *
                </label>
                <select
                  id="subject"
                  name="subject"
                  required
                  value={formData.subject}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg border border-crochet-200 focus:ring-2 focus:ring-crochet-500 focus:border-transparent transition-colors"
                >
                  <option value="">Select a subject</option>
                  <option value="General Inquiry">General Inquiry</option>
                  <option value="Product Question">Product Question</option>
                  <option value="Custom Order">Custom Order</option>
                  <option value="Order Status">Order Status</option>
                  <option value="Return/Exchange">Return/Exchange</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              
              <div className="space-y-2">
                <label htmlFor="message" className="text-sm font-medium text-crochet-700">
                  Message *
                </label>
                <textarea
                  id="message"
                  name="message"
                  required
                  rows={6}
                  value={formData.message}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg border border-crochet-200 focus:ring-2 focus:ring-crochet-500 focus:border-transparent transition-colors resize-none"
                  placeholder="How can we help you?"
                />
              </div>
              
              <Button 
                type="submit"
                disabled={isSubmitting}
                className="w-full sm:w-auto bg-crochet-800 hover:bg-crochet-900 button-effect"
              >
                {isSubmitting ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Sending Message...
                  </span>
                ) : (
                  <span className="flex items-center">
                    Send Message
                    <Send className="ml-2 h-4 w-4" />
                  </span>
                )}
              </Button>
            </form>
          </div>
        </div>
      </section>
      
      {/* Map Section */}
      <section className="bg-crochet-50 py-16">
        <div className="container max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <h2 className="section-title">Visit Our Store</h2>
            <p className="section-subtitle mx-auto">
              Come see our products in person at our physical location
            </p>
          </div>
          
          <div className="bg-white rounded-xl overflow-hidden shadow-sm border border-crochet-100 animate-scale-in">
            {/* Placeholder for map - in a real app, you'd integrate Google Maps or similar */}
            <div className="aspect-video bg-crochet-100 w-full">
              <div className="w-full h-full flex items-center justify-center">
                <p className="text-crochet-600 text-center px-4">
                  Interactive map would be displayed here.<br />
                  In a real implementation, this would be a Google Maps or similar integration.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* FAQ Section */}
      <section className="page-container py-16">
        <div className="text-center mb-12">
          <h2 className="section-title">Frequently Asked Questions</h2>
          <p className="section-subtitle mx-auto">
            Find answers to commonly asked questions about our products and services
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* FAQ Item 1 */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-crochet-100">
            <h3 className="font-medium text-lg mb-2">How long does shipping take?</h3>
            <p className="text-crochet-600">
              Standard shipping takes 3-5 business days within the US. International shipping typically takes 7-14 business days, depending on the destination.
            </p>
          </div>
          
          {/* FAQ Item 2 */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-crochet-100">
            <h3 className="font-medium text-lg mb-2">Can I return or exchange items?</h3>
            <p className="text-crochet-600">
              We accept returns within 30 days of delivery for most items. Custom orders are non-returnable unless there's a defect in the product.
            </p>
          </div>
          
          {/* FAQ Item 3 */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-crochet-100">
            <h3 className="font-medium text-lg mb-2">How do I care for my crochet items?</h3>
            <p className="text-crochet-600">
              Most of our items are hand-washable in cold water with mild detergent. Lay flat to dry. Detailed care instructions are included with each product.
            </p>
          </div>
          
          {/* FAQ Item 4 */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-crochet-100">
            <h3 className="font-medium text-lg mb-2">How long do custom orders take?</h3>
            <p className="text-crochet-600">
              Custom orders typically take 2-3 weeks to complete, depending on complexity and our current order volume. We'll provide an estimated completion date when you place your order.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;
