import { useState, useRef, useEffect } from 'react';
import { motion } from 'motion/react';
import { Settings, Lock, Image as ImageIcon, Palette, Moon, Sun, LogOut } from 'lucide-react';
import { useUser } from '../contexts/UserContext';
import { Button } from './ui/button';
import { Label } from './ui/label';
import { Input } from './ui/input';

interface SettingsPageProps {
  onNavigate?: (page: string) => void;
}

export function SettingsPage({ onNavigate }: SettingsPageProps) {
  const { currentUser, updateUserSettings, isAccountLocked, getTimeUntilUnlock, logout } = useUser();
  const [selectedColor, setSelectedColor] = useState(currentUser?.settings.homePageColor || '#000000');
  const [backgroundPreview, setBackgroundPreview] = useState(currentUser?.settings.homePageBackground || '');
  const [blink, setBlink] = useState(true);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const locked = isAccountLocked();
  const hoursRemaining = Math.ceil(getTimeUntilUnlock());

  useEffect(() => {
    const interval = setInterval(() => {
      setBlink(prev => !prev);
    }, 500);
    return () => clearInterval(interval);
  }, []);

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-8">
        <div className="text-center">
          <Lock className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-white text-2xl mb-2">Authentication Required</h2>
          <p className="text-white/70">Please log in to access settings</p>
        </div>
      </div>
    );
  }

  const handleColorChange = (color: string) => {
    if (locked) return;
    setSelectedColor(color);
    updateUserSettings({ homePageColor: color, homePageBackground: undefined });
  };

  const handleBackgroundUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (locked) return;
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setBackgroundPreview(result);
        updateUserSettings({ homePageBackground: result, homePageColor: undefined });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDarkModeToggle = () => {
    if (locked) return;
    updateUserSettings({ darkMode: !currentUser.settings.darkMode });
  };

  const handleLogout = () => {
    logout();
    if (onNavigate) {
      onNavigate('home');
    }
  };

  return (
    <div className={`min-h-screen relative overflow-hidden ${currentUser.settings.darkMode ? 'bg-white' : 'bg-black'}`}>
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-red-950/20 via-transparent to-blue-950/20" />

      <div className="relative z-10 container mx-auto p-8 pt-32">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl mx-auto"
        >
          <div className="flex items-center gap-4 mb-12">
            <Settings className={`w-10 h-10 ${currentUser.settings.darkMode ? 'text-black' : 'text-white'}`} />
            <h1 className={`${currentUser.settings.darkMode ? 'text-black' : 'text-white'} drop-shadow-[0_0_15px_rgba(255,255,255,0.4)]`}>
              User Settings
            </h1>
          </div>

          {locked && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mb-8 p-6 rounded-2xl backdrop-blur-xl bg-red-950/30 border-2 border-red-500/50"
            >
              <div className="flex items-center gap-4">
                <Lock className="w-8 h-8 text-red-500" />
                <div>
                  <h3 className="text-red-500 mb-1" style={{ opacity: blink ? 1 : 0.3 }}>
                    LOCKED
                  </h3>
                  <p className="text-red-400">
                    Settings unlock in {hoursRemaining} hours
                  </p>
                  <p className="text-white/60 text-sm mt-2">
                    New accounts must wait 24 hours before customizing settings
                  </p>
                </div>
              </div>
            </motion.div>
          )}

          {/* Home Page Customization */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-8"
          >
            <div className="relative">
              {locked && (
                <div className="absolute inset-0 backdrop-blur-sm bg-black/50 rounded-3xl z-10 flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-red-500 text-2xl mb-2" style={{ opacity: blink ? 1 : 0.3 }}>
                      LOCKED
                    </div>
                    <div className="text-red-400">24HRs</div>
                  </div>
                </div>
              )}
              
              <div className={`p-8 rounded-3xl backdrop-blur-xl ${currentUser.settings.darkMode ? 'bg-black/10 border-2 border-black/30' : 'bg-white/5 border-2 border-white/10'}`}>
                <h2 className={`${currentUser.settings.darkMode ? 'text-black' : 'text-white'} mb-6 flex items-center gap-3`}>
                  <Palette className="w-6 h-6" />
                  Home Page Customization
                </h2>

                <div className="space-y-6">
                  {/* Color Picker */}
                  <div>
                    <Label className={`${currentUser.settings.darkMode ? 'text-black' : 'text-white'} mb-3 block`}>
                      Background Color
                    </Label>
                    <div className="flex items-center gap-4">
                      <Input
                        type="color"
                        value={selectedColor}
                        onChange={(e) => handleColorChange(e.target.value)}
                        className="w-24 h-12 cursor-pointer border-2 border-white/20"
                        disabled={locked}
                      />
                      <span className={`${currentUser.settings.darkMode ? 'text-black/70' : 'text-white/70'}`}>
                        {selectedColor}
                      </span>
                    </div>
                  </div>

                  {/* Background Image Upload */}
                  <div>
                    <Label className={`${currentUser.settings.darkMode ? 'text-black' : 'text-white'} mb-3 block`}>
                      Background Image
                    </Label>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleBackgroundUpload}
                      className="hidden"
                      disabled={locked}
                    />
                    <Button
                      onClick={() => fileInputRef.current?.click()}
                      disabled={locked}
                      className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white border-2 border-red-400/40"
                    >
                      <ImageIcon className="w-5 h-5 mr-2" />
                      Upload Image
                    </Button>
                    {backgroundPreview && (
                      <div className="mt-4 rounded-xl overflow-hidden border-2 border-white/20">
                        <img src={backgroundPreview} alt="Preview" className="w-full h-32 object-cover" />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Theme Settings */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="relative">
              {locked && (
                <div className="absolute inset-0 backdrop-blur-sm bg-black/50 rounded-3xl z-10 flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-red-500 text-2xl mb-2" style={{ opacity: blink ? 1 : 0.3 }}>
                      LOCKED
                    </div>
                    <div className="text-red-400">24HRs</div>
                  </div>
                </div>
              )}

              <div className={`p-8 rounded-3xl backdrop-blur-xl ${currentUser.settings.darkMode ? 'bg-black/10 border-2 border-black/30' : 'bg-white/5 border-2 border-white/10'}`}>
                <h2 className={`${currentUser.settings.darkMode ? 'text-black' : 'text-white'} mb-6 flex items-center gap-3`}>
                  {currentUser.settings.darkMode ? <Sun className="w-6 h-6" /> : <Moon className="w-6 h-6" />}
                  Theme Mode
                </h2>

                <div className="flex items-center justify-between">
                  <div>
                    <p className={`${currentUser.settings.darkMode ? 'text-black' : 'text-white'} mb-1`}>
                      {currentUser.settings.darkMode ? 'Light Mode' : 'Dark Mode'}
                    </p>
                    <p className={`${currentUser.settings.darkMode ? 'text-black/60' : 'text-white/60'} text-sm`}>
                      Changes all pages to {currentUser.settings.darkMode ? 'white' : 'black'} background
                    </p>
                  </div>
                  <Button
                    onClick={handleDarkModeToggle}
                    disabled={locked}
                    className={`${
                      currentUser.settings.darkMode
                        ? 'bg-gradient-to-r from-gray-700 to-gray-800 hover:from-gray-800 hover:to-gray-900'
                        : 'bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800'
                    } text-white border-2 border-white/20`}
                  >
                    {currentUser.settings.darkMode ? (
                      <>
                        <Moon className="w-5 h-5 mr-2" />
                        Switch to Dark
                      </>
                    ) : (
                      <>
                        <Sun className="w-5 h-5 mr-2" />
                        Switch to Light
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Logout Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-8"
          >
            <div className={`p-8 rounded-3xl backdrop-blur-xl ${currentUser.settings.darkMode ? 'bg-black/10 border-2 border-black/30' : 'bg-white/5 border-2 border-white/10'}`}>
              <h2 className={`${currentUser.settings.darkMode ? 'text-black' : 'text-white'} mb-6 flex items-center gap-3`}>
                <LogOut className="w-6 h-6" />
                Account Actions
              </h2>

              <div className="flex items-center justify-between">
                <div>
                  <p className={`${currentUser.settings.darkMode ? 'text-black' : 'text-white'} mb-1`}>
                    Logout
                  </p>
                  <p className={`${currentUser.settings.darkMode ? 'text-black/60' : 'text-white/60'} text-sm`}>
                    Sign out of your account
                  </p>
                </div>
                <Button
                  onClick={handleLogout}
                  className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white border-2 border-red-400/40"
                >
                  <LogOut className="w-5 h-5 mr-2" />
                  Logout
                </Button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
