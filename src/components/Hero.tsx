
import { useState, useEffect } from 'react';
import { ArrowRight, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { getHeroSlides, HeroSlide } from '@/utils/heroSlideUtils';

const Hero = () => {
  const [heroSlides, setHeroSlides] = useState<HeroSlide[]>(getHeroSlides());
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [direction, setDirection] = useState<'next' | 'prev'>('next');
  const [imageLoaded, setImageLoaded] = useState(false);
  const [loadAttempt, setLoadAttempt] = useState(0);

  // Load slides from localStorage on mount and when they change
  useEffect(() => {
    const updateSlides = () => {
      setHeroSlides(getHeroSlides());
    };

    // Initial load
    updateSlides();

    // Listen for changes
    window.addEventListener('heroSlidesUpdated', updateSlides);
    
    return () => {
      window.removeEventListener('heroSlidesUpdated', updateSlides);
    };
  }, []);

  const nextSlide = () => {
    if (isAnimating) return;
    setDirection('next');
    setIsAnimating(true);
    setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    setImageLoaded(false);
    setLoadAttempt(0);
  };

  const prevSlide = () => {
    if (isAnimating) return;
    setDirection('prev');
    setIsAnimating(true);
    setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length);
    setImageLoaded(false);
    setLoadAttempt(0);
  };

  // Handle image loading error by incrementing load attempt
  const handleImageError = () => {
    console.error('Failed to load hero image, attempting fallback');
    setLoadAttempt(prev => prev + 1);
    // If we've tried too many times, just show the slide anyway
    if (loadAttempt > 2) {
      setImageLoaded(true);
    }
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

  const slide = heroSlides[currentSlide] || heroSlides[0];

  // New fallback image - wool/yarn themed
  const fallbackImage = "https://images.pexels.com/photos/6850711/pexels-photo-6850711.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1";

  return (
    <div className="hero-section">
      {/* Simple Background */}
      <div className="relative h-full w-full overflow-hidden">
        {!imageLoaded && (
          <div className="absolute inset-0 bg-gray-200 animate-pulse" />
        )}
        <img
          src={loadAttempt > 0 ? fallbackImage : slide.image}
          alt={slide.title}
          className={cn(
            "absolute inset-0 w-full h-full object-cover transition-opacity duration-300", 
            imageLoaded ? "opacity-100" : "opacity-0"
          )}
          loading="lazy"
          onLoad={() => setImageLoaded(true)}
          onError={handleImageError}
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
