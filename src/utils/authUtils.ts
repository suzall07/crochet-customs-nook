
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
  
  // Set session expiration (24 hours)
  const expirationTime = Date.now() + (24 * 60 * 60 * 1000);
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
  
  // Set session expiration (24 hours)
  const expirationTime = Date.now() + (24 * 60 * 60 * 1000);
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

// Initialize default customers if none exist
export const initializeDefaultCustomers = () => {
  if (!localStorage.getItem('customers')) {
    // Create a strong password for the demo account
    const defaultCustomers = [
      {
        id: "1",
        name: "Demo User",
        email: "demo@example.com",
        password: "Password1@"
      }
    ];
    
    localStorage.setItem('customers', JSON.stringify(defaultCustomers));
  }
};

// Check session on app load
export const checkSessionStatus = () => {
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
};
