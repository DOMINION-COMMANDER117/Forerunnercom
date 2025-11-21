import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowRight, Users as UsersIcon, FileStack } from 'lucide-react';
import backgroundImage from 'figma:asset/7386ead7d8aa3f335d1731ef4f47ade99a373daa.png';

interface Ember {
  id: number;
  x: number;
  y: number;
  size: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  stuckTo?: string;
  stuckX?: number;
  stuckY?: number;
  trail: Array<{ x: number; y: number; opacity: number }>;
}

interface Spark {
  id: number;
  x: number;
  y: number;
  size: number;
  vx: number;
  vy: number;
  life: number;
  color: 'orange' | 'red' | 'yellow';
  rotation: number;
  rotationSpeed: number;
}

export function HomePage() {
  const [letterStates, setLetterStates] = useState<boolean[]>(Array(10).fill(true));
  const [embers, setEmbers] = useState<Ember[]>([]);
  const [sparks, setSparks] = useState<Spark[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const emberIdRef = useRef(0);
  const sparkIdRef = useRef(0);

  // Electrical short circuit flickering effect for FORERUNNER letters
  useEffect(() => {
    const flickerLetter = () => {
      setLetterStates(prev => {
        const newStates = [...prev];
        const offLetters = newStates.filter(state => !state).length;
        
        // Only allow 2-3 letters to be off at a time
        if (offLetters >= 3) {
          // Turn some letters back on
          const offIndices = newStates.map((state, i) => !state ? i : -1).filter(i => i !== -1);
          if (offIndices.length > 0) {
            const randomOff = offIndices[Math.floor(Math.random() * offIndices.length)];
            newStates[randomOff] = true;
          }
        } else {
          // Random chance to flicker a letter
          if (Math.random() > 0.6) {
            const randomIndex = Math.floor(Math.random() * prev.length);
            newStates[randomIndex] = !newStates[randomIndex];
            
            // Quick recovery for short circuit effect
            if (!newStates[randomIndex]) {
              const recoveryTime = Math.random() > 0.7 
                ? Math.random() * 1500 + 500  // 0.5-2 seconds (longer)
                : Math.random() * 200 + 50;    // 50-250ms (quick flicker)
              
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

    const interval = setInterval(flickerLetter, Math.random() * 150 + 100); // 100-250ms - faster flickering
    return () => clearInterval(interval);
  }, []);

  // Ember particle system
  useEffect(() => {
    const spawnEmber = () => {
      if (!containerRef.current) return;
      
      const rect = containerRef.current.getBoundingClientRect();
      const newEmber: Ember = {
        id: emberIdRef.current++,
        x: Math.random() * rect.width,
        y: rect.height + 50,
        size: Math.random() * 4 + 3, // Larger embers
        vx: (Math.random() - 0.5) * 0.5, // Horizontal drift
        vy: -(Math.random() * 1.5 + 0.8), // Upward movement
        life: 1,
        maxLife: Math.random() * 3 + 2,
        trail: [],
      };
      
      setEmbers(prev => [...prev, newEmber]);
    };

    const spawnInterval = setInterval(() => {
      if (Math.random() > 0.7) { // Random spawning
        const count = Math.floor(Math.random() * 2) + 1;
        for (let i = 0; i < count; i++) {
          setTimeout(() => spawnEmber(), i * 100);
        }
      }
    }, 500);

    return () => clearInterval(spawnInterval);
  }, []);

  // Falling sparks from top
  useEffect(() => {
    const spawnSpark = () => {
      if (!containerRef.current) return;
      
      const rect = containerRef.current.getBoundingClientRect();
      const colors: Array<'orange' | 'red' | 'yellow'> = ['orange', 'red', 'yellow', 'orange', 'red'];
      
      const newSpark: Spark = {
        id: sparkIdRef.current++,
        x: Math.random() * rect.width,
        y: -20,
        size: Math.random() * 4 + 3,
        vx: (Math.random() - 0.5) * 2,
        vy: Math.random() * 3 + 2,
        life: 1,
        color: colors[Math.floor(Math.random() * colors.length)],
        rotation: Math.random() * 360,
        rotationSpeed: (Math.random() - 0.5) * 10,
      };
      
      setSparks(prev => [...prev, newSpark]);
    };

    const spawnInterval = setInterval(() => {
      if (Math.random() > 0.5) {
        const count = Math.floor(Math.random() * 3) + 1;
        for (let i = 0; i < count; i++) {
          setTimeout(() => spawnSpark(), i * 50);
        }
      }
    }, 300);

    return () => clearInterval(spawnInterval);
  }, []);

  // Update sparks
  useEffect(() => {
    const updateSparks = () => {
      setSparks(prev => {
        return prev
          .map(spark => ({
            ...spark,
            x: spark.x + spark.vx,
            y: spark.y + spark.vy,
            vx: spark.vx * 0.99,
            vy: spark.vy + 0.1, // Gravity
            rotation: spark.rotation + spark.rotationSpeed,
            life: spark.life - 0.008,
          }))
          .filter(spark => spark.life > 0 && spark.y < 2000);
      });
    };

    const sparkFrame = setInterval(updateSparks, 1000 / 60);
    return () => clearInterval(sparkFrame);
  }, []);

  // Update embers with bounce physics
  useEffect(() => {
    const updateEmbers = () => {
      setEmbers(prev => {
        return prev
          .map(ember => {
            if (ember.stuckTo) {
              // Stuck ember - just fade out
              return {
                ...ember,
                life: ember.life - 0.01,
              };
            }

            // Add current position to trail
            const newTrail = [
              { x: ember.x, y: ember.y, opacity: 0.6 },
              ...ember.trail.slice(0, 8)
            ].map((point, i) => ({
              ...point,
              opacity: point.opacity * 0.85
            }));

            // Update position
            let newX = ember.x + ember.vx;
            let newY = ember.y + ember.vy;
            let newVx = ember.vx;
            let newVy = ember.vy;
            
            // Check collision with elements (buttons, text, boxes)
            const elements = document.querySelectorAll('button, a, h1, h2, h3, p, div[class*="rounded"]');
            let bounced = false;

            elements.forEach((element) => {
              const rect = element.getBoundingClientRect();
              const containerRect = containerRef.current?.getBoundingClientRect();
              
              if (containerRect) {
                const relLeft = rect.left - containerRect.left;
                const relRight = rect.right - containerRect.left;
                const relTop = rect.top - containerRect.top;
                const relBottom = rect.bottom - containerRect.top;
                
                // Check if ember is inside element bounds
                if (newX >= relLeft && newX <= relRight &&
                    newY >= relTop && newY <= relBottom) {
                  
                  bounced = true;
                  
                  // Determine bounce direction based on where ember hit
                  const centerX = (relLeft + relRight) / 2;
                  const centerY = (relTop + relBottom) / 2;
                  
                  // Bounce off horizontally or vertically
                  if (Math.abs(newX - centerX) > Math.abs(newY - centerY)) {
                    // Hit from side
                    newVx = -newVx * 0.6; // Reverse and dampen
                    newX = newX < centerX ? relLeft - 2 : relRight + 2;
                  } else {
                    // Hit from top/bottom
                    newVy = -newVy * 0.6; // Reverse and dampen
                    newY = newY < centerY ? relTop - 2 : relBottom + 2;
                  }
                  
                  // Add some random deflection
                  newVx += (Math.random() - 0.5) * 0.3;
                  newVy += (Math.random() - 0.5) * 0.3;
                }
              }
            });

            return {
              ...ember,
              x: newX,
              y: newY,
              vx: newVx + (Math.random() - 0.5) * 0.05, // Wind effect
              vy: newVy + 0.015, // Gravity (but still mostly upward)
              life: ember.life - 0.005,
              trail: newTrail,
            };
          })
          .filter(ember => ember.life > 0 && ember.y > -100);
      });
    };

    const animationFrame = setInterval(updateEmbers, 1000 / 60); // 60 FPS
    return () => clearInterval(animationFrame);
  }, []);

  const letters = 'FORERUNNER'.split('');

  return (
    <div ref={containerRef} className="min-h-screen relative overflow-hidden" style={{ backgroundColor: '#000000' }}>
      {/* Background Image */}
      <div className="absolute inset-0 overflow-hidden">
        <img 
          src={backgroundImage}
          alt="Background"
          className="w-full h-full object-cover"
        />
        {/* Dark overlay for better text readability */}
        <div className="absolute inset-0 bg-black/40" />
      </div>

      {/* Falling sparks from top */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {sparks.map(spark => {
          const sparkColor = 
            spark.color === 'orange' ? '255, 150, 0' :
            spark.color === 'red' ? '255, 50, 0' :
            '255, 220, 0';
          
          return (
            <div key={spark.id}>
              {/* Spark glow */}
              <motion.div
                className="absolute"
                style={{
                  left: spark.x - spark.size * 3,
                  top: spark.y - spark.size * 3,
                  width: spark.size * 6,
                  height: spark.size * 6,
                  background: `radial-gradient(circle, rgba(${sparkColor}, ${spark.life * 0.6}) 0%, transparent 70%)`,
                  filter: 'blur(4px)',
                }}
              />
              
              {/* Spark core - flame shape */}
              <motion.div
                className="absolute"
                style={{
                  left: spark.x,
                  top: spark.y,
                  width: spark.size,
                  height: spark.size * 1.5,
                  backgroundColor: `rgba(${sparkColor}, ${spark.life})`,
                  borderRadius: '50% 50% 50% 50% / 60% 60% 40% 40%',
                  boxShadow: `0 0 ${spark.size * 4}px rgba(${sparkColor}, ${spark.life * 0.9})`,
                  transform: `rotate(${spark.rotation}deg)`,
                }}
              />
              
              {/* Bright center */}
              <motion.div
                className="absolute rounded-full"
                style={{
                  left: spark.x + spark.size * 0.25,
                  top: spark.y + spark.size * 0.25,
                  width: spark.size * 0.5,
                  height: spark.size * 0.5,
                  backgroundColor: `rgba(255, 255, 255, ${spark.life * 0.9})`,
                  boxShadow: `0 0 ${spark.size * 2}px rgba(255, 255, 255, ${spark.life})`,
                }}
              />
            </div>
          );
        })}
      </div>

      {/* Ember particles */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {embers.map(ember => (
          <div key={ember.id}>
            {/* Smoke trail with orange tint */}
            {ember.trail.map((point, i) => (
              <motion.div
                key={`trail-${ember.id}-${i}`}
                className="absolute rounded-full"
                style={{
                  left: point.x,
                  top: point.y,
                  width: ember.size * (1 + i * 0.3),
                  height: ember.size * (1 + i * 0.3),
                  background: i < 2 
                    ? `radial-gradient(circle, rgba(180, 80, 30, ${point.opacity * 0.4}) 0%, rgba(100, 100, 100, ${point.opacity * 0.2}) 100%)`
                    : `rgba(100, 100, 100, ${point.opacity * 0.25})`,
                  filter: 'blur(5px)',
                }}
              />
            ))}
            
            {/* Outer glow - orange */}
            <motion.div
              className="absolute rounded-full"
              style={{
                left: ember.x - ember.size * 3,
                top: ember.y - ember.size * 3,
                width: ember.size * 6,
                height: ember.size * 6,
                background: `radial-gradient(circle, rgba(255, 100, 0, ${ember.life * 0.3}) 0%, transparent 70%)`,
                filter: 'blur(6px)',
              }}
            />
            
            {/* Inner glow - bright orange/red */}
            <motion.div
              className="absolute rounded-full"
              style={{
                left: ember.x - ember.size * 1.5,
                top: ember.y - ember.size * 1.5,
                width: ember.size * 3,
                height: ember.size * 3,
                background: `radial-gradient(circle, rgba(255, 80, 0, ${ember.life * 0.6}) 0%, transparent 70%)`,
                filter: 'blur(3px)',
              }}
            />
            
            {/* Ember core - hot red/orange */}
            <motion.div
              className="absolute rounded-full"
              style={{
                left: ember.x,
                top: ember.y,
                width: ember.size,
                height: ember.size,
                backgroundColor: ember.life > 0.7 
                  ? `rgba(255, ${50 + ember.life * 50}, 0, ${ember.life})` // Hot orange
                  : ember.life > 0.4
                  ? `rgba(255, ${30 + ember.life * 70}, 0, ${ember.life})` // Orange-red
                  : `rgba(200, ${20 + ember.life * 50}, 0, ${ember.life})`, // Deep red
                boxShadow: `0 0 ${ember.size * 4}px rgba(255, 60, 0, ${ember.life * 0.9}), 0 0 ${ember.size * 2}px rgba(255, 150, 0, ${ember.life})`,
              }}
            />
            
            {/* White hot center */}
            <motion.div
              className="absolute rounded-full"
              style={{
                left: ember.x + ember.size * 0.25,
                top: ember.y + ember.size * 0.25,
                width: ember.size * 0.5,
                height: ember.size * 0.5,
                backgroundColor: `rgba(255, 255, 200, ${ember.life > 0.8 ? ember.life * 0.8 : 0})`,
                boxShadow: `0 0 ${ember.size}px rgba(255, 255, 255, ${ember.life > 0.8 ? ember.life * 0.6 : 0})`,
              }}
            />
          </div>
        ))}
      </div>

      {/* Main content */}
      <div className="relative z-10 min-h-screen flex flex-col items-center p-8 pt-32 pb-32">
        
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-20 max-w-4xl"
        >
          {/* Flickering FORERUNNER title */}
          <div
            className="mb-6 italic flex justify-center gap-2 flex-wrap"
            style={{
              fontSize: '7rem',
              fontWeight: 'bold',
              fontStyle: 'italic',
              lineHeight: '1',
            }}
          >
            {letters.map((letter, index) => (
              <motion.span
                key={index}
                className="text-white inline-block"
                animate={{
                  opacity: letterStates[index] ? [0.95, 1, 0.95] : [0.3, 0.1, 0.3],
                  textShadow: letterStates[index]
                    ? [
                        '0 0 20px rgba(255, 255, 255, 0.8), 0 0 40px rgba(255, 255, 255, 0.5)',
                        '0 0 30px rgba(255, 255, 255, 1), 0 0 60px rgba(255, 255, 255, 0.7)',
                        '0 0 20px rgba(255, 255, 255, 0.8), 0 0 40px rgba(255, 255, 255, 0.5)',
                      ]
                    : [
                        '0 0 5px rgba(255, 255, 255, 0.1)',
                        '0 0 2px rgba(255, 255, 255, 0.05)',
                        '0 0 5px rgba(255, 255, 255, 0.1)',
                      ],
                }}
                transition={{
                  opacity: { 
                    duration: letterStates[index] ? 0.15 : 0.08, 
                    ease: letterStates[index] ? "easeOut" : "easeIn",
                    repeat: Infinity,
                    repeatDelay: 1.5
                  },
                  textShadow: {
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }
                }}
              >
                {letter}
              </motion.span>
            ))}
          </div>
          <p className="text-white/90 tracking-widest mb-8" style={{
            fontSize: '1.5rem',
            textShadow: '0 0 10px rgba(255, 255, 255, 0.4)',
          }}>
            A NEW ERA!
          </p>
          <p className="text-white/80 text-lg leading-relaxed max-w-2xl mx-auto mb-8">
            Join the community and share your creations with unlimited storage. 
            Upload, manage, and control your content with complete privacy options.
          </p>
          <motion.button 
            className="relative px-10 py-5 rounded-full overflow-hidden group"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <div className="absolute inset-0 backdrop-blur-3xl rounded-full" />
            <div className="absolute inset-0 rounded-full pointer-events-none" style={{
              background: 'linear-gradient(to bottom right, rgba(255,80,80,0.4), transparent)',
              filter: 'blur(1px)',
            }} />
            <div className="absolute inset-0 rounded-full border-2 border-red-400/40" />
            <span className="relative z-10 text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.8)] flex items-center gap-2">
              Get Started <ArrowRight className="w-5 h-5" />
            </span>
          </motion.button>
        </motion.div>

        {/* Platform Welcome */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="w-full max-w-4xl mb-40"
        >
          <div className="text-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="text-white/80 text-xl"
            >
              Discover curated content from our team
            </motion.div>
          </div>
        </motion.div>

        {/* News & Events Section */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="w-full max-w-5xl mb-20"
        >
          <h2 className="text-white text-center mb-12" style={{
            fontSize: '2.5rem',
            textShadow: '0 0 15px rgba(255, 255, 255, 0.6)',
          }}>
            Latest News & Events
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <motion.a
              href="https://www.youtube.com/results?search_query=fortnite+new+season"
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="relative rounded-3xl overflow-hidden group cursor-pointer"
              whileHover={{ scale: 1.02 }}
            >
              <div className="relative h-64 overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1726935043403-29a87cfe895c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmb3J0bml0ZSUyMGJhdHRsZSUyMHJveWFsZXxlbnwxfHx8fDE3NjIzNTEyODJ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                  alt="Fortnite News"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent" />
              </div>
              <div className="absolute inset-0 backdrop-blur-sm bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <div className="absolute inset-0 backdrop-blur-xl" />
                <div className="absolute inset-0 pointer-events-none" style={{
                  background: 'linear-gradient(135deg, rgba(255,255,255,0.2) 0%, transparent 50%)',
                  filter: 'blur(1px)',
                }} />
                <div className="relative z-10">
                  <span className="text-red-400 text-sm tracking-wider drop-shadow-[0_0_8px_rgba(239,68,68,0.6)]">YOUTUBE</span>
                  <h3 className="text-white mt-2 drop-shadow-[0_0_8px_rgba(255,255,255,0.3)]">New Fortnite Season Videos</h3>
                  <p className="text-white/80 mt-1 text-sm">Watch the latest videos about the new season with gameplay, trailers, and updates...</p>
                </div>
              </div>
            </motion.a>

            <motion.a
              href="https://www.google.com/search?q=fortnite+world+cup+2025+news&tbm=nws"
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.7 }}
              className="relative rounded-3xl overflow-hidden group cursor-pointer"
              whileHover={{ scale: 1.02 }}
            >
              <div className="relative h-64 overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1656639969809-31bd8f5cc62c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmb3J0bml0ZSUyMGdhbWV8ZW58MXx8fHwxNzYyMzEzMDI5fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                  alt="Fortnite Event"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent" />
              </div>
              <div className="absolute inset-0 backdrop-blur-sm bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <div className="absolute inset-0 backdrop-blur-xl" />
                <div className="absolute inset-0 pointer-events-none" style={{
                  background: 'linear-gradient(135deg, rgba(255,255,255,0.2) 0%, transparent 50%)',
                  filter: 'blur(1px)',
                }} />
                <div className="relative z-10">
                  <span className="text-red-400 text-sm tracking-wider drop-shadow-[0_0_8px_rgba(239,68,68,0.6)]">GOOGLE NEWS</span>
                  <h3 className="text-white mt-2 drop-shadow-[0_0_8px_rgba(255,255,255,0.3)]">Fortnite World Cup 2025</h3>
                  <p className="text-white/80 mt-1 text-sm">Read the latest news articles about the Fortnite World Cup and competitions...</p>
                </div>
              </div>
            </motion.a>

            <motion.a
              href="https://www.youtube.com/results?search_query=fortnite+competitive+highlights"
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.8 }}
              className="relative rounded-3xl overflow-hidden group cursor-pointer"
              whileHover={{ scale: 1.02 }}
            >
              <div className="relative h-64 overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1635372708431-64774de60e20?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxnYW1pbmclMjBlc3BvcnRzfGVufDF8fHx8MTc2MjM5MzcwM3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                  alt="Gaming Tournament"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent" />
              </div>
              <div className="absolute inset-0 backdrop-blur-sm bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <div className="absolute inset-0 backdrop-blur-xl" />
                <div className="absolute inset-0 pointer-events-none" style={{
                  background: 'linear-gradient(135deg, rgba(255,255,255,0.2) 0%, transparent 50%)',
                  filter: 'blur(1px)',
                }} />
                <div className="relative z-10">
                  <span className="text-red-400 text-sm tracking-wider drop-shadow-[0_0_8px_rgba(239,68,68,0.6)]">YOUTUBE</span>
                  <h3 className="text-white mt-2 drop-shadow-[0_0_8px_rgba(255,255,255,0.3)]">Competitive Highlights</h3>
                  <p className="text-white/80 mt-1 text-sm">Watch the best competitive plays, highlights, and pro player gameplay...</p>
                </div>
              </div>
            </motion.a>

            <motion.a
              href="https://www.google.com/search?q=fortnite+latest+updates&tbm=nws"
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.9 }}
              className="relative rounded-3xl overflow-hidden group cursor-pointer"
              whileHover={{ scale: 1.02 }}
            >
              <div className="relative h-64 overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1738858078480-916cda8e6e3b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2aWRlbyUyMGdhbWUlMjBjb21wZXRpdGlvbnxlbnwxfHx8fDE3NjI0MDM1NjR8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                  alt="Gaming Competition"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent" />
              </div>
              <div className="absolute inset-0 backdrop-blur-sm bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <div className="absolute inset-0 backdrop-blur-xl" />
                <div className="absolute inset-0 pointer-events-none" style={{
                  background: 'linear-gradient(135deg, rgba(255,255,255,0.2) 0%, transparent 50%)',
                  filter: 'blur(1px)',
                }} />
                <div className="relative z-10">
                  <span className="text-red-400 text-sm tracking-wider drop-shadow-[0_0_8px_rgba(239,68,68,0.6)]">GOOGLE NEWS</span>
                  <h3 className="text-white mt-2 drop-shadow-[0_0_8px_rgba(255,255,255,0.3)]">Latest Fortnite Updates</h3>
                  <p className="text-white/80 mt-1 text-sm">Read the latest news articles about Fortnite updates, patches, and new content...</p>
                </div>
              </div>
            </motion.a>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
