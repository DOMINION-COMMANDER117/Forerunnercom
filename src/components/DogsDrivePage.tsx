import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useAdmin } from '../contexts/AdminContext';
import { ArrowLeft, ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';
import dogsBackground from 'figma:asset/5049ef414cb72c2fc7f04f5ba984e461787cfc3e.png';

interface DogsDrivePageProps {
  onNavigate: (page: string) => void;
}

export function DogsDrivePage({ onNavigate }: DogsDrivePageProps) {
  const { getDrive } = useAdmin();
  const drive = getDrive('dogs');
  
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  if (!drive) {
    return <div className="min-h-screen bg-white flex items-center justify-center">
      <p className="text-gray-600">Drive not found</p>
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
    <div 
      className="min-h-screen bg-cover bg-center pt-32 pb-20 relative"
      style={{ backgroundImage: `url(${dogsBackground})` }}
    >
      {/* Light overlay for readability */}
      <div className="absolute inset-0 bg-white/40 backdrop-blur-sm" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-8 md:px-12 relative z-10">
        {/* Title - Normal White Font */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h1 className="text-7xl md:text-9xl mb-6 uppercase tracking-wider text-white" style={{ fontWeight: 900, textShadow: '0 4px 20px rgba(0,0,0,0.3)' }}>
            {drive.title}
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
              <div className="relative rounded-[32px] overflow-hidden aspect-video bg-black/10 shadow-[0_8px_32px_rgba(0,0,0,0.1)] border border-white/30 backdrop-blur-md">
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
                      className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/30 backdrop-blur-md rounded-full flex items-center justify-center shadow-lg hover:bg-white/40 transition-all hover:scale-110 border border-white/40"
                    >
                      <ChevronLeft className="w-6 h-6 text-gray-800" />
                    </button>
                    <button
                      onClick={nextImage}
                      className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/30 backdrop-blur-md rounded-full flex items-center justify-center shadow-lg hover:bg-white/40 transition-all hover:scale-110 border border-white/40"
                    >
                      <ChevronRight className="w-6 h-6 text-gray-800" />
                    </button>

                    {/* Slide Indicators */}
                    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
                      {drive.images.map((_, idx) => (
                        <button
                          key={idx}
                          onClick={() => setCurrentImageIndex(idx)}
                          className={`w-2 h-2 rounded-full transition-all ${
                            idx === currentImageIndex 
                              ? 'bg-white w-8 shadow-lg' 
                              : 'bg-white/40 hover:bg-white/60'
                          }`}
                        />
                      ))}
                    </div>
                  </>
                )}
              </div>
            ) : (
              <div className="relative rounded-[32px] overflow-hidden aspect-video bg-white/20 backdrop-blur-md shadow-lg border border-white/30 flex items-center justify-center">
                <p className="text-gray-600">No images uploaded yet</p>
              </div>
            )}
          </div>

          {/* What's New Box */}
          <div className="lg:col-span-1">
            <div className="rounded-[32px] bg-white/30 backdrop-blur-md p-8 shadow-lg border border-white/40 h-full">
              <h2 className="text-3xl uppercase tracking-wider mb-6 text-gray-800" style={{ fontWeight: 800 }}>
                What's New
              </h2>
              {drive.whatsNewBullets && drive.whatsNewBullets.length > 0 ? (
                <ul className="space-y-3">
                  {drive.whatsNewBullets.map((bullet, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <span className="text-gray-700 mt-1">—</span>
                      <span className="text-gray-700 flex-1">{bullet}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-500">No updates yet</p>
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
            <div className="rounded-[32px] bg-white/30 backdrop-blur-md p-8 shadow-lg border border-white/40">
              <p className="text-xl text-gray-800 leading-relaxed whitespace-pre-wrap">
                {drive.bio}
              </p>
            </div>
          </motion.div>
        )}

        {/* GET IT Button with Zero Point Energy */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="flex justify-center mb-12"
        >
          {drive.link ? (
            <motion.a
              href={drive.link}
              target="_blank"
              rel="noopener noreferrer"
              className="relative group"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {/* Zero Point Energy Field Container */}
              <div className="relative" style={{ width: '280px', height: '120px' }}>
                
                {/* Quantum Particles - Orbiting Energy Orbs */}
                {[...Array(8)].map((_, i) => (
                  <motion.div
                    key={`orb-${i}`}
                    className="absolute w-3 h-3 rounded-full"
                    style={{
                      background: `radial-gradient(circle, ${i % 2 === 0 ? 'rgba(100,200,255,0.9)' : 'rgba(200,255,255,0.9)'} 0%, transparent 70%)`,
                      boxShadow: `0 0 ${12 + i * 2}px ${i % 2 === 0 ? 'rgba(100,200,255,0.8)' : 'rgba(200,255,255,0.8)'}`,
                      filter: 'blur(0.5px)',
                    }}
                    animate={{
                      x: [
                        Math.cos((i / 8) * Math.PI * 2) * 100 + 120,
                        Math.cos((i / 8) * Math.PI * 2 + Math.PI * 2) * 100 + 120,
                      ],
                      y: [
                        Math.sin((i / 8) * Math.PI * 2) * 45 + 50,
                        Math.sin((i / 8) * Math.PI * 2 + Math.PI * 2) * 45 + 50,
                      ],
                      opacity: [0.4, 1, 0.4],
                    }}
                    transition={{
                      duration: 4 + i * 0.3,
                      repeat: Infinity,
                      ease: "linear",
                      delay: i * 0.2,
                    }}
                  />
                ))}

                {/* Energy Waves - Expanding Rings */}
                {[...Array(3)].map((_, i) => (
                  <motion.div
                    key={`wave-${i}`}
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border-2"
                    style={{
                      borderColor: `rgba(100,200,255,${0.6 - i * 0.2})`,
                      width: '100px',
                      height: '60px',
                    }}
                    animate={{
                      scale: [1, 2.5],
                      opacity: [0.6, 0],
                    }}
                    transition={{
                      duration: 2.5,
                      repeat: Infinity,
                      ease: "easeOut",
                      delay: i * 0.8,
                    }}
                  />
                ))}

                {/* Quantum Field Glow */}
                <motion.div
                  className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
                  style={{
                    width: '200px',
                    height: '100px',
                    background: 'radial-gradient(ellipse, rgba(100,200,255,0.3) 0%, rgba(150,220,255,0.15) 40%, transparent 70%)',
                    filter: 'blur(25px)',
                  }}
                  animate={{
                    scale: [1, 1.3, 1],
                    opacity: [0.5, 0.8, 0.5],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                />

                {/* Energy Lightning Streaks */}
                {[...Array(4)].map((_, i) => (
                  <motion.div
                    key={`streak-${i}`}
                    className="absolute top-1/2 left-1/2"
                    style={{
                      width: '2px',
                      height: '30px',
                      background: 'linear-gradient(to bottom, rgba(150,220,255,0.9), transparent)',
                      boxShadow: '0 0 8px rgba(150,220,255,0.8)',
                      transformOrigin: 'top center',
                      transform: `rotate(${i * 90}deg) translateY(-40px)`,
                    }}
                    animate={{
                      scaleY: [0, 1, 0],
                      opacity: [0, 1, 0],
                    }}
                    transition={{
                      duration: 1.5,
                      repeat: Infinity,
                      ease: "easeInOut",
                      delay: i * 0.4,
                    }}
                  />
                ))}

                {/* Button Container */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 px-12 py-4 rounded-[32px] overflow-hidden">
                  {/* Core Energy Glow */}
                  <motion.div
                    className="absolute -inset-2"
                    style={{
                      background: 'radial-gradient(circle at center, rgba(100,200,255,0.5) 0%, rgba(150,220,255,0.3) 50%, transparent 70%)',
                      filter: 'blur(20px)',
                    }}
                    animate={{
                      opacity: [0.6, 1, 0.6],
                      scale: [0.95, 1.05, 0.95],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  />

                  {/* Liquid Glass Background */}
                  <div className="absolute inset-0 bg-white/60 backdrop-blur-xl rounded-[32px] border-2 border-cyan-300/80 shadow-[0_8px_32px_rgba(100,200,255,0.5),inset_0_2px_8px_rgba(255,255,255,0.8),0_0_20px_rgba(100,200,255,0.4)]" />

                  {/* Liquid Wave Animation */}
                  <motion.div
                    className="absolute inset-0 opacity-30"
                    style={{
                      background: 'linear-gradient(90deg, transparent 0%, rgba(100,200,255,0.6) 50%, transparent 100%)',
                    }}
                    animate={{
                      x: ['-100%', '200%'],
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      ease: "linear"
                    }}
                  />

                  {/* Shimmer Effect */}
                  <motion.div
                    className="absolute inset-0"
                    style={{
                      background: 'radial-gradient(circle at center, rgba(100,200,255,0.4) 0%, transparent 70%)',
                    }}
                    animate={{
                      scale: [1, 1.2, 1],
                      opacity: [0.3, 0.6, 0.3],
                    }}
                    transition={{
                      duration: 2.5,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  />

                  {/* Text Content */}
                  <div className="relative flex items-center gap-3">
                    <Sparkles className="w-5 h-5 text-cyan-600" />
                    <span 
                      className="text-2xl uppercase tracking-wider" 
                      style={{ 
                        fontWeight: 700,
                        color: '#1e3a8a',
                        textShadow: '0 0 10px rgba(100,200,255,0.5), 0 2px 4px rgba(0,0,0,0.1)'
                      }}
                    >
                      GET IT
                    </span>
                    <Sparkles className="w-5 h-5 text-cyan-600" />
                  </div>
                </div>
              </div>
            </motion.a>
          ) : (
            <div className="text-center text-gray-500 italic">
              No drive link set yet
            </div>
          )}
        </motion.div>

        {/* Back button */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="flex justify-center mb-12"
        >
          <motion.button
            onClick={() => onNavigate('explore')}
            className="px-8 py-4 bg-white/30 backdrop-blur-md rounded-[32px] hover:bg-white/40 transition-all flex items-center gap-3 text-gray-800 shadow-lg uppercase border border-white/40"
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
          <p className="text-gray-600 text-sm">
            {drive.owner}'s Drive © 2025
          </p>
        </motion.div>
      </div>
    </div>
  );
}
