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

  // Password challenge state
  const [passwordInput, setPasswordInput] = useState('');
  const [attempts, setAttempts] = useState(0);
  const [errorMessage, setErrorMessage] = useState('');
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [isShaking, setIsShaking] = useState(false);

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

  const funnyMessages = [
    'Skill issue. Try again.',
    'Nope. That\'s cooked.',
    'Bro… 💀',
    'That\'s not even close.',
  ];

  const handleUnlock = () => {
    // Check if password is correct
    if (passwordInput === '1234') {
      setIsUnlocked(true);
      setShowModal(true);
      setErrorMessage('');
      setPasswordInput('');
      return;
    }

    // Otherwise, continue with the 3-attempt logic
    const newAttempts = attempts + 1;
    setAttempts(newAttempts);

    if (newAttempts < 3) {
      // Show random funny message and shake
      const randomMessage = funnyMessages[Math.floor(Math.random() * funnyMessages.length)];
      setErrorMessage(randomMessage);
      setIsShaking(true);
      setTimeout(() => setIsShaking(false), 500);
    } else {
      // Auto-unlock after 3 attempts
      setIsUnlocked(true);
      setShowModal(true);
      setErrorMessage('');
      setPasswordInput('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleUnlock();
    }
  };

  const closeModal = () => {
    setShowModal(false);
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

          {/* Password Challenge */}
          <div className="mt-16 max-w-md mx-auto">
            <p className="font-body text-lg sm:text-xl text-rose-800 mb-4 text-center">
              Enter the secret password…
            </p>
            <div className="flex flex-col sm:flex-row gap-3 items-center">
              <input
                type="text"
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                onKeyPress={handleKeyPress}
                disabled={isUnlocked}
                className={`flex-1 w-full sm:w-auto glass px-6 py-4 rounded-full text-rose-800 font-body text-lg
                         placeholder-rose-400/60 focus:outline-none focus:ring-2 focus:ring-rose-400/50
                         transition-all duration-300 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed
                         ${isShaking ? 'animate-shake' : ''}`}
                placeholder="Type here..."
              />
              <button
                onClick={handleUnlock}
                disabled={isUnlocked}
                className="glass px-8 py-4 rounded-full text-rose-700 font-body font-semibold text-lg
                         hover:bg-white/30 transition-all duration-300 shadow-lg hover:shadow-xl
                         active:scale-95 min-h-[44px] min-w-[120px] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Unlock
              </button>
            </div>
            {errorMessage && (
              <p className="mt-3 text-center font-body text-rose-600 text-sm sm:text-base animate-fade-in">
                {errorMessage}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in"
          onClick={closeModal}
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/50 backdrop-blur-md" />

          {/* Modal Content */}
          <div
            className="relative rounded-3xl p-8 sm:p-10 max-w-md w-full shadow-2xl animate-scale-in"
            style={{
              background: 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(16px)',
              WebkitBackdropFilter: 'blur(16px)',
              border: '1px solid rgba(255, 255, 255, 0.5)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="font-display text-3xl sm:text-4xl font-bold text-rose-700 text-center mb-4">
              Yaay! 🎉
            </h3>
            <p className="font-body text-lg sm:text-xl text-rose-800 text-center mb-6 leading-relaxed">
              Nice, you unlocked it. Now go drink some water. 🌚💧
            </p>
            <button
              onClick={closeModal}
              className="w-full glass px-6 py-3 rounded-full text-rose-700 font-body font-semibold text-lg
                       hover:bg-white/30 transition-all duration-300 shadow-lg hover:shadow-xl
                       active:scale-95"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
