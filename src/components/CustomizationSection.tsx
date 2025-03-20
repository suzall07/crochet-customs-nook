
import { useState } from 'react';
import { Check, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useToast } from '@/components/ui/use-toast';

interface ColorOption {
  name: string;
  value: string;
}

interface SizeOption {
  name: string;
  value: string;
}

interface PatternOption {
  name: string;
  value: string;
  image: string;
}

const colorOptions: ColorOption[] = [
  { name: "Cream", value: "#F5F5DC" },
  { name: "Dusty Rose", value: "#DCABAB" },
  { name: "Sage Green", value: "#B2BDA0" },
  { name: "Sky Blue", value: "#A6C0D4" },
  { name: "Lavender", value: "#CAB8D9" },
  { name: "Mustard", value: "#E1AD01" },
];

const sizeOptions: SizeOption[] = [
  { name: "Small", value: "s" },
  { name: "Medium", value: "m" },
  { name: "Large", value: "l" },
  { name: "X-Large", value: "xl" },
];

// Updated pattern options with reliable yarn/wool images
const patternOptions: PatternOption[] = [
  { 
    name: "Classic", 
    value: "classic",
    image: "https://images.pexels.com/photos/6850483/pexels-photo-6850483.jpeg?auto=compress&cs=tinysrgb&w=400" 
  },
  { 
    name: "Chevron", 
    value: "chevron",
    image: "https://images.pexels.com/photos/6850490/pexels-photo-6850490.jpeg?auto=compress&cs=tinysrgb&w=400" 
  },
  { 
    name: "Basket Weave", 
    value: "basket",
    image: "https://images.pexels.com/photos/6850711/pexels-photo-6850711.jpeg?auto=compress&cs=tinysrgb&w=400" 
  },
  { 
    name: "Shell Stitch", 
    value: "shell",
    image: "https://images.pexels.com/photos/6858600/pexels-photo-6858600.jpeg?auto=compress&cs=tinysrgb&w=400" 
  },
];

const CustomizationSection = () => {
  const [selectedColor, setSelectedColor] = useState<ColorOption>(colorOptions[0]);
  const [selectedSize, setSelectedSize] = useState<SizeOption>(sizeOptions[1]);
  const [selectedPattern, setSelectedPattern] = useState<PatternOption>(patternOptions[0]);
  const { toast } = useToast();

  const handleAddToCart = () => {
    // Create a custom product
    const customProduct = {
      id: Date.now(), // Generate a unique ID
      name: `Custom ${selectedPattern.name} (${selectedColor.name}, ${selectedSize.name})`,
      price: 4999, // Example price
      image: selectedPattern.image,
      category: "Custom",
      isNew: true
    };
    
    // Get existing cart from localStorage or initialize empty array
    const existingCart = JSON.parse(localStorage.getItem('cart') || '[]');
    
    // Add custom product to cart
    const updatedCart = [...existingCart, customProduct];
    localStorage.setItem('cart', JSON.stringify(updatedCart));
    
    toast({
      title: "Custom item added to cart",
      description: "Your custom item has been added to the cart.",
    });
  };

  // Handle image loading error
  const handlePatternImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    console.error('Failed to load pattern image, using fallback');
    e.currentTarget.src = "https://images.pexels.com/photos/6850711/pexels-photo-6850711.jpeg?auto=compress&cs=tinysrgb&w=400";
  };

  return (
    <section className="bg-crochet-50 py-20">
      <div className="page-container">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left side - Preview */}
          <div className="relative">
            <div 
              className="rounded-2xl overflow-hidden aspect-square bg-white shadow-lg"
              style={{ backgroundColor: selectedColor.value }}
            >
              <img 
                src={selectedPattern.image} 
                alt="Customized crochet product" 
                className="w-full h-full object-cover mix-blend-multiply"
                onError={handlePatternImageError}
                loading="lazy"
              />
            </div>
            
            <div className="absolute -bottom-6 -right-6 bg-white/90 backdrop-blur-sm rounded-lg p-4 shadow-lg border border-crochet-100 animate-fade-in">
              <p className="text-sm font-medium text-crochet-900">Your custom creation</p>
              <p className="text-xs text-crochet-600">Rendered in real-time</p>
            </div>
          </div>
          
          {/* Right side - Customization options */}
          <div className="lg:pl-8">
            <h2 className="section-title mb-3">Create Your Custom Piece</h2>
            <p className="section-subtitle mb-8">
              Personalize your crochet item by selecting from our range of colors, sizes, and patterns
            </p>
            
            <div className="space-y-8">
              {/* Color selection */}
              <div className="space-y-3">
                <label className="text-sm font-medium text-crochet-900">Select Color</label>
                <div className="flex flex-wrap gap-3">
                  {colorOptions.map((color) => (
                    <button
                      key={color.value}
                      onClick={() => setSelectedColor(color)}
                      className={cn(
                        "w-8 h-8 rounded-full transition-all duration-200",
                        selectedColor.value === color.value 
                          ? "ring-2 ring-offset-2 ring-crochet-600 scale-110" 
                          : "hover:scale-110"
                      )}
                      style={{ backgroundColor: color.value }}
                      title={color.name}
                      aria-label={`Select ${color.name} color`}
                    >
                      {selectedColor.value === color.value && (
                        <Check className="h-4 w-4 mx-auto text-crochet-900/50" />
                      )}
                    </button>
                  ))}
                </div>
                <p className="text-sm text-muted-foreground">Selected: {selectedColor.name}</p>
              </div>
              
              {/* Size selection */}
              <div className="space-y-3">
                <label className="text-sm font-medium text-crochet-900">Select Size</label>
                <div className="flex flex-wrap gap-3">
                  {sizeOptions.map((size) => (
                    <button
                      key={size.value}
                      onClick={() => setSelectedSize(size)}
                      className={cn(
                        "px-4 py-2 rounded-md text-sm font-medium transition-all duration-200",
                        selectedSize.value === size.value 
                          ? "bg-crochet-700 text-white" 
                          : "bg-white border border-crochet-200 text-crochet-800 hover:bg-crochet-50"
                      )}
                    >
                      {size.name}
                    </button>
                  ))}
                </div>
              </div>
              
              {/* Pattern selection */}
              <div className="space-y-3">
                <label className="text-sm font-medium text-crochet-900">Select Pattern</label>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button 
                      variant="outline" 
                      className="w-full justify-between border-crochet-200"
                    >
                      {selectedPattern.name}
                      <ChevronDown className="h-4 w-4 ml-2 opacity-50" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-full">
                    {patternOptions.map((pattern) => (
                      <DropdownMenuItem 
                        key={pattern.value}
                        className="cursor-pointer"
                        onClick={() => setSelectedPattern(pattern)}
                      >
                        <div className="flex items-center">
                          <div className="w-8 h-8 rounded-md overflow-hidden mr-2">
                            <img 
                              src={pattern.image} 
                              alt={pattern.name} 
                              className="w-full h-full object-cover"
                              onError={handlePatternImageError}
                              loading="lazy"
                            />
                          </div>
                          <span>{pattern.name}</span>
                        </div>
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              
              <Button 
                className="w-full mt-6 bg-crochet-800 hover:bg-crochet-900 button-effect"
                onClick={handleAddToCart}
              >
                Add Custom Item to Cart
              </Button>
              
              <p className="text-sm text-muted-foreground text-center">
                Your item will be crafted to order and shipped within 2-3 weeks
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CustomizationSection;
