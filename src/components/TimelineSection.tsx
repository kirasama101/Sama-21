import { useEffect, useRef, useState } from 'react';

interface YearCard {
  year: string;
  text: string;
}

const years: YearCard[] = [
  {
    year: '2021',
    text: 'The year we met — and I realized my life just got brighter.',
  },
  {
    year: '2022',
    text: 'Distance, calls, and memes. Somehow, we made it look easy.',
  },
  {
    year: '2023',
    text: 'We grew up a little, but never apart.',
  },
  {
    year: '2024',
    text: 'You became my calm, my chaos, and my favorite notification.',
  },
  {
    year: '2025',
    text: 'We made it through everything. Stronger. Closer. Us.',
  },
];

export default function TimelineSection() {
  const [visibleCards, setVisibleCards] = useState<Set<number>>(new Set());
  const [animationKey, setAnimationKey] = useState(0);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [stickers, setStickers] = useState<Array<{
    id: number;
    x: number; // percentage
    y: number; // percentage
    rotation: number;
    scale: number;
    delay: number;
    src: string;
    size: number; // rem base size
  }>>([]);

  useEffect(() => {
    const observers = cardRefs.current.map((card, index) => {
      if (!card) return null;

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              setVisibleCards((prev) => new Set([...prev, index]));
            } else {
              // Reset card visibility when it goes out of view
              setVisibleCards((prev) => {
                const newSet = new Set(prev);
                newSet.delete(index);
                return newSet;
              });
            }
          });
        },
        {
          threshold: 0.3,
          rootMargin: '0px 0px -50px 0px',
        }
      );

      observer.observe(card);
      return observer;
    });

    // Add scroll listener to reset animations when scrolling back to top
    const handleScroll = () => {
      const timelineSection = document.getElementById('timeline');
      if (timelineSection) {
        const rect = timelineSection.getBoundingClientRect();
        // Only reset when timeline section is completely above viewport AND we're near the top of the page
        if (rect.bottom < 0 && window.scrollY < 100) {
          setVisibleCards(new Set());
          setAnimationKey(prev => prev + 1);
        }
      }
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      observers.forEach((observer) => observer?.disconnect());
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Create cute floating stickers (image sketches: cats, paws, hearts, stars)
  useEffect(() => {
    // Place your PNGs under public/stickers/ and list them here
    const stickerImages = [
      '/stickers/cat-1.png',
      '/stickers/cat-2.png',
      '/stickers/paw-1.png',
      '/stickers/paw-2.png',
      '/stickers/heart-1.png',
      '/stickers/star-1.png',
      '/stickers/flower-1.png',
    ];
    const count = 16;
    const generated = Array.from({ length: count }, (_, i) => {
      const src = stickerImages[Math.floor(Math.random() * stickerImages.length)];
      return {
        id: i,
        x: Math.random() * 100, // 0-100%
        y: Math.random() * 100, // 0-100%
        rotation: Math.random() * 40 - 20, // -20deg to 20deg
        scale: 0.8 + Math.random() * 0.8, // 0.8x - 1.6x
        delay: Math.random() * 2, // 0-2s
        src,
        size: 1.75 + Math.random() * 1.25, // rem: 1.75 - 3.0
      };
    });
    setStickers(generated);
  }, []);

  return (
    <section id="timeline" className="relative min-h-screen py-20 px-6 bg-gradient-to-b from-pink-50 via-rose-50 to-pink-100">
      <div className="max-w-4xl mx-auto">
        <h2 className="font-display text-4xl sm:text-5xl md:text-6xl font-bold text-rose-800 text-center mb-16">
          Our 5 Years Together
        </h2>

        {/* Decorative cute sketch stickers (images) */}
        <div className="pointer-events-none select-none absolute inset-0 overflow-hidden">
          {stickers.map((s) => (
            <img
              key={`sticker-${s.id}`}
              src={s.src}
              alt=""
              loading="lazy"
              draggable={false}
              className="absolute opacity-70 animate-float will-change-transform"
              style={{
                left: `${s.x}%`,
                top: `${s.y}%`,
                width: `${s.size}rem`,
                height: 'auto',
                transform: `translate(-50%, -50%) rotate(${s.rotation}deg) scale(${s.scale})`,
                filter: 'drop-shadow(0 4px 10px rgba(0,0,0,0.08))',
                animationDelay: `${s.delay}s`,
              }}
              aria-hidden="true"
            />
          ))}
        </div>

        <div className="space-y-12">
          {years.map((yearCard, index) => (
            <div
              key={`${yearCard.year}-${animationKey}`}
              ref={(el) => (cardRefs.current[index] = el)}
              className={`transition-all duration-700 ${visibleCards.has(index)
                ? 'opacity-100 translate-y-0'
                : 'opacity-0 translate-y-12'
                }`}
            >
              <div className="glass rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-shadow duration-300">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-rose-400 to-pink-500 flex items-center justify-center shadow-lg">
                    <span className="font-display text-white font-bold text-xl">
                      {yearCard.year.length > 4 ? yearCard.year.slice(2, 4) : yearCard.year.slice(2)}
                    </span>
                  </div>
                  <h3 className="font-display text-3xl sm:text-4xl font-bold text-rose-700">
                    {yearCard.year}
                  </h3>
                </div>
                <p className="font-body text-lg sm:text-xl text-rose-800 leading-relaxed pl-20">
                  {yearCard.text}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
