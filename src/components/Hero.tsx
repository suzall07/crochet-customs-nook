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

  const slide = heroSlides[currentSlide] || heroSlides[0];

  return (
    <div className="hero-section bg-gradient-to-r from-crochet-50 to-crochet-100 relative h-[500px] flex items-center justify-center text-center overflow-hidden">
      <div className={cn(
        "max-w-4xl px-6 transition-all duration-700",
        isAnimating ? 
          (direction === 'next' ? "translate-x-10 opacity-0" : "-translate-x-10 opacity-0") : 
          "translate-x-0 opacity-100"
      )}>
        <h1 className="text-5xl font-display font-bold text-crochet-900 mb-4">
          {slide.title}
        </h1>
        <p className="text-2xl text-crochet-700 mb-8">
          {slide.subtitle}
        </p>
        <Button 
          asChild
          size="lg" 
          className="bg-crochet-600 text-white hover:bg-crochet-700"
        >
          <a href={slide.link}>
            {slide.cta} 
            <ArrowRight className="ml-2 h-5 w-5" />
          </a>
        </Button>
      </div>
      
      {/* Simple Navigation */}
      <div className="absolute bottom-6 right-6 z-20 flex space-x-2">
        <Button 
          variant="outline" 
          size="icon" 
          onClick={prevSlide}
          className="bg-white/20 hover:bg-white/30 border-crochet-200"
        >
          <ArrowLeft className="h-5 w-5 text-crochet-900" />
        </Button>
        <Button 
          variant="outline" 
          size="icon" 
          onClick={nextSlide}
          className="bg-white/20 hover:bg-white/30 border-crochet-200"
        >
          <ArrowRight className="h-5 w-5 text-crochet-900" />
        </Button>
      </div>
    </div>
  );
};

export default Hero;
