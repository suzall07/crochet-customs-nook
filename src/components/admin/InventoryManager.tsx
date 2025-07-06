
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, Package, TrendingDown, TrendingUp } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface InventoryItem {
  id: number;
  name: string;
  stock: number;
  reserved_stock: number;
  reorder_level: number;
  category: string;
  price: number;
}

const InventoryManager = () => {
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);
  const [stockUpdate, setStockUpdate] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    fetchInventory();
  }, []);

  const fetchInventory = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('id, name, stock, category, price')
        .order('name');

      if (error) throw error;

      const inventoryData = data?.map(item => ({
        ...item,
        reserved_stock: 0, // You can extend this to track reserved inventory
        reorder_level: 10, // Default reorder level
      })) || [];

      setInventory(inventoryData);
    } catch (error) {
      console.error('Error fetching inventory:', error);
      toast({
        title: "Error",
        description: "Failed to fetch inventory data",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const updateStock = async () => {
    if (!selectedItem || !stockUpdate) return;

    try {
      const newStock = parseInt(stockUpdate);
      const { error } = await supabase
        .from('products')
        .update({ stock: newStock })
        .eq('id', selectedItem.id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Stock updated successfully"
      });

      fetchInventory();
      setSelectedItem(null);
      setStockUpdate('');
    } catch (error) {
      console.error('Error updating stock:', error);
      toast({
        title: "Error",
        description: "Failed to update stock",
        variant: "destructive"
      });
    }
  };

  const getStockStatus = (item: InventoryItem) => {
    const availableStock = item.stock - item.reserved_stock;
    if (availableStock <= 0) return { status: 'out-of-stock', color: 'destructive' };
    if (availableStock <= item.reorder_level) return { status: 'low-stock', color: 'secondary' };
    return { status: 'in-stock', color: 'default' };
  };

  const lowStockItems = inventory.filter(item => 
    (item.stock - item.reserved_stock) <= item.reorder_level
  );

  if (loading) return <div>Loading inventory...</div>;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Products</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{inventory.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Low Stock Alerts</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-500">{lowStockItems.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Stock Value</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${inventory.reduce((acc, item) => acc + (item.stock * item.price), 0).toFixed(2)}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Inventory Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {inventory.map((item) => {
              const stockStatus = getStockStatus(item);
              return (
                <div key={item.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex-1">
                    <h3 className="font-medium">{item.name}</h3>
                    <p className="text-sm text-gray-600">{item.category}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant={stockStatus.color as any}>
                        {stockStatus.status.replace('-', ' ')}
                      </Badge>
                      <span className="text-sm">
                        Stock: {item.stock} | Available: {item.stock - item.reserved_stock}
                      </span>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSelectedItem(item)}
                  >
                    Update Stock
                  </Button>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {selectedItem && (
        <Card>
          <CardHeader>
            <CardTitle>Update Stock: {selectedItem.name}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="currentStock">Current Stock</Label>
              <Input value={selectedItem.stock} disabled />
            </div>
            <div>
              <Label htmlFor="newStock">New Stock Level</Label>
              <Input
                type="number"
                value={stockUpdate}
                onChange={(e) => setStockUpdate(e.target.value)}
                placeholder="Enter new stock level"
              />
            </div>
            <div className="flex gap-2">
              <Button onClick={updateStock}>Update Stock</Button>
              <Button variant="outline" onClick={() => setSelectedItem(null)}>
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default InventoryManager;
