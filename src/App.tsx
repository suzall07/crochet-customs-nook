
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Suspense } from 'react';
import { QueryClientProvider, QueryClient } from '@tanstack/react-query';
import { TooltipProvider } from '@/components/ui/tooltip';
import Layout from './components/Layout';
import Index from './pages/Index';
import Shop from './pages/Shop';
import About from './pages/About';
import Contact from './pages/Contact';
import ProductDetail from './pages/ProductDetail';
import Search from './pages/Search';
import Cart from './pages/Cart';
import Popular from './pages/Popular';
import NotFound from './pages/NotFound';
import Admin from './pages/Admin';
import AdminSignup from './pages/AdminSignup';
import CustomerLogin from './pages/CustomerLogin';
import { Toaster } from '@/components/ui/toaster';
import './App.css';

function App() {
  // Create a client inside the component
  const queryClient = new QueryClient();
  
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <BrowserRouter>
          <Suspense fallback={<div>Loading...</div>}>
            <Layout>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/shop" element={<Shop />} />
                <Route path="/about" element={<About />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/products/:id" element={<ProductDetail />} />
                <Route path="/search" element={<Search />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/popular" element={<Popular />} />
                <Route path="/admin" element={<Admin />} />
                <Route path="/admin-signup" element={<AdminSignup />} />
                <Route path="/login" element={<CustomerLogin />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Layout>
          </Suspense>
        </BrowserRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
