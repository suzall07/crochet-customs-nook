
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { loginCustomer, isCustomerLoggedIn, registerCustomer, verifyCustomerLogin } from '@/utils/authUtils';

interface Customer {
  id: string;
  name: string;
  email: string;
  password: string;
}

const CustomerLogin = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<string>('login');
  
  // Login states
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  
  // Register states
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  
  useEffect(() => {
    // Check if customer is already logged in
    if (isCustomerLoggedIn()) {
      navigate('/shop');
    }
    
    // Check if there's a remembered email
    const rememberedEmail = localStorage.getItem('rememberedEmail');
    if (rememberedEmail) {
      setLoginEmail(rememberedEmail);
      setRememberMe(true);
    }
  }, [navigate]);
  
  // Password validation
  const validatePassword = (password: string): boolean => {
    // Minimum 8 characters, at least one uppercase, one lowercase, one number, and one special character
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return passwordRegex.test(password);
  };
  
  // Email validation
  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };
  
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!loginEmail || !loginPassword) {
      toast({
        title: "Validation Error",
        description: "Please enter both email and password",
        variant: "destructive"
      });
      return;
    }
    
    if (!validateEmail(loginEmail)) {
      toast({
        title: "Invalid Email",
        description: "Please enter a valid email address",
        variant: "destructive"
      });
      return;
    }
    
    console.log('Attempting login for:', loginEmail);
    
    // Use the enhanced verification function
    const loginResult = verifyCustomerLogin(loginEmail, loginPassword);
    
    if (loginResult.success && loginResult.customer) {
      // Save email if remember me is checked
      if (rememberMe) {
        localStorage.setItem('rememberedEmail', loginEmail);
      } else {
        localStorage.removeItem('rememberedEmail');
      }
      
      // Use the auth utility to handle login
      loginCustomer({
        id: loginResult.customer.id,
        name: loginResult.customer.name,
        email: loginResult.customer.email,
        password: loginResult.customer.password
      });
      
      toast({
        title: "Login Successful",
        description: `Welcome back, ${loginResult.customer.name}!`
      });
      
      navigate('/shop');
    } else {
      console.log('Login failed:', loginResult.error);
      toast({
        title: "Login Failed",
        description: loginResult.error || "Invalid email or password. Please try again.",
        variant: "destructive"
      });
    }
  };
  
  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!name || !email || !password || !confirmPassword) {
      toast({
        title: "Validation Error",
        description: "Please fill in all fields",
        variant: "destructive"
      });
      return;
    }
    
    if (!validateEmail(email)) {
      toast({
        title: "Invalid Email",
        description: "Please enter a valid email address",
        variant: "destructive"
      });
      return;
    }
    
    if (!validatePassword(password)) {
      setPasswordError('Password must be at least 8 characters and include uppercase, lowercase, number, and special character');
      return;
    }
    
    if (password !== confirmPassword) {
      toast({
        title: "Validation Error",
        description: "Passwords do not match",
        variant: "destructive"
      });
      return;
    }
    
    console.log('Attempting registration for:', email);
    
    // Use the enhanced registration function
    const registrationResult = registerCustomer({ name, email, password });
    
    if (registrationResult.success && registrationResult.customer) {
      // Automatically log in the new customer
      loginCustomer({
        id: registrationResult.customer.id,
        name: registrationResult.customer.name,
        email: registrationResult.customer.email,
        password: registrationResult.customer.password
      });
      
      toast({
        title: "Registration Successful",
        description: `Welcome, ${name}! Your account has been created and you're now logged in.`
      });
      
      navigate('/shop');
    } else {
      console.log('Registration failed:', registrationResult.error);
      toast({
        title: "Registration Failed",
        description: registrationResult.error || "Unable to create account. Please try again.",
        variant: "destructive"
      });
    }
  };
  
  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newPassword = e.target.value;
    setPassword(newPassword);
    
    if (newPassword && !validatePassword(newPassword)) {
      setPasswordError('Password must be at least 8 characters and include uppercase, lowercase, number, and special character');
    } else {
      setPasswordError('');
    }
  };
  
  return (
    <div className="min-h-screen pt-24 pb-16 flex items-center justify-center">
      <div className="container max-w-md">
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Customer Account</CardTitle>
            <CardDescription>
              Login or create an account to shop
            </CardDescription>
          </CardHeader>
          
          <Tabs defaultValue="login" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid grid-cols-2 mx-4 bg-red-50">
              <TabsTrigger value="login" className="data-[state=active]:bg-red-600 data-[state=active]:text-white">Login</TabsTrigger>
              <TabsTrigger value="register" className="data-[state=active]:bg-red-600 data-[state=active]:text-white">Register</TabsTrigger>
            </TabsList>
            
            <TabsContent value="login">
              <form onSubmit={handleLogin}>
                <CardContent className="space-y-4 pt-4">
                  <div className="space-y-2">
                    <Label htmlFor="login-email">Email</Label>
                    <Input
                      id="login-email"
                      type="email"
                      placeholder="your@email.com"
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="login-password">Password</Label>
                    <Input
                      id="login-password"
                      type="password"
                      placeholder="••••••••"
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      required
                    />
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="remember-me" 
                      checked={rememberMe} 
                      onCheckedChange={(checked) => setRememberMe(checked === true)}
                    />
                    <label
                      htmlFor="remember-me"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      Remember me
                    </label>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button type="submit" className="w-full bg-red-600 hover:bg-red-700">
                    Login
                  </Button>
                </CardFooter>
              </form>
            </TabsContent>
            
            <TabsContent value="register">
              <form onSubmit={handleRegister}>
                <CardContent className="space-y-4 pt-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      placeholder="John Doe"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="your@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <Input
                      id="password"
                      type="password"
                      placeholder="••••••••"
                      value={password}
                      onChange={handlePasswordChange}
                      required
                    />
                    {passwordError && (
                      <p className="text-red-600 text-xs">{passwordError}</p>
                    )}
                    <p className="text-xs text-muted-foreground">
                      Password must be at least 8 characters and include uppercase, lowercase, number, and special character
                    </p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirm-password">Confirm Password</Label>
                    <Input
                      id="confirm-password"
                      type="password"
                      placeholder="••••••••"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                    />
                  </div>
                </CardContent>
                <CardFooter>
                  <Button type="submit" className="w-full bg-red-600 hover:bg-red-700">
                    Create Account
                  </Button>
                </CardFooter>
              </form>
            </TabsContent>
          </Tabs>
        </Card>
      </div>
    </div>
  );
};

export default CustomerLogin;

