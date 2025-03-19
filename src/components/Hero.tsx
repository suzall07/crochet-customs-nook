
import { useState, useEffect } from 'react';
import { ArrowRight, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

// Hero slide interface
interface HeroSlide {
  id: number;
  title: string;
  subtitle: string;
  image: string;
  cta: string;
  link: string;
}

// Sample hero slides
const heroSlides: HeroSlide[] = [
  {
    id: 1,
    title: "Handcrafted with Love",
    subtitle: "Unique crochet creations made with passion and attention to detail",
    image: "https://images.unsplash.com/photo-1615834307573-4e51ade23d28",
    cta: "Shop Collection",
    link: "/shop"
  },
  {
    id: 2,
    title: "Custom Crochet Designs",
    subtitle: "Personalize your crochet items with colors and designs that reflect your style",
    image: "https://images.unsplash.com/photo-1511436868135-bea7c3eca603",
    cta: "Customize Now",
    link: "/customize"
  },
  {
    id: 3,
    title: "The Art of Crochet",
    subtitle: "Each stitch tells a story of craftsmanship and creativity",
    image: "https://images.unsplash.com/photo-1604955562882-30ee1ded2ba0",
    cta: "Explore Techniques",
    link: "/about"
  }
];

const Hero = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [direction, setDirection] = useState<'next' | 'prev'>('next');

  const nextSlide = () => {
    if (isAnimating) return;
    setDirection('next');
    setIsAnimating(true);
    setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
  };

  const prevSlide = () => {
    if (isAnimating) return;
    setDirection('prev');
    setIsAnimating(true);
    setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length);
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsAnimating(false);
    }, 600);

    return () => clearTimeout(timer);
  }, [currentSlide]);

  // Auto slide
  useEffect(() => {
    const interval = setInterval(() => {
      nextSlide();
    }, 6000);

    return () => clearInterval(interval);
  }, [currentSlide, isAnimating]);

  const slide = heroSlides[currentSlide];

  return (
    <div className="hero-section">
      {/* Plain Image Background */}
      <div className="relative h-full w-full overflow-hidden">
        <img
          src={slide.image}
          alt={slide.title}
          className={cn(
            "absolute inset-0 w-full h-full object-cover transition-opacity duration-500",
            isAnimating ? "opacity-0" : "opacity-100"
          )}
        />
        
        {/* Overlay */}
        <div className="absolute inset-0 bg-black/40" />
      </div>
      
      {/* Content */}
      <div className="relative z-10 h-full flex items-center">
        <div className="container max-w-7xl mx-auto px-4 sm:px-6">
          <div 
            className={cn(
              "max-w-3xl text-white transition-all duration-700",
              isAnimating ? 
                (direction === 'next' ? "translate-x-10 opacity-0" : "-translate-x-10 opacity-0") : 
                "translate-x-0 opacity-100"
            )}
          >
            <h1 className="font-display text-4xl md:text-6xl lg:text-7xl font-semibold mb-4">
              {slide.title}
            </h1>
            <p className="text-lg md:text-xl opacity-90 mb-8 max-w-xl">
              {slide.subtitle}
            </p>
            <Button 
              asChild
              size="lg" 
              className="button-effect text-md px-8 py-6 bg-white text-crochet-900 hover:bg-white/90"
            >
              <a href={slide.link}>
                {slide.cta} 
                <ArrowRight className="ml-2 h-5 w-5" />
              </a>
            </Button>
          </div>
        </div>
      </div>
      
      {/* Simple Navigation */}
      <div className="absolute bottom-8 right-8 z-20 flex space-x-4">
        <Button 
          variant="outline" 
          size="icon" 
          onClick={prevSlide}
          className="bg-white/20 backdrop-blur-sm hover:bg-white/30 border-white/30"
        >
          <ArrowLeft className="h-5 w-5 text-white" />
        </Button>
        <Button 
          variant="outline" 
          size="icon" 
          onClick={nextSlide}
          className="bg-white/20 backdrop-blur-sm hover:bg-white/30 border-white/30"
        >
          <ArrowRight className="h-5 w-5 text-white" />
        </Button>
      </div>
      
      {/* Indicators */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20 flex space-x-2">
        {heroSlides.map((_, index) => (
          <button
            key={index}
            onClick={() => {
              setDirection(index > currentSlide ? 'next' : 'prev');
              setCurrentSlide(index);
              setIsAnimating(true);
            }}
            className={cn(
              "w-3 h-3 rounded-full transition-all duration-300",
              index === currentSlide 
                ? "bg-white w-6" 
                : "bg-white/50 hover:bg-white/70"
            )}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default Hero;
