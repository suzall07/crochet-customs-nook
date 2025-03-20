
import { useState, useEffect } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Mail, User, Phone, MapPin, Clock, ShoppingBag } from 'lucide-react';

interface Customer {
  id: number;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  orderCount: number;
  totalSpent: number;
  registrationDate: string;
}

const defaultCustomers: Customer[] = [
  {
    id: 1,
    name: 'Anish Limboo',
    email: 'anish@example.com',
    phone: '+9779801111111',
    address: 'Kathmandu, Nepal',
    orderCount: 3,
    totalSpent: 8500,
    registrationDate: '2025-01-15T10:30:00'
  },
  {
    id: 2,
    name: 'Sonal Rai',
    email: 'sonal@example.com',
    phone: '+9779802222222',
    address: 'Pokhara, Nepal',
    orderCount: 1,
    totalSpent: 2200,
    registrationDate: '2025-02-20T14:45:00'
  },
  {
    id: 3,
    name: 'Ragita Shah',
    email: 'ragita@example.com',
    phone: '+9779803333333',
    address: 'Lalitpur, Nepal',
    orderCount: 5,
    totalSpent: 12000,
    registrationDate: '2025-01-05T09:15:00'
  }
];

const AdminCustomerList = () => {
  const { toast } = useToast();
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false);
  const [isEmailDialogOpen, setIsEmailDialogOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [emailSubject, setEmailSubject] = useState('');
  const [emailBody, setEmailBody] = useState('');

  useEffect(() => {
    try {
      const storedCustomers = localStorage.getItem('customers');
      if (storedCustomers) {
        setCustomers(JSON.parse(storedCustomers));
      } else {
        // Initialize with default customers if none exist
        setCustomers(defaultCustomers);
        localStorage.setItem('customers', JSON.stringify(defaultCustomers));
      }
    } catch (error) {
      console.error('Error loading customers:', error);
      setCustomers(defaultCustomers);
    }
  }, []);

  const handleViewDetails = (customer: Customer) => {
    setSelectedCustomer(customer);
    setIsDetailsDialogOpen(true);
  };

  const handleOpenEmailDialog = (customer: Customer) => {
    setSelectedCustomer(customer);
    setEmailSubject(`Special Offer for ${customer.name}`);
    setEmailBody(`Dear ${customer.name},\n\nWe have a special offer just for you!\n\nBest regards,\nCrochet with Limboo`);
    setIsEmailDialogOpen(true);
  };

  const handleSendEmail = () => {
    if (!selectedCustomer || !emailSubject || !emailBody) return;
    
    toast({
      title: "Email Sent",
      description: `Email has been sent to ${selectedCustomer.name}.`
    });
    
    setIsEmailDialogOpen(false);
    setEmailSubject('');
    setEmailBody('');
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Customer Management</CardTitle>
        <CardDescription>View and manage customer accounts</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="border rounded-md">
          <div className="grid grid-cols-12 gap-2 p-4 font-medium bg-muted">
            <div className="col-span-1">ID</div>
            <div className="col-span-3">Name</div>
            <div className="col-span-3">Email</div>
            <div className="col-span-2">Orders</div>
            <div className="col-span-3">Actions</div>
          </div>
          <Separator />
          
          {customers.length === 0 ? (
            <div className="p-8 text-center text-muted-foreground">
              No customers found.
            </div>
          ) : (
            customers.map((customer) => (
              <div key={customer.id} className="grid grid-cols-12 gap-2 p-4 items-center">
                <div className="col-span-1">{customer.id}</div>
                <div className="col-span-3">{customer.name}</div>
                <div className="col-span-3">{customer.email}</div>
                <div className="col-span-2">{customer.orderCount}</div>
                <div className="col-span-3 flex space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleViewDetails(customer)}
                  >
                    <User className="h-3.5 w-3.5 mr-1" />
                    View
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleOpenEmailDialog(customer)}
                  >
                    <Mail className="h-3.5 w-3.5 mr-1" />
                    Email
                  </Button>
                </div>
                <Separator className="col-span-12 mt-2" />
              </div>
            ))
          )}
        </div>
      </CardContent>

      {/* Customer Details Dialog */}
      <Dialog open={isDetailsDialogOpen} onOpenChange={setIsDetailsDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Customer Details</DialogTitle>
          </DialogHeader>
          {selectedCustomer && (
            <div className="space-y-4 py-4">
              <div className="flex items-center space-x-4">
                <div className="h-16 w-16 rounded-full bg-crochet-100 flex items-center justify-center text-crochet-800">
                  <User className="h-8 w-8" />
                </div>
                <div>
                  <h3 className="text-lg font-medium">{selectedCustomer.name}</h3>
                  <p className="text-sm text-muted-foreground">Customer ID: {selectedCustomer.id}</p>
                </div>
              </div>
              
              <Separator />
              
              <div className="space-y-2">
                <div className="flex items-start space-x-3">
                  <Mail className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="text-sm font-medium">Email</p>
                    <p className="text-sm">{selectedCustomer.email}</p>
                  </div>
                </div>
                
                {selectedCustomer.phone && (
                  <div className="flex items-start space-x-3">
                    <Phone className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="text-sm font-medium">Phone</p>
                      <p className="text-sm">{selectedCustomer.phone}</p>
                    </div>
                  </div>
                )}
                
                {selectedCustomer.address && (
                  <div className="flex items-start space-x-3">
                    <MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="text-sm font-medium">Address</p>
                      <p className="text-sm">{selectedCustomer.address}</p>
                    </div>
                  </div>
                )}
              </div>
              
              <Separator />
              
              <div className="space-y-2">
                <div className="flex items-start space-x-3">
                  <Clock className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="text-sm font-medium">Customer Since</p>
                    <p className="text-sm">{formatDate(selectedCustomer.registrationDate)}</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <ShoppingBag className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="text-sm font-medium">Order History</p>
                    <p className="text-sm">{selectedCustomer.orderCount} orders placed</p>
                    <p className="text-sm">Total spent: Rs {selectedCustomer.totalSpent.toLocaleString()}</p>
                  </div>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => handleOpenEmailDialog(selectedCustomer!)}
            >
              <Mail className="h-4 w-4 mr-2" />
              Send Email
            </Button>
            <Button onClick={() => setIsDetailsDialogOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Send Email Dialog */}
      <Dialog open={isEmailDialogOpen} onOpenChange={setIsEmailDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Send Email to Customer</DialogTitle>
          </DialogHeader>
          {selectedCustomer && (
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <p className="text-sm font-medium">To</p>
                <div className="flex items-center space-x-2 p-2 border rounded bg-muted">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span>{selectedCustomer.email}</span>
                </div>
              </div>
              
              <div className="space-y-2">
                <label htmlFor="subject" className="text-sm font-medium">Subject</label>
                <input
                  id="subject"
                  type="text"
                  value={emailSubject}
                  onChange={(e) => setEmailSubject(e.target.value)}
                  className="w-full p-2 border rounded"
                  placeholder="Email subject"
                />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="message" className="text-sm font-medium">Message</label>
                <textarea
                  id="message"
                  value={emailBody}
                  onChange={(e) => setEmailBody(e.target.value)}
                  className="w-full p-2 border rounded h-40 resize-none"
                  placeholder="Type your message here..."
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEmailDialogOpen(false)}>Cancel</Button>
            <Button 
              className="bg-crochet-800"
              onClick={handleSendEmail}
              disabled={!emailSubject || !emailBody}
            >
              <Mail className="h-4 w-4 mr-2" />
              Send Email
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default AdminCustomerList;
