// Define the type for a hero slide
export interface HeroSlide {
  id: number;
  title: string;
  subtitle: string;
  image: string;
  cta: string;
  link: string;
}

// Default hero slides
const defaultHeroSlides: HeroSlide[] = [
  {
    id: 1,
    title: "Crochet with Limboo",
    subtitle: "Handcrafted Creations from Passion",
    image: "https://images.pexels.com/photos/6850490/pexels-photo-6850490.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    cta: "Explore Collection",
    link: "/shop"
  }
];

// Save slides to localStorage
export const saveHeroSlides = (slides: HeroSlide[]): void => {
  try {
    localStorage.setItem('heroSlides', JSON.stringify(slides));
    // Dispatch a custom event to notify components that slides have been updated
    window.dispatchEvent(new Event('heroSlidesUpdated'));
  } catch (error) {
    console.error('Error saving hero slides:', error);
  }
};

// Get slides from localStorage or return defaults
export const getHeroSlides = (): HeroSlide[] => {
  try {
    const storedSlides = localStorage.getItem('heroSlides');
    if (storedSlides) {
      return JSON.parse(storedSlides);
    }
    return defaultHeroSlides;
  } catch (error) {
    console.error('Error getting hero slides:', error);
    return defaultHeroSlides;
  }
};

// Update a single slide
export const updateHeroSlide = (updatedSlide: HeroSlide): void => {
  const slides = getHeroSlides();
  const updatedSlides = slides.map(slide => 
    slide.id === updatedSlide.id ? updatedSlide : slide
  );
  saveHeroSlides(updatedSlides);
};

// Reset slides to default
export const resetHeroSlidesToDefault = (): void => {
  saveHeroSlides(defaultHeroSlides);
};
