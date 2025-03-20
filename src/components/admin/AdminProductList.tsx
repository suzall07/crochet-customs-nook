
import { useState, useEffect } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Product } from '@/components/ProductCard';
import { PlusCircle, Edit, Trash } from 'lucide-react';

const defaultProducts: Product[] = [
  {
    id: 1,
    name: "Cozy Winter Blanket",
    price: 3500,
    image: "https://images.pexels.com/photos/6850490/pexels-photo-6850490.jpeg",
    category: "Home Decor",
    isNew: true,
  },
  {
    id: 2,
    name: "Amigurumi Elephant",
    price: 1200,
    image: "https://images.pexels.com/photos/6850483/pexels-photo-6850483.jpeg",
    category: "Toys",
    isFeatured: true,
  },
  {
    id: 3,
    name: "Summer Hat",
    price: 900,
    image: "https://images.pexels.com/photos/6850711/pexels-photo-6850711.jpeg",
    category: "Apparel",
  },
  {
    id: 4,
    name: "Baby Booties",
    price: 600,
    image: "https://images.pexels.com/photos/6851381/pexels-photo-6851381.jpeg",
    category: "Baby",
    isNew: true,
  },
];

const AdminProductList = () => {
  const { toast } = useToast();
  const [products, setProducts] = useState<Product[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [currentProduct, setCurrentProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState({
    id: 0,
    name: '',
    price: 0,
    image: '',
    category: '',
    isNew: false,
    isFeatured: false
  });

  useEffect(() => {
    try {
      const storedProducts = localStorage.getItem('products');
      if (storedProducts) {
        setProducts(JSON.parse(storedProducts));
      } else {
        // Initialize with default products if none exist
        setProducts(defaultProducts);
        localStorage.setItem('products', JSON.stringify(defaultProducts));
      }
    } catch (error) {
      console.error('Error loading products:', error);
      setProducts(defaultProducts);
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else if (name === 'price') {
      setFormData(prev => ({ ...prev, [name]: parseInt(value) || 0 }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleAddEdit = () => {
    if (!formData.name || !formData.price || !formData.image || !formData.category) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }

    let updatedProducts: Product[];
    if (formData.id === 0) {
      // Add new product
      const newProduct = {
        ...formData,
        id: Math.max(0, ...products.map(p => p.id)) + 1
      };
      updatedProducts = [...products, newProduct];
      toast({
        title: "Product Added",
        description: `${formData.name} has been added to products.`
      });
    } else {
      // Update existing product
      updatedProducts = products.map(product => 
        product.id === formData.id ? formData : product
      );
      toast({
        title: "Product Updated",
        description: `${formData.name} has been updated.`
      });
    }

    setProducts(updatedProducts);
    localStorage.setItem('products', JSON.stringify(updatedProducts));
    setIsDialogOpen(false);
    resetForm();
  };

  const handleDelete = () => {
    if (!currentProduct) return;
    
    const updatedProducts = products.filter(product => product.id !== currentProduct.id);
    setProducts(updatedProducts);
    localStorage.setItem('products', JSON.stringify(updatedProducts));
    
    toast({
      title: "Product Deleted",
      description: `${currentProduct.name} has been removed.`
    });
    
    setIsDeleteDialogOpen(false);
    setCurrentProduct(null);
  };

  const openAddDialog = () => {
    resetForm();
    setIsDialogOpen(true);
  };

  const openEditDialog = (product: Product) => {
    setFormData({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      category: product.category,
      isNew: product.isNew || false,
      isFeatured: product.isFeatured || false
    });
    setIsDialogOpen(true);
  };

  const openDeleteDialog = (product: Product) => {
    setCurrentProduct(product);
    setIsDeleteDialogOpen(true);
  };

  const resetForm = () => {
    setFormData({
      id: 0,
      name: '',
      price: 0,
      image: '',
      category: '',
      isNew: false,
      isFeatured: false
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Products Management</CardTitle>
        <CardDescription>Manage your product catalog</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex justify-end mb-4">
          <Button 
            className="bg-crochet-800"
            onClick={openAddDialog}
          >
            <PlusCircle className="mr-2 h-4 w-4" />
            Add New Product
          </Button>
        </div>
        <div className="border rounded-md">
          <div className="grid grid-cols-12 gap-2 p-4 font-medium bg-muted">
            <div className="col-span-1">ID</div>
            <div className="col-span-3">Name</div>
            <div className="col-span-2">Category</div>
            <div className="col-span-2">Price</div>
            <div className="col-span-2">Status</div>
            <div className="col-span-2">Actions</div>
          </div>
          <Separator />
          {products.length === 0 ? (
            <div className="p-8 text-center text-muted-foreground">
              No products found. Add some products to get started.
            </div>
          ) : (
            products.map((product) => (
              <div key={product.id} className="grid grid-cols-12 gap-2 p-4 items-center">
                <div className="col-span-1">{product.id}</div>
                <div className="col-span-3">{product.name}</div>
                <div className="col-span-2">{product.category}</div>
                <div className="col-span-2">Rs {product.price.toLocaleString()}</div>
                <div className="col-span-2">
                  {product.isNew && (
                    <span className="inline-block px-2 py-1 rounded-full text-xs bg-green-100 text-green-800 mr-1">
                      New
                    </span>
                  )}
                  {product.isFeatured && (
                    <span className="inline-block px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800">
                      Featured
                    </span>
                  )}
                  {!product.isNew && !product.isFeatured && (
                    <span className="inline-block px-2 py-1 rounded-full text-xs bg-gray-100 text-gray-800">
                      Standard
                    </span>
                  )}
                </div>
                <div className="col-span-2 flex space-x-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => openEditDialog(product)}
                  >
                    <Edit className="h-3.5 w-3.5 mr-1" />
                    Edit
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="text-red-500"
                    onClick={() => openDeleteDialog(product)}
                  >
                    <Trash className="h-3.5 w-3.5 mr-1" />
                    Delete
                  </Button>
                </div>
                <Separator className="col-span-12 mt-2" />
              </div>
            ))
          )}
        </div>
      </CardContent>

      {/* Add/Edit Product Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>{formData.id === 0 ? 'Add New Product' : 'Edit Product'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Product Name *</Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter product name"
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="price">Price (Rs) *</Label>
                <Input
                  id="price"
                  name="price"
                  type="number"
                  value={formData.price}
                  onChange={handleChange}
                  placeholder="Enter price"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="category">Category *</Label>
                <select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full px-3 py-2 rounded-md border border-input bg-transparent"
                  required
                >
                  <option value="">Select category</option>
                  <option value="Home Decor">Home Decor</option>
                  <option value="Apparel">Apparel</option>
                  <option value="Toys">Toys</option>
                  <option value="Baby">Baby</option>
                  <option value="Accessories">Accessories</option>
                </select>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="image">Image URL *</Label>
              <Input
                id="image"
                name="image"
                value={formData.image}
                onChange={handleChange}
                placeholder="Enter image URL"
                required
              />
            </div>
            <div className="flex space-x-4">
              <div className="flex items-center space-x-2">
                <input
                  id="isNew"
                  name="isNew"
                  type="checkbox"
                  checked={formData.isNew}
                  onChange={handleChange}
                  className="rounded border-input"
                />
                <Label htmlFor="isNew">Mark as New</Label>
              </div>
              <div className="flex items-center space-x-2">
                <input
                  id="isFeatured"
                  name="isFeatured"
                  type="checkbox"
                  checked={formData.isFeatured}
                  onChange={handleChange}
                  className="rounded border-input"
                />
                <Label htmlFor="isFeatured">Mark as Featured</Label>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
            <Button className="bg-crochet-800" onClick={handleAddEdit}>
              {formData.id === 0 ? 'Add Product' : 'Update Product'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p>Are you sure you want to delete "{currentProduct?.name}"? This action cannot be undone.</p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>Cancel</Button>
            <Button variant="destructive" onClick={handleDelete}>Delete</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default AdminProductList;
