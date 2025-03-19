
import { useState, useEffect } from 'react';
import { ArrowRight, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

// Simplified hero slides with direct image URLs
const heroSlides = [
  {
    id: 1,
    title: "Handcrafted with Love",
    subtitle: "Unique crochet creations made with passion",
    image: "https://images.unsplash.com/photo-1532774788000-afc4d8ce089f?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
    cta: "Shop Collection",
    link: "/shop"
  },
  {
    id: 2,
    title: "Custom Crochet Designs",
    subtitle: "Personalize your crochet items with colors and designs",
    image: "https://images.unsplash.com/photo-1601379327928-bedfaf9da2e0?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
    cta: "Customize Now",
    link: "/customize"
  },
  {
    id: 3,
    title: "The Art of Crochet",
    subtitle: "Each stitch tells a story of craftsmanship",
    image: "https://images.unsplash.com/photo-1605518216938-7c31b7b14ad0?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
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
      {/* Simple Background */}
      <div className="relative h-full w-full overflow-hidden">
        <img
          src={slide.image}
          alt={slide.title}
          className="absolute inset-0 w-full h-full object-cover"
          loading="lazy"
        />
        
        {/* Simple Overlay */}
        <div className="absolute inset-0 bg-black/40" />
      </div>
      
      {/* Content */}
      <div className="relative z-10 h-full flex items-center">
        <div className="container mx-auto px-4">
          <div className={cn(
            "max-w-lg text-white transition-all duration-700",
            isAnimating ? 
              (direction === 'next' ? "translate-x-10 opacity-0" : "-translate-x-10 opacity-0") : 
              "translate-x-0 opacity-100"
          )}>
            <h1 className="text-3xl md:text-4xl font-medium mb-3">
              {slide.title}
            </h1>
            <p className="text-lg opacity-90 mb-6">
              {slide.subtitle}
            </p>
            <Button 
              asChild
              size="lg" 
              className="bg-white text-crochet-900 hover:bg-white/90"
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
      <div className="absolute bottom-6 right-6 z-20 flex space-x-2">
        <Button 
          variant="outline" 
          size="icon" 
          onClick={prevSlide}
          className="bg-white/20 hover:bg-white/30 border-white/30"
        >
          <ArrowLeft className="h-5 w-5 text-white" />
        </Button>
        <Button 
          variant="outline" 
          size="icon" 
          onClick={nextSlide}
          className="bg-white/20 hover:bg-white/30 border-white/30"
        >
          <ArrowRight className="h-5 w-5 text-white" />
        </Button>
      </div>
    </div>
  );
};

export default Hero;
