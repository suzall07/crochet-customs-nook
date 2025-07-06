
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Package, Truck, CheckCircle, Clock, MapPin } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Order {
  id: string;
  order_number: string;
  status: string;
  total_amount: number;
  created_at: string;
  estimated_delivery: string;
  tracking_number?: string;
  shipping_address: any;
  items: any[];
}

interface TrackingStep {
  status: string;
  icon: React.ReactNode;
  title: string;
  description: string;
  completed: boolean;
  active: boolean;
}

const OrderTracking: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [trackingNumber, setTrackingNumber] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchUserOrders();
  }, []);

  const fetchUserOrders = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // This would fetch from an orders table - for demo purposes, we'll use mock data
      const mockOrders: Order[] = [
        {
          id: '1',
          order_number: 'ORD-2024-001',
          status: 'shipped',
          total_amount: 89.99,
          created_at: '2024-01-15T10:30:00Z',
          estimated_delivery: '2024-01-20T18:00:00Z',
          tracking_number: 'TRK123456789',
          shipping_address: {
            street: '123 Main St',
            city: 'New York',
            state: 'NY',
            zip: '10001'
          },
          items: [
            { name: 'Handmade Scarf', quantity: 1, price: 45.99 },
            { name: 'Crochet Hat', quantity: 1, price: 34.00 }
          ]
        },
        {
          id: '2',
          order_number: 'ORD-2024-002',
          status: 'processing',
          total_amount: 125.50,
          created_at: '2024-01-18T14:15:00Z',
          estimated_delivery: '2024-01-25T18:00:00Z',
          shipping_address: {
            street: '456 Oak Ave',
            city: 'Los Angeles',
            state: 'CA',
            zip: '90210'
          },
          items: [
            { name: 'Baby Blanket', quantity: 1, price: 125.50 }
          ]
        }
      ];

      setOrders(mockOrders);
    } catch (error) {
      console.error('Error fetching orders:', error);
    }
  };

  const trackOrder = async () => {
    if (!trackingNumber.trim()) {
      toast({
        title: "Error",
        description: "Please enter a tracking number",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    try {
      // In a real app, this would query your orders table
      const order = orders.find(o => 
        o.tracking_number === trackingNumber || 
        o.order_number === trackingNumber
      );

      if (order) {
        setSelectedOrder(order);
        toast({
          title: "Order Found",
          description: `Order ${order.order_number} is currently ${order.status}`
        });
      } else {
        toast({
          title: "Order Not Found",
          description: "Please check your tracking number and try again",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Error tracking order:', error);
      toast({
        title: "Error",
        description: "Failed to track order",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const getTrackingSteps = (order: Order): TrackingStep[] => {
    const statuses = ['placed', 'confirmed', 'processing', 'shipped', 'delivered'];
    const currentIndex = statuses.indexOf(order.status);

    return [
      {
        status: 'placed',
        icon: <Clock className="h-5 w-5" />,
        title: 'Order Placed',
        description: 'Your order has been received',
        completed: currentIndex >= 0,
        active: currentIndex === 0
      },
      {
        status: 'confirmed',
        icon: <CheckCircle className="h-5 w-5" />,
        title: 'Order Confirmed',
        description: 'Payment processed successfully',
        completed: currentIndex >= 1,
        active: currentIndex === 1
      },
      {
        status: 'processing',
        icon: <Package className="h-5 w-5" />,
        title: 'Processing',
        description: 'Your items are being prepared',
        completed: currentIndex >= 2,
        active: currentIndex === 2
      },
      {
        status: 'shipped',
        icon: <Truck className="h-5 w-5" />,
        title: 'Shipped',
        description: 'Your order is on its way',
        completed: currentIndex >= 3,
        active: currentIndex === 3
      },
      {
        status: 'delivered',
        icon: <MapPin className="h-5 w-5" />,
        title: 'Delivered',
        description: 'Order has been delivered',
        completed: currentIndex >= 4,
        active: currentIndex === 4
      }
    ];
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'placed': return 'default';
      case 'confirmed': return 'secondary';
      case 'processing': return 'secondary';
      case 'shipped': return 'default';
      case 'delivered': return 'default';
      default: return 'default';
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-bold mb-6">Order Tracking</h1>

      {/* Tracking Input */}
      <Card>
        <CardHeader>
          <CardTitle>Track Your Order</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="tracking">Order Number or Tracking Number</Label>
            <Input
              id="tracking"
              value={trackingNumber}
              onChange={(e) => setTrackingNumber(e.target.value)}
              placeholder="Enter your order or tracking number"
            />
          </div>
          <Button onClick={trackOrder} disabled={loading}>
            {loading ? 'Tracking...' : 'Track Order'}
          </Button>
        </CardContent>
      </Card>

      {/* Order Details */}
      {selectedOrder && (
        <Card>
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle>Order {selectedOrder.order_number}</CardTitle>
                <p className="text-sm text-gray-600 mt-1">
                  Placed on {new Date(selectedOrder.created_at).toLocaleDateString()}
                </p>
              </div>
              <Badge variant={getStatusColor(selectedOrder.status) as any}>
                {selectedOrder.status.toUpperCase()}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Tracking Steps */}
            <div className="space-y-4">
              <h3 className="font-semibold">Tracking Progress</h3>
              <div className="space-y-4">
                {getTrackingSteps(selectedOrder).map((step, index) => (
                  <div key={step.status} className="flex items-center space-x-4">
                    <div className={`flex items-center justify-center w-10 h-10 rounded-full ${
                      step.completed ? 'bg-black text-white' : 
                      step.active ? 'bg-gray-200 text-gray-600' : 'bg-gray-100 text-gray-400'
                    }`}>
                      {step.icon}
                    </div>
                    <div className="flex-1">
                      <h4 className={`font-medium ${step.completed || step.active ? 'text-black' : 'text-gray-400'}`}>
                        {step.title}
                      </h4>
                      <p className={`text-sm ${step.completed || step.active ? 'text-gray-600' : 'text-gray-400'}`}>
                        {step.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Order Items */}
            <div>
              <h3 className="font-semibold mb-3">Order Items</h3>
              <div className="space-y-2">
                {selectedOrder.items.map((item, index) => (
                  <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded">
                    <div>
                      <span className="font-medium">{item.name}</span>
                      <span className="text-gray-600 ml-2">x{item.quantity}</span>
                    </div>
                    <span className="font-medium">${item.price}</span>
                  </div>
                ))}
              </div>
              <div className="border-t pt-2 mt-2">
                <div className="flex justify-between items-center font-bold">
                  <span>Total</span>
                  <span>${selectedOrder.total_amount}</span>
                </div>
              </div>
            </div>

            {/* Shipping Information */}
            <div>
              <h3 className="font-semibold mb-3">Shipping Information</h3>
              <div className="bg-gray-50 p-4 rounded">
                <p className="font-medium">Delivery Address:</p>
                <p>{selectedOrder.shipping_address.street}</p>
                <p>{selectedOrder.shipping_address.city}, {selectedOrder.shipping_address.state} {selectedOrder.shipping_address.zip}</p>
                {selectedOrder.tracking_number && (
                  <p className="mt-2">
                    <span className="font-medium">Tracking Number:</span> {selectedOrder.tracking_number}
                  </p>
                )}
                <p className="mt-2">
                  <span className="font-medium">Estimated Delivery:</span>{' '}
                  {new Date(selectedOrder.estimated_delivery).toLocaleDateString()}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Recent Orders */}
      <Card>
        <CardHeader>
          <CardTitle>Your Recent Orders</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {orders.map((order) => (
              <div key={order.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <h4 className="font-medium">{order.order_number}</h4>
                  <p className="text-sm text-gray-600">
                    {new Date(order.created_at).toLocaleDateString()} • ${order.total_amount}
                  </p>
                </div>
                <div className="flex items-center space-x-3">
                  <Badge variant={getStatusColor(order.status) as any}>
                    {order.status.toUpperCase()}
                  </Badge>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSelectedOrder(order)}
                  >
                    View Details
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default OrderTracking;
