
import { useState, useEffect, useRef } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Product } from '@/components/ProductCard';
import { PlusCircle, Edit, Trash, Image, AlertTriangle } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { supabase } from '@/integrations/supabase/client';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

const defaultProducts: Product[] = [
  {
    id: 1,
    name: "Cozy Winter Blanket",
    price: 3500,
    image: "https://images.pexels.com/photos/6850490/pexels-photo-6850490.jpeg",
    category: "Shop",
    isNew: true,
    stock: 10,
    description: "This beautiful handmade crochet blanket is crafted with care and attention to detail. Made from high-quality materials, it's designed to last for years to come."
  },
  {
    id: 2,
    name: "Amigurumi Elephant",
    price: 1200,
    image: "https://images.pexels.com/photos/6850483/pexels-photo-6850483.jpeg",
    category: "Popular Crochet",
    isFeatured: true,
    stock: 5,
    description: "Adorable handcrafted elephant amigurumi. Perfect gift for children or as a decorative piece for your home."
  }
];

const AdminProductList = () => {
  const { toast } = useToast();
  const [products, setProducts] = useState<Product[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isDeleteAllDialogOpen, setIsDeleteAllDialogOpen] = useState(false);
  const [currentProduct, setCurrentProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    id: 0,
    name: '',
    price: 0,
    image: '',
    category: '',
    description: '',
    stock: 0,
    isNew: false,
    isFeatured: false
  });
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('id', { ascending: true });

      if (error) {
        console.error('Error loading products:', error);
        toast({
          title: "Error",
          description: "Failed to load products from database.",
          variant: "destructive"
        });
        return;
      }

      setProducts(data || []);
    } catch (error) {
      console.error('Error loading products:', error);
      toast({
        title: "Error",
        description: "Failed to load products.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else if (name === 'price' || name === 'stock') {
      setFormData(prev => ({ ...prev, [name]: parseInt(value) || 0 }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      toast({
        title: "Invalid file type",
        description: "Please upload a JPEG, JPG, PNG, GIF, or WEBP image",
        variant: "destructive"
      });
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      setImagePreview(base64String);
      setFormData(prev => ({ ...prev, image: base64String }));
    };
    reader.readAsDataURL(file);
  };

  const handleAddEdit = async () => {
    if (!formData.name || !formData.price || (!formData.image && !imagePreview) || !formData.category || !formData.description) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }

    try {
      setIsLoading(true);
      const productData = {
        name: formData.name,
        price: formData.price,
        image: formData.image || imagePreview || '',
        category: formData.category,
        description: formData.description,
        stock: formData.stock
      };

      if (formData.id === 0) {
        // Add new product
        const { data, error } = await supabase
          .from('products')
          .insert([productData])
          .select()
          .single();

        if (error) throw error;

        toast({
          title: "Product Added",
          description: `${formData.name} has been added to products.`
        });
      } else {
        // Update existing product
        const { error } = await supabase
          .from('products')
          .update(productData)
          .eq('id', formData.id);

        if (error) throw error;

        toast({
          title: "Product Updated",
          description: `${formData.name} has been updated.`
        });
      }

      await loadProducts();
      setIsDialogOpen(false);
      resetForm();
    } catch (error) {
      console.error('Error saving products:', error);
      toast({
        title: "Error",
        description: "Failed to save product. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!currentProduct) return;
    
    try {
      setIsLoading(true);
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', currentProduct.id);

      if (error) throw error;

      toast({
        title: "Product Deleted",
        description: `${currentProduct.name} has been removed.`
      });

      await loadProducts();
      setIsDeleteDialogOpen(false);
      setCurrentProduct(null);
    } catch (error) {
      console.error('Error deleting product:', error);
      toast({
        title: "Error",
        description: "Failed to delete product. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteAll = async () => {
    try {
      setIsLoading(true);
      const { error } = await supabase
        .from('products')
        .delete()
        .neq('id', 0); // Delete all products

      if (error) throw error;

      toast({
        title: "All Products Deleted",
        description: "All products have been removed from the catalog."
      });

      await loadProducts();
      setIsDeleteAllDialogOpen(false);
    } catch (error) {
      console.error('Error deleting all products:', error);
      toast({
        title: "Error",
        description: "Failed to delete all products. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
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
      description: product.description || '',
      stock: product.stock || 0,
      isNew: product.isNew || false,
      isFeatured: product.isFeatured || false
    });
    setImagePreview(product.image);
    setIsDialogOpen(true);
  };

  const openDeleteDialog = (product: Product) => {
    setCurrentProduct(product);
    setIsDeleteDialogOpen(true);
  };

  const openDeleteAllDialog = () => {
    setIsDeleteAllDialogOpen(true);
  };

  const resetForm = () => {
    setFormData({
      id: 0,
      name: '',
      price: 0,
      image: '',
      category: '',
      description: '',
      stock: 0,
      isNew: false,
      isFeatured: false
    });
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Products Management</CardTitle>
        <CardDescription>Manage your product catalog</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex justify-between mb-4">
          <Button 
            className="bg-red-600 hover:bg-red-700 text-white"
            onClick={openDeleteAllDialog}
            disabled={isLoading}
          >
            <Trash className="mr-2 h-4 w-4" />
            Delete All Products
          </Button>
          <Button 
            className="bg-blue-600 hover:bg-blue-700"
            onClick={openAddDialog}
            disabled={isLoading}
          >
            <PlusCircle className="mr-2 h-4 w-4" />
            Add New Product
          </Button>
        </div>
        <div className="border rounded-md">
          <div className="grid grid-cols-12 gap-2 p-4 font-medium bg-blue-50">
            <div className="col-span-1">ID</div>
            <div className="col-span-2">Name</div>
            <div className="col-span-2">Category</div>
            <div className="col-span-1">Price</div>
            <div className="col-span-1">Stock</div>
            <div className="col-span-2">Status</div>
            <div className="col-span-3">Actions</div>
          </div>
          <Separator />
          {isLoading ? (
            <div className="p-8 text-center text-muted-foreground">
              Loading products...
            </div>
          ) : products.length === 0 ? (
            <div className="p-8 text-center text-muted-foreground">
              No products found. Add some products to get started.
            </div>
          ) : (
            products.map((product) => (
              <div key={product.id} className="grid grid-cols-12 gap-2 p-4 items-center">
                <div className="col-span-1">{product.id}</div>
                <div className="col-span-2">{product.name}</div>
                <div className="col-span-2">{product.category}</div>
                <div className="col-span-1">Rs {product.price.toLocaleString()}</div>
                <div className="col-span-1">
                  <span className={`font-medium ${
                    product.stock === undefined ? 'text-gray-500' :
                    product.stock === 0 ? 'text-red-500' :
                    product.stock <= 5 ? 'text-yellow-600' : 'text-green-600'
                  }`}>
                    {product.stock !== undefined ? product.stock : 'N/A'}
                  </span>
                </div>
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
                <div className="col-span-3 flex space-x-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="bg-blue-50 hover:bg-blue-100"
                    onClick={() => openEditDialog(product)}
                    disabled={isLoading}
                  >
                    <Edit className="h-3.5 w-3.5 mr-1" />
                    Edit
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="text-red-500"
                    onClick={() => openDeleteDialog(product)}
                    disabled={isLoading}
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

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-hidden">
          <DialogHeader>
            <DialogTitle>{formData.id === 0 ? 'Add New Product' : 'Edit Product'}</DialogTitle>
            <DialogDescription>
              Fill in the product details below. Fields marked with * are required.
            </DialogDescription>
          </DialogHeader>
          <ScrollArea className="flex-grow pr-4" style={{ maxHeight: 'calc(90vh - 180px)' }}>
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
              <div className="grid grid-cols-3 gap-4">
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
                  <Label htmlFor="stock">Stock Quantity</Label>
                  <Input
                    id="stock"
                    name="stock"
                    type="number"
                    value={formData.stock}
                    onChange={handleChange}
                    placeholder="Enter stock quantity"
                    min="0"
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
                    <option value="Shop">Shop</option>
                    <option value="Popular Crochet">Popular Crochet</option>
                  </select>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="description">Product Description</Label>
                <Textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Enter product description"
                  rows={4}
                />
              </div>
              
              <div className="space-y-2">
                <Label>Product Image *</Label>
                <div className="grid grid-cols-1 gap-4">
                  <div 
                    className="border border-dashed rounded-md p-4 text-center cursor-pointer hover:bg-blue-50 transition-colors" 
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <input 
                      type="file" 
                      ref={fileInputRef}
                      className="hidden" 
                      accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
                      onChange={handleFileChange}
                    />
                    <Image className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                    <p className="text-sm text-gray-500 mb-1">Click to upload image</p>
                    <p className="text-xs text-gray-400">JPG, JPEG, PNG, GIF, or WEBP</p>
                  </div>
                  
                  {(imagePreview || formData.image) && (
                    <div className="relative">
                      <Carousel className="w-full">
                        <CarouselContent>
                          <CarouselItem>
                            <div className="relative aspect-square">
                              <img 
                                src={imagePreview || formData.image} 
                                alt="Product preview" 
                                className="w-full h-full object-cover rounded-md" 
                              />
                              <Button 
                                variant="destructive" 
                                size="sm" 
                                className="absolute top-2 right-2"
                                onClick={() => {
                                  setImagePreview(null);
                                  setFormData(prev => ({ ...prev, image: '' }));
                                  if (fileInputRef.current) {
                                    fileInputRef.current.value = '';
                                  }
                                }}
                              >
                                Remove
                              </Button>
                            </div>
                          </CarouselItem>
                        </CarouselContent>
                        <CarouselPrevious className="left-2" />
                        <CarouselNext className="right-2" />
                      </Carousel>
                    </div>
                  )}
                  
                  <div className="text-sm mt-2">
                    <Label htmlFor="image-url">Or enter image URL</Label>
                    <Input
                      id="image-url"
                      name="image"
                      value={formData.image}
                      onChange={handleChange}
                      placeholder="https://example.com/image.jpg"
                      className="mt-1"
                    />
                  </div>
                </div>
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
          </ScrollArea>
          <DialogFooter className="sticky bottom-0 pt-4 bg-background">
            <Button variant="outline" onClick={() => setIsDialogOpen(false)} disabled={isLoading}>Cancel</Button>
            <Button className="bg-blue-600 hover:bg-blue-700" onClick={handleAddEdit} disabled={isLoading}>
              {isLoading ? 'Saving...' : (formData.id === 0 ? 'Add Product' : 'Update Product')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p>Are you sure you want to delete "{currentProduct?.name}"? This action cannot be undone.</p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)} disabled={isLoading}>Cancel</Button>
            <Button variant="destructive" onClick={handleDelete} disabled={isLoading}>
              {isLoading ? 'Deleting...' : 'Delete'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isDeleteAllDialogOpen} onOpenChange={setIsDeleteAllDialogOpen}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle className="flex items-center">
              <AlertTriangle className="h-5 w-5 text-red-500 mr-2" />
              Delete All Products
            </DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p className="font-medium text-red-600 mb-2">Warning: This is a destructive action!</p>
            <p>Are you sure you want to delete ALL products? This action cannot be undone and will remove all products from your catalog.</p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteAllDialogOpen(false)} disabled={isLoading}>Cancel</Button>
            <Button variant="destructive" onClick={handleDeleteAll} disabled={isLoading}>
              {isLoading ? 'Deleting...' : 'Delete All'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default AdminProductList;
