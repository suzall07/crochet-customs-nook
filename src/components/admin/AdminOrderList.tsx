
import { useState, useEffect } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Product } from '@/components/ProductCard';
import { Eye, XCircle, CheckCircle } from 'lucide-react';

interface Order {
  id: string;
  customer: {
    name: string;
    email: string;
    address: string;
  };
  items: (Product & { quantity: number })[];
  total: number;
  status: 'pending' | 'processing' | 'completed' | 'cancelled';
  date: string;
}

const defaultOrders: Order[] = [
  {
    id: 'ORD-001',
    customer: {
      name: 'Anish Limboo',
      email: 'anish@example.com',
      address: 'Kathmandu, Nepal'
    },
    items: [
      {
        id: 1,
        name: 'Cozy Winter Blanket',
        price: 3500,
        image: 'https://images.pexels.com/photos/6850490/pexels-photo-6850490.jpeg',
        category: 'Home Decor',
        quantity: 1
      },
      {
        id: 2,
        name: 'Amigurumi Elephant',
        price: 1200,
        image: 'https://images.pexels.com/photos/6850483/pexels-photo-6850483.jpeg',
        category: 'Toys',
        quantity: 2
      }
    ],
    total: 5900,
    status: 'pending',
    date: '2025-03-15T10:30:00'
  },
  {
    id: 'ORD-002',
    customer: {
      name: 'Sonal Rai',
      email: 'sonal@example.com',
      address: 'Pokhara, Nepal'
    },
    items: [
      {
        id: 3,
        name: 'Summer Hat',
        price: 900,
        image: 'https://images.pexels.com/photos/6850711/pexels-photo-6850711.jpeg',
        category: 'Apparel',
        quantity: 1
      }
    ],
    total: 900,
    status: 'processing',
    date: '2025-03-12T14:45:00'
  },
  {
    id: 'ORD-003',
    customer: {
      name: 'Ragita Shah',
      email: 'ragita@example.com',
      address: 'Lalitpur, Nepal'
    },
    items: [
      {
        id: 4,
        name: 'Baby Booties',
        price: 600,
        image: 'https://images.pexels.com/photos/6851381/pexels-photo-6851381.jpeg',
        category: 'Baby',
        quantity: 3
      }
    ],
    total: 1800,
    status: 'completed',
    date: '2025-03-10T09:15:00'
  }
];

const AdminOrderList = () => {
  const { toast } = useToast();
  const [orders, setOrders] = useState<Order[]>([]);
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  useEffect(() => {
    try {
      const storedOrders = localStorage.getItem('orders');
      if (storedOrders) {
        setOrders(JSON.parse(storedOrders));
      } else {
        // Initialize with default orders if none exist
        setOrders(defaultOrders);
        localStorage.setItem('orders', JSON.stringify(defaultOrders));
      }
    } catch (error) {
      console.error('Error loading orders:', error);
      setOrders(defaultOrders);
    }
  }, []);

  const handleViewDetails = (order: Order) => {
    setSelectedOrder(order);
    setIsDetailsDialogOpen(true);
  };

  const handleStatusChange = (orderId: string, newStatus: Order['status']) => {
    const updatedOrders = orders.map(order => 
      order.id === orderId ? { ...order, status: newStatus } : order
    );
    
    setOrders(updatedOrders);
    localStorage.setItem('orders', JSON.stringify(updatedOrders));
    
    toast({
      title: "Order Status Updated",
      description: `Order ${orderId} status changed to ${newStatus}.`
    });
    
    // Update selected order if it's currently open in details
    if (selectedOrder && selectedOrder.id === orderId) {
      setSelectedOrder({ ...selectedOrder, status: newStatus });
    }
  };

  const getStatusBadgeClass = (status: Order['status']) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'processing':
        return 'bg-blue-100 text-blue-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Order Management</CardTitle>
        <CardDescription>View and manage customer orders</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="border rounded-md">
          <div className="grid grid-cols-12 gap-2 p-4 font-medium bg-muted">
            <div className="col-span-1">ID</div>
            <div className="col-span-2">Customer</div>
            <div className="col-span-2">Date</div>
            <div className="col-span-2">Amount</div>
            <div className="col-span-2">Status</div>
            <div className="col-span-3">Actions</div>
          </div>
          <Separator />
          
          {orders.length === 0 ? (
            <div className="p-8 text-center text-muted-foreground">
              No orders found.
            </div>
          ) : (
            orders.map((order) => (
              <div key={order.id} className="grid grid-cols-12 gap-2 p-4 items-center">
                <div className="col-span-1">{order.id}</div>
                <div className="col-span-2">{order.customer.name}</div>
                <div className="col-span-2">{formatDate(order.date)}</div>
                <div className="col-span-2">Rs {order.total.toLocaleString()}</div>
                <div className="col-span-2">
                  <span className={`inline-block px-2 py-1 rounded-full text-xs ${getStatusBadgeClass(order.status)}`}>
                    {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                  </span>
                </div>
                <div className="col-span-3 flex space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleViewDetails(order)}
                  >
                    <Eye className="h-3.5 w-3.5 mr-1" />
                    Details
                  </Button>
                  {order.status === 'pending' && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-blue-500"
                      onClick={() => handleStatusChange(order.id, 'processing')}
                    >
                      Process
                    </Button>
                  )}
                  {order.status === 'processing' && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-green-500"
                      onClick={() => handleStatusChange(order.id, 'completed')}
                    >
                      <CheckCircle className="h-3.5 w-3.5 mr-1" />
                      Complete
                    </Button>
                  )}
                  {(order.status === 'pending' || order.status === 'processing') && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-red-500"
                      onClick={() => handleStatusChange(order.id, 'cancelled')}
                    >
                      <XCircle className="h-3.5 w-3.5 mr-1" />
                      Cancel
                    </Button>
                  )}
                </div>
                <Separator className="col-span-12 mt-2" />
              </div>
            ))
          )}
        </div>
      </CardContent>

      {/* Order Details Dialog */}
      <Dialog open={isDetailsDialogOpen} onOpenChange={setIsDetailsDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Order Details</DialogTitle>
          </DialogHeader>
          {selectedOrder && (
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Order Information</h3>
                  <p className="text-base font-medium mt-1">Order ID: {selectedOrder.id}</p>
                  <p className="text-sm">Date: {formatDate(selectedOrder.date)}</p>
                  <p className="text-sm mt-2">
                    Status: 
                    <span className={`inline-block ml-2 px-2 py-0.5 rounded-full text-xs ${getStatusBadgeClass(selectedOrder.status)}`}>
                      {selectedOrder.status.charAt(0).toUpperCase() + selectedOrder.status.slice(1)}
                    </span>
                  </p>
                  <p className="text-sm mt-2 font-medium">Total: Rs {selectedOrder.total.toLocaleString()}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Customer Information</h3>
                  <p className="text-base font-medium mt-1">{selectedOrder.customer.name}</p>
                  <p className="text-sm">{selectedOrder.customer.email}</p>
                  <p className="text-sm">{selectedOrder.customer.address}</p>
                </div>
              </div>
              
              <Separator />
              
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-2">Order Items</h3>
                <div className="space-y-2">
                  {selectedOrder.items.map((item, index) => (
                    <div key={index} className="flex items-center space-x-4 p-2 border rounded">
                      <div className="h-12 w-12 overflow-hidden rounded bg-gray-100">
                        <img 
                          src={item.image} 
                          alt={item.name} 
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <h4 className="text-sm font-medium">{item.name}</h4>
                        <p className="text-xs text-muted-foreground">{item.category}</p>
                      </div>
                      <div className="text-sm text-center w-16">
                        <p>x{item.quantity}</p>
                      </div>
                      <div className="text-sm font-medium text-right w-24">
                        Rs {(item.price * item.quantity).toLocaleString()}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              <Separator />
              
              <div className="flex justify-between">
                <div>
                  <p className="text-sm font-medium">Update Order Status</p>
                </div>
                <div className="flex space-x-2">
                  {selectedOrder.status !== 'completed' && selectedOrder.status !== 'cancelled' && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-green-600"
                      onClick={() => handleStatusChange(selectedOrder.id, 'completed')}
                    >
                      <CheckCircle className="h-4 w-4 mr-1" />
                      Mark as Completed
                    </Button>
                  )}
                  
                  {selectedOrder.status !== 'cancelled' && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-red-600"
                      onClick={() => handleStatusChange(selectedOrder.id, 'cancelled')}
                    >
                      <XCircle className="h-4 w-4 mr-1" />
                      Cancel Order
                    </Button>
                  )}
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button onClick={() => setIsDetailsDialogOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default AdminOrderList;
