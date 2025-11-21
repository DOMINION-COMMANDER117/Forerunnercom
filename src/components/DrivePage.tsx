import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useAdmin } from '../contexts/AdminContext';
import { ArrowLeft } from 'lucide-react';

interface DrivePageProps {
  onNavigate: (page: string) => void;
}

export function DrivePage({ onNavigate }: DrivePageProps) {
  const { featuredDrive } = useAdmin();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [letterStates, setLetterStates] = useState<boolean[]>([]);
  const [letterColors, setLetterColors] = useState<string[]>([]);
  const [sliderPosition, setSliderPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);

  // Initialize letter states and colors
  useEffect(() => {
    const title = "KAYO'S DRIVE";
    setLetterStates(Array(title.length).fill(true));
    // Initialize with random colors for each letter
    const colors = ['white', 'red', 'orange'];
    setLetterColors(Array(title.length).fill(0).map(() => colors[Math.floor(Math.random() * colors.length)]));
  }, []);

  // Electrical flickering effect for title (like FORERUNNER)
  useEffect(() => {
    const title = "KAYO'S DRIVE";

    const flickerLetter = () => {
      setLetterStates(prev => {
        const newStates = [...prev];
        const offLetters = newStates.filter(state => !state).length;
        
        if (offLetters >= 3) {
          const offIndices = newStates.map((state, i) => !state ? i : -1).filter(i => i !== -1);
          if (offIndices.length > 0) {
            const randomOff = offIndices[Math.floor(Math.random() * offIndices.length)];
            newStates[randomOff] = true;
          }
        } else {
          if (Math.random() > 0.6) {
            const randomIndex = Math.floor(Math.random() * prev.length);
            newStates[randomIndex] = !newStates[randomIndex];
            
            if (!newStates[randomIndex]) {
              const recoveryTime = Math.random() > 0.7 
                ? Math.random() * 1500 + 500
                : Math.random() * 200 + 50;
              
              setTimeout(() => {
                setLetterStates(current => {
                  const updated = [...current];
                  updated[randomIndex] = true;
                  return updated;
                });
              }, recoveryTime);
            }
          }
        }
        
        return newStates;
      });
    };

    const interval = setInterval(flickerLetter, Math.random() * 150 + 100);
    return () => clearInterval(interval);
  }, []);

  // Color shifting effect for letters - slowly fade between red, white, and orange
  useEffect(() => {
    const title = "KAYO'S DRIVE";
    
    const shiftColors = () => {
      setLetterColors(prev => {
        const newColors = [...prev];
        // Randomly pick a letter to change color
        if (Math.random() > 0.5) {
          const randomIndex = Math.floor(Math.random() * title.length);
          const colors = ['white', 'red', 'orange'];
          const currentColor = newColors[randomIndex];
          // Pick a different color from current
          const availableColors = colors.filter(c => c !== currentColor);
          newColors[randomIndex] = availableColors[Math.floor(Math.random() * availableColors.length)];
        }
        return newColors;
      });
    };

    const interval = setInterval(shiftColors, 800); // Shift colors every 800ms
    return () => clearInterval(interval);
  }, []);

  // Auto-advance slideshow every 5 seconds
  useEffect(() => {
    if (!featuredDrive || featuredDrive.images.length === 0) return;

    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => 
        (prev + 1) % featuredDrive.images.length
      );
    }, 5000); // 5 seconds per slide

    return () => clearInterval(interval);
  }, [featuredDrive]);

  // Handle slider drag
  const handleMouseDown = () => setIsDragging(true);
  
  const handleMouseUp = () => setIsDragging(false);
  
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDragging) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percentage = (x / rect.width) * 100;
    setSliderPosition(Math.max(0, Math.min(100, percentage)));
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (!isDragging) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.touches[0].clientX - rect.left;
    const percentage = (x / rect.width) * 100;
    setSliderPosition(Math.max(0, Math.min(100, percentage)));
  };

  if (!featuredDrive || !featuredDrive.isPublished) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-red-950 to-black flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl mb-4 text-white">Drive Not Available</h1>
          <p className="text-gray-400 mb-6">Check back soon.</p>
          <button
            onClick={() => onNavigate('explore')}
            className="px-6 py-3 bg-red-500/20 border border-red-500 rounded-xl hover:bg-red-500/30 transition-all text-white"
          >
            Return to Explore
          </button>
        </div>
      </div>
    );
  }

  const title = "KAYO'S DRIVE";

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-red-950 to-orange-950 relative overflow-hidden">
      {/* Simple animated background orbs */}
      <motion.div
        className="absolute top-20 right-20 w-96 h-96 bg-red-600 rounded-full mix-blend-screen filter blur-3xl opacity-30"
        animate={{
          x: [0, 50, 0],
          y: [0, 30, 0],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      <motion.div
        className="absolute bottom-20 left-20 w-96 h-96 bg-orange-600 rounded-full mix-blend-screen filter blur-3xl opacity-20"
        animate={{
          x: [0, -50, 0],
          y: [0, -30, 0],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />

      {/* Content */}
      <div className="relative z-10 w-full pt-32 pb-12">
        {/* Flickering Title - Red, White, and Orange Color-Shifting */}
        <motion.div 
          className="text-center mb-16 px-4"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-7xl md:text-9xl mb-4 italic tracking-wider uppercase" style={{ fontWeight: 700 }}>
            {title.split('').map((char, i) => {
              // Get color values for smooth transition
              const getColorValues = (color: string) => {
                if (color === 'white') return { r: 255, g: 255, b: 255 };
                if (color === 'red') return { r: 239, g: 68, b: 68 };
                if (color === 'orange') return { r: 251, g: 146, b: 60 };
                return { r: 255, g: 255, b: 255 };
              };

              const color = getColorValues(letterColors[i] || 'white');

              return (
                <motion.span
                  key={i}
                  className="inline-block"
                  style={{
                    color: `rgb(${color.r}, ${color.g}, ${color.b})`,
                  }}
                  animate={{
                    opacity: letterStates[i] ? [0.95, 1, 0.95] : [0.3, 0.1, 0.3],
                    color: letterColors[i] === 'white' 
                      ? ['rgb(255, 255, 255)', 'rgb(255, 255, 255)', 'rgb(255, 255, 255)']
                      : letterColors[i] === 'red'
                      ? ['rgb(239, 68, 68)', 'rgb(239, 68, 68)', 'rgb(239, 68, 68)']
                      : ['rgb(251, 146, 60)', 'rgb(251, 146, 60)', 'rgb(251, 146, 60)'],
                    textShadow: letterStates[i]
                      ? letterColors[i] === 'white'
                        ? [
                            '0 0 20px rgba(255, 255, 255, 0.8), 0 0 40px rgba(255, 255, 255, 0.5)',
                            '0 0 30px rgba(255, 255, 255, 1), 0 0 60px rgba(255, 255, 255, 0.7)',
                            '0 0 20px rgba(255, 255, 255, 0.8), 0 0 40px rgba(255, 255, 255, 0.5)',
                          ]
                        : letterColors[i] === 'red'
                        ? [
                            '0 0 20px rgba(239, 68, 68, 0.8), 0 0 40px rgba(239, 68, 68, 0.5)',
                            '0 0 30px rgba(239, 68, 68, 1), 0 0 60px rgba(239, 68, 68, 0.7)',
                            '0 0 20px rgba(239, 68, 68, 0.8), 0 0 40px rgba(239, 68, 68, 0.5)',
                          ]
                        : [
                            '0 0 20px rgba(251, 146, 60, 0.8), 0 0 40px rgba(251, 146, 60, 0.5)',
                            '0 0 30px rgba(251, 146, 60, 1), 0 0 60px rgba(251, 146, 60, 0.7)',
                            '0 0 20px rgba(251, 146, 60, 0.8), 0 0 40px rgba(251, 146, 60, 0.5)',
                          ]
                      : [
                          '0 0 5px rgba(255, 255, 255, 0.1)',
                          '0 0 2px rgba(255, 255, 255, 0.05)',
                          '0 0 5px rgba(255, 255, 255, 0.1)',
                        ],
                  }}
                  transition={{
                    opacity: { 
                      duration: letterStates[i] ? 0.15 : 0.08, 
                      ease: letterStates[i] ? "easeOut" : "easeIn",
                      repeat: Infinity,
                      repeatDelay: 1.5
                    },
                    color: {
                      duration: 1.2,
                      ease: "easeInOut"
                    },
                    textShadow: {
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }
                  }}
                >
                  {char === ' ' ? '\u00A0' : char}
                </motion.span>
              );
            })}
          </h1>
        </motion.div>

        {/* Slideshow - Auto-playing Recent Additions */}
        {featuredDrive.images.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-20 px-4 sm:px-8 md:px-12"
          >
            <h2 className="text-4xl mb-8 text-center text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-orange-500 uppercase">
              RECENT ADDITIONS & CHANGES
            </h2>
            
            <div className="relative rounded-[32px] overflow-hidden aspect-video bg-black/40 w-full shadow-[0_0_60px_rgba(239,68,68,0.3)]">
              <AnimatePresence mode="wait">
                <motion.img
                  key={currentImageIndex}
                  src={featuredDrive.images[currentImageIndex]}
                  alt={`Slideshow image ${currentImageIndex + 1}`}
                  className="w-full h-full object-contain"
                  initial={{ opacity: 0, scale: 1.05 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.5 }}
                />
              </AnimatePresence>

              {/* Top fade - blends image into page background */}
              <div className="absolute top-0 left-0 right-0 h-1/2 pointer-events-none bg-gradient-to-b from-[#1a0a0a] via-[#1a0a0a]/60 to-transparent" />

              {/* Bottom fade - blends image into page background */}
              <div className="absolute bottom-0 left-0 right-0 h-1/2 pointer-events-none bg-gradient-to-t from-[#1a0a0a] via-[#1a0a0a]/60 to-transparent" />

              {/* Slide indicators */}
              <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-3 z-10">
                {featuredDrive.images.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentImageIndex(idx)}
                    className={`h-3 rounded-full transition-all ${
                      idx === currentImageIndex
                        ? 'bg-red-500 w-10 shadow-[0_0_15px_rgba(239,68,68,0.8)]'
                        : 'bg-white/30 hover:bg-white/50 w-3'
                    }`}
                  />
                ))}
              </div>

              {/* Navigation arrows */}
              <button
                onClick={() => setCurrentImageIndex((prev) => 
                  prev === 0 ? featuredDrive.images.length - 1 : prev - 1
                )}
                className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-black/50 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-black/70 transition-all"
              >
                ←
              </button>
              <button
                onClick={() => setCurrentImageIndex((prev) => 
                  (prev + 1) % featuredDrive.images.length
                )}
                className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-black/50 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-black/70 transition-all"
              >
                →
              </button>
            </div>
          </motion.div>
        )}

        {/* Comparison Slider */}
        {featuredDrive.comparisonImageBefore && featuredDrive.comparisonImageAfter && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mb-20 px-4 sm:px-8 md:px-12"
          >
            <h2 className="text-4xl mb-8 text-center text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-red-500 uppercase">
              BEFORE & AFTER COMPARISON
            </h2>
            
            <div 
              className="relative rounded-[32px] overflow-hidden aspect-video bg-black/40 w-full cursor-ew-resize select-none shadow-[0_0_60px_rgba(251,146,60,0.3)]"
              onMouseDown={handleMouseDown}
              onMouseUp={handleMouseUp}
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseUp}
              onTouchStart={handleMouseDown}
              onTouchEnd={handleMouseUp}
              onTouchMove={handleTouchMove}
            >
              {/* After Image (Bottom Layer) */}
              <img
                src={featuredDrive.comparisonImageAfter}
                alt="After"
                className="absolute inset-0 w-full h-full object-contain"
              />

              {/* Before Image (Top Layer with Clip) */}
              <div
                className="absolute inset-0 overflow-hidden"
                style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }}
              >
                <img
                  src={featuredDrive.comparisonImageBefore}
                  alt="Before"
                  className="absolute inset-0 w-full h-full object-contain"
                />
              </div>

              {/* Top fade - blends image into page background */}
              <div className="absolute top-0 left-0 right-0 h-1/2 pointer-events-none bg-gradient-to-b from-[#1a0a0a] via-[#1a0a0a]/60 to-transparent" />

              {/* Bottom fade - blends image into page background */}
              <div className="absolute bottom-0 left-0 right-0 h-1/2 pointer-events-none bg-gradient-to-t from-[#1a0a0a] via-[#1a0a0a]/60 to-transparent" />

              {/* Slider Handle */}
              <div
                className="absolute top-0 bottom-0 w-1 bg-white cursor-ew-resize shadow-[0_0_10px_rgba(255,255,255,0.5)]"
                style={{ left: `${sliderPosition}%` }}
              >
                {/* Handle Circle */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 bg-white rounded-full shadow-[0_0_20px_rgba(255,255,255,0.5)] flex items-center justify-center">
                  <div className="flex gap-1">
                    <div className="w-0.5 h-6 bg-gray-800"></div>
                    <div className="w-0.5 h-6 bg-gray-800"></div>
                  </div>
                </div>

                {/* Labels */}
                <div className="absolute top-4 left-1/2 -translate-x-1/2 flex gap-4 pointer-events-none">
                  <span className="px-3 py-1 bg-black/80 backdrop-blur-sm rounded-lg text-white text-sm whitespace-nowrap -translate-x-12 uppercase">
                    BEFORE
                  </span>
                  <span className="px-3 py-1 bg-black/80 backdrop-blur-sm rounded-lg text-white text-sm whitespace-nowrap translate-x-12 uppercase">
                    AFTER
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* What's New Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mb-20 px-4 sm:px-8 md:px-12"
        >
          <h2 className="text-5xl mb-12 text-center text-white italic">
            WHAT'S NEW IN THIS UPDATE!
          </h2>

          {/* Main Updates */}
          <div className="w-full mb-12">
            <div className="relative rounded-[32px] p-8 mb-8">
              {/* Liquid glass layers */}
              <div 
                className="absolute inset-0" 
                style={{
                  backdropFilter: 'blur(20px) saturate(180%)',
                  WebkitBackdropFilter: 'blur(20px) saturate(180%)',
                }}
              />
              <div 
                className="absolute inset-0"
                style={{
                  background: 'rgba(255, 255, 255, 0.06)',
                }}
              />
              <div 
                className="absolute inset-0 rounded-[32px] pointer-events-none"
                style={{
                  background: 'linear-gradient(135deg, rgba(255,255,255,0.25) 0%, transparent 50%)',
                  mixBlendMode: 'overlay',
                }}
              />
              <div 
                className="absolute inset-0 rounded-[32px] pointer-events-none"
                style={{
                  boxShadow: `
                    inset 1px 1px 1px rgba(255, 255, 255, 0.3),
                    inset -1px -1px 1px rgba(255, 255, 255, 0.05)
                  `,
                }}
              />
              <div 
                className="absolute inset-0 rounded-[32px] pointer-events-none"
                style={{
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                }}
              />
              
              <div className="relative space-y-6">
                {/* Update Item 1 */}
                <div>
                  <div className="flex items-start gap-3 mb-2">
                    <span className="text-red-500 text-xl mt-1">—</span>
                    <h3 className="text-2xl text-white uppercase">NEW FEATURE EXAMPLE</h3>
                  </div>
                  <p className="text-white/70 ml-8 mb-4">
                    This is where you can describe what's been added or changed in this update. Keep it concise and informative for your users.
                  </p>
                </div>

                {/* Update Item 2 */}
                <div>
                  <div className="flex items-start gap-3 mb-2">
                    <span className="text-red-500 text-xl mt-1">—</span>
                    <h3 className="text-2xl text-white uppercase">PERFORMANCE IMPROVEMENTS</h3>
                  </div>
                  <p className="text-white/70 ml-8 mb-4">
                    Detail any performance enhancements, bug fixes, or optimizations you've made.
                  </p>
                </div>

                {/* Update Item 3 */}
                <div>
                  <div className="flex items-start gap-3 mb-2">
                    <span className="text-red-500 text-xl mt-1">—</span>
                    <h3 className="text-2xl text-white uppercase">VISUAL UPDATES</h3>
                  </div>
                  <p className="text-white/70 ml-8 mb-4">
                    Explain any visual changes, new designs, or UI improvements.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Additional Information Section */}
          <div className="w-full">
            <h3 className="text-3xl mb-6 text-center text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-red-500 uppercase">
              ADDITIONAL INFORMATION FOR USERS
            </h3>
            
            <div className="relative rounded-[32px] p-8">
              {/* Liquid glass layers */}
              <div 
                className="absolute inset-0" 
                style={{
                  backdropFilter: 'blur(20px) saturate(180%)',
                  WebkitBackdropFilter: 'blur(20px) saturate(180%)',
                }}
              />
              <div 
                className="absolute inset-0"
                style={{
                  background: 'rgba(255, 255, 255, 0.06)',
                }}
              />
              <div 
                className="absolute inset-0 rounded-[32px] pointer-events-none"
                style={{
                  background: 'linear-gradient(135deg, rgba(255,255,255,0.25) 0%, transparent 50%)',
                  mixBlendMode: 'overlay',
                }}
              />
              <div 
                className="absolute inset-0 rounded-[32px] pointer-events-none"
                style={{
                  boxShadow: `
                    inset 1px 1px 1px rgba(255, 255, 255, 0.3),
                    inset -1px -1px 1px rgba(255, 255, 255, 0.05)
                  `,
                }}
              />
              <div 
                className="absolute inset-0 rounded-[32px] pointer-events-none"
                style={{
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                }}
              />
              
              <div className="relative">
                {/* Folder Structure Example */}
                <div className="mb-6">
                  <h4 className="text-xl text-white mb-3 uppercase">📁 FOLDER STRUCTURE</h4>
                  <div className="bg-black/30 rounded-xl p-4 font-mono text-sm text-white/80">
                    <div className="space-y-1">
                      <div>📁 MAIN PROJECT/</div>
                      <div className="ml-4">├── 📁 ASSETS/</div>
                      <div className="ml-8">│   ├── 📄 textures.uasset</div>
                      <div className="ml-8">│   └── 📄 materials.uasset</div>
                      <div className="ml-4">├── 📁 MAPS/</div>
                      <div className="ml-8">│   └── 📄 main_map.umap</div>
                      <div className="ml-4">└── 📄 README.txt</div>
                    </div>
                  </div>
                </div>

                {/* Additional Notes */}
                <div>
                  <h4 className="text-xl text-white mb-3 uppercase">📝 IMPORTANT NOTES</h4>
                  <ul className="space-y-2 text-white/70">
                    <li className="flex items-start gap-2">
                      <span className="text-orange-500">•</span>
                      <span>Make sure to backup your files before updating</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-orange-500">•</span>
                      <span>Compatible with the latest version of UEFN</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-orange-500">•</span>
                      <span>Follow Epic Games Terms of Service when using these assets</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Epic Drive Download Button */}
        {featuredDrive.link && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="mb-20 px-4 sm:px-8 md:px-12"
          >
            <motion.a
              href={featuredDrive.link}
              target="_blank"
              rel="noopener noreferrer"
              className="block relative"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="relative h-32 rounded-[32px] overflow-hidden">
                {/* Strong outer glow/lightning effect */}
                <motion.div
                  className="absolute -inset-4"
                  style={{
                    background: 'radial-gradient(ellipse at center, rgba(239,68,68,0.6) 0%, rgba(251,146,60,0.4) 30%, transparent 70%)',
                    filter: 'blur(40px)',
                  }}
                  animate={{
                    opacity: [0.6, 1, 0.6],
                    scale: [1, 1.1, 1],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                />

                {/* Animated helix/wave background */}
                <div className="absolute inset-0 overflow-hidden rounded-[32px]">
                  {/* Base dark background */}
                  <div className="absolute inset-0 bg-black" />
                  
                  {/* Animated wave layers */}
                  <motion.div
                    className="absolute inset-0"
                    style={{
                      background: 'linear-gradient(90deg, transparent 0%, rgba(239,68,68,0.3) 25%, rgba(251,146,60,0.3) 50%, rgba(239,68,68,0.3) 75%, transparent 100%)',
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
                  
                  <motion.div
                    className="absolute inset-0"
                    style={{
                      background: 'linear-gradient(90deg, transparent 0%, rgba(239,68,68,0.2) 30%, rgba(251,146,60,0.2) 60%, transparent 100%)',
                    }}
                    animate={{
                      x: ['200%', '-100%'],
                    }}
                    transition={{
                      duration: 4,
                      repeat: Infinity,
                      ease: "linear"
                    }}
                  />

                  {/* White highlight energy panning */}
                  <motion.div
                    className="absolute inset-0"
                    style={{
                      background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.1) 40%, rgba(255,255,255,0.2) 50%, rgba(255,255,255,0.1) 60%, transparent 100%)',
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

                  {/* Helix diagonal waves */}
                  <motion.div
                    className="absolute inset-0 opacity-40"
                    style={{
                      backgroundImage: `
                        repeating-linear-gradient(
                          45deg,
                          transparent,
                          transparent 20px,
                          rgba(239,68,68,0.3) 20px,
                          rgba(239,68,68,0.3) 22px,
                          rgba(251,146,60,0.3) 22px,
                          rgba(251,146,60,0.3) 24px,
                          transparent 24px,
                          transparent 44px
                        )
                      `,
                    }}
                    animate={{
                      x: [0, 50],
                      y: [0, 50],
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      ease: "linear"
                    }}
                  />

                  {/* Border glow */}
                  <div 
                    className="absolute inset-0 rounded-[32px] pointer-events-none"
                    style={{
                      border: '2px solid rgba(239,68,68,0.5)',
                      boxShadow: `
                        inset 0 0 20px rgba(239,68,68,0.3),
                        inset 0 0 40px rgba(251,146,60,0.2),
                        0 0 40px rgba(239,68,68,0.6),
                        0 0 80px rgba(251,146,60,0.4)
                      `,
                    }}
                  />
                </div>

                {/* Content */}
                <div className="relative h-full flex items-center justify-center gap-6">
                  {/* Left spinning alarm */}
                  <motion.div
                    className="relative w-12 h-12"
                    animate={{
                      rotate: [0, 360],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "linear"
                    }}
                  >
                    <div className="absolute inset-0 rounded-full bg-red-600" style={{
                      boxShadow: '0 0 20px rgba(239,68,68,0.8), 0 0 40px rgba(239,68,68,0.5)'
                    }} />
                    <motion.div
                      className="absolute inset-0 rounded-full"
                      style={{
                        background: 'linear-gradient(180deg, rgba(255,255,255,0.6) 0%, transparent 50%)',
                      }}
                      animate={{
                        opacity: [0.4, 1, 0.4],
                      }}
                      transition={{
                        duration: 0.5,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                    />
                    <div className="absolute inset-2 rounded-full bg-black" />
                  </motion.div>

                  {/* GET IT! Text */}
                  <motion.div
                    className="text-6xl uppercase tracking-wider"
                    style={{ fontWeight: 900 }}
                    animate={{
                      textShadow: [
                        '0 0 20px rgba(255,255,255,0.5), 0 0 40px rgba(239,68,68,0.6), 0 0 60px rgba(251,146,60,0.4)',
                        '0 0 30px rgba(255,255,255,0.8), 0 0 60px rgba(239,68,68,0.9), 0 0 90px rgba(251,146,60,0.6)',
                        '0 0 20px rgba(255,255,255,0.5), 0 0 40px rgba(239,68,68,0.6), 0 0 60px rgba(251,146,60,0.4)',
                      ],
                    }}
                    transition={{
                      duration: 1.5,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  >
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-orange-500 to-red-500">
                      GET IT!
                    </span>
                  </motion.div>

                  {/* Right spinning alarm */}
                  <motion.div
                    className="relative w-12 h-12"
                    animate={{
                      rotate: [0, 360],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "linear"
                    }}
                  >
                    <div className="absolute inset-0 rounded-full bg-red-600" style={{
                      boxShadow: '0 0 20px rgba(239,68,68,0.8), 0 0 40px rgba(239,68,68,0.5)'
                    }} />
                    <motion.div
                      className="absolute inset-0 rounded-full"
                      style={{
                        background: 'linear-gradient(180deg, rgba(255,255,255,0.6) 0%, transparent 50%)',
                      }}
                      animate={{
                        opacity: [0.4, 1, 0.4],
                      }}
                      transition={{
                        duration: 0.5,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                    />
                    <div className="absolute inset-2 rounded-full bg-black" />
                  </motion.div>
                </div>
              </div>
            </motion.a>
          </motion.div>
        )}

        {/* Back button - Moved to bottom */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="flex justify-center mb-12"
        >
          <motion.button
            onClick={() => onNavigate('explore')}
            className="px-8 py-4 bg-white/5 backdrop-blur-sm rounded-xl hover:bg-white/10 transition-all flex items-center gap-3 text-white text-lg shadow-[0_0_30px_rgba(255,255,255,0.1)] uppercase"
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
            All drive rights reserved 2025 © KAYO
          </p>
        </motion.div>
      </div>
    </div>
  );
}
