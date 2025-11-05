import { motion } from 'motion/react';
import { Twitter, Youtube, Twitch, Instagram, Facebook, Linkedin, MessageCircle } from 'lucide-react';

export function SocialsPage() {
  const socials = [
    {
      name: "Twitter",
      handle: "@FORERUNNER",
      description: "Follow us for updates, news, and community highlights",
      icon: Twitter,
      color: "rgba(29, 155, 240, 0.6)"
    },
    {
      name: "YouTube",
      handle: "FORERUNNER Official",
      description: "Watch tutorials, showcases, and event coverage",
      icon: Youtube,
      color: "rgba(255, 0, 0, 0.6)"
    },
    {
      name: "Twitch",
      handle: "FORERUNNER_Live",
      description: "Join our live streams and interactive sessions",
      icon: Twitch,
      color: "rgba(145, 70, 255, 0.6)"
    },
    {
      name: "Instagram",
      handle: "@forerunner.official",
      description: "See behind-the-scenes content and visual updates",
      icon: Instagram,
      color: "rgba(225, 48, 108, 0.6)"
    },
    {
      name: "Discord",
      handle: "FORERUNNER Community",
      description: "Connect with the community and get real-time support",
      icon: MessageCircle,
      color: "rgba(88, 101, 242, 0.6)"
    },
    {
      name: "LinkedIn",
      handle: "FORERUNNER",
      description: "Professional updates and career opportunities",
      icon: Linkedin,
      color: "rgba(10, 102, 194, 0.6)"
    },
  ];

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-black via-gray-900 to-black">
      {/* Animated background blobs */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-600 rounded-full mix-blend-screen filter blur-3xl opacity-20"
          animate={{
            x: [0, 100, 0],
            y: [0, -50, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-600 rounded-full mix-blend-screen filter blur-3xl opacity-20"
          animate={{
            x: [0, -100, 0],
            y: [0, 50, 0],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="absolute top-1/2 left-1/2 w-64 h-64 bg-white rounded-full filter blur-3xl opacity-10"
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
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12 max-w-4xl"
        >
          <motion.h1
            className="text-white mb-8"
            style={{
              fontSize: '3.5rem',
              textShadow: '0 0 20px rgba(255, 255, 255, 0.8), 0 0 40px rgba(255, 255, 255, 0.5)',
            }}
          >
            Connect With Us
          </motion.h1>
          <p className="text-white/90 text-lg">
            Join our community across multiple platforms and stay connected with FORERUNNER
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl w-full"
        >
          {socials.map((social, index) => {
            const Icon = social.icon;
            return (
              <motion.a
                key={index}
                href="#"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.1 * index }}
                whileHover={{ scale: 1.02, y: -5 }}
                className="flex items-start gap-4 p-6 cursor-pointer"
              >
                <div 
                  className="flex-shrink-0 p-4 rounded-full"
                  style={{
                    background: social.color,
                  }}
                >
                  <Icon className="w-8 h-8 text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.8)]" />
                </div>
                <div className="flex-1">
                  <h3 className="text-white text-xl mb-1 drop-shadow-[0_0_10px_rgba(255,255,255,0.4)]">
                    {social.name}
                  </h3>
                  <p className="text-white/70 text-sm mb-2">{social.handle}</p>
                  <p className="text-white/80">
                    {social.description}
                  </p>
                </div>
              </motion.a>
            );
          })}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="mt-16 text-center"
        >
          <p className="text-white/90 text-lg mb-4">
            Tag us with <span className="text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.6)]">#FORERUNNER</span>
          </p>
          <p className="text-white/70">
            Share your experiences and join the conversation!
          </p>
        </motion.div>
      </div>
    </div>
  );
}
