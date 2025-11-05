import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  User, Edit, Camera, AlertTriangle, Shield, Clock, 
  FileText, Image as ImageIcon, CheckCircle, XCircle,
  MessageSquare, Crown, BadgeCheck
} from 'lucide-react';
import { useUser } from '../contexts/UserContext';
import { toast } from 'sonner';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from './ui/alert-dialog';

export function EnhancedProfilePage() {
  const {
    currentUser,
    getUserPosts,
    updateDisplayName,
    updateProfilePicture,
    canEditProfilePicture,
    getDaysUntilProfilePictureEdit,
    getUserWithMostPosts,
    getUserWithMostFollowers,
  } = useUser();

  const [editingDisplayName, setEditingDisplayName] = useState(false);
  const [newDisplayName, setNewDisplayName] = useState('');
  const [showDisplayNameWarning, setShowDisplayNameWarning] = useState(false);
  const [showProfilePicWarning, setShowProfilePicWarning] = useState(false);
  const [newProfilePicUrl, setNewProfilePicUrl] = useState('');
  const [selectedTab, setSelectedTab] = useState<'posts' | 'warnings'>('posts');

  const isDarkMode = currentUser?.settings.darkMode || false;

  if (!currentUser) {
    return (
      <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-black via-gray-900 to-black flex items-center justify-center p-8">
        <div className="text-center">
          <h2 className="text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.5)]">
            Please log in to view your profile
          </h2>
        </div>
      </div>
    );
  }

  const userPosts = getUserPosts(currentUser.id);
  const activeWarnings = currentUser.warnings.filter(w => w.active);
  const daysUntilPicEdit = getDaysUntilProfilePictureEdit();
  const canEditPic = canEditProfilePicture();
  
  // Check if current user has most posts or most followers
  const topPostUser = getUserWithMostPosts();
  const topFollowerUser = getUserWithMostFollowers();
  const hasMostPosts = topPostUser?.id === currentUser.id;
  const hasMostFollowers = topFollowerUser?.id === currentUser.id;

  const getDiscordAvatarUrl = () => {
    if (currentUser.profilePicture) return currentUser.profilePicture;
    if (currentUser.discordAvatar && currentUser.discordId) {
      return `https://cdn.discordapp.com/avatars/${currentUser.discordId}/${currentUser.discordAvatar}.png?size=256`;
    }
    // Fallback to UI Avatars
    if (currentUser.discordUsername || currentUser.username) {
      const name = encodeURIComponent(currentUser.discordUsername || currentUser.username);
      return `https://ui-avatars.com/api/?name=${name}&size=256&background=5865F2&color=fff&bold=true`;
    }
    return null;
  };

  const handleDisplayNameEdit = () => {
    if (currentUser.displayNameEdited) {
      toast.error('Display name can only be edited once');
      return;
    }
    setShowDisplayNameWarning(true);
  };

  const confirmDisplayNameEdit = () => {
    if (!newDisplayName.trim()) {
      toast.error('Please enter a display name');
      return;
    }

    if (updateDisplayName(newDisplayName)) {
      toast.success('Display name updated successfully!');
      setEditingDisplayName(false);
      setNewDisplayName('');
      setShowDisplayNameWarning(false);
    } else {
      toast.error('Failed to update display name');
    }
  };

  const handleProfilePicEdit = () => {
    if (!canEditPic) {
      toast.error(`You can edit your profile picture in ${daysUntilPicEdit} days`);
      return;
    }
    setShowProfilePicWarning(true);
  };

  const confirmProfilePicEdit = () => {
    if (!newProfilePicUrl.trim()) {
      toast.error('Please enter an image URL');
      return;
    }

    if (updateProfilePicture(newProfilePicUrl)) {
      toast.success('Profile picture updated successfully!');
      setNewProfilePicUrl('');
      setShowProfilePicWarning(false);
    } else {
      toast.error('Failed to update profile picture');
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'low': return 'text-yellow-400 border-yellow-400/40';
      case 'medium': return 'text-orange-400 border-orange-400/40';
      case 'high': return 'text-red-400 border-red-400/40';
      case 'critical': return 'text-red-600 border-red-600/60';
      default: return 'text-gray-400 border-gray-400/40';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'warning': return AlertTriangle;
      case 'timeout': return Clock;
      case 'report': return Shield;
      case 'rule_break': return XCircle;
      default: return AlertTriangle;
    }
  };

  return (
    <div className={`min-h-screen relative overflow-hidden ${
      isDarkMode 
        ? 'bg-gradient-to-br from-white via-gray-100 to-white' 
        : 'bg-gradient-to-br from-black via-gray-900 to-black'
    }`}>
      {/* Animated background blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className={`absolute top-0 left-0 w-96 h-96 ${
            isDarkMode ? 'bg-purple-300' : 'bg-purple-600'
          } rounded-full mix-blend-screen filter blur-3xl opacity-20`}
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
          className={`absolute bottom-0 right-0 w-96 h-96 ${
            isDarkMode ? 'bg-blue-300' : 'bg-blue-600'
          } rounded-full mix-blend-screen filter blur-3xl opacity-20`}
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

      <div className="relative z-10 container mx-auto p-8 pt-32 pb-32">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-6xl mx-auto"
        >
          {/* Profile Header */}
          <div className={`mb-8 p-8 rounded-3xl backdrop-blur-xl ${
            isDarkMode 
              ? 'bg-black/10 border-2 border-black/30' 
              : 'bg-white/5 border-2 border-white/10'
          }`}>
            <div className="flex flex-col md:flex-row gap-8 items-start">
              {/* Profile Picture */}
              <div className="relative">
                <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-purple-500/40 bg-gradient-to-br from-purple-600/20 to-blue-600/20">
                  {getDiscordAvatarUrl() ? (
                    <img 
                      src={getDiscordAvatarUrl()!} 
                      alt="Profile" 
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        // Fallback if image fails to load
                        const target = e.target as HTMLImageElement;
                        const name = encodeURIComponent(currentUser.discordUsername || currentUser.username);
                        target.src = `https://ui-avatars.com/api/?name=${name}&size=256&background=5865F2&color=fff&bold=true`;
                      }}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <User className={`w-16 h-16 ${isDarkMode ? 'text-black/50' : 'text-white/50'}`} />
                    </div>
                  )}
                </div>
                <button
                  onClick={handleProfilePicEdit}
                  className={`absolute bottom-0 right-0 p-2 rounded-full backdrop-blur-xl ${
                    canEditPic
                      ? 'bg-purple-600/40 border-2 border-purple-400/40 hover:bg-purple-600/60'
                      : 'bg-gray-600/40 border-2 border-gray-400/40 cursor-not-allowed'
                  } transition-all`}
                  disabled={!canEditPic}
                >
                  <Camera className="w-4 h-4 text-white" />
                </button>
                {!canEditPic && (
                  <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 whitespace-nowrap">
                    <p className="text-xs text-red-400">
                      {daysUntilPicEdit} days left
                    </p>
                  </div>
                )}
              </div>

              {/* Profile Info */}
              <div className="flex-1">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    {editingDisplayName ? (
                      <div className="flex gap-2">
                        <Input
                          value={newDisplayName}
                          onChange={(e) => setNewDisplayName(e.target.value)}
                          placeholder="Enter display name"
                          className={`${
                            isDarkMode
                              ? 'bg-black/10 border-black/30 text-black'
                              : 'bg-white/10 border-white/20 text-white'
                          }`}
                        />
                        <Button
                          onClick={() => setEditingDisplayName(false)}
                          variant="outline"
                          className={isDarkMode ? 'border-black/30' : 'border-white/20'}
                        >
                          Cancel
                        </Button>
                      </div>
                    ) : (
                      <div className="flex items-center gap-3">
                        <h1 className={`${isDarkMode ? 'text-black' : 'text-white'} drop-shadow-[0_0_15px_rgba(147,51,234,0.5)]`}>
                          {currentUser.displayName || currentUser.discordUsername || currentUser.username}
                        </h1>
                        
                        {/* Crown icon for most posts */}
                        {hasMostPosts && (
                          <motion.div
                            animate={{
                              filter: [
                                'drop-shadow(0 0 8px rgba(255, 215, 0, 0.8))',
                                'drop-shadow(0 0 16px rgba(255, 215, 0, 1))',
                                'drop-shadow(0 0 8px rgba(255, 215, 0, 0.8))',
                              ],
                            }}
                            transition={{
                              duration: 2,
                              repeat: Infinity,
                              ease: "easeInOut"
                            }}
                            className="relative"
                            title="Most Posts - Top Creator"
                          >
                            <Crown className="w-7 h-7 text-yellow-400 fill-yellow-400" />
                            <motion.div
                              className="absolute inset-0"
                              animate={{
                                opacity: [0.3, 0.8, 0.3],
                              }}
                              transition={{
                                duration: 1.5,
                                repeat: Infinity,
                                ease: "easeInOut"
                              }}
                            >
                              <Crown className="w-7 h-7 text-yellow-200 fill-yellow-200" />
                            </motion.div>
                          </motion.div>
                        )}
                        
                        {/* Check icon for most followers */}
                        {hasMostFollowers && (
                          <motion.div
                            animate={{
                              filter: [
                                'drop-shadow(0 0 8px rgba(59, 130, 246, 0.8))',
                                'drop-shadow(0 0 16px rgba(59, 130, 246, 1))',
                                'drop-shadow(0 0 8px rgba(59, 130, 246, 0.8))',
                              ],
                            }}
                            transition={{
                              duration: 2,
                              repeat: Infinity,
                              ease: "easeInOut"
                            }}
                            className="relative"
                            title="Most Followed - Top Influencer"
                          >
                            <BadgeCheck className="w-7 h-7 text-blue-400 fill-blue-400" />
                            <motion.div
                              className="absolute inset-0"
                              animate={{
                                opacity: [0.3, 0.8, 0.3],
                              }}
                              transition={{
                                duration: 1.5,
                                repeat: Infinity,
                                ease: "easeInOut"
                              }}
                            >
                              <BadgeCheck className="w-7 h-7 text-blue-200 fill-blue-200" />
                            </motion.div>
                          </motion.div>
                        )}
                        
                        {!currentUser.displayNameEdited && (
                          <button
                            onClick={handleDisplayNameEdit}
                            className="p-2 rounded-full backdrop-blur-xl bg-purple-600/40 border-2 border-purple-400/40 hover:bg-purple-600/60 transition-all"
                          >
                            <Edit className="w-4 h-4 text-white" />
                          </button>
                        )}
                      </div>
                    )}
                    <p className={`${isDarkMode ? 'text-black/70' : 'text-white/70'} mt-2`}>
                      @{currentUser.discordUsername || currentUser.username}
                      {currentUser.discordDiscriminator && currentUser.discordDiscriminator !== '0' && `#${currentUser.discordDiscriminator}`}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4 mt-6">
                  <div className={`p-4 rounded-2xl backdrop-blur-xl ${
                    isDarkMode ? 'bg-black/5 border border-black/20' : 'bg-white/5 border border-white/10'
                  }`}>
                    <FileText className={`w-6 h-6 mb-2 ${isDarkMode ? 'text-purple-600' : 'text-purple-400'}`} />
                    <div className={`text-2xl ${isDarkMode ? 'text-black' : 'text-white'}`}>{userPosts.length}</div>
                    <div className={`text-sm ${isDarkMode ? 'text-black/60' : 'text-white/60'}`}>Posts</div>
                  </div>
                  <div className={`p-4 rounded-2xl backdrop-blur-xl ${
                    isDarkMode ? 'bg-black/5 border border-black/20' : 'bg-white/5 border border-white/10'
                  }`}>
                    <User className={`w-6 h-6 mb-2 ${isDarkMode ? 'text-blue-600' : 'text-blue-400'}`} />
                    <div className={`text-2xl ${isDarkMode ? 'text-black' : 'text-white'}`}>{currentUser.followers.length}</div>
                    <div className={`text-sm ${isDarkMode ? 'text-black/60' : 'text-white/60'}`}>Followers</div>
                  </div>
                  <div className={`p-4 rounded-2xl backdrop-blur-xl ${
                    isDarkMode ? 'bg-black/5 border border-black/20' : 'bg-white/5 border border-white/10'
                  }`}>
                    <AlertTriangle className={`w-6 h-6 mb-2 ${
                      activeWarnings.length > 0 
                        ? 'text-red-500' 
                        : isDarkMode ? 'text-green-600' : 'text-green-400'
                    }`} />
                    <div className={`text-2xl ${isDarkMode ? 'text-black' : 'text-white'}`}>{activeWarnings.length}</div>
                    <div className={`text-sm ${isDarkMode ? 'text-black/60' : 'text-white/60'}`}>Warnings</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-4 mb-6">
            <button
              onClick={() => setSelectedTab('posts')}
              className={`px-6 py-3 rounded-2xl backdrop-blur-xl transition-all ${
                selectedTab === 'posts'
                  ? 'bg-purple-600/40 border-2 border-purple-400/40'
                  : isDarkMode
                  ? 'bg-black/10 border-2 border-black/30'
                  : 'bg-white/10 border-2 border-white/20'
              }`}
            >
              <span className={isDarkMode ? 'text-black' : 'text-white'}>Posts</span>
            </button>
            <button
              onClick={() => setSelectedTab('warnings')}
              className={`px-6 py-3 rounded-2xl backdrop-blur-xl transition-all ${
                selectedTab === 'warnings'
                  ? 'bg-purple-600/40 border-2 border-purple-400/40'
                  : isDarkMode
                  ? 'bg-black/10 border-2 border-black/30'
                  : 'bg-white/10 border-2 border-white/20'
              }`}
            >
              <span className={isDarkMode ? 'text-black' : 'text-white'}>
                Warnings & Reports
                {activeWarnings.length > 0 && (
                  <span className="ml-2 px-2 py-1 rounded-full bg-red-500/40 text-xs">
                    {activeWarnings.length}
                  </span>
                )}
              </span>
            </button>
          </div>

          {/* Content */}
          <AnimatePresence mode="wait">
            {selectedTab === 'posts' && (
              <motion.div
                key="posts"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className={`p-8 rounded-3xl backdrop-blur-xl ${
                  isDarkMode 
                    ? 'bg-black/10 border-2 border-black/30' 
                    : 'bg-white/5 border-2 border-white/10'
                }`}
              >
                {userPosts.length === 0 ? (
                  <div className="text-center py-12">
                    <ImageIcon className={`w-16 h-16 mx-auto mb-4 ${
                      isDarkMode ? 'text-black/30' : 'text-white/30'
                    }`} />
                    <p className={isDarkMode ? 'text-black/70' : 'text-white/70'}>
                      No posts yet. Visit the Profile page to upload content.
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {userPosts.map((post) => (
                      <div
                        key={post.id}
                        className={`p-4 rounded-2xl backdrop-blur-xl ${
                          isDarkMode 
                            ? 'bg-black/5 border border-black/20' 
                            : 'bg-white/5 border border-white/10'
                        }`}
                      >
                        <h3 className={`mb-2 ${isDarkMode ? 'text-black' : 'text-white'}`}>
                          {post.title}
                        </h3>
                        <p className={`text-sm mb-4 ${isDarkMode ? 'text-black/70' : 'text-white/70'}`}>
                          {post.description}
                        </p>
                        <div className="flex gap-2 flex-wrap">
                          <span className={`text-xs px-3 py-1 rounded-full ${
                            post.privacy === 'public' 
                              ? 'bg-green-500/20 text-green-400' 
                              : post.privacy === 'followers'
                              ? 'bg-blue-500/20 text-blue-400'
                              : 'bg-red-500/20 text-red-400'
                          }`}>
                            {post.privacy}
                          </span>
                          {post.downloadable && (
                            <span className="text-xs px-3 py-1 rounded-full bg-purple-500/20 text-purple-400">
                              Downloadable
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </motion.div>
            )}

            {selectedTab === 'warnings' && (
              <motion.div
                key="warnings"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className={`p-8 rounded-3xl backdrop-blur-xl ${
                  isDarkMode 
                    ? 'bg-black/10 border-2 border-black/30' 
                    : 'bg-white/5 border-2 border-white/10'
                }`}
              >
                {currentUser.warnings.length === 0 ? (
                  <div className="text-center py-12">
                    <CheckCircle className="w-16 h-16 mx-auto mb-4 text-green-400" />
                    <p className={`text-xl mb-2 ${isDarkMode ? 'text-black' : 'text-white'}`}>
                      No Warnings or Reports
                    </p>
                    <p className={isDarkMode ? 'text-black/70' : 'text-white/70'}>
                      Your account is in good standing. Keep following the rules!
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {currentUser.warnings.map((warning) => {
                      const Icon = getTypeIcon(warning.type);
                      return (
                        <div
                          key={warning.id}
                          className={`p-6 rounded-2xl backdrop-blur-xl border-2 ${
                            warning.active 
                              ? getSeverityColor(warning.severity)
                              : isDarkMode
                              ? 'border-black/20 opacity-50'
                              : 'border-white/20 opacity-50'
                          } ${isDarkMode ? 'bg-black/5' : 'bg-white/5'}`}
                        >
                          <div className="flex items-start gap-4">
                            <Icon className={`w-6 h-6 flex-shrink-0 ${
                              warning.active 
                                ? getSeverityColor(warning.severity).split(' ')[0]
                                : isDarkMode ? 'text-black/50' : 'text-white/50'
                            }`} />
                            <div className="flex-1">
                              <div className="flex items-center justify-between mb-2">
                                <h3 className={`${isDarkMode ? 'text-black' : 'text-white'}`}>
                                  {warning.reason}
                                </h3>
                                <div className="flex gap-2">
                                  <span className={`text-xs px-3 py-1 rounded-full border ${
                                    getSeverityColor(warning.severity)
                                  }`}>
                                    {warning.severity.toUpperCase()}
                                  </span>
                                  {warning.active ? (
                                    <span className="text-xs px-3 py-1 rounded-full bg-red-500/20 text-red-400 border border-red-400/40">
                                      ACTIVE
                                    </span>
                                  ) : (
                                    <span className={`text-xs px-3 py-1 rounded-full ${
                                      isDarkMode 
                                        ? 'bg-black/10 text-black/50 border border-black/20'
                                        : 'bg-white/10 text-white/50 border border-white/20'
                                    }`}>
                                      RESOLVED
                                    </span>
                                  )}
                                </div>
                              </div>
                              <p className={`text-sm mb-3 ${isDarkMode ? 'text-black/70' : 'text-white/70'}`}>
                                {warning.description}
                              </p>
                              <div className="flex items-center gap-4 text-xs">
                                <span className={isDarkMode ? 'text-black/60' : 'text-white/60'}>
                                  Issued: {new Date(warning.issuedAt).toLocaleDateString()}
                                </span>
                                {warning.expiresAt && (
                                  <span className={isDarkMode ? 'text-black/60' : 'text-white/60'}>
                                    Expires: {new Date(warning.expiresAt).toLocaleDateString()}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>

      {/* Display Name Warning Dialog */}
      <AlertDialog open={showDisplayNameWarning} onOpenChange={setShowDisplayNameWarning}>
        <AlertDialogContent className="bg-gradient-to-br from-black/95 to-purple-950/95 border-2 border-red-500/50 backdrop-blur-xl">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-white flex items-center gap-2">
              <AlertTriangle className="w-6 h-6 text-red-500" />
              Warning: Permanent Action
            </AlertDialogTitle>
            <AlertDialogDescription className="text-white/80">
              You can only edit your display name <span className="text-red-400">ONCE</span> permanently.
              After this change, you will not be able to modify it again.
              <br /><br />
              Are you absolutely sure you want to proceed?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="my-4">
            <Input
              value={newDisplayName}
              onChange={(e) => setNewDisplayName(e.target.value)}
              placeholder="Enter new display name"
              className="bg-white/10 border-white/20 text-white placeholder-white/50"
            />
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-white/10 border-white/20 text-white hover:bg-white/20">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction 
              onClick={confirmDisplayNameEdit}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              I Understand, Proceed
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Profile Picture Warning Dialog */}
      <AlertDialog open={showProfilePicWarning} onOpenChange={setShowProfilePicWarning}>
        <AlertDialogContent className="bg-gradient-to-br from-black/95 to-purple-950/95 border-2 border-orange-500/50 backdrop-blur-xl">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-white flex items-center gap-2">
              <Clock className="w-6 h-6 text-orange-500" />
              30-Day Limit Warning
            </AlertDialogTitle>
            <AlertDialogDescription className="text-white/80">
              Profile pictures can only be edited <span className="text-orange-400">once every 30 calendar days</span>.
              <br /><br />
              After this change, you will need to wait 30 days before you can edit it again.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="my-4">
            <Input
              value={newProfilePicUrl}
              onChange={(e) => setNewProfilePicUrl(e.target.value)}
              placeholder="Enter image URL"
              className="bg-white/10 border-white/20 text-white placeholder-white/50"
            />
            <p className="text-xs text-white/60 mt-2">
              Tip: Upload your image to a service like Imgur or Discord and paste the URL here
            </p>
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-white/10 border-white/20 text-white hover:bg-white/20">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction 
              onClick={confirmProfilePicEdit}
              className="bg-orange-600 hover:bg-orange-700 text-white"
            >
              I Understand, Proceed
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
