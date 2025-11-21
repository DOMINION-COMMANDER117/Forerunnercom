import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useAdmin } from '../contexts/AdminContext';
import { ArrowLeft, ChevronLeft, ChevronRight, Zap } from 'lucide-react';

interface KayoDrivePageProps {
  onNavigate: (page: string) => void;
}

export function KayoDrivePage({ onNavigate }: KayoDrivePageProps) {
  const { getDrive } = useAdmin();
  const drive = getDrive('kayo');
  
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [letterStates, setLetterStates] = useState<boolean[]>([]);
  const [letterColors, setLetterColors] = useState<string[]>([]);

  if (!drive) {
    return <div className="min-h-screen bg-[#1a0a0a] flex items-center justify-center">
      <p className="text-white/60">Drive not found</p>
    </div>;
  }

  // Initialize letter states and colors
  useEffect(() => {
    const title = drive.title;
    setLetterStates(Array(title.length).fill(true));
    // Initialize with random colors for each letter
    const colors = ['white', 'red', 'orange'];
    setLetterColors(Array(title.length).fill(0).map(() => colors[Math.floor(Math.random() * colors.length)]));
  }, [drive.title]);

  // Electrical flickering effect for title
  useEffect(() => {
    const title = drive.title;
    const flickerInterval = setInterval(() => {
      const newStates = [...letterStates];
      const newColors = [...letterColors];
      const colors = ['white', 'red', 'orange'];
      
      // Random flicker pattern
      const numToFlicker = Math.floor(Math.random() * 3) + 1;
      for (let i = 0; i < numToFlicker; i++) {
        const randomIndex = Math.floor(Math.random() * title.length);
        newStates[randomIndex] = Math.random() > 0.3;
        newColors[randomIndex] = colors[Math.floor(Math.random() * colors.length)];
      }
      
      setLetterStates(newStates);
      setLetterColors(newColors);
    }, 150);

    return () => clearInterval(flickerInterval);
  }, [letterStates, letterColors, drive.title]);

  const hasImages = drive.images && drive.images.length > 0;

  // Auto-advance slideshow
  useEffect(() => {
    if (!hasImages || drive.images.length <= 1) return;
    
    const timer = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % drive.images.length);
    }, 5000);

    return () => clearInterval(timer);
  }, [hasImages, drive.images.length]);

  const nextImage = () => {
    if (hasImages) {
      setCurrentImageIndex((prev) => (prev + 1) % drive.images.length);
    }
  };

  const prevImage = () => {
    if (hasImages) {
      setCurrentImageIndex((prev) => 
        prev === 0 ? drive.images.length - 1 : prev - 1
      );
    }
  };

  const getLetterColor = (color: string) => {
    if (color === 'red') return 'text-red-500';
    if (color === 'orange') return 'text-orange-500';
    return 'text-white';
  };

  return (
    <div className="min-h-screen bg-[#1a0a0a] pt-32 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 md:px-12">
        {/* Flickering Title */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h1 className="text-7xl md:text-9xl mb-6 uppercase tracking-wider" style={{ fontWeight: 900 }}>
            {drive.title.split('').map((letter, index) => (
              <span
                key={index}
                className={`inline-block transition-all duration-100 ${
                  letterStates[index] ? getLetterColor(letterColors[index]) : 'text-transparent'
                }`}
                style={{
                  textShadow: letterStates[index]
                    ? `0 0 20px ${letterColors[index] === 'red' ? '#ef4444' : letterColors[index] === 'orange' ? '#f97316' : '#ffffff'},
                       0 0 40px ${letterColors[index] === 'red' ? '#dc2626' : letterColors[index] === 'orange' ? '#ea580c' : '#ffffff'}`
                    : 'none',
                }}
              >
                {letter === ' ' ? '\u00A0' : letter}
              </span>
            ))}
          </h1>
        </motion.div>

        {/* Main Content: Slideshow + What's New Side by Side */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12"
        >
          {/* Image Slideshow */}
          <div className="lg:col-span-2">
            {hasImages ? (
              <div className="relative rounded-[32px] overflow-hidden aspect-video bg-black/40 shadow-[0_0_60px_rgba(239,68,68,0.3)] border border-red-500/30">
                <AnimatePresence mode="wait">
                  <motion.img
                    key={currentImageIndex}
                    src={drive.images[currentImageIndex]}
                    alt={`Slideshow ${currentImageIndex + 1}`}
                    className="w-full h-full object-cover"
                    initial={{ opacity: 0, scale: 1.05 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.5 }}
                  />
                </AnimatePresence>

                {/* Navigation Arrows */}
                {drive.images.length > 1 && (
                  <>
                    <button
                      onClick={prevImage}
                      className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/5 backdrop-blur-sm rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(239,68,68,0.3)] hover:bg-white/10 transition-all hover:scale-110 border border-red-500/30"
                    >
                      <ChevronLeft className="w-6 h-6 text-white" />
                    </button>
                    <button
                      onClick={nextImage}
                      className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/5 backdrop-blur-sm rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(239,68,68,0.3)] hover:bg-white/10 transition-all hover:scale-110 border border-red-500/30"
                    >
                      <ChevronRight className="w-6 h-6 text-white" />
                    </button>

                    {/* Slide Indicators */}
                    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
                      {drive.images.map((_, idx) => (
                        <button
                          key={idx}
                          onClick={() => setCurrentImageIndex(idx)}
                          className={`w-2 h-2 rounded-full transition-all ${
                            idx === currentImageIndex 
                              ? 'bg-red-500 w-8 shadow-[0_0_10px_rgba(239,68,68,0.8)]' 
                              : 'bg-white/30 hover:bg-white/50'
                          }`}
                        />
                      ))}
                    </div>
                  </>
                )}
              </div>
            ) : (
              <div className="relative rounded-[32px] overflow-hidden aspect-video bg-black/40 shadow-[0_0_60px_rgba(239,68,68,0.3)] border border-red-500/30 flex items-center justify-center">
                <p className="text-white/40">No images uploaded yet</p>
              </div>
            )}
          </div>

          {/* What's New Box */}
          <div className="lg:col-span-1">
            <div className="rounded-[32px] bg-white/5 backdrop-blur-sm p-8 shadow-[0_0_60px_rgba(239,68,68,0.2)] border border-red-500/30 h-full">
              <h2 className="text-3xl uppercase tracking-wider mb-6 text-white" style={{ fontWeight: 800 }}>
                What's New
              </h2>
              {drive.whatsNewBullets && drive.whatsNewBullets.length > 0 ? (
                <ul className="space-y-3">
                  {drive.whatsNewBullets.map((bullet, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <span className="text-red-500 mt-1">—</span>
                      <span className="text-white/80 flex-1">{bullet}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-white/40">No updates yet</p>
              )}
            </div>
          </div>
        </motion.div>

        {/* Description Section */}
        {drive.bio && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mb-12"
          >
            <div className="rounded-[32px] bg-white/5 backdrop-blur-sm p-8 shadow-[0_0_60px_rgba(239,68,68,0.2)] border border-red-500/30">
              <p className="text-xl text-white/80 leading-relaxed whitespace-pre-wrap">
                {drive.bio}
              </p>
            </div>
          </motion.div>
        )}

        {/* GET IT Button with Lightning & Sparks */}
        {drive.link && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="flex justify-center mb-12"
          >
            <motion.a
              href={drive.link}
              target="_blank"
              rel="noopener noreferrer"
              className="relative group"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {/* Button Container */}
              <div className="relative px-12 py-4 rounded-[32px] overflow-hidden">
                {/* Lightning Glow Effect */}
                <motion.div
                  className="absolute -inset-2"
                  style={{
                    background: 'radial-gradient(circle at center, rgba(239,68,68,0.4) 0%, rgba(251,146,60,0.3) 40%, transparent 70%)',
                    filter: 'blur(20px)',
                  }}
                  animate={{
                    opacity: [0.5, 1, 0.5],
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                />

                {/* Background Layer */}
                <div className="absolute inset-0 bg-black/60 backdrop-blur-sm rounded-[32px] border border-red-500/50 shadow-[0_0_40px_rgba(239,68,68,0.5)]" />

                {/* Animated Lightning Waves */}
                <motion.div
                  className="absolute inset-0 opacity-40"
                  style={{
                    background: 'linear-gradient(90deg, transparent 0%, rgba(239,68,68,0.3) 50%, transparent 100%)',
                  }}
                  animate={{
                    x: ['-100%', '200%'],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "linear"
                  }}
                />

                {/* Spark Particles */}
                {[...Array(6)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute w-1 h-1 bg-red-500 rounded-full"
                    style={{
                      left: `${20 + i * 15}%`,
                      top: '50%',
                      boxShadow: '0 0 8px rgba(239,68,68,0.8)',
                    }}
                    animate={{
                      y: [-20, 20, -20],
                      opacity: [0, 1, 0],
                      scale: [0, 1.5, 0],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      delay: i * 0.3,
                      ease: "easeInOut"
                    }}
                  />
                ))}

                {/* Text Content */}
                <div className="relative flex items-center gap-3">
                  <Zap className="w-5 h-5 text-red-500" />
                  <span className="text-2xl uppercase tracking-wider text-white" style={{ fontWeight: 700 }}>
                    GET IT
                  </span>
                  <Zap className="w-5 h-5 text-red-500" />
                </div>
              </div>
            </motion.a>
          </motion.div>
        )}

        {/* Back button */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="flex justify-center mb-12"
        >
          <motion.button
            onClick={() => onNavigate('explore')}
            className="px-8 py-4 bg-white/5 backdrop-blur-sm rounded-[32px] hover:bg-white/10 transition-all flex items-center gap-3 text-white shadow-[0_0_30px_rgba(255,255,255,0.1)] uppercase border border-white/10"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <ArrowLeft className="w-5 h-5" />
            BACK TO EXPLORE
          </motion.button>
        </motion.div>

        {/* Copyright Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="text-center pb-8"
        >
          <p className="text-white/40 text-sm">
            {drive.owner}'s Drive © 2025
          </p>
        </motion.div>
      </div>
    </div>
  );
}
