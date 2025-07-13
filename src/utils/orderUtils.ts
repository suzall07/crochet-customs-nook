
// Order management utilities

export interface OrderItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

export interface Order {
  id: string;
  customerId: string;
  date: string;
  status: 'confirmed' | 'shipped' | 'delivered';
  total: number;
  items: OrderItem[];
  shippingAddress?: {
    street: string;
    city: string;
    state: string;
    zip: string;
  };
}

// Add a new order (called after successful checkout)
export const addOrder = (order: Order) => {
  const existingOrders = JSON.parse(localStorage.getItem(`orders_${order.customerId}`) || '[]');
  existingOrders.unshift(order); // Add to beginning
  localStorage.setItem(`orders_${order.customerId}`, JSON.stringify(existingOrders));
};

// Get orders for a customer
export const getCustomerOrders = (customerId: string): Order[] => {
  return JSON.parse(localStorage.getItem(`orders_${customerId}`) || '[]');
};

// Create order from cart items (utility function for checkout)
export const createOrderFromCart = (
  customerId: string,
  cartItems: any[],
  shippingAddress: any
): Order => {
  const orderItems: OrderItem[] = cartItems.map(item => ({
    id: item.id,
    name: item.name,
    price: item.price,
    quantity: item.quantity,
    image: item.image
  }));

  const total = orderItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  return {
    id: `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 5).toUpperCase()}`,
    customerId,
    date: new Date().toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    }),
    status: 'confirmed',
    total,
    items: orderItems,
    shippingAddress
  };
};

// Update order status (for admin or system updates)
export const updateOrderStatus = (customerId: string, orderId: string, newStatus: Order['status']) => {
  const orders = getCustomerOrders(customerId);
  const updatedOrders = orders.map(order => 
    order.id === orderId 
      ? { ...order, status: newStatus }
      : order
  );
  localStorage.setItem(`orders_${customerId}`, JSON.stringify(updatedOrders));
};
