import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { AlertTriangle } from 'lucide-react';

interface AuthErrorOverlayProps {
  show: boolean;
  onComplete: () => void;
}

export function AuthErrorOverlay({ show, onComplete }: AuthErrorOverlayProps) {
  const [blink, setBlink] = useState(true);
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    if (!show) return;

    // Blink for 10 seconds
    const blinkInterval = setInterval(() => {
      setBlink(prev => !prev);
    }, 500);

    // Start fade out after 10 seconds
    const fadeTimer = setTimeout(() => {
      setFadeOut(true);
    }, 10000);

    // Complete and cleanup after fade animation (10s + 2s fade)
    const completeTimer = setTimeout(() => {
      onComplete();
      setFadeOut(false);
      setBlink(true);
    }, 12000);

    return () => {
      clearInterval(blinkInterval);
      clearTimeout(fadeTimer);
      clearTimeout(completeTimer);
    };
  }, [show, onComplete]);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 1 }}
          animate={{ opacity: fadeOut ? 0 : 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 2 }}
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black"
          style={{ pointerEvents: 'all' }}
        >
          {/* Animated background */}
          <div className="absolute inset-0">
            <motion.div
              className="absolute top-0 left-0 w-96 h-96 bg-red-600 rounded-full mix-blend-screen filter blur-3xl opacity-30"
              animate={{
                x: [0, 100, 0],
                y: [0, 50, 0],
              }}
              transition={{
                duration: 10,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
            <motion.div
              className="absolute bottom-0 right-0 w-96 h-96 bg-red-800 rounded-full mix-blend-screen filter blur-3xl opacity-20"
              animate={{
                x: [0, -100, 0],
                y: [0, -50, 0],
              }}
              transition={{
                duration: 8,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
          </div>

          {/* Error message */}
          <div className="relative z-10 text-center px-8">
            <motion.div
              animate={{
                scale: blink ? 1 : 0.95,
                opacity: blink ? 1 : 0.3,
              }}
              transition={{ duration: 0.5 }}
            >
              <AlertTriangle className="w-24 h-24 text-red-500 mx-auto mb-8 drop-shadow-[0_0_20px_rgba(239,68,68,0.8)]" />
              
              <h1 
                className="text-6xl text-red-500 mb-6 drop-shadow-[0_0_20px_rgba(239,68,68,0.9)]"
                style={{
                  borderBottom: blink ? '4px dotted #ef4444' : '4px dotted transparent',
                  display: 'inline-block',
                  paddingBottom: '8px'
                }}
              >
                FAILED TO LOGIN
              </h1>
              
              <p className="text-3xl text-white/90 drop-shadow-[0_0_15px_rgba(255,255,255,0.5)] max-w-3xl mx-auto">
                You must have a Discord account to use this website
              </p>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
