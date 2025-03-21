
import { useState, useEffect } from 'react';
import { getHeroSlides, saveHeroSlides, resetHeroSlidesToDefault, HeroSlide } from '@/utils/heroSlideUtils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/components/ui/use-toast';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowRight, ImageIcon, RefreshCw } from 'lucide-react';

const AdminHeroSlides = () => {
  const [slides, setSlides] = useState<HeroSlide[]>(getHeroSlides());
  const [activeTab, setActiveTab] = useState<string>("1");
  const { toast } = useToast();

  // Load slides from localStorage
  useEffect(() => {
    setSlides(getHeroSlides());
  }, []);

  const handleSlideChange = (slideId: number, field: keyof HeroSlide, value: string) => {
    const updatedSlides = slides.map(slide => 
      slide.id === slideId ? { ...slide, [field]: value } : slide
    );
    setSlides(updatedSlides);
  };

  const handleSaveSlides = () => {
    saveHeroSlides(slides);
    toast({
      title: "Hero slides updated",
      description: "Your changes to the hero slides have been saved.",
    });
  };

  const handleResetSlides = () => {
    resetHeroSlidesToDefault();
    setSlides(getHeroSlides());
    toast({
      title: "Hero slides reset",
      description: "Hero slides have been reset to default.",
    });
  };

  const previewSlide = (slide: HeroSlide) => {
    return (
      <div className="relative h-[200px] overflow-hidden rounded-lg mb-4">
        {slide.image ? (
          <img 
            src={slide.image} 
            alt={slide.title}
            className="w-full h-full object-cover" 
            onError={(e) => {
              e.currentTarget.src = 'https://images.pexels.com/photos/6850711/pexels-photo-6850711.jpeg';
            }}
          />
        ) : (
          <div className="flex items-center justify-center w-full h-full bg-gray-200">
            <ImageIcon className="h-10 w-10 text-gray-400" />
          </div>
        )}
        <div className="absolute inset-0 bg-black/40 flex items-center p-4">
          <div className="text-white">
            <h3 className="text-xl font-medium">{slide.title}</h3>
            <p className="text-sm opacity-90">{slide.subtitle}</p>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-medium">Manage Hero Slides</h2>
        <div className="space-x-2">
          <Button 
            variant="outline" 
            onClick={handleResetSlides} 
            className="border-amber-200 hover:bg-amber-50 text-amber-800"
          >
            <RefreshCw className="mr-2 h-4 w-4" />
            Reset to Default
          </Button>
          <Button onClick={handleSaveSlides} className="bg-amber-700 hover:bg-amber-800">
            Save Changes
          </Button>
        </div>
      </div>
      
      <Separator className="my-6" />

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-6">
          {slides.map(slide => (
            <TabsTrigger key={slide.id} value={slide.id.toString()}>Slide {slide.id}</TabsTrigger>
          ))}
        </TabsList>

        {slides.map(slide => (
          <TabsContent key={slide.id} value={slide.id.toString()}>
            <Card>
              <CardHeader>
                <CardTitle>Edit Slide {slide.id}</CardTitle>
                <CardDescription>Update the content and appearance of this slide</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">Title</label>
                      <Input 
                        value={slide.title}
                        onChange={(e) => handleSlideChange(slide.id, 'title', e.target.value)}
                        className="w-full"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-1">Subtitle</label>
                      <Input 
                        value={slide.subtitle}
                        onChange={(e) => handleSlideChange(slide.id, 'subtitle', e.target.value)}
                        className="w-full"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-1">Image URL</label>
                      <Input 
                        value={slide.image}
                        onChange={(e) => handleSlideChange(slide.id, 'image', e.target.value)}
                        className="w-full"
                        placeholder="https://example.com/image.jpg"
                      />
                      <p className="text-xs text-muted-foreground mt-1">
                        Enter a valid image URL. Recommended size: 1200×600 pixels.
                      </p>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">Button Text</label>
                      <Input 
                        value={slide.cta}
                        onChange={(e) => handleSlideChange(slide.id, 'cta', e.target.value)}
                        className="w-full"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-1">Button Link</label>
                      <Input 
                        value={slide.link}
                        onChange={(e) => handleSlideChange(slide.id, 'link', e.target.value)}
                        className="w-full"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-1">Preview</label>
                      {previewSlide(slide)}
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button 
                  variant="outline" 
                  onClick={() => {
                    const defaultSlides = getHeroSlides();
                    const defaultSlide = defaultSlides.find(s => s.id === slide.id);
                    if (defaultSlide) {
                      const updatedSlides = slides.map(s => 
                        s.id === slide.id ? defaultSlide : s
                      );
                      setSlides(updatedSlides);
                    }
                  }}
                >
                  Reset This Slide
                </Button>
                <Button 
                  onClick={() => {
                    saveHeroSlides(slides);
                    toast({
                      title: "Slide updated",
                      description: `Slide ${slide.id} has been updated.`,
                    });
                  }}
                  className="bg-amber-700 hover:bg-amber-800"
                >
                  Save This Slide
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};

export default AdminHeroSlides;
