
import { useState, useEffect } from 'react';
import { ArrowRight, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { getHeroSlides, HeroSlide } from '@/utils/heroSlideUtils';

const Hero = () => {
  const [heroSlides, setHeroSlides] = useState<HeroSlide[]>(getHeroSlides());
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

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
    setIsAnimating(true);
    setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
  };

  const prevSlide = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length);
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsAnimating(false);
    }, 500);

    return () => clearTimeout(timer);
  }, [currentSlide]);

  // Auto slide
  useEffect(() => {
    const interval = setInterval(() => {
      nextSlide();
    }, 4000);

    return () => clearInterval(interval);
  }, [currentSlide, isAnimating]);

  const slide = heroSlides[currentSlide] || heroSlides[0];

  return (
    <div className="hero-section relative h-[400px] flex items-center justify-center text-center bg-white">
      {/* Slide content */}
      <div className={cn(
        "max-w-4xl px-6 transition-all duration-500 relative z-10",
        isAnimating ? "opacity-0 translate-y-4" : "opacity-100 translate-y-0"
      )}>
        <h1 className="text-5xl font-display font-bold text-gray-800 mb-6">
          {slide.title}
        </h1>
        <Button 
          asChild
          size="lg" 
          className="bg-red-600 text-white hover:bg-red-700"
        >
          <a href={slide.link}>
            {slide.cta} 
            <ArrowRight className="ml-2 h-5 w-5" />
          </a>
        </Button>
      </div>
      
      {/* Navigation */}
      <div className="absolute bottom-6 right-6 z-20 flex space-x-2">
        <Button 
          variant="outline" 
          size="icon" 
          onClick={prevSlide}
          className="bg-white/80 hover:bg-white border-gray-300"
        >
          <ArrowLeft className="h-5 w-5 text-gray-600" />
        </Button>
        <Button 
          variant="outline" 
          size="icon" 
          onClick={nextSlide}
          className="bg-white/80 hover:bg-white border-gray-300"
        >
          <ArrowRight className="h-5 w-5 text-gray-600" />
        </Button>
      </div>
      
      {/* Slide indicators */}
      <div className="absolute bottom-6 left-0 right-0 flex justify-center z-20">
        <div className="flex space-x-2">
          {heroSlides.map((_, index) => (
            <button
              key={index}
              onClick={() => {
                setIsAnimating(true);
                setCurrentSlide(index);
              }}
              className={cn(
                "w-2 h-2 rounded-full transition-all duration-300",
                currentSlide === index 
                  ? "bg-red-600 w-6" 
                  : "bg-gray-300 hover:bg-gray-400"
              )}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Hero;
