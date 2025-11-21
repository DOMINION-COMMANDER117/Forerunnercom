import { useState, useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { useAdmin } from '../contexts/AdminContext';
import { Heart } from 'lucide-react';
import backgroundImage from 'figma:asset/7386ead7d8aa3f335d1731ef4f47ade99a373daa.png';
import evecitaCharacter from 'figma:asset/3bc1a53fb007ceb90e7888354687a6a9134dff5e.png';
import evecitaBackground from 'figma:asset/2541fed8b22d48dc63510ece19dcf5291fb73392.png';
import dogsBackground from 'figma:asset/5049ef414cb72c2fc7f04f5ba984e461787cfc3e.png';

interface ExplorePageProps {
  onNavigate: (page: string) => void;
}

interface DistantFlash {
  id: number;
  x: number;
  y: number;
  size: number; // Variable size
  brightness: number; // Variable brightness
  duration: number; // Variable speed
  blur: number; // Blur amount for distant effect
}

interface Spark {
  id: number;
  x: number;
  y: number;
  velocityX: number;
  velocityY: number;
}

export function ExplorePage({ onNavigate }: ExplorePageProps) {
  const { posts, likePost, drives } = useAdmin();
  const [kayoEyeOpacity, setKayoEyeOpacity] = useState(1);
  const [distantFlashes, setDistantFlashes] = useState<DistantFlash[]>([]);
  const [sparks, setSparks] = useState<Spark[]>([]);
  const [flickeringLetters, setFlickeringLetters] = useState<Set<number>>(new Set());
  const flashIdRef = useRef(0);
  const sparkIdRef = useRef(0);
  
  const kayoDrive = drives.find(d => d.id === 'kayo');
  const dogsDrive = drives.find(d => d.id === 'dogs');
  const evecitaDrive = drives.find(d => d.id === 'evecita');

  // Debug logging
  useEffect(() => {
    console.log('All drives:', drives);
    console.log('Evecita drive:', evecitaDrive);
    console.log('Evecita published?', evecitaDrive?.isPublished);
  }, [drives, evecitaDrive]);

  // Eye flicker effect for Kayo's Drive
  useEffect(() => {
    const flickerEyes = () => {
      if (Math.random() > 0.7) {
        setKayoEyeOpacity(Math.random() * 0.3 + 0.1);
        const restoreTime = Math.random() * 300 + 100;
        setTimeout(() => {
          setKayoEyeOpacity(1);
        }, restoreTime);
      }
    };

    const scheduleNextFlicker = () => {
      const nextFlickerTime = Math.random() * 3000 + 2000;
      setTimeout(() => {
        flickerEyes();
        scheduleNextFlicker();
      }, nextFlickerTime);
    };

    scheduleNextFlicker();
  }, []);

  // Distant flash effects for Kayo's Drive
  useEffect(() => {
    const createDistantFlash = () => {
      // Randomize all properties
      const size = Math.random() * 150 + 50; // 50-200px
      const brightness = Math.random() * 0.7 + 0.3; // 0.3-1.0
      const duration = Math.random() * 0.8 + 0.4; // 0.4-1.2s (fast to slow)
      const blur = Math.random() * 40 + 20; // 20-60px blur for distant effect
      
      const newFlash: DistantFlash = {
        id: flashIdRef.current++,
        x: Math.random() * 100, // Random position across card
        y: Math.random() * 100,
        size,
        brightness,
        duration,
        blur,
      };

      setDistantFlashes(prev => [...prev, newFlash]);

      // Create sparks for some flashes
      if (Math.random() > 0.5) {
        createSparks(newFlash.x, newFlash.y);
      }

      setTimeout(() => {
        setDistantFlashes(prev => prev.filter(f => f.id !== newFlash.id));
      }, (newFlash.duration + 0.3) * 1000);
    };

    const createSparks = (x: number, y: number) => {
      const sparkCount = Math.floor(Math.random() * 6) + 4; // 4-10 sparks
      const newSparks: Spark[] = [];
      
      for (let i = 0; i < sparkCount; i++) {
        newSparks.push({
          id: sparkIdRef.current++,
          x,
          y,
          velocityX: (Math.random() - 0.5) * 4,
          velocityY: Math.random() * 3 + 2,
        });
      }
      
      setSparks(prev => [...prev, ...newSparks]);
      
      // Remove sparks after animation
      setTimeout(() => {
        setSparks(prev => prev.filter(s => !newSparks.find(ns => ns.id === s.id)));
      }, 1500);
    };

    const scheduleNextFlash = () => {
      const nextTime = Math.random() * 800 + 300; // 300-1100ms between flashes
      setTimeout(() => {
        createDistantFlash();
        scheduleNextFlash();
      }, nextTime);
    };

    scheduleNextFlash();
  }, []);

  // Letter flickering effect for Kayo's title
  useEffect(() => {
    const flickerLetters = () => {
      if (!kayoDrive) return;
      
      // Randomly select 1-3 letters to flicker
      const letterCount = Math.floor(Math.random() * 3) + 1;
      const titleLength = kayoDrive.title.length;
      const lettersToFlicker = new Set<number>();
      
      for (let i = 0; i < letterCount; i++) {
        lettersToFlicker.add(Math.floor(Math.random() * titleLength));
      }
      
      setFlickeringLetters(lettersToFlicker);
      
      // Restore after flicker
      setTimeout(() => {
        setFlickeringLetters(new Set());
      }, Math.random() * 800 + 600); // 600-1400ms flicker duration
    };

    const scheduleNextFlicker = () => {
      const nextTime = Math.random() * 2000 + 1000; // 1-3 seconds between flickers
      setTimeout(() => {
        flickerLetters();
        scheduleNextFlicker();
      }, nextTime);
    };

    scheduleNextFlicker();
  }, [kayoDrive]);

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-indigo-950 to-black pt-24 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Page header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-5xl sm:text-6xl text-white mb-4 drop-shadow-[0_0_20px_rgba(255,255,255,0.5)] italic">
            EXPLORE
          </h1>
          <p className="text-white/60 text-lg">
            Discover the latest content from FORERUNNER
          </p>
        </motion.div>

        {/* Discord Join Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-16 max-w-2xl mx-auto"
        >
          <div className="relative">
            {/* Pulsing glow effect behind button */}
            <motion.div
              className="absolute inset-0 rounded-[32px]"
              style={{
                background: 'linear-gradient(135deg, rgba(239,68,68,0.4), rgba(251,146,60,0.4))',
                filter: 'blur(30px)',
              }}
              animate={{
                opacity: [0.3, 0.7, 0.3],
                scale: [1, 1.05, 1],
              }}
              transition={{
                duration: 2.5,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />

            {/* Discord Card */}
            <div className="relative rounded-[32px] p-8 overflow-hidden">
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

              {/* Content */}
              <div className="relative text-center">
                <h3 className="text-3xl text-white mb-3 uppercase">
                  Join Our Discord
                </h3>
                <p className="text-white/70 mb-6 text-lg">
                  Connect with the community, get updates, and be part of the conversation!
                </p>

                {/* Glowing Button */}
                <motion.a
                  href="https://discord.gg/ttmR5R6EHB"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <div className="relative">
                    {/* Button glow effect */}
                    <motion.div
                      className="absolute inset-0 rounded-2xl"
                      style={{
                        background: 'linear-gradient(135deg, rgba(239,68,68,0.6), rgba(251,146,60,0.6))',
                        filter: 'blur(20px)',
                      }}
                      animate={{
                        opacity: [0.5, 1, 0.5],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                    />

                    {/* Button */}
                    <div className="relative px-8 py-4 rounded-2xl overflow-hidden">
                      {/* Button gradient background */}
                      <div 
                        className="absolute inset-0"
                        style={{
                          background: 'linear-gradient(135deg, rgba(239,68,68,0.9), rgba(251,146,60,0.9))',
                        }}
                      />
                      
                      {/* Button shine effect */}
                      <motion.div
                        className="absolute inset-0"
                        style={{
                          background: 'linear-gradient(135deg, rgba(255,255,255,0.3) 0%, transparent 50%)',
                        }}
                        animate={{
                          opacity: [0.3, 0.6, 0.3],
                        }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          ease: "easeInOut"
                        }}
                      />

                      {/* Pulsing Text */}
                      <motion.span
                        className="relative text-2xl text-white uppercase tracking-wide inline-block"
                        style={{ fontWeight: 800 }}
                        animate={{
                          textShadow: [
                            '0 0 10px rgba(255,255,255,0.5), 0 0 20px rgba(255,255,255,0.3)',
                            '0 0 20px rgba(255,255,255,0.8), 0 0 40px rgba(255,255,255,0.5)',
                            '0 0 10px rgba(255,255,255,0.5), 0 0 20px rgba(255,255,255,0.3)',
                          ],
                        }}
                        transition={{
                          duration: 1.5,
                          repeat: Infinity,
                          ease: "easeInOut"
                        }}
                      >
                        Join NOW!
                      </motion.span>
                    </div>
                  </div>
                </motion.a>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Drive Cards Grid */}
        <div className="mb-16 grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* KAYO'S DRIVE - Flickering Black/Red Theme */}
          {kayoDrive && kayoDrive.isPublished && (
            <motion.button
              onClick={() => onNavigate('kayo-drive')}
              className="group relative w-full aspect-[3/4] rounded-[32px] overflow-hidden cursor-pointer"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {/* Background Image */}
              <div 
                className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                style={{
                  backgroundImage: `url(${backgroundImage})`,
                  filter: 'brightness(0.4)',
                }}
              />

              {/* Dark overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent" />

              {/* Distant Flash Effects - Blurred atmospheric lightning */}
              {distantFlashes.map(flash => (
                <motion.div
                  key={flash.id}
                  className="absolute pointer-events-none rounded-full"
                  style={{
                    left: `${flash.x}%`,
                    top: `${flash.y}%`,
                    width: `${flash.size}px`,
                    height: `${flash.size}px`,
                    transform: 'translate(-50%, -50%)',
                    background: `radial-gradient(circle, rgba(255,255,255,${flash.brightness}) 0%, rgba(239,68,68,${flash.brightness * 0.8}) 30%, rgba(251,146,60,${flash.brightness * 0.6}) 50%, transparent 100%)`,
                    filter: `blur(${flash.blur}px)`,
                    boxShadow: `0 0 ${flash.size * 0.5}px rgba(239,68,68,${flash.brightness * 0.7}), 0 0 ${flash.size}px rgba(251,146,60,${flash.brightness * 0.5})`,
                  }}
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ 
                    opacity: [0, flash.brightness, flash.brightness * 0.7, 0], 
                    scale: [0.5, 1.2, 1, 0.8] 
                  }}
                  transition={{ duration: flash.duration, ease: "easeInOut" }}
                />
              ))}

              {/* Falling Sparks */}
              {sparks.map(spark => (
                <motion.div
                  key={spark.id}
                  className="absolute w-1 h-1 rounded-full pointer-events-none"
                  style={{
                    left: `${spark.x}%`,
                    top: `${spark.y}%`,
                    background: 'rgba(255,255,255,1)',
                    boxShadow: '0 0 4px rgba(239,68,68,1), 0 0 8px rgba(251,146,60,0.8)',
                  }}
                  initial={{ opacity: 1, scale: 1 }}
                  animate={{
                    x: spark.velocityX * 30,
                    y: spark.velocityY * 50,
                    opacity: [1, 0.8, 0],
                    scale: [1, 0.5, 0],
                  }}
                  transition={{
                    duration: 1.5,
                    ease: "easeOut"
                  }}
                />
              ))}

              {/* Content */}
              <div className="absolute inset-0 p-8 flex flex-col justify-end z-10">
                <h2 className="text-4xl uppercase tracking-wider mb-2" style={{ fontWeight: 900 }}>
                  {kayoDrive.title.split('').map((letter, index) => {
                    const isFlickering = flickeringLetters.has(index);
                    return (
                      <motion.span
                        key={index}
                        className="inline-block text-white"
                        style={{
                          textShadow: isFlickering 
                            ? '0 0 8px rgba(239,68,68,1), 0 0 12px rgba(239,68,68,0.8)'
                            : '0 0 20px rgba(239,68,68,0.8), 0 0 40px rgba(251,146,60,0.6)',
                          WebkitTextStroke: isFlickering ? '1px rgba(239,68,68,0.9)' : '0px',
                        }}
                        animate={{
                          opacity: isFlickering ? [1, 0.3, 1, 0.4, 1, 0.3, 1] : 1,
                        }}
                        transition={{
                          duration: 0.6,
                          ease: "easeInOut",
                        }}
                      >
                        {letter === ' ' ? '\u00A0' : letter}
                      </motion.span>
                    );
                  })}
                </h2>
                <p className="text-white/80 text-sm mb-4">{kayoDrive.description || 'View Drive'}</p>
                <div className="text-red-500 uppercase text-sm tracking-widest">Click to explore →</div>
              </div>

              {/* Glow effect on hover */}
              <div className="absolute inset-0 bg-gradient-to-t from-red-500/20 via-orange-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </motion.button>
          )}

          {/* DOGS DRIVE - Bright Theme with Landscape */}
          {dogsDrive && dogsDrive.isPublished && (
            <motion.button
              onClick={() => onNavigate('dogs-drive')}
              className="group relative w-full aspect-[3/4] rounded-[32px] overflow-hidden cursor-pointer"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {/* Full Visibility Background Image */}
              <div 
                className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                style={{
                  backgroundImage: `url(${dogsBackground})`,
                }}
              />

              {/* Animated light rays overlay */}
              <motion.div
                className="absolute inset-0 opacity-20"
                style={{
                  background: 'linear-gradient(45deg, transparent 30%, rgba(255,255,255,0.6) 50%, transparent 70%)',
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

              {/* Content */}
              <div className="absolute inset-0 p-8 flex flex-col justify-end z-10">
                <h2 className="text-4xl uppercase tracking-wider mb-2 text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]" style={{ fontWeight: 900 }}>
                  {dogsDrive.title}
                </h2>
                <p className="text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] text-sm mb-4">{dogsDrive.description || 'View Drive'}</p>
                <div className="text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] uppercase text-sm tracking-widest">Click to explore →</div>
              </div>

              {/* Subtle gradient overlay on hover for depth */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              
              {/* Border with subtle glow */}
              <div 
                className="absolute inset-0 rounded-[32px] border-2 pointer-events-none"
                style={{
                  borderColor: 'rgba(255,255,255,0.3)',
                  boxShadow: '0 0 20px rgba(255,255,255,0.2), inset 0 0 20px rgba(255,255,255,0.1)'
                }}
              />
            </motion.button>
          )}

          {/* EVECITA'S DRIVE - Pink/Blue with Wires */}
          <motion.button
            onClick={() => onNavigate('evecita-drive')}
            className="group relative w-full aspect-[3/4] rounded-[32px] overflow-hidden cursor-pointer"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
              {/* Main Pink Background Image */}
              <div 
                className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                style={{
                  backgroundImage: `url(${evecitaBackground})`,
                }}
              />

              {/* Character Image Layer with Fade */}
              <div 
                className="absolute inset-0 bg-contain bg-center bg-no-repeat transition-transform duration-700 group-hover:scale-105"
                style={{
                  backgroundImage: `url(${evecitaCharacter})`,
                  opacity: 0.6,
                }}
              />

              {/* Blue/Purple/Pink Color Overlay */}
              <div 
                className="absolute inset-0"
                style={{
                  background: 'radial-gradient(circle at 50% 40%, rgba(236, 72, 153, 0.3) 0%, rgba(147, 51, 234, 0.25) 40%, rgba(59, 130, 246, 0.2) 80%)',
                  mixBlendMode: 'overlay',
                }}
              />

              {/* Dark overlay for text readability */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />

              {/* Blue and Purple Sparkles */}
              {[...Array(20)].map((_, i) => {
                const isBlue = i % 2 === 0;
                const size = 1 + (i % 3); // 1-3px
                const startX = 10 + (i * 4.5); // Distributed positions
                const startY = 10 + ((i * 7) % 80);
                const randomY = 20 + (i % 3) * 10;
                const randomX = (i % 2 === 0 ? 1 : -1) * (5 + (i % 3) * 3);
                const duration = 3 + (i % 3);
                const delay = (i % 4) * 0.75;
                
                return (
                  <motion.div
                    key={i}
                    className="absolute rounded-full pointer-events-none"
                    style={{
                      width: `${size}px`,
                      height: `${size}px`,
                      background: isBlue ? '#3b82f6' : '#a855f7',
                      boxShadow: `0 0 ${size * 4}px ${isBlue ? '#3b82f6' : '#a855f7'}`,
                      left: `${startX}%`,
                      top: `${startY}%`,
                    }}
                    animate={{
                      y: [0, -randomY, 0],
                      x: [0, randomX, 0],
                      opacity: [0, 1, 1, 0],
                      scale: [0, 1.5, 1, 0],
                    }}
                    transition={{
                      duration: duration,
                      repeat: Infinity,
                      delay: delay,
                      ease: "easeInOut"
                    }}
                  />
                );
              })}

              {/* Animated wire lines */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-30">
                <motion.path
                  d="M0,50 Q100,25 200,50 T400,50"
                  stroke="url(#wire-gradient-card-1)"
                  strokeWidth="1"
                  fill="none"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                />
                <motion.path
                  d="M0,150 Q100,175 200,150 T400,150"
                  stroke="url(#wire-gradient-card-2)"
                  strokeWidth="1"
                  fill="none"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 3, repeat: Infinity, ease: "linear", delay: 0.5 }}
                />
                
                <defs>
                  <linearGradient id="wire-gradient-card-1" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#ec4899" stopOpacity="0" />
                    <stop offset="50%" stopColor="#ec4899" stopOpacity="1" />
                    <stop offset="100%" stopColor="#ec4899" stopOpacity="0" />
                  </linearGradient>
                  <linearGradient id="wire-gradient-card-2" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#3b82f6" stopOpacity="0" />
                    <stop offset="50%" stopColor="#3b82f6" stopOpacity="1" />
                    <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
                  </linearGradient>
                </defs>
              </svg>

              {/* Content */}
              <div className="absolute inset-0 p-8 flex flex-col justify-end z-10">
                <h2 className="text-4xl uppercase tracking-wider mb-2 text-transparent bg-clip-text bg-gradient-to-r from-pink-400 via-purple-400 to-blue-400" style={{ fontWeight: 900 }}>
                  {evecitaDrive?.title || "EVECITA'S DRIVE"}
                </h2>
                <p className="text-pink-200 text-sm mb-4">{evecitaDrive?.description || 'View Drive'}</p>
                <div className="text-pink-400 uppercase text-sm tracking-widest">Click to explore →</div>
              </div>

              {/* Glow effect on hover */}
              <div className="absolute inset-0 bg-gradient-to-t from-pink-500/20 via-purple-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              
              {/* Border with electric effect */}
              <div 
                className="absolute inset-0 rounded-[32px] border-2 pointer-events-none"
                style={{
                  borderColor: 'rgba(236,72,153,0.5)',
                  boxShadow: '0 0 20px rgba(236,72,153,0.3), inset 0 0 20px rgba(59,130,246,0.2)'
                }}
              />
            </motion.button>
        </div>

        {/* Posts grid */}
        {posts.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <div className="relative rounded-[32px] p-12 max-w-md mx-auto">
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
                  background: 'rgba(255, 255, 255, 0.05)',
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
              <svg
                className="w-20 h-20 mx-auto mb-4 text-white/30"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                />
              </svg>
              <h2 className="text-2xl text-white/70 mb-2">No posts yet</h2>
              <p className="text-white/50">Check back later for new content</p>
              </div>
            </div>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post, index) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="relative rounded-[28px] overflow-hidden group"
              >
                {/* Liquid glass effect */}
                <div 
                  className="absolute inset-0" 
                  style={{
                    backdropFilter: 'blur(16px) saturate(160%)',
                    WebkitBackdropFilter: 'blur(16px) saturate(160%)',
                  }}
                />
                <div 
                  className="absolute inset-0"
                  style={{
                    background: 'rgba(255, 255, 255, 0.06)',
                  }}
                />
                <div 
                  className="absolute inset-0 rounded-[28px] pointer-events-none"
                  style={{
                    background: 'linear-gradient(135deg, rgba(255,255,255,0.25) 0%, transparent 50%)',
                    mixBlendMode: 'overlay',
                  }}
                />
                <div 
                  className="absolute inset-0 rounded-[28px] pointer-events-none transition-all group-hover:shadow-[inset_1px_1px_2px_rgba(255,255,255,0.5)]"
                  style={{
                    boxShadow: `
                      inset 1px 1px 1px rgba(255, 255, 255, 0.3),
                      inset -1px -1px 1px rgba(255, 255, 255, 0.05)
                    `,
                  }}
                />
                <div 
                  className="absolute inset-0 rounded-[28px] pointer-events-none"
                  style={{
                    border: '1px solid rgba(255, 255, 255, 0.15)',
                  }}
                />
                
                <div className="relative">
                {/* Image */}
                <div className="aspect-video relative overflow-hidden bg-black/50">
                  <img
                    src={post.imageUrl}
                    alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                </div>

                {/* Content */}
                <div className="p-6">
                  <h3 className="text-xl text-white mb-2 drop-shadow-[0_0_10px_rgba(255,255,255,0.3)]">
                    {post.title}
                  </h3>
                  <p className="text-white/70 mb-4 line-clamp-2">
                    {post.description}
                  </p>

                  {/* Footer */}
                  <div className="flex items-center justify-between pt-4 border-t border-white/10">
                    <span className="text-white/50 text-sm">
                      {formatDate(post.createdAt)}
                    </span>
                    
                    <motion.button
                      onClick={() => likePost(post.id)}
                      className="flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 hover:bg-white/10 transition-colors"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Heart className="w-4 h-4 text-red-400" />
                      <span className="text-white/70 text-sm">{post.likes}</span>
                    </motion.button>
                  </div>
                </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Updates Coming Soon & Warning Message */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-20 max-w-4xl mx-auto"
        >
          {/* Updates Coming Soon */}
          <div className="text-center mb-12">
            <motion.h2 
              className="text-4xl text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-orange-500 mb-2"
              animate={{
                textShadow: [
                  '0 0 20px rgba(239, 68, 68, 0.5)',
                  '0 0 40px rgba(251, 146, 60, 0.7)',
                  '0 0 20px rgba(239, 68, 68, 0.5)',
                ]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              Updates Coming Soon
            </motion.h2>
          </div>

          {/* Warning Message - Liquid Glass */}
          <div className="relative rounded-[32px] p-8">
            {/* Glass effect layers */}
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
                background: 'rgba(239, 68, 68, 0.12)',
              }}
            />
            <div 
              className="absolute inset-0 rounded-[32px] pointer-events-none"
              style={{
                background: 'linear-gradient(135deg, rgba(255,255,255,0.2) 0%, transparent 40%)',
                mixBlendMode: 'overlay',
              }}
            />
            <div 
              className="absolute inset-0 rounded-[32px] pointer-events-none"
              style={{
                boxShadow: `
                  inset 1px 1px 1px rgba(255, 255, 255, 0.3),
                  inset -1px -1px 1px rgba(255, 255, 255, 0.05),
                  0 8px 32px rgba(239, 68, 68, 0.4)
                `,
              }}
            />
            <div 
              className="absolute inset-0 rounded-[32px] pointer-events-none"
              style={{
                border: '1.5px solid rgba(239, 68, 68, 0.5)',
              }}
            />
            
            <div className="relative">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 mt-1">
                <svg
                  className="w-8 h-8 text-red-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="text-xl text-red-400 mb-3">
                  ⚠️ Important Notice
                </h3>
                <p className="text-white/90 leading-relaxed mb-4">
                  <strong>Do NOT share this content as your own.</strong>
                </p>
                <p className="text-white/80 leading-relaxed">
                  Do not use this content to violate Epic Games' Terms of Service in UEFN Islands. 
                  All content shared here is for educational and community purposes only. 
                  Respect the creators and follow all applicable guidelines.
                </p>
              </div>
            </div>
            </div>
          </div>
        </motion.div>

        {/* Copyright Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-16 text-center pb-8"
        >
          <p className="text-white/40 text-sm">
            All drive rights reserved 2025 © KAYO
          </p>
        </motion.div>
      </div>
    </div>
  );
}
