import { useState, useEffect } from 'react';
import { ChevronDown, Music } from 'lucide-react';

interface HeroSectionProps {
  onMusicToggle: () => void;
  isPlaying: boolean;
}

export default function HeroSection({ onMusicToggle, isPlaying }: HeroSectionProps) {
  const [sparkles, setSparkles] = useState<Array<{ id: number; left: number; top: number; delay: number }>>([]);

  useEffect(() => {
    const newSparkles = Array.from({ length: 30 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      top: Math.random() * 100,
      delay: Math.random() * 2,
    }));
    setSparkles(newSparkles);
  }, []);

  const scrollToNext = () => {
    const timelineSection = document.getElementById('timeline');
    timelineSection?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden gradient-shimmer">
      {sparkles.map((sparkle) => (
        <div
          key={sparkle.id}
          className="sparkle"
          style={{
            left: `${sparkle.left}%`,
            top: `${sparkle.top}%`,
            animationDelay: `${sparkle.delay}s`,
          }}
        />
      ))}

      <div className="relative z-10 text-center px-6 py-12">
        <div className="animate-fade-in-up opacity-0" style={{ animationDelay: '0.2s' }}>
          <h1 className="font-script text-6xl sm:text-7xl md:text-8xl text-rose-600 mb-6 text-shadow-glow">
            Sama
          </h1>
        </div>

        <div className="animate-fade-in-up opacity-0" style={{ animationDelay: '0.5s' }}>
          <h2 className="font-display text-4xl sm:text-5xl md:text-6xl font-bold text-rose-800 mb-8">
            Happy 21st Birthday, my love
          </h2>
        </div>

        <div className="animate-fade-in-up opacity-0 max-w-2xl mx-auto" style={{ animationDelay: '0.8s' }}>
          <p className="font-body text-lg sm:text-xl md:text-2xl text-rose-700 leading-relaxed italic mb-8">
            Five years of laughter, chaos, and love — and I'd still choose you every single day.
          </p>
        </div>

        <div className="animate-fade-in-up opacity-0 space-y-4" style={{ animationDelay: '1.1s' }}>
          <button
            onClick={scrollToNext}
            className="glass px-8 py-4 rounded-full text-rose-700 font-body font-semibold text-lg
                     hover:bg-white/25 transition-all duration-300 shadow-lg hover:shadow-xl
                     active:scale-95 min-h-[44px] min-w-[44px]"
          >
            Scroll to relive us ✨
          </button>

          <button
            onClick={onMusicToggle}
            className="block mx-auto glass px-6 py-3 rounded-full text-rose-600 font-body
                     hover:bg-white/25 transition-all duration-300 shadow-lg
                     active:scale-95 min-h-[44px] min-w-[44px] flex items-center gap-2"
            aria-label={isPlaying ? 'Pause music' : 'Play music'}
          >
            <Music size={20} />
            <span className="text-sm">{isPlaying ? 'Pause' : 'Tap to play'}</span>
          </button>
        </div>

        <div className="absolute bottom-5 animate-slide-down" style={{ left: 'calc(50% - 6px)', transform: 'translateX(-50%)' }}>
          <ChevronDown size={32} className="text-rose-400" />
        </div>
      </div>
    </section>
  );
}
