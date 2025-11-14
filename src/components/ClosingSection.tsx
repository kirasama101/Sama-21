import { useEffect, useRef, useState } from 'react';
import { Sparkles } from 'lucide-react';

interface ClosingSectionProps {
  onConfetti: () => void;
}

export default function ClosingSection({ onConfetti }: ClosingSectionProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [sparkles, setSparkles] = useState<Array<{ id: number; x: number; y: number; delay: number; duration: number }>>([]);
  const [animationKey, setAnimationKey] = useState(0);
  const sectionRef = useRef<HTMLElement>(null);
  const confettiTriggered = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            if (!confettiTriggered.current) {
              confettiTriggered.current = true;
              setTimeout(() => {
                onConfetti();
              }, 800);
            }
          } else {
            // Reset visibility when going out of view
            setIsVisible(false);
          }
        });
      },
      {
        threshold: 0.5,
      }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    // Add scroll listener to reset animations when scrolling back to top
    const handleScroll = () => {
      const closingSection = document.querySelector('[data-section="closing"]');
      if (closingSection) {
        const rect = closingSection.getBoundingClientRect();
        // Only reset when closing section is completely above viewport AND we're near the top of the page
        if (rect.bottom < 0 && window.scrollY < 100) {
          setIsVisible(false);
          confettiTriggered.current = false;
          setAnimationKey(prev => prev + 1);
        }
      }
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      observer.disconnect();
      window.removeEventListener('scroll', handleScroll);
    };
  }, [onConfetti]);

  useEffect(() => {
    if (isVisible) {
      const newSparkles = Array.from({ length: 40 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        delay: Math.random() * 2,
        duration: 1.5 + Math.random() * 1,
      }));
      setSparkles(newSparkles);
    }
  }, [isVisible]);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <section
      ref={sectionRef}
      data-section="closing"
      className="relative min-h-screen flex items-center justify-center py-20 px-6 bg-gradient-to-b from-pink-200 via-rose-200 to-pink-300 overflow-hidden"
    >
      {sparkles.map((sparkle) => (
        <div
          key={`sparkle-${animationKey}-${sparkle.id}`}
          className="absolute"
          style={{
            left: `${sparkle.x}%`,
            top: `${sparkle.y}%`,
          }}
        >
          <Sparkles
            size={20}
            className="text-yellow-300 fill-yellow-300 animate-pulse-slow"
            style={{
              animationDelay: `${sparkle.delay}s`,
              animationDuration: `${sparkle.duration}s`,
            }}
          />
        </div>
      ))}

      <div className="relative z-10 text-center">
        <div
          className={`transition-all duration-1000 ${isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-75'
            }`}
        >
          <div className="mb-12 relative">
            <h1 className="font-display text-9xl sm:text-[12rem] md:text-[14rem] font-bold text-rose-600 text-shadow-glow animate-float">
              21
            </h1>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-48 h-48 sm:w-64 sm:h-64 rounded-full bg-rose-300/30 blur-3xl animate-pulse-slow" />
            </div>
          </div>

          <div className="space-y-8 max-w-2xl mx-auto">
            <p className="font-body text-2xl sm:text-3xl md:text-4xl text-rose-800 leading-relaxed">
              To more adventures, more laughter, and a lifetime of 'us'.
            </p>

            <p className="text-3xl sm:text-4xl md:text-5xl font-script text-rose-600 text-shadow-glow">
              Happy 21st, my forever person
            </p>

            <button
              onClick={scrollToTop}
              className="mt-12 glass px-10 py-5 rounded-full text-rose-700 font-body font-semibold text-xl
                       hover:bg-white/30 transition-all duration-300 shadow-xl hover:shadow-2xl
                       active:scale-95 min-h-[44px] min-w-[44px]"
            >
              Replay ✨
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
