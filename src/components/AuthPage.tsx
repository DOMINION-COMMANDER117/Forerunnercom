import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { LogIn, UserPlus } from 'lucide-react';
import { useUser } from '../contexts/UserContext';
import { toast } from 'sonner';
import { getDiscordAuthUrl, getDiscordUser } from '../config/discord';

interface AuthPageProps {
  onNavigate: (page: string) => void;
  onAuthError: () => void;
}

export function AuthPage({ onNavigate, onAuthError }: AuthPageProps) {
  const { login, register, loginWithDiscord } = useUser();
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isProcessingOAuth, setIsProcessingOAuth] = useState(false);

  // Handle OAuth callback (for Discord OAuth with authorization code)
  useEffect(() => {
    const handleOAuthCallback = async () => {
      // Check if we have an authorization code in the URL query params
      const urlParams = new URLSearchParams(window.location.search);
      const code = urlParams.get('code');

      if (code && !isProcessingOAuth) {
        setIsProcessingOAuth(true);
        const loadingToast = toast.loading('Logging in with Discord...');
        
        try {
          // NOTE: In a production environment with authorization code flow,
          // you would send this code to YOUR backend server, which would:
          // 1. Exchange the code for an access token using your client secret (server-side)
          // 2. Fetch the Discord user data
          // 3. Return the user data to the frontend
          // 
          // For this demo/prototype, we'll simulate a successful Discord login
          // since we don't have a backend server in Figma Make.
          
          // Simulate network delay
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          // Create a simulated Discord user based on the authorization code
          const mockDiscordUser = {
            id: Date.now().toString() + Math.floor(Math.random() * 10000),
            username: 'ForerunnerUser',
            discriminator: Math.floor(1000 + Math.random() * 9000).toString(),
            avatar: Array.from({ length: 32 }, () => 
              Math.floor(Math.random() * 16).toString(16)
            ).join(''),
            email: 'user@forerunner.app',
            verified: true,
            public_flags: 0,
            flags: 0,
            banner: null,
            accent_color: null,
            global_name: 'Forerunner User',
            avatar_decoration_data: null,
          };
          
          // Log in with Discord user
          loginWithDiscord(mockDiscordUser);
          
          // Clear the code from URL
          window.history.replaceState({}, document.title, window.location.pathname);
          
          // Show success message
          toast.dismiss(loadingToast);
          toast.success(`Welcome back, ${mockDiscordUser.username}! 🎮`, {
            description: 'Successfully authenticated with Discord',
            duration: 3000,
          });
          
          // Navigate to home page
          setTimeout(() => {
            onNavigate('home');
          }, 500);
        } catch (error) {
          console.error('Discord OAuth error:', error);
          toast.dismiss(loadingToast);
          toast.error('Failed to authenticate with Discord', {
            description: 'Please try logging in again',
          });
          
          // Clear the code from URL
          window.history.replaceState({}, document.title, window.location.pathname);
          
          // Trigger error overlay
          onAuthError();
        } finally {
          setIsProcessingOAuth(false);
        }
      }
    };

    handleOAuthCallback();
  }, [loginWithDiscord, onNavigate, onAuthError, isProcessingOAuth]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (isLogin) {
      // Login
      if (login(email, password)) {
        toast.success('Logged in successfully!');
        onNavigate('profile');
      } else {
        toast.error('Invalid email or password');
      }
    } else {
      // Register
      if (!username.trim()) {
        toast.error('Please enter a username');
        return;
      }
      if (register(username, email, password)) {
        toast.success('Account created successfully!');
        onNavigate('profile');
      } else {
        toast.error('Username or email already exists');
      }
    }
  };

  const handleDiscordLogin = () => {
    // Use real Discord OAuth
    toast.loading('Redirecting to Discord...');
    try {
      const authUrl = getDiscordAuthUrl();
      window.location.href = authUrl;
    } catch (error) {
      console.error('Failed to redirect to Discord:', error);
      toast.error('Failed to connect to Discord. Please try again.');
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-black via-indigo-950 to-black">
      {/* Animated background blobs */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute top-0 left-0 w-96 h-96 bg-indigo-600 rounded-full mix-blend-screen filter blur-3xl opacity-30"
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
          className="absolute bottom-0 right-0 w-96 h-96 bg-purple-600 rounded-full mix-blend-screen filter blur-3xl opacity-20"
          animate={{
            x: [0, -100, 0],
            y: [0, -50, 0],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </div>

      {/* Main content */}
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center p-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="w-full max-w-md"
        >
          <div className="text-center mb-8">
            <h1 className="text-white text-4xl mb-4 drop-shadow-[0_0_20px_rgba(255,255,255,0.5)]">
              {isLogin ? 'Welcome Back' : 'Create Account'}
            </h1>
            <p className="text-white/70">
              {isLogin ? 'Log in to access your profile' : 'Join FORERUNNER today'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {!isLogin && (
              <div>
                <input
                  type="text"
                  placeholder="Username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  className="w-full px-6 py-4 bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl text-white placeholder-white/50 focus:outline-none focus:border-indigo-400/40 transition-colors"
                />
              </div>
            )}

            <div>
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-6 py-4 bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl text-white placeholder-white/50 focus:outline-none focus:border-indigo-400/40 transition-colors"
              />
            </div>

            <div>
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                className="w-full px-6 py-4 bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl text-white placeholder-white/50 focus:outline-none focus:border-indigo-400/40 transition-colors"
              />
            </div>

            <motion.button
              type="submit"
              className="relative w-full px-8 py-4 rounded-2xl overflow-hidden"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="absolute inset-0 backdrop-blur-3xl rounded-2xl" />
              <div className="absolute inset-0 rounded-2xl pointer-events-none" style={{
                background: 'linear-gradient(to bottom right, rgba(99,102,241,0.4), transparent)',
                filter: 'blur(1px)',
              }} />
              <div className="absolute inset-0 rounded-2xl border-2 border-indigo-400/40" />
              <span className="relative z-10 text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.8)] flex items-center justify-center gap-2">
                {isLogin ? (
                  <>
                    <LogIn className="w-5 h-5" />
                    Log In
                  </>
                ) : (
                  <>
                    <UserPlus className="w-5 h-5" />
                    Sign Up
                  </>
                )}
              </span>
            </motion.button>
          </form>

          {/* Discord Login Option */}
          <div className="mt-8">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/20"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-transparent text-white/70">Or continue with</span>
              </div>
            </div>

            <div className="mt-6">
              {/* Discord Login */}
              <motion.button
                type="button"
                onClick={handleDiscordLogin}
                className="relative w-full px-6 py-4 rounded-2xl overflow-hidden"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="absolute inset-0 backdrop-blur-xl bg-[#5865F2]/20 rounded-2xl" />
                <div className="absolute inset-0 rounded-2xl border-2 border-[#5865F2]/40" />
                <div className="relative z-10 flex items-center justify-center gap-3 text-white">
                  <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515a.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0a12.64 12.64 0 0 0-.617-1.25a.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057a19.9 19.9 0 0 0 5.993 3.03a.078.078 0 0 0 .084-.028a14.09 14.09 0 0 0 1.226-1.994a.076.076 0 0 0-.041-.106a13.107 13.107 0 0 1-1.872-.892a.077.077 0 0 1-.008-.128a10.2 10.2 0 0 0 .372-.292a.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127a12.299 12.299 0 0 1-1.873.892a.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028a19.839 19.839 0 0 0 6.002-3.03a.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.956-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.955-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.946 2.418-2.157 2.418z"/>
                  </svg>
                  <span className="drop-shadow-[0_0_10px_rgba(88,101,242,0.8)]">
                    Login with Discord
                  </span>
                </div>
              </motion.button>
            </div>
          </div>

          <div className="mt-6 text-center">
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="text-white/70 hover:text-white transition-colors"
            >
              {isLogin ? "Don't have an account? Sign up" : 'Already have an account? Log in'}
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
