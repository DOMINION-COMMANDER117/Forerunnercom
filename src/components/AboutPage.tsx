import { motion } from 'motion/react';
import { Users, Target, Zap, Award, Heart, TrendingUp } from 'lucide-react';
import forerunnerImage from 'figma:asset/030652ada08dd3b00717cef743f31393071e7979.png';

export function AboutPage() {
  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-black via-gray-950 to-black">
      {/* Animated background blobs */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute top-0 left-0 w-96 h-96 bg-gray-800 rounded-full mix-blend-screen filter blur-3xl opacity-20"
          animate={{
            x: [0, 100, 0],
            y: [0, 50, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="absolute top-0 right-0 w-96 h-96 bg-gray-700 rounded-full mix-blend-screen filter blur-3xl opacity-20"
          animate={{
            x: [0, -100, 0],
            y: [0, 100, 0],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="absolute bottom-0 left-1/2 w-96 h-96 bg-gray-900 rounded-full mix-blend-screen filter blur-3xl opacity-20"
          animate={{
            x: [-50, 50, -50],
            y: [0, -50, 0],
          }}
          transition={{
            duration: 18,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="absolute top-1/3 right-1/3 w-64 h-64 bg-white rounded-full filter blur-3xl opacity-10"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.1, 0.15, 0.1],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
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
          <motion.h1
            className="text-white mb-8"
            style={{
              fontSize: '4rem',
              fontWeight: 'bold',
              textShadow: '0 0 20px rgba(255, 255, 255, 0.8), 0 0 40px rgba(255, 255, 255, 0.5)',
            }}
            animate={{
              textShadow: [
                '0 0 20px rgba(255, 255, 255, 0.8), 0 0 40px rgba(255, 255, 255, 0.5)',
                '0 0 30px rgba(255, 255, 255, 1), 0 0 60px rgba(255, 255, 255, 0.7)',
                '0 0 20px rgba(255, 255, 255, 0.8), 0 0 40px rgba(255, 255, 255, 0.5)',
              ],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            About Us
          </motion.h1>
          <p className="text-white/90 text-lg leading-relaxed">
            We are the pioneers of liquid glass design, pushing the boundaries of what's possible
            in modern digital experiences. Our mission is to create interfaces that inspire innovation
            and redefine the future of technology.
          </p>
        </motion.div>

        {/* Story Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="max-w-5xl w-full mb-20"
        >          
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-white mb-6 text-3xl drop-shadow-[0_0_15px_rgba(255,255,255,0.5)]">Our Story</h2>
              <p className="text-white/90 leading-relaxed">
                Forerunner began back in the early days of Fortnite Creative, around Chapter 1 Season 7—when building maps meant nothing more than dropping props and experimenting with the few tools available. What started as simply spamming items on an empty island quickly turned into a passion for creating experiences that players could actually enjoy. Over time, that curiosity evolved into designing full games, intricate deathruns, and now large-scale events and detailed 3D models. Today, Forerunner stands as more than just a creative studio—it's a community-driven project built on years of learning, experimenting, and pushing the limits of what's possible in Fortnite UEFN. The goal has always been the same: to create, inspire, and provide the tools and content that help other creators bring their own visions to life.
              </p>
            </div>
            <div className="relative rounded-2xl overflow-hidden">
              <img 
                src={forerunnerImage}
                alt="FORERUNNER"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </motion.div>

        {/* Values Section */}
        <div className="w-full max-w-6xl mb-20">
          <h2 className="text-white text-center mb-12" style={{
            fontSize: '2.5rem',
            textShadow: '0 0 15px rgba(255, 255, 255, 0.6)',
          }}>
            Our Core Values
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="p-8"
              whileHover={{ y: -5 }}
            >
              <Users className="w-10 h-10 text-white mb-4 drop-shadow-[0_0_8px_rgba(255,255,255,0.8)]" />
              <h3 className="text-white mb-3 text-xl drop-shadow-[0_0_8px_rgba(255,255,255,0.3)]">Collaboration</h3>
              <p className="text-white/80">
                At Forerunner, teamwork is everything. Our Discord thrives on collaboration—creators, developers, and players all contribute ideas, feedback, and inspiration. Every project is a shared vision, where everyone's input matters, and every success is achieved together.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="p-8"
              whileHover={{ y: -5 }}
            >
              <Target className="w-10 h-10 text-white mb-4 drop-shadow-[0_0_8px_rgba(255,255,255,0.8)]" />
              <h3 className="text-white mb-3 text-xl drop-shadow-[0_0_8px_rgba(255,255,255,0.3)]">Focus</h3>
              <p className="text-white/80">
                From the earliest days of Creative to the complex event maps we build now, Forerunner has always been about staying true to one goal: bringing ideas to life with precision and meaning. We focus on pushing quality, clarity, and purpose into everything we make.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="p-8"
              whileHover={{ y: -5 }}
            >
              <Zap className="w-10 h-10 text-white mb-4 drop-shadow-[0_0_8px_rgba(255,255,255,0.8)]" />
              <h3 className="text-white mb-3 text-xl drop-shadow-[0_0_8px_rgba(255,255,255,0.3)]">Innovation</h3>
              <p className="text-white/80">
                Forerunner was built on the idea of doing what others thought couldn't be done. We constantly experiment with new mechanics, visual styles, and Unreal systems to redefine what's possible in Fortnite and beyond. Innovation isn't a goal—it's our foundation.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="p-8"
              whileHover={{ y: -5 }}
            >
              <Award className="w-10 h-10 text-white mb-4 drop-shadow-[0_0_8px_rgba(255,255,255,0.8)]" />
              <h3 className="text-white mb-3 text-xl drop-shadow-[0_0_8px_rgba(255,255,255,0.3)]">Excellence</h3>
              <p className="text-white/80">
                Every project we release represents the highest level of dedication from our team. From detailed environments to clean visuals and functional design, we hold ourselves to a professional standard that keeps Forerunner's work recognized across the community.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.7 }}
              className="p-8"
              whileHover={{ y: -5 }}
            >
              <Heart className="w-10 h-10 text-white mb-4 drop-shadow-[0_0_8px_rgba(255,255,255,0.8)]" />
              <h3 className="text-white mb-3 text-xl drop-shadow-[0_0_8px_rgba(255,255,255,0.3)]">Passion</h3>
              <p className="text-white/80">
                Forerunner was born out of passion—long nights in Creative, endless testing, and a genuine love for building worlds. That same energy fuels our Discord today, where everyone shares the same excitement for creation, collaboration, and growth.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.8 }}
              className="p-8"
              whileHover={{ y: -5 }}
            >
              <TrendingUp className="w-10 h-10 text-white mb-4 drop-shadow-[0_0_8px_rgba(255,255,255,0.8)]" />
              <h3 className="text-white mb-3 text-xl drop-shadow-[0_0_8px_rgba(255,255,255,0.3)]">Growth</h3>
              <p className="text-white/80">
                Starting from simple item builds back in Chapter 1 Season 7 to advanced UEFN projects today, Forerunner's story is one of constant evolution. We grow with every update, every challenge, and every new member who joins the journey forward.
              </p>
            </motion.div>
          </div>
        </div>

        {/* Stats Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.9 }}
          className="max-w-5xl w-full"
        >          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <motion.div 
                className="text-white text-4xl mb-2 drop-shadow-[0_0_15px_rgba(255,255,255,0.6)]"
                animate={{
                  opacity: [1, 0.3, 1],
                }}
                transition={{
                  duration: Math.random() * 2 + 1,
                  repeat: Infinity,
                  ease: "easeInOut",
                  repeatDelay: Math.random() * 1.5,
                }}
              >
                10K+
              </motion.div>
              <div className="text-white/80 italic">Active Users</div>
            </div>
            <div>
              <motion.div 
                className="text-white text-4xl mb-2 drop-shadow-[0_0_15px_rgba(255,255,255,0.6)]"
                animate={{
                  opacity: [1, 0.3, 1],
                }}
                transition={{
                  duration: Math.random() * 2.5 + 0.8,
                  repeat: Infinity,
                  ease: "easeInOut",
                  repeatDelay: Math.random() * 2,
                }}
              >
                50+
              </motion.div>
              <div className="text-white/80 italic">Team Members</div>
            </div>
            <div>
              <motion.div 
                className="text-white text-4xl mb-2 drop-shadow-[0_0_15px_rgba(255,255,255,0.6)]"
                animate={{
                  opacity: [1, 0.3, 1],
                }}
                transition={{
                  duration: Math.random() * 1.8 + 1.2,
                  repeat: Infinity,
                  ease: "easeInOut",
                  repeatDelay: Math.random() * 1.2,
                }}
              >
                100+
              </motion.div>
              <div className="text-white/80 italic">Projects</div>
            </div>
            <div>
              <motion.div 
                className="text-white text-4xl mb-2 drop-shadow-[0_0_15px_rgba(255,255,255,0.6)]"
                animate={{
                  opacity: [1, 0.3, 1],
                }}
                transition={{
                  duration: Math.random() * 3 + 0.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                  repeatDelay: Math.random() * 1.8,
                }}
              >
                25+
              </motion.div>
              <div className="text-white/80 italic">Countries</div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
