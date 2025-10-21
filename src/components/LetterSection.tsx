import { useEffect, useRef, useState } from 'react';
import { Heart } from 'lucide-react';

export default function LetterSection() {
  const [isVisible, setIsVisible] = useState(false);
  const [showHeart, setShowHeart] = useState(false);
  const [animationKey, setAnimationKey] = useState(0);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            setTimeout(() => {
              setShowHeart(true);
            }, 3500);
          } else {
            // Reset visibility when going out of view
            setIsVisible(false);
            setShowHeart(false);
          }
        });
      },
      {
        threshold: 0.3,
      }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    // Add scroll listener to reset animations when scrolling back to top
    const handleScroll = () => {
      const letterSection = document.querySelector('[data-section="letter"]');
      if (letterSection) {
        const rect = letterSection.getBoundingClientRect();
        // Only reset when letter section is completely above viewport AND we're near the top of the page
        if (rect.bottom < 0 && window.scrollY < 100) {
          setIsVisible(false);
          setShowHeart(false);
          setAnimationKey(prev => prev + 1);
        }
      }
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      observer.disconnect();
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      data-section="letter"
      className="relative min-h-screen flex items-center justify-center py-20 px-6 bg-gradient-to-b from-pink-100 via-rose-100 to-pink-200"
    >
      <div className="max-w-3xl mx-auto">
        <div
          className={`glass rounded-3xl p-8 sm:p-12 shadow-2xl transition-all duration-1000 ${isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
            }`}
        >
          <div className="mb-8 flex justify-center">
            <Heart size={48} className="text-rose-500 fill-rose-500 animate-pulse-slow" />
          </div>

          <div className="space-y-6 text-rose-800">
            <p className="font-body text-lg sm:text-xl md:text-2xl leading-relaxed">
              I could write pages, but none would match how I feel when I look at you.
            </p>

            <p className="font-body text-lg sm:text-xl md:text-2xl leading-relaxed">
              You're 21 now — and somehow even more beautiful, fun, and real than the day we met.
            </p>

            <p className="font-body text-lg sm:text-xl md:text-2xl leading-relaxed">
              Thank you for being my person.
            </p>

            <div className="pt-8 text-right">
              <p className="font-script text-4xl sm:text-5xl text-rose-600">
                Love you endlessly.
              </p>
            </div>
          </div>

          {showHeart && (
            <div key={`heart-${animationKey}`} className="mt-8 flex justify-center animate-scale-in">
              <Heart
                size={64}
                className="text-rose-400 fill-rose-400 animate-pulse-slow"
              />
            </div>
          )}
        </div>
      </div>
    </section>
  );
}