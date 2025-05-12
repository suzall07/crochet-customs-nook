
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
  const yarns = Array.from({ length: 6 }, (_, i) => i); // Increased for more sweater elements
  const sweaterStitches = Array.from({ length: 8 }, (_, i) => i);
  const colorSchemes = [
    ["#FF2C2C20", "#FF2C2C30", "#FF2C2C15", "#FF2C2C25"], // First slide color scheme - red tones
    ["#FF2C2C15", "#FF2C2C10", "#FF2C2C20", "#FF2C2C05"]  // Second slide color scheme - lighter red tones
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
      {/* Animated Sweater Background */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Use animated background */}
        <div className="absolute inset-0 bg-gradient-to-r from-white to-gray-50 overflow-hidden">
          {/* Sweater pattern base layer */}
          <div className={`absolute inset-0 ${currentSlide % 2 === 0 ? 'sweater-bg-1' : 'sweater-bg-2'}`}></div>
          
          {/* Sweater pattern overlay */}
          <div className="sweater-pattern"></div>
          
          {/* Animated yarn balls representing sweater stitches */}
          {yarns.map((yarn, index) => (
            <div 
              key={yarn}
              className={cn(
                "absolute rounded-full opacity-70",
                index % 2 === 0 ? "animate-pulse" : "animate-[pulse_4s_ease-in-out_infinite]"
              )}
              style={{
                backgroundColor: currentColors[index % currentColors.length],
                width: `${40 + (index * 15)}px`,
                height: `${40 + (index * 15)}px`,
                left: `${10 + (index * 15)}%`,
                top: `${15 + ((index % 4) * 20)}%`,
                filter: 'blur(12px)',
                animation: `float-${index % 4} ${6 + index}s ease-in-out infinite alternate`
              }}
            />
          ))}
          
          {/* Yarn strands */}
          {sweaterStitches.map((stitch, index) => (
            <div 
              key={`stitch-${stitch}`}
              className="yarn-strand"
              style={{
                width: `${150 + (index * 50)}px`,
                left: `${5 + (index * 10)}%`,
                top: `${20 + ((index % 5) * 15)}%`,
                opacity: 0.5,
                animationDelay: `${index * 0.5}s`
              }}
            />
          ))}
        </div>
        
        {/* Overlay for better text contrast */}
        <div className="absolute inset-0 bg-black/10"></div>
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
        
        <h1 className="text-5xl font-display font-bold text-white mb-4 relative text-shadow-lg">
          {slide.title}
          {showSparkle && (
            <span className="absolute -top-5 -right-5 animate-fade-in">
              <Sparkle className="h-6 w-6 text-yellow-400" />
            </span>
          )}
        </h1>
        <p className="text-2xl text-white mb-8 text-shadow-md">
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
          <ArrowLeft className="h-5 w-5 text-white" />
        </Button>
        <Button 
          variant="outline" 
          size="icon" 
          onClick={nextSlide}
          className="bg-white/20 hover:bg-white/30 border-crochet-200"
        >
          <ArrowRight className="h-5 w-5 text-white" />
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
