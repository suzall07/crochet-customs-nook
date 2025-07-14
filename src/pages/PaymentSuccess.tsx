import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle, Package, ArrowRight, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const PaymentSuccess = () => {
  const navigate = useNavigate();
  const [orderDetails, setOrderDetails] = useState<any>(null);

  useEffect(() => {
    // Clear cart after successful payment
    localStorage.removeItem('cart');
    window.dispatchEvent(new Event('cartUpdated'));

    // Get order details from localStorage (if available)
    const orders = JSON.parse(localStorage.getItem('orders') || '[]');
    if (orders.length > 0) {
      setOrderDetails(orders[orders.length - 1]); // Get the latest order
    }
  }, []);

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="container max-w-2xl mx-auto px-4">
        <div className="text-center mb-8">
          <div className="mx-auto flex items-center justify-center w-16 h-16 rounded-full bg-green-100 mb-4">
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
          <h1 className="text-3xl font-bold text-crochet-900 mb-2">Payment Successful!</h1>
          <p className="text-muted-foreground">
            Thank you for your purchase. Your payment has been processed successfully.
          </p>
        </div>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Package className="h-5 w-5 mr-2" />
              Order Confirmation
            </CardTitle>
            <CardDescription>
              Your order has been confirmed and will be processed shortly.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {orderDetails && (
              <>
                <div className="flex justify-between py-2 border-b">
                  <span className="font-medium">Order ID:</span>
                  <span>{orderDetails.id}</span>
                </div>
                <div className="flex justify-between py-2 border-b">
                  <span className="font-medium">Total Amount:</span>
                  <span className="font-semibold">Rs {orderDetails.total?.toLocaleString()}</span>
                </div>
                <div className="flex justify-between py-2 border-b">
                  <span className="font-medium">Payment Method:</span>
                  <span>Khalti</span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="font-medium">Status:</span>
                  <span className="text-green-600 font-semibold">Paid</span>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        <Card className="mb-8">
          <CardContent className="pt-6">
            <div className="space-y-3">
              <h3 className="font-semibold mb-3">What happens next?</h3>
              <div className="flex items-start">
                <div className="w-6 h-6 rounded-full bg-crochet-100 flex items-center justify-center mr-3 mt-0.5">
                  <span className="text-xs font-semibold text-crochet-800">1</span>
                </div>
                <div>
                  <p className="font-medium">Order Processing</p>
                  <p className="text-sm text-muted-foreground">We'll prepare your order for shipment</p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="w-6 h-6 rounded-full bg-crochet-100 flex items-center justify-center mr-3 mt-0.5">
                  <span className="text-xs font-semibold text-crochet-800">2</span>
                </div>
                <div>
                  <p className="font-medium">Shipment</p>
                  <p className="text-sm text-muted-foreground">Your order will be shipped within 2-3 business days</p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="w-6 h-6 rounded-full bg-crochet-100 flex items-center justify-center mr-3 mt-0.5">
                  <span className="text-xs font-semibold text-crochet-800">3</span>
                </div>
                <div>
                  <p className="font-medium">Delivery</p>
                  <p className="text-sm text-muted-foreground">Your order will arrive at your doorstep</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button 
            onClick={() => navigate('/shop')}
            variant="outline"
            className="flex items-center"
          >
            Continue Shopping
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
          <Button 
            onClick={() => navigate('/')}
            className="bg-crochet-800 flex items-center"
          >
            <Home className="h-4 w-4 mr-2" />
            Go to Home
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccess;