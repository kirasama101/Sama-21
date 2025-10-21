import { useState, useRef } from 'react';
import HeroSection from './components/HeroSection';
import TimelineSection from './components/TimelineSection';
import LetterSection from './components/LetterSection';
import ClosingSection from './components/ClosingSection';

function App() {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const handleMusicToggle = () => {
    if (!audioRef.current) {
      audioRef.current = new Audio('https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3');
      audioRef.current.loop = true;
      audioRef.current.volume = 0.3;
    }

    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play().catch(() => {
        console.log('Audio play failed');
      });
    }
    setIsPlaying(!isPlaying);
  };

  const createConfetti = () => {
    const colors = ['#ff69b4', '#ffc0cb', '#ff1493', '#db7093', '#ffb6c1', '#ffaed0'];
    const confettiCount = 50;

    for (let i = 0; i < confettiCount; i++) {
      setTimeout(() => {
        const confetti = document.createElement('div');
        confetti.className = 'confetti';
        confetti.style.left = `${Math.random() * 100}%`;
        confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        confetti.style.animationDelay = `${Math.random() * 0.5}s`;
        confetti.style.animationDuration = `${2.5 + Math.random() * 1}s`;
        document.body.appendChild(confetti);

        setTimeout(() => {
          confetti.remove();
        }, 4000);
      }, i * 30);
    }
  };

  return (
    <div className="scroll-smooth">
      <HeroSection onMusicToggle={handleMusicToggle} isPlaying={isPlaying} />
      <TimelineSection />
      <LetterSection />
      <ClosingSection onConfetti={createConfetti} />
    </div>
  );
}

export default App;
