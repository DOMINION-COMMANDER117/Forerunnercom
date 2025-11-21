import { useState, useRef, useEffect } from 'react';
import { motion } from 'motion/react';
import { Settings, Lock, Image as ImageIcon, Palette, Moon, Sun, LogOut, MessageSquare, UserX, X } from 'lucide-react';
import { useUser } from '../contexts/UserContext';
import { Button } from './ui/button';
import { Label } from './ui/label';
import { Input } from './ui/input';
import { getDiscordAuthUrl } from '../config/discord';

interface SettingsPageProps {
  onNavigate?: (page: string) => void;
}

export function SettingsPage({ onNavigate }: SettingsPageProps) {
  const { currentUser, users, updateUserSettings, isAccountLocked, getTimeUntilUnlock, logout, unblockUser } = useUser();
  const [selectedColor, setSelectedColor] = useState(currentUser?.settings.homePageColor || '#000000');
  const [backgroundPreview, setBackgroundPreview] = useState(currentUser?.settings.homePageBackground || '');
  const [blink, setBlink] = useState(true);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Settings are always unlocked now
  const locked = false;

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

  const handleMessagePermissionChange = (permission: 'everyone' | 'friends' | 'followers' | 'nobody') => {
    updateUserSettings({ messagePermission: permission });
  };

  const handleUnblock = (userId: string) => {
    unblockUser(userId);
  };

  const blockedUsers = users.filter(u => currentUser?.blockedUsers?.includes(u.id));

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

          {/* Account Information */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="mb-8"
          >
            <div className={`p-8 rounded-3xl backdrop-blur-xl ${currentUser.settings.darkMode ? 'bg-black/10 border-2 border-black/30' : 'bg-white/5 border-2 border-white/10'}`}>
              <h2 className={`${currentUser.settings.darkMode ? 'text-black' : 'text-white'} mb-6 flex items-center gap-3`}>
                <Settings className="w-6 h-6" />
                Account Information
              </h2>

              <div className="space-y-4">
                <div>
                  <Label className={`${currentUser.settings.darkMode ? 'text-black/70' : 'text-white/70'} mb-2 block text-sm`}>
                    Username
                  </Label>
                  <p className={`${currentUser.settings.darkMode ? 'text-black' : 'text-white'} text-lg`}>
                    {currentUser.username}
                  </p>
                </div>
                
                <div>
                  <Label className={`${currentUser.settings.darkMode ? 'text-black/70' : 'text-white/70'} mb-2 block text-sm`}>
                    Email (Private)
                  </Label>
                  <p className={`${currentUser.settings.darkMode ? 'text-black' : 'text-white'} text-lg`}>
                    {currentUser.email}
                  </p>
                  <p className={`${currentUser.settings.darkMode ? 'text-black/50' : 'text-white/50'} text-xs mt-1`}>
                    Your email is private and never shown to other users
                  </p>
                </div>
                
                <div>
                  <Label className={`${currentUser.settings.darkMode ? 'text-black/70' : 'text-white/70'} mb-2 block text-sm`}>
                    Account Created
                  </Label>
                  <p className={`${currentUser.settings.darkMode ? 'text-black' : 'text-white'} text-lg`}>
                    {new Date(currentUser.createdAt).toLocaleDateString('en-US', { 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}
                  </p>
                </div>

                {/* Discord Connection */}
                <div className="pt-4 border-t border-white/10">
                  <Label className={`${currentUser.settings.darkMode ? 'text-black/70' : 'text-white/70'} mb-2 block text-sm`}>
                    Discord Account
                  </Label>
                  {currentUser.discordId ? (
                    <div className="space-y-2">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center">
                          {currentUser.discordAvatar ? (
                            <img 
                              src={`https://cdn.discordapp.com/avatars/${currentUser.discordId}/${currentUser.discordAvatar}.png`}
                              alt="Discord Avatar"
                              className="w-full h-full rounded-full"
                            />
                          ) : (
                            <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515a.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0a12.64 12.64 0 0 0-.617-1.25a.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057a19.9 19.9 0 0 0 5.993 3.03a.078.078 0 0 0 .084-.028a14.09 14.09 0 0 0 1.226-1.994a.076.076 0 0 0-.041-.106a13.107 13.107 0 0 1-1.872-.892a.077.077 0 0 1-.008-.128a10.2 10.2 0 0 0 .372-.292a.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127a12.299 12.299 0 0 1-1.873.892a.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028a19.839 19.839 0 0 0 6.002-3.03a.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.956-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.955-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.946 2.418-2.157 2.418z"/>
                            </svg>
                          )}
                        </div>
                        <div>
                          <p className={`${currentUser.settings.darkMode ? 'text-black' : 'text-white'}`}>
                            {currentUser.discordUsername}#{currentUser.discordDiscriminator}
                          </p>
                          <p className={`${currentUser.settings.darkMode ? 'text-black/50' : 'text-white/50'} text-xs`}>
                            Connected
                          </p>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <p className={`${currentUser.settings.darkMode ? 'text-black/70' : 'text-white/70'} text-sm mb-3`}>
                        Connect your Discord account to automatically sync your display name, username, and avatar
                      </p>
                      <Button
                        onClick={() => window.location.href = getDiscordAuthUrl()}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-500/50"
                      >
                        <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515a.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0a12.64 12.64 0 0 0-.617-1.25a.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057a19.9 19.9 0 0 0 5.993 3.03a.078.078 0 0 0 .084-.028a14.09 14.09 0 0 0 1.226-1.994a.076.076 0 0 0-.041-.106a13.107 13.107 0 0 1-1.872-.892a.077.077 0 0 1-.008-.128a10.2 10.2 0 0 0 .372-.292a.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127a12.299 12.299 0 0 1-1.873.892a.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028a19.839 19.839 0 0 0 6.002-3.03a.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.956-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.955-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.946 2.418-2.157 2.418z"/>
                        </svg>
                        Connect Discord
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </motion.div>

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

          {/* Messaging Permissions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mb-8"
          >
            <div className={`p-8 rounded-3xl backdrop-blur-xl ${currentUser.settings.darkMode ? 'bg-black/10 border-2 border-black/30' : 'bg-white/5 border-2 border-white/10'}`}>
              <h2 className={`${currentUser.settings.darkMode ? 'text-black' : 'text-white'} mb-6 flex items-center gap-3`}>
                <MessageSquare className="w-6 h-6" />
                Who Can Message Me
              </h2>

              <div className="space-y-3">
                {(['everyone', 'friends', 'followers', 'nobody'] as const).map((permission) => (
                  <label
                    key={permission}
                    className={`flex items-center gap-3 p-4 rounded-xl cursor-pointer transition-colors ${
                      currentUser.settings.messagePermission === permission
                        ? currentUser.settings.darkMode
                          ? 'bg-black/20 border-2 border-black/50'
                          : 'bg-white/10 border-2 border-red-400/60'
                        : currentUser.settings.darkMode
                        ? 'bg-black/5 border-2 border-black/20'
                        : 'bg-white/5 border-2 border-white/20'
                    }`}
                  >
                    <input
                      type="radio"
                      name="messagePermission"
                      checked={currentUser.settings.messagePermission === permission}
                      onChange={() => handleMessagePermissionChange(permission)}
                      className="w-5 h-5 accent-red-500"
                    />
                    <span className={`${currentUser.settings.darkMode ? 'text-black' : 'text-white'} capitalize`}>
                      {permission === 'everyone' ? 'Everyone' : 
                       permission === 'friends' ? 'Friends Only' :
                       permission === 'followers' ? 'Followers Only' :
                       'Nobody'}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Blocked Users */}
          {blockedUsers.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="mb-8"
            >
              <div className={`p-8 rounded-3xl backdrop-blur-xl ${currentUser.settings.darkMode ? 'bg-black/10 border-2 border-black/30' : 'bg-white/5 border-2 border-white/10'}`}>
                <h2 className={`${currentUser.settings.darkMode ? 'text-black' : 'text-white'} mb-6 flex items-center gap-3`}>
                  <UserX className="w-6 h-6" />
                  Blocked Users ({blockedUsers.length})
                </h2>

                <div className="space-y-3">
                  {blockedUsers.map((user) => (
                    <div
                      key={user.id}
                      className={`flex items-center justify-between p-4 rounded-xl ${
                        currentUser.settings.darkMode ? 'bg-black/10' : 'bg-white/5'
                      }`}
                    >
                      <div>
                        <p className={`${currentUser.settings.darkMode ? 'text-black' : 'text-white'}`}>
                          {user.displayName || user.username}
                        </p>
                        <p className={`text-sm ${currentUser.settings.darkMode ? 'text-black/60' : 'text-white/60'}`}>
                          @{user.username}
                        </p>
                      </div>
                      <Button
                        onClick={() => handleUnblock(user.id)}
                        className="bg-red-600 hover:bg-red-700 text-white"
                        size="sm"
                      >
                        <X className="w-4 h-4 mr-1" />
                        Unblock
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {/* Logout Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
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
