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
  const [errorMessage, setErrorMessage] = useState('');
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [isShaking, setIsShaking] = useState(false);
  const [wrongAttempts, setWrongAttempts] = useState(0);
  const [showHint, setShowHint] = useState(false);

  // Modal state
  const [showForeverMessage, setShowForeverMessage] = useState(false);
  const [noButtonMessage, setNoButtonMessage] = useState('');

  const wrongPasswordMessages = [
    'nah try again 💀',
    'that\'s not the right option 😭',
    'fake button btw',
    'I\'ll wait…',
  ];

  const noButtonMessages = [
    'nah try again 💀',
    'that\'s not the right option 😭',
    'fake button btw',
    'I\'ll wait…',
  ];

  const sendEmail = async (subject: string, message: string) => {
    try {
      await fetch('/api/sendEmail', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ subject, message }),
      });
    } catch (error) {
      console.error('Failed to send email:', error);
    }
  };

  const handleUnlock = async () => {
    if (!passwordInput.trim()) {
      return;
    }

    // Case-insensitive check for "sama"
    if (passwordInput.toLowerCase().trim() === 'sama') {
      // Correct password
      setIsUnlocked(true);
      setErrorMessage('');
      setPasswordInput('');
      setWrongAttempts(0);
      setShowHint(false);

      // Send email
      await sendEmail('Correct password', 'Correct password entered: sama');

      // Open modal
      setShowModal(true);
      return;
    }

    // Wrong password
    const newAttempts = wrongAttempts + 1;
    setWrongAttempts(newAttempts);

    // Show hint after 3 wrong attempts
    if (newAttempts >= 3) {
      setShowHint(true);
    }

    const randomMessage = wrongPasswordMessages[Math.floor(Math.random() * wrongPasswordMessages.length)];
    setErrorMessage(randomMessage);
    setIsShaking(true);
    setTimeout(() => setIsShaking(false), 500);
    setPasswordInput('');

    // Send email
    await sendEmail('Wrong password attempt', `Wrong password: ${passwordInput}`);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleUnlock();
    }
  };

  const handleYes = async () => {
    // Send email
    await sendEmail('YES pressed', 'She pressed YES 💖');

    // Fade screen dark and show forever message
    setShowForeverMessage(true);
  };

  const handleNo = async () => {
    // Send email
    await sendEmail('NO pressed', 'She pressed NO 😭');

    // Show random message under popup
    const randomMessage = noButtonMessages[Math.floor(Math.random() * noButtonMessages.length)];
    setNoButtonMessage(randomMessage);
  };

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

          {/* Password Challenge */}
          <div className="mt-16 max-w-md mx-auto">
            <h2 className="font-body text-2xl sm:text-3xl font-semibold text-rose-800 mb-6 text-center">
              Final challenge: Something I love ❤️
            </h2>
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
                placeholder="Type your answer here..."
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
            {showHint && (
              <p className="mt-3 text-center font-body text-rose-700 text-base sm:text-lg font-semibold animate-fade-in">
                💡 It starts with S
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Forever Message Overlay */}
      {showForeverMessage && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center">
          <div className="absolute inset-0 bg-black/90 transition-opacity duration-1000 animate-fade-in" />
          <div className="relative z-10 text-center animate-cinematic-fade-in">
            <h2 className="font-display text-5xl sm:text-7xl md:text-8xl font-bold text-white text-shadow-glow px-4">
              Forever starts today.
            </h2>
          </div>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-md transition-opacity duration-300"
            onClick={(e) => e.stopPropagation()}
          />

          {/* Modal Content */}
          <div
            className="relative rounded-3xl p-8 sm:p-10 max-w-md w-full shadow-2xl animate-scale-in bg-gradient-to-br from-pink-100 to-rose-100 border-2 border-rose-300/50"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="font-display text-3xl sm:text-4xl font-bold text-rose-700 text-center mb-6">
              Will you be mine forever?
            </h3>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-4">
              <button
                onClick={handleYes}
                className="glass px-8 py-4 rounded-full text-rose-700 font-body font-semibold text-lg
                         bg-rose-200/50 hover:bg-rose-300/50
                         transition-all duration-300 shadow-lg hover:shadow-xl active:scale-95
                         min-h-[50px] min-w-[120px]"
              >
                YES
              </button>
              <button
                onClick={handleNo}
                className="glass px-8 py-4 rounded-full text-rose-700 font-body font-semibold text-lg
                         hover:bg-white/30 transition-all duration-300 shadow-lg hover:shadow-xl
                         active:scale-95 min-h-[50px] min-w-[120px]"
              >
                NO
              </button>
            </div>

            {noButtonMessage && (
              <p className="mt-4 text-center font-body text-rose-600 text-sm sm:text-base animate-fade-in">
                {noButtonMessage}
              </p>
            )}
          </div>
        </div>
      )}
    </section>
  );
}
