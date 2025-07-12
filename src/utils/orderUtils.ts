
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
  status: 'pending' | 'processing' | 'shipped' | 'delivered';
  total: number;
  items: OrderItem[];
}

// Create a sample order for demonstration
export const createSampleOrder = (customerId: string): Order => {
  const products = JSON.parse(localStorage.getItem('products') || '[]');
  const sampleProducts = products.slice(0, 2); // Take first 2 products
  
  const orderItems: OrderItem[] = sampleProducts.map((product: any) => ({
    id: product.id,
    name: product.name,
    price: product.price,
    quantity: Math.floor(Math.random() * 3) + 1,
    image: product.image
  }));
  
  const total = orderItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  
  return {
    id: `ORD-${Date.now()}`,
    customerId,
    date: new Date().toLocaleDateString(),
    status: ['pending', 'processing', 'shipped', 'delivered'][Math.floor(Math.random() * 4)] as any,
    total,
    items: orderItems
  };
};

// Initialize sample orders for a customer
export const initializeSampleOrders = (customerId: string) => {
  const existingOrders = JSON.parse(localStorage.getItem(`orders_${customerId}`) || '[]');
  
  if (existingOrders.length === 0) {
    // Create 2-3 sample orders
    const sampleOrders = [];
    for (let i = 0; i < 3; i++) {
      sampleOrders.push(createSampleOrder(customerId));
    }
    localStorage.setItem(`orders_${customerId}`, JSON.stringify(sampleOrders));
  }
};

// Add a new order
export const addOrder = (order: Order) => {
  const existingOrders = JSON.parse(localStorage.getItem(`orders_${order.customerId}`) || '[]');
  existingOrders.unshift(order); // Add to beginning
  localStorage.setItem(`orders_${order.customerId}`, JSON.stringify(existingOrders));
};

// Get orders for a customer
export const getCustomerOrders = (customerId: string): Order[] => {
  return JSON.parse(localStorage.getItem(`orders_${customerId}`) || '[]');
};
