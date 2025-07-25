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
  
  // Set session expiration (7 days for better persistence)
  const expirationTime = Date.now() + (7 * 24 * 60 * 60 * 1000);
  localStorage.setItem('adminSessionExpires', expirationTime.toString());
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
  localStorage.removeItem('adminSessionExpires');
};

export const isAdminLoggedIn = () => {
  const loggedIn = localStorage.getItem('adminLoggedIn') === 'true';
  if (!loggedIn) return false;
  
  // Check if session expired
  const sessionExpires = localStorage.getItem('adminSessionExpires');
  if (sessionExpires && parseInt(sessionExpires) < Date.now()) {
    logoutAdmin();
    return false;
  }
  
  return true;
};

// Customer authentication
export interface CustomerData {
  id: string;
  name: string;
  email: string;
  password?: string;
  joinDate?: string;
  createdAt?: string;
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
  
  // Set session expiration (30 days for better persistence)
  const expirationTime = Date.now() + (30 * 24 * 60 * 60 * 1000);
  localStorage.setItem('customerSessionExpires', expirationTime.toString());
  
  // Save cart if there's one in localStorage
  const cart = localStorage.getItem('cart');
  if (cart && customerData.id) {
    localStorage.setItem(`cart_${customerData.id}`, cart);
  }
  
  // Dispatch event to notify components of login
  window.dispatchEvent(new Event('customerAuthChanged'));
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
  localStorage.removeItem('customerSessionExpires');
  
  // Dispatch event to notify components of logout
  window.dispatchEvent(new Event('customerAuthChanged'));
};

export const isCustomerLoggedIn = () => {
  const loggedIn = localStorage.getItem('customerLoggedIn') === 'true';
  if (!loggedIn) return false;
  
  // Check if session expired
  const sessionExpires = localStorage.getItem('customerSessionExpires');
  if (sessionExpires && parseInt(sessionExpires) < Date.now()) {
    logoutCustomer();
    return false;
  }
  
  return true;
};

export const getCurrentCustomer = (): CustomerData | null => {
  if (!isCustomerLoggedIn()) return null;
  
  const customerStr = localStorage.getItem('currentCustomer');
  if (!customerStr) return null;
  
  try {
    const customer = JSON.parse(customerStr) as CustomerData;
    // Ensure backwards compatibility with joinDate
    if (!customer.joinDate && customer.createdAt) {
      customer.joinDate = customer.createdAt;
    }
    return customer;
  } catch (e) {
    console.error("Error parsing current customer data:", e);
    return null;
  }
};

// Enhanced customer registration function
export const registerCustomer = (customerData: { name: string, email: string, password: string }) => {
  try {
    // Get existing customers
    const customers = JSON.parse(localStorage.getItem('customers') || '[]');
    
    // Check if email already exists
    const existingCustomer = customers.find((c: CustomerData) => c.email === customerData.email);
    if (existingCustomer) {
      return { success: false, error: 'Email already exists' };
    }
    
    // Create new customer with unique ID and proper timestamps
    const now = new Date().toISOString();
    const newCustomer = {
      id: `customer_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      name: customerData.name,
      email: customerData.email,
      password: customerData.password,
      createdAt: now,
      joinDate: now
    };
    
    // Add to customers array
    customers.push(newCustomer);
    
    // Save updated customers array
    localStorage.setItem('customers', JSON.stringify(customers));
    
    console.log('Customer registered successfully:', { email: newCustomer.email, id: newCustomer.id });
    
    return { success: true, customer: newCustomer };
  } catch (error) {
    console.error('Error registering customer:', error);
    return { success: false, error: 'Registration failed' };
  }
};

// Enhanced customer login verification
export const verifyCustomerLogin = (email: string, password: string) => {
  try {
    const customers = JSON.parse(localStorage.getItem('customers') || '[]');
    console.log('Checking login for:', email);
    console.log('Available customers:', customers.map((c: CustomerData) => ({ email: c.email, id: c.id })));
    
    const customer = customers.find((c: CustomerData) => c.email === email && c.password === password);
    
    if (customer) {
      console.log('Login successful for:', email);
      return { success: true, customer };
    } else {
      console.log('Login failed - no matching customer found');
      return { success: false, error: 'Invalid email or password' };
    }
  } catch (error) {
    console.error('Error verifying login:', error);
    return { success: false, error: 'Login verification failed' };
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

// Search functionality
export const searchProducts = (query: string) => {
  try {
    const products = JSON.parse(localStorage.getItem('products') || '[]');
    if (!query.trim()) return products;
    
    const lowerQuery = query.toLowerCase().trim();
    
    return products.filter((product: any) => 
      product.name.toLowerCase().includes(lowerQuery) ||
      product.description.toLowerCase().includes(lowerQuery) ||
      product.category.toLowerCase().includes(lowerQuery)
    );
  } catch (e) {
    console.error('Error searching products:', e);
    return [];
  }
};

// Initialize default products if none exist
export const initializeDefaultProducts = () => {
  if (!localStorage.getItem('products')) {
    const defaultProducts = [
      {
        id: 1,
        name: "Handcrafted Crochet Blanket",
        price: 3500,
        category: "Blankets",
        image: "https://images.pexels.com/photos/6850711/pexels-photo-6850711.jpeg",
        description: "A beautiful handmade crochet blanket made with high-quality yarn. Perfect for adding warmth and style to your home.",
        stock: 15,
        isFeatured: true
      },
      {
        id: 2,
        name: "Crochet Baby Hat",
        price: 850,
        category: "Baby Items",
        image: "https://images.pexels.com/photos/8458560/pexels-photo-8458560.jpeg",
        description: "Adorable and soft crochet hat perfect for newborns and infants. Made with baby-friendly yarn.",
        stock: 8,
        isNew: true
      },
      {
        id: 3,
        name: "Decorative Crochet Pillow Cover",
        price: 1200,
        category: "Home Decor",
        image: "https://images.pexels.com/photos/4993247/pexels-photo-4993247.jpeg",
        description: "Add a touch of handmade charm to your living space with this unique crochet pillow cover.",
        stock: 12,
        isFeatured: true
      }
    ];
    
    localStorage.setItem('products', JSON.stringify(defaultProducts));
  }
};

// Initialize default customers if none exist - including a persistent demo account
export const initializeDefaultCustomers = () => {
  if (!localStorage.getItem('customers')) {
    const now = new Date().toISOString();
    const defaultCustomers = [
      {
        id: "demo-user-001",
        name: "Demo User",
        email: "demo@example.com",
        password: "Password1@",
        createdAt: now,
        joinDate: now
      }
    ];
    
    localStorage.setItem('customers', JSON.stringify(defaultCustomers));
    console.log('Initialized default customers');
  }
};

// Initialize default admin if none exists - for persistent login
export const initializeDefaultAdmin = () => {
  if (!localStorage.getItem('admin')) {
    const defaultAdmin = {
      name: "Admin User",
      email: "admin@crochet.com",
      password: "Admin123@"
    };
    
    localStorage.setItem('admin', JSON.stringify(defaultAdmin));
  }
};

// Check session on app load - with better error handling
export const checkSessionStatus = () => {
  try {
    // Check admin session
    if (localStorage.getItem('adminLoggedIn') === 'true') {
      const sessionExpires = localStorage.getItem('adminSessionExpires');
      if (sessionExpires && parseInt(sessionExpires) < Date.now()) {
        logoutAdmin();
      }
    }
    
    // Check customer session
    if (localStorage.getItem('customerLoggedIn') === 'true') {
      const sessionExpires = localStorage.getItem('customerSessionExpires');
      if (sessionExpires && parseInt(sessionExpires) < Date.now()) {
        logoutCustomer();
      }
    }
    
    // Log current state for debugging
    console.log('Session check completed');
    console.log('Customer logged in:', isCustomerLoggedIn());
    if (isCustomerLoggedIn()) {
      console.log('Current customer:', getCurrentCustomer());
    }
  } catch (error) {
    console.error('Error checking session status:', error);
  }
};

// Initialize all default data
export const initializeDefaultData = () => {
  initializeDefaultProducts();
  initializeDefaultCustomers();
  initializeDefaultAdmin();
};
