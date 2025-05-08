
import { useState, useEffect } from 'react';
import { ArrowRight, ArrowLeft, Sparkle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { getHeroSlides, HeroSlide } from '@/utils/heroSlideUtils';

const Hero = () => {
  const [heroSlides, setHeroSlides] = useState<HeroSlide[]>(getHeroSlides());
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [direction, setDirection] = useState<'next' | 'prev'>('next');
  const [showSparkle, setShowSparkle] = useState(false);

  // Animation elements
  const yarns = Array.from({ length: 4 }, (_, i) => i);
  const colorSchemes = [
    ["#FDE1D3", "#E5DEFF", "#F2FCE2", "#FFDEE2"], // First slide color scheme
    ["#D3E4FD", "#FEF7CD", "#FEC6A1", "#F1F0FB"]  // Second slide color scheme
  ];

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

  // Sparkle animation effect
  useEffect(() => {
    // Show sparkle effect when slide changes
    setShowSparkle(true);
    const timer = setTimeout(() => {
      setShowSparkle(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, [currentSlide]);

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
  const currentColors = colorSchemes[currentSlide % colorSchemes.length];

  return (
    <div className="hero-section relative h-[500px] flex items-center justify-center text-center overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-r from-crochet-50 to-crochet-100 overflow-hidden">
        {/* Animated yarn balls */}
        {yarns.map((yarn, index) => (
          <div 
            key={yarn}
            className={cn(
              "absolute rounded-full opacity-70 animate-pulse",
              index % 2 === 0 ? "animate-[pulse_4s_ease-in-out_infinite]" : "animate-[pulse_5s_ease-in-out_infinite]"
            )}
            style={{
              backgroundColor: currentColors[index % currentColors.length],
              width: `${80 + (index * 20)}px`,
              height: `${80 + (index * 20)}px`,
              left: `${15 + (index * 20)}%`,
              top: `${20 + ((index % 3) * 20)}%`,
              filter: 'blur(8px)',
              animation: `float-${index} ${5 + index}s ease-in-out infinite alternate`
            }}
          />
        ))}
        
        {/* Crochet pattern overlay */}
        <div 
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: 'url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%239C92AC" fill-opacity="1"%3E%3Cpath d="M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
          }}
        />
      </div>

      {/* Slide content */}
      <div className={cn(
        "max-w-4xl px-6 transition-all duration-700 relative z-10",
        isAnimating ? 
          (direction === 'next' ? "translate-x-10 opacity-0" : "-translate-x-10 opacity-0") : 
          "translate-x-0 opacity-100"
      )}>
        {showSparkle && (
          <div className="absolute -top-10 -left-5 animate-fade-in">
            <Sparkle className="h-8 w-8 text-yellow-400" />
          </div>
        )}
        
        <h1 className="text-5xl font-display font-bold text-crochet-900 mb-4 relative">
          {slide.title}
          {showSparkle && (
            <span className="absolute -top-5 -right-5 animate-fade-in">
              <Sparkle className="h-6 w-6 text-yellow-400" />
            </span>
          )}
        </h1>
        <p className="text-2xl text-crochet-700 mb-8">
          {slide.subtitle}
        </p>
        <Button 
          asChild
          size="lg" 
          className="bg-crochet-600 text-white hover:bg-crochet-700 button-effect"
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
      
      {/* Slide indicators */}
      <div className="absolute bottom-6 left-0 right-0 flex justify-center z-20">
        <div className="flex space-x-2">
          {heroSlides.map((_, index) => (
            <button
              key={index}
              onClick={() => {
                setDirection(index > currentSlide ? 'next' : 'prev');
                setIsAnimating(true);
                setCurrentSlide(index);
              }}
              className={cn(
                "w-2 h-2 rounded-full transition-all duration-300",
                currentSlide === index 
                  ? "bg-crochet-600 w-6" 
                  : "bg-crochet-300 hover:bg-crochet-400"
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
