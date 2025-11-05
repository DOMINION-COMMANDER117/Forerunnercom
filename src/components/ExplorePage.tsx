import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Telescope, Lock, Download, Eye, Crown, BadgeCheck } from 'lucide-react';
import { useUser } from '../contexts/UserContext';
import { Button } from './ui/button';

export function ExplorePage() {
  const { currentUser, users, posts, isAccountLocked, getUserWithMostPosts, getUserWithMostFollowers } = useUser();
  const [blink, setBlink] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setBlink(prev => !prev);
    }, 500);
    return () => clearInterval(interval);
  }, []);

  const locked = isAccountLocked();
  const isDarkMode = currentUser?.settings.darkMode || false;

  // Get all posts sorted by creation date
  const allPosts = [...posts].sort((a, b) => b.createdAt - a.createdAt);
  
  // Get top users
  const topPostUser = getUserWithMostPosts();
  const topFollowerUser = getUserWithMostFollowers();

  const canViewPost = (post: any) => {
    if (!currentUser) return false;
    if (locked) return false;
    
    // Own posts always visible
    if (post.userId === currentUser.id) return true;

    // Check privacy settings
    if (post.privacy === 'public') return true;
    if (post.privacy === 'followers') {
      const postOwner = users.find(u => u.id === post.userId);
      return postOwner?.followers.includes(currentUser.id) || false;
    }
    return false; // private posts not visible
  };

  const canDownload = (post: any) => {
    if (!currentUser) return false;
    if (locked) return false;
    if (post.userId === currentUser.id) return true;
    return post.downloadable && post.privacy === 'public';
  };

  const handleDownload = (post: any) => {
    if (!canDownload(post)) return;
    
    const link = document.createElement('a');
    link.href = post.fileUrl;
    link.download = post.fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getPostOwner = (userId: string) => {
    return users.find(u => u.id === userId);
  };

  return (
    <div className={`min-h-screen relative overflow-hidden ${isDarkMode ? 'bg-white' : 'bg-black'}`}>
      {/* Background gradient */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-red-950/20 via-transparent to-blue-950/20" />
        <motion.div
          className="absolute top-0 left-0 w-96 h-96 bg-blue-600 rounded-full mix-blend-screen filter blur-3xl opacity-20"
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
            y: [0, 50, 0],
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
          {/* Header */}
          <div className="flex items-center gap-4 mb-8">
            <Telescope className={`w-10 h-10 ${isDarkMode ? 'text-black' : 'text-white'} drop-shadow-[0_0_15px_rgba(100,200,255,0.9)]`} />
            <h1 className={`${isDarkMode ? 'text-black' : 'text-white'} drop-shadow-[0_0_15px_rgba(255,255,255,0.4)]`}>
              Explore
            </h1>
          </div>

          {/* Account Locked Warning */}
          {currentUser && locked && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mb-8 p-6 rounded-2xl backdrop-blur-xl bg-red-950/30 border-2 border-red-500/50"
            >
              <div className="flex items-center gap-4">
                <Lock className="w-8 h-8 text-red-500" />
                <div>
                  <div className="text-red-500 text-xl mb-2" style={{ 
                    opacity: blink ? 1 : 0.3,
                    borderBottom: blink ? '2px dotted #ef4444' : '2px dotted transparent',
                    display: 'inline-block',
                    paddingBottom: '4px'
                  }}>
                    LOCKED
                  </div>
                  <div className="text-red-400">24HRs</div>
                  <p className="text-white/70 text-sm mt-2">
                    New accounts must wait 24 hours before viewing posts
                  </p>
                </div>
              </div>
            </motion.div>
          )}

          {/* Not Logged In Warning */}
          {!currentUser && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mb-8 p-6 rounded-2xl backdrop-blur-xl bg-red-950/30 border-2 border-red-500/50"
            >
              <div className="flex items-center gap-4">
                <Lock className="w-8 h-8 text-red-500" />
                <div>
                  <h3 className="text-white text-xl mb-2">Login Required</h3>
                  <p className="text-white/70">
                    You must be logged in to view posts. Posts are blurred for non-authenticated users.
                  </p>
                </div>
              </div>
            </motion.div>
          )}

          {/* Posts Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {allPosts.length === 0 ? (
              <div className="col-span-full text-center py-20">
                <Telescope className={`w-16 h-16 ${isDarkMode ? 'text-black/30' : 'text-white/30'} mx-auto mb-4`} />
                <p className={`${isDarkMode ? 'text-black/70' : 'text-white/70'}`}>
                  No posts yet. Be the first to share!
                </p>
              </div>
            ) : (
              allPosts.map((post) => {
                const owner = getPostOwner(post.userId);
                const canView = canViewPost(post);
                const isBlurred = !canView || !currentUser || locked;

                return (
                  <motion.div
                    key={post.id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    whileHover={canView ? { scale: 1.02 } : {}}
                    className={`relative rounded-2xl overflow-hidden backdrop-blur-xl ${
                      isDarkMode ? 'bg-black/10 border-2 border-black/30' : 'bg-white/5 border-2 border-white/10'
                    } ${!canView ? 'cursor-not-allowed' : 'cursor-pointer'}`}
                  >
                    {/* Post Image */}
                    <div className="relative h-64 overflow-hidden">
                      <img
                        src={post.fileUrl}
                        alt={post.title}
                        className={`w-full h-full object-cover ${isBlurred ? 'blur-2xl' : ''}`}
                        style={{ filter: isBlurred ? 'blur(20px)' : 'none' }}
                      />
                      {isBlurred && (
                        <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                          <div className="text-center">
                            <Lock className="w-12 h-12 text-red-500 mx-auto mb-3" />
                            <div className="text-red-500 text-xl mb-2" style={{ 
                              opacity: blink ? 1 : 0.3,
                              borderBottom: blink ? '2px dotted #ef4444' : '2px dotted transparent',
                              display: 'inline-block',
                              paddingBottom: '4px'
                            }}>
                              LOCKED
                            </div>
                            <div className="text-red-400">24HRs</div>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Post Info */}
                    <div className="p-4">
                      <h3 className={`${isDarkMode ? 'text-black' : 'text-white'} mb-2 truncate ${isBlurred ? 'blur-sm' : ''}`}>
                        {post.title}
                      </h3>
                      
                      {owner && (
                        <div className={`flex items-center gap-2 mb-3 ${isBlurred ? 'blur-sm' : ''}`}>
                          <div className={`w-6 h-6 rounded-full ${isDarkMode ? 'bg-black/20' : 'bg-white/20'} flex items-center justify-center`}>
                            <span className={`text-xs ${isDarkMode ? 'text-black' : 'text-white'}`}>
                              {owner.username[0].toUpperCase()}
                            </span>
                          </div>
                          <span className={`text-sm ${isDarkMode ? 'text-black/70' : 'text-white/70'}`}>
                            @{owner.username}
                          </span>
                          
                          {/* Crown for most posts */}
                          {topPostUser?.id === owner.id && (
                            <motion.div
                              animate={{
                                filter: [
                                  'drop-shadow(0 0 4px rgba(255, 215, 0, 0.8))',
                                  'drop-shadow(0 0 8px rgba(255, 215, 0, 1))',
                                  'drop-shadow(0 0 4px rgba(255, 215, 0, 0.8))',
                                ],
                              }}
                              transition={{
                                duration: 2,
                                repeat: Infinity,
                                ease: "easeInOut"
                              }}
                              title="Most Posts"
                            >
                              <Crown className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                            </motion.div>
                          )}
                          
                          {/* Check for most followers */}
                          {topFollowerUser?.id === owner.id && (
                            <motion.div
                              animate={{
                                filter: [
                                  'drop-shadow(0 0 4px rgba(59, 130, 246, 0.8))',
                                  'drop-shadow(0 0 8px rgba(59, 130, 246, 1))',
                                  'drop-shadow(0 0 4px rgba(59, 130, 246, 0.8))',
                                ],
                              }}
                              transition={{
                                duration: 2,
                                repeat: Infinity,
                                ease: "easeInOut"
                              }}
                              title="Most Followed"
                            >
                              <BadgeCheck className="w-4 h-4 text-blue-400 fill-blue-400" />
                            </motion.div>
                          )}
                        </div>
                      )}

                      {/* Privacy Badge */}
                      <div className={`flex items-center justify-between ${isBlurred ? 'blur-sm' : ''}`}>
                        <span className={`text-xs px-3 py-1 rounded-full ${
                          post.privacy === 'public' 
                            ? 'bg-green-500/20 text-green-400 border border-green-500/30' 
                            : post.privacy === 'followers'
                            ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                            : 'bg-red-500/20 text-red-400 border border-red-500/30'
                        }`}>
                          {post.privacy === 'public' ? 'Public' : post.privacy === 'followers' ? 'Followers' : 'Private'}
                        </span>

                        {canDownload(post) && (
                          <Button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDownload(post);
                            }}
                            size="sm"
                            className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white border border-red-400/40"
                          >
                            <Download className="w-4 h-4" />
                          </Button>
                        )}
                      </div>

                      {/* File Info */}
                      {!isBlurred && (
                        <div className={`mt-3 text-xs ${isDarkMode ? 'text-black/60' : 'text-white/60'}`}>
                          {post.fileName} • {(post.fileSize / 1024 / 1024).toFixed(2)} MB
                        </div>
                      )}
                    </div>
                  </motion.div>
                );
              })
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
