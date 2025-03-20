
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
import { useNavigate } from 'react-router-dom';

const Contact = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [customOrderData, setCustomOrderData] = useState({
    itemType: '',
    description: '',
    preferredColors: '',
    budget: '',
    timeline: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCustomSubmitting, setIsCustomSubmitting] = useState(false);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleCustomChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setCustomOrderData(prev => ({ ...prev, [name]: value }));
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

  const handleCustomOrderSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsCustomSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      const customOrders = JSON.parse(localStorage.getItem('customOrders') || '[]');
      const newOrder = {
        id: Date.now(),
        ...customOrderData,
        status: 'Pending',
        date: new Date().toISOString()
      };
      
      localStorage.setItem('customOrders', JSON.stringify([...customOrders, newOrder]));
      
      toast({
        title: "Custom order request submitted",
        description: "Thank you for your interest! We'll review your request and contact you soon.",
      });
      setCustomOrderData({
        itemType: '',
        description: '',
        preferredColors: '',
        budget: '',
        timeline: ''
      });
      setIsCustomSubmitting(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen pt-20">
      {/* Hero Section */}
      <div className="relative bg-crochet-800 text-white py-16 sm:py-24">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-crochet-900 to-crochet-800 opacity-90"></div>
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
                    href="tel:+977980101097" 
                    className="text-crochet-700 hover:text-crochet-900 hover:underline"
                  >
                    980101097
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
                    Kimdol, KTM<br />
                    Nepal
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
                    Sunday - Friday: 10am - 8pm<br />
                    Saturday: Closed
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
                className="bg-crochet-700 hover:bg-crochet-800"
                onClick={() => document.getElementById('custom-order-form')?.scrollIntoView({ behavior: 'smooth' })}
              >
                Request Custom Order
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
      
      {/* Custom Order Form */}
      <section id="custom-order-form" className="bg-crochet-50 py-16">
        <div className="container max-w-7xl mx-auto px-4 sm:px-6">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="font-display text-3xl font-medium text-crochet-900 mb-4">Request a Custom Order</h2>
              <p className="text-crochet-600">
                Tell us about your dream crochet item and we'll bring it to life for you.
              </p>
            </div>
            
            <div className="bg-white rounded-xl overflow-hidden shadow-sm border border-crochet-100 p-8">
              <form onSubmit={handleCustomOrderSubmit} className="space-y-6">
                <div className="space-y-2">
                  <label htmlFor="itemType" className="text-sm font-medium text-crochet-700">
                    Type of Item *
                  </label>
                  <input
                    id="itemType"
                    name="itemType"
                    type="text"
                    required
                    value={customOrderData.itemType}
                    onChange={handleCustomChange}
                    className="w-full px-4 py-3 rounded-lg border border-crochet-200 focus:ring-2 focus:ring-crochet-500 focus:border-transparent transition-colors"
                    placeholder="e.g. Blanket, Amigurumi, Garment"
                  />
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="description" className="text-sm font-medium text-crochet-700">
                    Description *
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    required
                    rows={4}
                    value={customOrderData.description}
                    onChange={handleCustomChange}
                    className="w-full px-4 py-3 rounded-lg border border-crochet-200 focus:ring-2 focus:ring-crochet-500 focus:border-transparent transition-colors resize-none"
                    placeholder="Please describe your custom item in detail (size, design, etc)"
                  />
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="preferredColors" className="text-sm font-medium text-crochet-700">
                    Preferred Colors
                  </label>
                  <input
                    id="preferredColors"
                    name="preferredColors"
                    type="text"
                    value={customOrderData.preferredColors}
                    onChange={handleCustomChange}
                    className="w-full px-4 py-3 rounded-lg border border-crochet-200 focus:ring-2 focus:ring-crochet-500 focus:border-transparent transition-colors"
                    placeholder="e.g. Blue, Green, Yellow"
                  />
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label htmlFor="budget" className="text-sm font-medium text-crochet-700">
                      Budget Range (Rs)
                    </label>
                    <input
                      id="budget"
                      name="budget"
                      type="text"
                      value={customOrderData.budget}
                      onChange={handleCustomChange}
                      className="w-full px-4 py-3 rounded-lg border border-crochet-200 focus:ring-2 focus:ring-crochet-500 focus:border-transparent transition-colors"
                      placeholder="e.g. 1000-3000"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label htmlFor="timeline" className="text-sm font-medium text-crochet-700">
                      Desired Timeline
                    </label>
                    <input
                      id="timeline"
                      name="timeline"
                      type="text"
                      value={customOrderData.timeline}
                      onChange={handleCustomChange}
                      className="w-full px-4 py-3 rounded-lg border border-crochet-200 focus:ring-2 focus:ring-crochet-500 focus:border-transparent transition-colors"
                      placeholder="e.g. 2 weeks, 1 month"
                    />
                  </div>
                </div>
                
                <Button 
                  type="submit"
                  disabled={isCustomSubmitting}
                  className="w-full bg-crochet-800 hover:bg-crochet-900"
                >
                  {isCustomSubmitting ? "Submitting Request..." : "Submit Custom Order Request"}
                </Button>
              </form>
            </div>
          </div>
        </div>
      </section>
      
      {/* Map Section - Removed image */}
      <section className="bg-crochet-50 py-16">
        <div className="container max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <h2 className="font-display text-3xl font-medium text-crochet-900 mb-4">Visit Our Store</h2>
            <p className="text-crochet-600 max-w-2xl mx-auto">
              Come see our products in person at our physical location
            </p>
          </div>
          
          <div className="bg-white rounded-xl overflow-hidden shadow-sm border border-crochet-100 p-8 text-center">
            <h3 className="font-medium text-xl mb-4">Store Address</h3>
            <p className="text-crochet-600 mb-4">
              Kimdol, Kathmandu, Nepal
            </p>
            <p className="text-crochet-600">
              <span className="font-medium">Business Hours:</span><br />
              Sunday - Friday: 10am - 8pm<br />
              Saturday: Closed
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;
