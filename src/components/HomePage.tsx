import { motion } from 'motion/react';
import { ArrowRight, Users as UsersIcon, FileStack } from 'lucide-react';
import { useUser } from '../contexts/UserContext';
import backgroundImage from 'figma:asset/7386ead7d8aa3f335d1731ef4f47ade99a373daa.png';

export function HomePage() {
  const { users, posts, currentUser } = useUser();

  // Get user's custom settings
  const userBackground = currentUser?.settings.homePageBackground;
  const userColor = currentUser?.settings.homePageColor;
  const isDarkMode = currentUser?.settings.darkMode || false;

  return (
    <div className="min-h-screen relative overflow-hidden" style={{ backgroundColor: isDarkMode ? '#ffffff' : (userColor || '#000000') }}>
      {/* Background Image */}
      <div className="absolute inset-0 overflow-hidden">
        {userBackground ? (
          <img 
            src={userBackground}
            alt="Custom Background"
            className="w-full h-full object-cover"
          />
        ) : !userColor ? (
          <img 
            src={backgroundImage}
            alt="Background"
            className="w-full h-full object-cover"
          />
        ) : null}
        {/* Dark overlay for better text readability */}
        <div className="absolute inset-0 bg-black/40" />
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
            className="text-white mb-6 italic"
            style={{
              fontSize: '5rem',
              fontWeight: 'bold',
              textShadow: '0 0 20px rgba(255, 255, 255, 0.8), 0 0 40px rgba(255, 255, 255, 0.5)',
              fontStyle: 'italic',
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
            FORERUNNER
          </motion.h1>
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

        {/* Platform Statistics */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="w-full max-w-4xl mb-40"
        >
          <div className="flex justify-center gap-16">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="text-center"
              whileHover={{ y: -5 }}
            >
              <div className="text-white text-3xl mb-2 drop-shadow-[0_0_10px_rgba(255,255,255,0.4)]">
                {users.length.toLocaleString()}
              </div>
              <p className="text-white/70">Total Users</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="text-center"
              whileHover={{ y: -5 }}
            >
              <div className="text-white text-3xl mb-2 drop-shadow-[0_0_10px_rgba(255,255,255,0.4)]">
                {posts.length.toLocaleString()}
              </div>
              <p className="text-white/70">Asset Posts</p>
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
              href="#"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="relative rounded-3xl overflow-hidden group cursor-pointer"
              whileHover={{ scale: 1.02 }}
            >
              <div className="relative h-64 overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1650984661525-7e6b1b874e47?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0ZWNobm9sb2d5JTIwbmV3cyUyMGZ1dHVyaXN0aWN8ZW58MXx8fHwxNzYyMjg4Mjg2fDA&ixlib=rb-4.1.0&q=80&w=1080"
                  alt="Technology News"
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
                  <span className="text-red-400 text-sm tracking-wider drop-shadow-[0_0_8px_rgba(239,68,68,0.6)]">BREAKING NEWS</span>
                  <h3 className="text-white mt-2 drop-shadow-[0_0_8px_rgba(255,255,255,0.3)]">Next Generation Platform Launch</h3>
                  <p className="text-white/80 mt-1 text-sm">Revolutionary features coming soon to transform your digital experience...</p>
                </div>
              </div>
            </motion.a>

            <motion.a
              href="#"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.7 }}
              className="relative rounded-3xl overflow-hidden group cursor-pointer"
              whileHover={{ scale: 1.02 }}
            >
              <div className="relative h-64 overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1759709867188-7d94e0041de2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxnYW1pbmclMjBlc3BvcnRzJTIwY29tcGV0aXRpb258ZW58MXx8fHwxNzYyMjIzNDYzfDA&ixlib=rb-4.1.0&q=80&w=1080"
                  alt="Gaming Event"
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
                  <span className="text-red-400 text-sm tracking-wider drop-shadow-[0_0_8px_rgba(239,68,68,0.6)]">EVENT</span>
                  <h3 className="text-white mt-2 drop-shadow-[0_0_8px_rgba(255,255,255,0.3)]">Championship Series 2025</h3>
                  <p className="text-white/80 mt-1 text-sm">Join the ultimate competition and showcase your skills on the global stage</p>
                </div>
              </div>
            </motion.a>

            <motion.a
              href="#"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.8 }}
              className="relative rounded-3xl overflow-hidden group cursor-pointer"
              whileHover={{ scale: 1.02 }}
            >
              <div className="relative h-64 overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1627368021159-b315481e51bb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkaWdpdGFsJTIwZXZlbnQlMjBjb25mZXJlbmNlfGVufDF8fHx8MTc2MjI4ODI4OHww&ixlib=rb-4.1.0&q=80&w=1080"
                  alt="Conference"
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
                  <span className="text-red-400 text-sm tracking-wider drop-shadow-[0_0_8px_rgba(239,68,68,0.6)]">CONFERENCE</span>
                  <h3 className="text-white mt-2 drop-shadow-[0_0_8px_rgba(255,255,255,0.3)]">Digital Innovation Summit</h3>
                  <p className="text-white/80 mt-1 text-sm">Connect with industry leaders and explore the future of technology</p>
                </div>
              </div>
            </motion.a>

            <motion.a
              href="#"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.9 }}
              className="relative rounded-3xl overflow-hidden group cursor-pointer"
              whileHover={{ scale: 1.02 }}
            >
              <div className="relative h-64 overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1758073519996-6d3c63b4922c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhYnN0cmFjdCUyMHRlY2hub2xvZ3klMjBkYXRhfGVufDF8fHx8MTc2MjI4ODI4OHww&ixlib=rb-4.1.0&q=80&w=1080"
                  alt="Technology Data"
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
                  <span className="text-red-400 text-sm tracking-wider drop-shadow-[0_0_8px_rgba(239,68,68,0.6)]">UPDATE</span>
                  <h3 className="text-white mt-2 drop-shadow-[0_0_8px_rgba(255,255,255,0.3)]">Advanced Analytics Released</h3>
                  <p className="text-white/80 mt-1 text-sm">New powerful tools for data visualization and real-time insights</p>
                </div>
              </div>
            </motion.a>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
