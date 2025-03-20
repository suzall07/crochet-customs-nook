// Authentication utility functions

// Admin authentication
export const loginAdmin = (adminData: { name: string, email: string, password: string }) => {
  // Save admin data to localStorage
  localStorage.setItem('admin', JSON.stringify({
    ...adminData,
    isLoggedIn: true
  }));
  
  // Set admin logged in flag
  localStorage.setItem('adminLoggedIn', 'true');
  
  // Save current timestamp for session persistence
  localStorage.setItem('adminLoginTime', Date.now().toString());
};

export const logoutAdmin = () => {
  // We keep the admin data for future logins, but set logged in to false
  const admin = JSON.parse(localStorage.getItem('admin') || '{}');
  localStorage.setItem('admin', JSON.stringify({
    ...admin,
    isLoggedIn: false
  }));
  
  // Remove admin logged in flag
  localStorage.removeItem('adminLoggedIn');
  localStorage.removeItem('adminLoginTime');
};

export const isAdminLoggedIn = () => {
  return localStorage.getItem('adminLoggedIn') === 'true';
};

// Customer authentication
export interface CustomerData {
  id: string;
  name: string;
  email: string;
  password?: string;
}

export const loginCustomer = (customerData: CustomerData) => {
  // Remove password from customer data stored in currentCustomer
  const { password, ...safeCustomerData } = customerData;
  
  // Save customer logged in flag
  localStorage.setItem('customerLoggedIn', 'true');
  
  // Save customer data without password
  localStorage.setItem('currentCustomer', JSON.stringify(safeCustomerData));
  
  // Save login timestamp for session persistence
  localStorage.setItem('customerLoginTime', Date.now().toString());
  
  // Save cart if there's one in localStorage
  const cart = localStorage.getItem('cart');
  if (cart && customerData.id) {
    localStorage.setItem(`cart_${customerData.id}`, cart);
  }
};

export const logoutCustomer = () => {
  // Save the current cart to the generic cart if user is logged in
  const customerData = getCurrentCustomer();
  if (customerData?.id) {
    const customerCart = localStorage.getItem(`cart_${customerData.id}`);
    if (customerCart) {
      localStorage.setItem('cart', customerCart);
    }
  }
  
  // Remove customer login flags
  localStorage.removeItem('customerLoggedIn');
  localStorage.removeItem('currentCustomer');
  localStorage.removeItem('customerLoginTime');
};

export const isCustomerLoggedIn = () => {
  return localStorage.getItem('customerLoggedIn') === 'true';
};

export const getCurrentCustomer = (): CustomerData | null => {
  const customerStr = localStorage.getItem('currentCustomer');
  if (!customerStr) return null;
  
  try {
    return JSON.parse(customerStr) as CustomerData;
  } catch (e) {
    console.error("Error parsing current customer data:", e);
    return null;
  }
};

// Cart functionality
export const saveProductToCart = (productId: number | string, quantity: number = 1) => {
  const customer = getCurrentCustomer();
  let cartKey = 'cart';
  
  // If customer is logged in, use their specific cart
  if (customer?.id) {
    cartKey = `cart_${customer.id}`;
  }
  
  try {
    // Get existing cart or create new one
    const cartStr = localStorage.getItem(cartKey);
    const cart = cartStr ? JSON.parse(cartStr) : [];
    
    // Check if product already in cart
    const existingProductIndex = cart.findIndex((item: any) => item.productId === productId);
    
    if (existingProductIndex >= 0) {
      // Update quantity if product exists
      cart[existingProductIndex].quantity += quantity;
    } else {
      // Add new product to cart
      cart.push({
        productId,
        quantity,
        addedAt: new Date().toISOString()
      });
    }
    
    // Save updated cart
    localStorage.setItem(cartKey, JSON.stringify(cart));
    
    // Dispatch event to notify components
    window.dispatchEvent(new Event('cartUpdated'));
    
    return true;
  } catch (e) {
    console.error("Error saving product to cart:", e);
    return false;
  }
};
