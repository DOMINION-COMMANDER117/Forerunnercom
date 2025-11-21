import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useAdmin } from '../contexts/AdminContext';
import { ArrowLeft, ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';
import evecitaBackground from 'figma:asset/2541fed8b22d48dc63510ece19dcf5291fb73392.png';
import evecitaCharacter from 'figma:asset/3bc1a53fb007ceb90e7888354687a6a9134dff5e.png';

interface EvecitaDrivePageProps {
  onNavigate: (page: string) => void;
}

// Generate stable sparkle positions
const generateSparklePositions = (count: number) => {
  return Array.from({ length: count }, (_, i) => ({
    startX: 10 + (i * 4.5),
    startY: 10 + ((i * 7) % 80),
    offsetX: (i % 2 === 0 ? 1 : -1) * (5 + (i % 3) * 3),
    offsetY: 20 + (i % 3) * 10,
    duration: 3 + (i % 3),
    delay: i * 0.3,
    isBlue: i % 2 === 0,
    size: 1 + (i % 3),
  }));
};

const titleSparkles = generateSparklePositions(12);

export function EvecitaDrivePage({ onNavigate }: EvecitaDrivePageProps) {
  const { getDrive } = useAdmin();
  const drive = getDrive('evecita');
  
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  if (!drive) {
    return <div className="min-h-screen bg-[#1a0520] flex items-center justify-center">
      <p className="text-white/60">Drive not found</p>
    </div>;
  }

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

  return (
    <div className="min-h-screen pt-32 pb-20 relative overflow-hidden">
      {/* Background Layers */}
      <div className="absolute inset-0">
        {/* Pink Striped Background */}
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url(${evecitaBackground})`,
          }}
        />

        {/* Character Layer with Fade */}
        <div 
          className="absolute inset-0 bg-contain bg-center bg-no-repeat"
          style={{
            backgroundImage: `url(${evecitaCharacter})`,
            opacity: 0.5,
          }}
        />

        {/* Color Overlay */}
        <div 
          className="absolute inset-0"
          style={{
            background: 'radial-gradient(circle at 50% 40%, rgba(236, 72, 153, 0.3) 0%, rgba(147, 51, 234, 0.25) 40%, rgba(59, 130, 246, 0.2) 80%)',
            mixBlendMode: 'overlay',
          }}
        />

        {/* Dark overlay for content readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#1a0520]/60 via-[#1a0520]/70 to-[#1a0520]/80" />
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-8 md:px-12 relative z-10">
        {/* Title with Floating Sparkles */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16 relative"
        >
          <h1 className="text-7xl md:text-9xl mb-6 uppercase tracking-wider text-white relative inline-block" style={{ fontWeight: 900 }}>
            {drive.title}
            
            {/* Floating Sparkles Around Title */}
            {titleSparkles.map((sparkle, i) => (
              <motion.div
                key={i}
                className="absolute rounded-full"
                style={{
                  width: sparkle.size,
                  height: sparkle.size,
                  left: `${sparkle.startX}%`,
                  top: `${sparkle.startY}%`,
                  backgroundColor: sparkle.isBlue ? '#60a5fa' : '#c084fc',
                  boxShadow: sparkle.isBlue 
                    ? '0 0 10px #60a5fa, 0 0 20px #3b82f6' 
                    : '0 0 10px #c084fc, 0 0 20px #a855f7',
                }}
                animate={{
                  x: [0, sparkle.offsetX, 0],
                  y: [0, -sparkle.offsetY, 0],
                  opacity: [0.3, 1, 0.3],
                  scale: [0.5, 1.2, 0.5],
                }}
                transition={{
                  duration: sparkle.duration,
                  repeat: Infinity,
                  delay: sparkle.delay,
                  ease: "easeInOut"
                }}
              />
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
              <div className="relative rounded-[32px] overflow-hidden aspect-video bg-black/40 shadow-[0_0_60px_rgba(147,51,234,0.3)] border border-purple-500/30 backdrop-blur-md">
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
                      className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/5 backdrop-blur-sm rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(147,51,234,0.3)] hover:bg-white/10 transition-all hover:scale-110 border border-purple-500/30"
                    >
                      <ChevronLeft className="w-6 h-6 text-white" />
                    </button>
                    <button
                      onClick={nextImage}
                      className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/5 backdrop-blur-sm rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(147,51,234,0.3)] hover:bg-white/10 transition-all hover:scale-110 border border-purple-500/30"
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
                              ? 'bg-purple-500 w-8 shadow-[0_0_10px_rgba(147,51,234,0.8)]' 
                              : 'bg-white/30 hover:bg-white/50'
                          }`}
                        />
                      ))}
                    </div>
                  </>
                )}
              </div>
            ) : (
              <div className="relative rounded-[32px] overflow-hidden aspect-video bg-black/40 shadow-[0_0_60px_rgba(147,51,234,0.3)] border border-purple-500/30 backdrop-blur-md flex items-center justify-center">
                <p className="text-white/40">No images uploaded yet</p>
              </div>
            )}
          </div>

          {/* What's New Box */}
          <div className="lg:col-span-1">
            <div className="rounded-[32px] bg-white/5 backdrop-blur-md p-8 shadow-[0_0_60px_rgba(147,51,234,0.2)] border border-purple-500/30 h-full">
              <h2 className="text-3xl uppercase tracking-wider mb-6 text-white" style={{ fontWeight: 800 }}>
                What's New
              </h2>
              {drive.whatsNewBullets && drive.whatsNewBullets.length > 0 ? (
                <ul className="space-y-3">
                  {drive.whatsNewBullets.map((bullet, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <span className="text-pink-400 mt-1">—</span>
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
            <div className="rounded-[32px] bg-white/5 backdrop-blur-md p-8 shadow-[0_0_60px_rgba(147,51,234,0.2)] border border-purple-500/30">
              <p className="text-xl text-white/80 leading-relaxed whitespace-pre-wrap">
                {drive.bio}
              </p>
            </div>
          </motion.div>
        )}

        {/* GET IT Button with Floating Sparkles */}
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
              <div className="relative px-12 py-4 rounded-[32px] overflow-visible">
                {/* Outer Glow */}
                <motion.div
                  className="absolute -inset-2"
                  style={{
                    background: 'radial-gradient(circle at center, rgba(236,72,153,0.4) 0%, rgba(147,51,234,0.3) 40%, transparent 70%)',
                    filter: 'blur(20px)',
                  }}
                  animate={{
                    opacity: [0.6, 1, 0.6],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                />

                {/* Background Layer */}
                <div className="absolute inset-0 bg-gradient-to-r from-purple-600/60 to-pink-600/60 backdrop-blur-md rounded-[32px] border border-purple-400/50 shadow-[0_0_40px_rgba(147,51,234,0.5)]" />

                {/* Shimmer Wave */}
                <motion.div
                  className="absolute inset-0 opacity-40"
                  style={{
                    background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.4) 50%, transparent 100%)',
                  }}
                  animate={{
                    x: ['-100%', '200%'],
                  }}
                  transition={{
                    duration: 2.5,
                    repeat: Infinity,
                    ease: "linear"
                  }}
                />

                {/* Floating Sparkles Around Button */}
                {[...Array(16)].map((_, i) => {
                  const angle = (i / 16) * Math.PI * 2;
                  const radius = 60 + (i % 3) * 10;
                  const isBlue = i % 2 === 0;
                  const isPink = i % 3 === 0;
                  
                  return (
                    <motion.div
                      key={i}
                      className="absolute rounded-full"
                      style={{
                        width: 2 + (i % 2),
                        height: 2 + (i % 2),
                        left: '50%',
                        top: '50%',
                        backgroundColor: isPink ? '#ec4899' : isBlue ? '#60a5fa' : '#c084fc',
                        boxShadow: isPink 
                          ? '0 0 8px #ec4899, 0 0 16px #db2777'
                          : isBlue 
                            ? '0 0 8px #60a5fa, 0 0 16px #3b82f6'
                            : '0 0 8px #c084fc, 0 0 16px #a855f7',
                      }}
                      animate={{
                        x: [0, Math.cos(angle) * radius, 0],
                        y: [0, Math.sin(angle) * radius, 0],
                        opacity: [0, 1, 0],
                        scale: [0, 1.5, 0],
                      }}
                      transition={{
                        duration: 3 + (i % 3),
                        repeat: Infinity,
                        delay: i * 0.15,
                        ease: "easeInOut"
                      }}
                    />
                  );
                })}

                {/* Text Content */}
                <div className="relative flex items-center gap-3">
                  <Sparkles className="w-5 h-5 text-white" />
                  <span className="text-2xl uppercase tracking-wider text-white" style={{ fontWeight: 700 }}>
                    GET IT
                  </span>
                  <Sparkles className="w-5 h-5 text-white" />
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
            className="px-8 py-4 bg-white/5 backdrop-blur-md rounded-[32px] hover:bg-white/10 transition-all flex items-center gap-3 text-white shadow-[0_0_30px_rgba(147,51,234,0.2)] uppercase border border-purple-500/30"
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
