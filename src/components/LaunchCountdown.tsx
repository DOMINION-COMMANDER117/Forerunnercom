import { useState, useEffect } from 'react';
import { motion } from 'motion/react';

export function LaunchCountdown() {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    total: 0,
  });

  useEffect(() => {
    // Target: Thursday, November 6, 2025 at 1:00 PM EST (UTC-5)
    const targetDate = new Date('2025-11-06T13:00:00-05:00');

    const updateCountdown = () => {
      const now = new Date().getTime();
      const distance = targetDate.getTime() - now;

      if (distance < 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0, total: 0 });
        return;
      }

      const days = Math.floor(distance / (1000 * 60 * 60 * 24));
      const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);

      setTimeLeft({ days, hours, minutes, seconds, total: distance });
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);

    return () => clearInterval(interval);
  }, []);

  if (timeLeft.total <= 0) {
    return null; // Don't show after launch
  }

  return (
    <motion.div 
      className="fixed top-20 left-0 right-0 z-40 backdrop-blur-xl bg-red-950/40 border-b-2 border-red-500/60"
      initial={{ y: -100, opacity: 0 }}
      animate={{ 
        y: 0, 
        opacity: 1,
        boxShadow: [
          '0 4px 20px rgba(239, 68, 68, 0.3)',
          '0 4px 40px rgba(239, 68, 68, 0.6)',
          '0 4px 20px rgba(239, 68, 68, 0.3)',
        ],
      }}
      transition={{
        y: { duration: 0.5 },
        opacity: { duration: 0.5 },
        boxShadow: {
          duration: 1.5,
          repeat: Infinity,
          ease: 'easeInOut',
        },
      }}
    >
      <div className="container mx-auto px-4 py-3 flex items-center justify-between gap-4 flex-wrap">
        {/* Launch day text */}
        <motion.div
          className="flex items-center gap-3"
          animate={{
            opacity: [1, 0.4, 1],
          }}
          transition={{
            duration: 0.8,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        >
          <span className="text-red-500 text-xl md:text-2xl" style={{ textShadow: '0 0 15px rgba(239, 68, 68, 0.9)' }}>
            🚀 LAUNCH DAY!
          </span>
          <span className="hidden md:inline text-white/50 text-sm">
            Thursday, November 6, 2025 @ 1:00 PM EST
          </span>
        </motion.div>

        {/* Countdown timer */}
        <div className="flex gap-3 md:gap-6 items-center">
          <TimeUnit value={timeLeft.days} label="DAYS" />
          <Separator />
          <TimeUnit value={timeLeft.hours} label="HRS" />
          <Separator />
          <TimeUnit value={timeLeft.minutes} label="MIN" />
          <Separator />
          <TimeUnit value={timeLeft.seconds} label="SEC" />
        </div>
      </div>
    </motion.div>
  );
}

function TimeUnit({ value, label }: { value: number; label: string }) {
  return (
    <div className="flex flex-col items-center gap-1">
      <motion.div
        className="text-red-500 px-2 py-1 md:px-3 md:py-1.5 rounded-lg backdrop-blur-sm bg-red-950/30 border border-red-500/50"
        style={{
          textShadow: '0 0 15px rgba(239, 68, 68, 0.9)',
        }}
        animate={{
          opacity: [1, 0.5, 1],
          borderColor: [
            'rgba(239, 68, 68, 0.5)',
            'rgba(239, 68, 68, 0.9)',
            'rgba(239, 68, 68, 0.5)',
          ],
        }}
        transition={{
          duration: Math.random() * 1 + 0.5,
          repeat: Infinity,
          ease: 'easeInOut',
          repeatDelay: Math.random() * 0.3,
        }}
      >
        {String(value).padStart(2, '0')}
      </motion.div>
      <motion.div
        className="text-red-400/70 text-xs"
        animate={{
          opacity: [0.7, 0.3, 0.7],
        }}
        transition={{
          duration: 1.2,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      >
        {label}
      </motion.div>
    </div>
  );
}

function Separator() {
  return (
    <motion.div
      className="text-red-500 text-xl md:text-2xl"
      style={{
        textShadow: '0 0 10px rgba(239, 68, 68, 0.8)',
      }}
      animate={{
        opacity: [1, 0.3, 1],
      }}
      transition={{
        duration: 1,
        repeat: Infinity,
        ease: 'easeInOut',
      }}
    >
      :
    </motion.div>
  );
}
