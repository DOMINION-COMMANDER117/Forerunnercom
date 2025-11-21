import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useAdmin } from '../contexts/AdminContext';
import backgroundImage from 'figma:asset/7386ead7d8aa3f335d1731ef4f47ade99a373daa.png';

interface FeaturedDriveProps {
  onNavigate: (page: string) => void;
}

interface LightningSpark {
  id: number;
  x: number;
  y: number;
  duration: number;
  delay: number;
}

interface EdgeLightning {
  id: number;
  edge: 'top' | 'bottom' | 'left' | 'right';
  position: number; // 0-100% along the edge
  size: 'small' | 'medium' | 'large';
  duration: number;
}

export function FeaturedDrive({ onNavigate }: FeaturedDriveProps) {
  const { featuredDrive } = useAdmin();
  const [eyeOpacity, setEyeOpacity] = useState(1);
  const [sparks, setSparks] = useState<LightningSpark[]>([]);
  const [edgeLightning, setEdgeLightning] = useState<EdgeLightning[]>([]);
  const sparkIdRef = useRef(0);
  const edgeLightningIdRef = useRef(0);

  // Slow random eye flicker effect
  useEffect(() => {
    const flickerEyes = () => {
      // Randomly decide to flicker
      if (Math.random() > 0.7) {
        setEyeOpacity(Math.random() * 0.3 + 0.1); // Fade to 10-40%
        
        // Restore after a random duration
        const restoreTime = Math.random() * 300 + 100; // 100-400ms
        setTimeout(() => {
          setEyeOpacity(1);
        }, restoreTime);
      }
    };

    // Check for flicker every 2-5 seconds
    const scheduleNextFlicker = () => {
      const nextFlickerTime = Math.random() * 3000 + 2000; // 2-5 seconds
      setTimeout(() => {
        flickerEyes();
        scheduleNextFlicker();
      }, nextFlickerTime);
    };

    scheduleNextFlicker();
  }, []);

  // Lightning spark system - like a storm
  useEffect(() => {
    const createSpark = () => {
      const newSpark: LightningSpark = {
        id: sparkIdRef.current++,
        x: Math.random() * 100, // Random position 0-100%
        y: Math.random() * 100,
        duration: Math.random() * 0.3 + 0.2, // 0.2-0.5s duration
        delay: 0,
      };

      setSparks(prev => [...prev, newSpark]);

      // Remove spark after it's done
      setTimeout(() => {
        setSparks(prev => prev.filter(s => s.id !== newSpark.id));
      }, (newSpark.duration + 0.5) * 1000);
    };

    // Schedule sparks at intervals - 3-8 seconds apart for storm-like effect
    const scheduleNextSpark = () => {
      const nextSparkTime = Math.random() * 5000 + 3000; // 3-8 seconds
      setTimeout(() => {
        createSpark();
        scheduleNextSpark();
      }, nextSparkTime);
    };

    scheduleNextSpark();
  }, []);

  // Edge lightning system - flashes on card edges
  useEffect(() => {
    const createEdgeLightning = () => {
      const edges: Array<'top' | 'bottom' | 'left' | 'right'> = ['top', 'bottom', 'left', 'right'];
      const sizes: Array<'small' | 'medium' | 'large'> = ['small', 'medium', 'large'];
      
      const newLightning: EdgeLightning = {
        id: edgeLightningIdRef.current++,
        edge: edges[Math.floor(Math.random() * edges.length)],
        position: Math.random() * 100,
        size: sizes[Math.floor(Math.random() * sizes.length)],
        duration: Math.random() * 0.4 + 0.2, // 0.2-0.6s
      };

      setEdgeLightning(prev => [...prev, newLightning]);

      // Remove after animation completes
      setTimeout(() => {
        setEdgeLightning(prev => prev.filter(l => l.id !== newLightning.id));
      }, (newLightning.duration + 0.3) * 1000);
    };

    // Schedule edge lightning - 2-6 seconds apart
    const scheduleNextEdgeLightning = () => {
      const nextTime = Math.random() * 4000 + 2000; // 2-6 seconds
      setTimeout(() => {
        createEdgeLightning();
        scheduleNextEdgeLightning();
      }, nextTime);
    };

    scheduleNextEdgeLightning();
  }, []);

  if (!featuredDrive || !featuredDrive.isPublished) {
    return null;
  }

  return (
    <div className="relative mb-12">
      {/* Energy wires - Top Left */}
      <motion.div
        className="absolute -top-20 left-0 w-1 h-24 origin-bottom"
        style={{
          background: 'linear-gradient(to bottom, transparent, rgba(239,68,68,0.6), rgba(251,146,60,0.8))',
        }}
        animate={{
          scaleY: [1, 1.1, 1],
          opacity: [0.6, 1, 0.6],
        }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      <motion.div
        className="absolute -top-24 left-0 w-4 h-4 rounded-full"
        style={{
          background: 'radial-gradient(circle, rgba(251,146,60,1), rgba(239,68,68,0.5))',
          boxShadow: '0 0 20px rgba(251,146,60,0.8)',
        }}
        animate={{
          scale: [1, 1.3, 1],
          opacity: [0.8, 1, 0.8],
        }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />

      {/* Energy wires - Top Right */}
      <motion.div
        className="absolute -top-20 right-0 w-1 h-24 origin-bottom"
        style={{
          background: 'linear-gradient(to bottom, transparent, rgba(239,68,68,0.6), rgba(251,146,60,0.8))',
        }}
        animate={{
          scaleY: [1, 1.1, 1],
          opacity: [0.6, 1, 0.6],
        }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 0.3
        }}
      />
      <motion.div
        className="absolute -top-24 right-0 w-4 h-4 rounded-full"
        style={{
          background: 'radial-gradient(circle, rgba(251,146,60,1), rgba(239,68,68,0.5))',
          boxShadow: '0 0 20px rgba(251,146,60,0.8)',
        }}
        animate={{
          scale: [1, 1.3, 1],
          opacity: [0.8, 1, 0.8],
        }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 0.3
        }}
      />

      {/* Flowing particles - Left wire */}
      {[...Array(4)].map((_, i) => (
        <motion.div
          key={`left-${i}`}
          className="absolute left-0 w-2 h-2 rounded-full"
          style={{
            background: 'radial-gradient(circle, rgba(251,146,60,1), rgba(239,68,68,0.5))',
            boxShadow: '0 0 10px rgba(251,146,60,0.8)',
            marginLeft: '-3px',
            top: '-24px'
          }}
          animate={{
            y: [0, 24],
            opacity: [0, 1, 0],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "linear",
            delay: i * 0.375
          }}
        />
      ))}

      {/* Flowing particles - Right wire */}
      {[...Array(4)].map((_, i) => (
        <motion.div
          key={`right-${i}`}
          className="absolute right-0 w-2 h-2 rounded-full"
          style={{
            background: 'radial-gradient(circle, rgba(251,146,60,1), rgba(239,68,68,0.5))',
            boxShadow: '0 0 10px rgba(251,146,60,0.8)',
            marginRight: '-3px',
            top: '-24px'
          }}
          animate={{
            y: [0, 24],
            opacity: [0, 1, 0],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "linear",
            delay: i * 0.375 + 0.2
          }}
        />
      ))}

      {/* Main Drive Cover Card - Clickable */}
      <motion.div
        onClick={() => onNavigate('drive')}
        className="relative cursor-pointer"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        {/* Pulsing glow effect */}
        <motion.div
          className="absolute inset-0 rounded-2xl"
          style={{
            background: 'linear-gradient(135deg, rgba(239,68,68,0.5), rgba(251,146,60,0.5))',
            filter: 'blur(20px)',
          }}
          animate={{
            opacity: [0.5, 1, 0.5],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />

        {/* Corner radial effects */}
        <div className="absolute top-0 left-0 w-32 h-32 bg-gradient-to-br from-red-500/30 to-transparent rounded-tl-2xl blur-xl" />
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-orange-500/30 to-transparent rounded-tr-2xl blur-xl" />
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-orange-500/30 to-transparent rounded-bl-2xl blur-xl" />
        <div className="absolute bottom-0 right-0 w-32 h-32 bg-gradient-to-tl from-red-500/30 to-transparent rounded-br-2xl blur-xl" />

        {/* Edge Lightning Effects */}
        <AnimatePresence>
          {edgeLightning.map((lightning) => {
            const getSizeStyles = (size: 'small' | 'medium' | 'large') => {
              switch (size) {
                case 'small':
                  return { length: 30, width: 2, glowSize: 15 };
                case 'medium':
                  return { length: 60, width: 3, glowSize: 25 };
                case 'large':
                  return { length: 100, width: 4, glowSize: 40 };
              }
            };

            const { length, width, glowSize } = getSizeStyles(lightning.size);

            const getPositionStyles = () => {
              switch (lightning.edge) {
                case 'top':
                  return {
                    top: 0,
                    left: `${lightning.position}%`,
                    transform: 'translateX(-50%)',
                    height: `${length}px`,
                    width: `${width}px`,
                  };
                case 'bottom':
                  return {
                    bottom: 0,
                    left: `${lightning.position}%`,
                    transform: 'translateX(-50%) rotate(180deg)',
                    height: `${length}px`,
                    width: `${width}px`,
                  };
                case 'left':
                  return {
                    left: 0,
                    top: `${lightning.position}%`,
                    transform: 'translateY(-50%) rotate(-90deg)',
                    height: `${length}px`,
                    width: `${width}px`,
                  };
                case 'right':
                  return {
                    right: 0,
                    top: `${lightning.position}%`,
                    transform: 'translateY(-50%) rotate(90deg)',
                    height: `${length}px`,
                    width: `${width}px`,
                  };
              }
            };

            return (
              <motion.div
                key={lightning.id}
                className="absolute pointer-events-none z-20"
                style={getPositionStyles()}
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ 
                  opacity: [0, 1, 0.9, 0.7, 0],
                  scale: [0.5, 1.2, 1, 0.8, 0.5],
                }}
                exit={{ opacity: 0, scale: 0 }}
                transition={{
                  duration: lightning.duration,
                  ease: "easeOut",
                  times: [0, 0.1, 0.3, 0.7, 1]
                }}
              >
                {/* Main lightning bolt */}
                <div
                  className="absolute inset-0"
                  style={{
                    background: 'linear-gradient(to bottom, rgba(251,146,60,1) 0%, rgba(239,68,68,0.9) 50%, rgba(251,146,60,0.5) 100%)',
                    boxShadow: `
                      0 0 ${glowSize * 0.5}px rgba(251,146,60,1),
                      0 0 ${glowSize}px rgba(239,68,68,0.8),
                      0 0 ${glowSize * 1.5}px rgba(251,146,60,0.6),
                      0 0 ${glowSize * 2}px rgba(239,68,68,0.4)
                    `,
                    filter: 'blur(0.5px)',
                  }}
                />
                
                {/* Intense glow core */}
                <div
                  className="absolute top-0 left-1/2 -translate-x-1/2 rounded-full"
                  style={{
                    width: `${width * 3}px`,
                    height: `${width * 3}px`,
                    background: 'radial-gradient(circle, rgba(251,146,60,1), rgba(239,68,68,0.5), transparent)',
                    boxShadow: `
                      0 0 ${glowSize * 0.8}px rgba(251,146,60,1),
                      0 0 ${glowSize * 1.5}px rgba(239,68,68,0.8)
                    `,
                  }}
                />

                {/* Side branches for larger bolts */}
                {lightning.size !== 'small' && (
                  <>
                    <div
                      className="absolute"
                      style={{
                        top: `${length * 0.3}px`,
                        left: '50%',
                        width: `${width * 0.7}px`,
                        height: `${length * 0.3}px`,
                        background: 'linear-gradient(to bottom, rgba(251,146,60,0.8), transparent)',
                        transform: 'rotate(-35deg) translateX(-50%)',
                        boxShadow: `0 0 ${glowSize * 0.5}px rgba(251,146,60,0.8)`,
                      }}
                    />
                    <div
                      className="absolute"
                      style={{
                        top: `${length * 0.3}px`,
                        left: '50%',
                        width: `${width * 0.7}px`,
                        height: `${length * 0.3}px`,
                        background: 'linear-gradient(to bottom, rgba(239,68,68,0.8), transparent)',
                        transform: 'rotate(35deg) translateX(-50%)',
                        boxShadow: `0 0 ${glowSize * 0.5}px rgba(239,68,68,0.8)`,
                      }}
                    />
                  </>
                )}
              </motion.div>
            );
          })}
        </AnimatePresence>

        {/* Main card content - Liquid Glass */}
        <div className="relative rounded-[32px] p-12 overflow-hidden">
          {/* Faded background image with flickering eyes */}
          <motion.div
            className="absolute inset-0 opacity-20"
            style={{
              backgroundImage: `url(${backgroundImage})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              filter: 'grayscale(0.3)',
            }}
            animate={{
              opacity: eyeOpacity * 0.2, // Max 20% opacity when fully visible
            }}
            transition={{
              duration: 0.2,
              ease: "easeInOut"
            }}
          />

          {/* Lightning sparks */}
          <AnimatePresence>
            {sparks.map((spark) => (
              <motion.div
                key={spark.id}
                className="absolute pointer-events-none"
                style={{
                  left: `${spark.x}%`,
                  top: `${spark.y}%`,
                }}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: [0, 1, 0.8, 0], scale: [0.5, 1.5, 1, 0.5] }}
                exit={{ opacity: 0, scale: 0 }}
                transition={{
                  duration: spark.duration,
                  ease: "easeOut"
                }}
              >
                {/* Main lightning bolt */}
                <div
                  className="relative"
                  style={{
                    width: '2px',
                    height: '20px',
                    background: 'linear-gradient(to bottom, rgba(251,146,60,1), rgba(239,68,68,0.8))',
                    boxShadow: '0 0 10px rgba(251,146,60,1), 0 0 20px rgba(239,68,68,0.8), 0 0 30px rgba(251,146,60,0.6)',
                    transform: `rotate(${Math.random() * 40 - 20}deg)`,
                  }}
                />
                {/* Branching bolts */}
                <div
                  className="absolute top-1/2 left-0"
                  style={{
                    width: '1px',
                    height: '10px',
                    background: 'linear-gradient(to bottom, rgba(251,146,60,0.8), transparent)',
                    boxShadow: '0 0 8px rgba(251,146,60,0.8)',
                    transform: `rotate(-45deg) translateX(-5px)`,
                  }}
                />
                <div
                  className="absolute top-1/2 left-0"
                  style={{
                    width: '1px',
                    height: '10px',
                    background: 'linear-gradient(to bottom, rgba(239,68,68,0.8), transparent)',
                    boxShadow: '0 0 8px rgba(239,68,68,0.8)',
                    transform: `rotate(45deg) translateX(5px)`,
                  }}
                />
                {/* Glow orb at spark point */}
                <div
                  className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full"
                  style={{
                    width: '8px',
                    height: '8px',
                    background: 'radial-gradient(circle, rgba(251,146,60,1), rgba(239,68,68,0.5))',
                    boxShadow: '0 0 15px rgba(251,146,60,1), 0 0 25px rgba(239,68,68,0.8)',
                  }}
                />
              </motion.div>
            ))}
          </AnimatePresence>

          {/* Backdrop blur for glass effect */}
          <div 
            className="absolute inset-0" 
            style={{
              backdropFilter: 'blur(20px) saturate(180%)',
              WebkitBackdropFilter: 'blur(20px) saturate(180%)',
            }}
          />
          
          {/* Semi-transparent background with gradient */}
          <div 
            className="absolute inset-0"
            style={{
              background: 'linear-gradient(135deg, rgba(239,68,68,0.15), rgba(251,146,60,0.15))',
            }}
          />

          {/* Refractive edge highlights */}
          <div 
            className="absolute inset-0 rounded-[32px] pointer-events-none"
            style={{
              background: 'linear-gradient(135deg, rgba(255,255,255,0.3) 0%, transparent 30%, transparent 70%, rgba(255,255,255,0.1) 100%)',
              mixBlendMode: 'overlay',
            }}
          />

          {/* Glass edge reflection */}
          <div 
            className="absolute inset-0 rounded-[32px] pointer-events-none"
            style={{
              boxShadow: `
                inset 1px 1px 2px rgba(255, 255, 255, 0.4),
                inset -1px -1px 2px rgba(255, 255, 255, 0.1),
                0 8px 32px rgba(239, 68, 68, 0.3)
              `,
            }}
          />

          {/* Border with gradient */}
          <div 
            className="absolute inset-0 rounded-[32px] pointer-events-none"
            style={{
              border: '1px solid rgba(255, 255, 255, 0.2)',
            }}
          />
          {/* Animated gradient background */}
          <motion.div
            className="absolute inset-0 opacity-10"
            style={{
              background: 'linear-gradient(135deg, #ef4444, #fb923c, #ef4444)',
              backgroundSize: '200% 200%',
            }}
            animate={{
              backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
            }}
            transition={{
              duration: 5,
              repeat: Infinity,
              ease: "linear"
            }}
          />

          {/* Content */}
          <div className="relative z-10">
            {/* Badge */}
            <motion.div
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-red-500/20 to-orange-500/20 border border-red-500/50 mb-6"
              animate={{
                boxShadow: [
                  '0 0 20px rgba(239,68,68,0.3)',
                  '0 0 30px rgba(251,146,60,0.5)',
                  '0 0 20px rgba(239,68,68,0.3)',
                ],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              <motion.div
                className="w-2 h-2 rounded-full bg-red-500"
                animate={{
                  scale: [1, 1.5, 1],
                  opacity: [0.5, 1, 0.5],
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
              <span className="text-sm text-red-400">⚡ Featured Drive</span>
            </motion.div>

            {/* Flickering "KAYO'S DRIVE" title */}
            <motion.h2 
              className="text-6xl mb-4"
              animate={{
                textShadow: [
                  '0 0 20px rgba(239,68,68,0.8), 0 0 40px rgba(251,146,60,0.6)',
                  '0 0 30px rgba(239,68,68,1), 0 0 60px rgba(251,146,60,0.8)',
                  '0 0 20px rgba(239,68,68,0.8), 0 0 40px rgba(251,146,60,0.6)',
                ]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              {"KAYO'S DRIVE".split('').map((char, i) => (
                <motion.span
                  key={i}
                  className="inline-block"
                  style={{
                    background: 'linear-gradient(135deg, #ef4444, #fb923c)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                  }}
                  animate={{
                    opacity: [1, 0.7, 1],
                  }}
                  transition={{
                    duration: 0.1,
                    repeat: Infinity,
                    delay: i * 0.05,
                    repeatDelay: 2
                  }}
                >
                  {char === ' ' ? '\u00A0' : char}
                </motion.span>
              ))}
            </motion.h2>

            {/* Short description preview */}
            <p className="text-gray-400 mb-6 line-clamp-2">
              {featuredDrive.description}
            </p>

            {/* Click to view button */}
            <motion.div
              className="inline-flex items-center gap-2 text-red-400 border-b border-red-400/50 hover:border-red-400 transition-colors"
              whileHover={{ x: 5 }}
            >
              <span>Click to explore</span>
              <span>→</span>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
