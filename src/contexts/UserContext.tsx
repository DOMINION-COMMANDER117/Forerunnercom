import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface Post {
  id: string;
  userId: string;
  title: string;
  description: string;
  fileUrl: string;
  fileName: string;
  fileSize: number;
  privacy: 'public' | 'followers' | 'private';
  downloadable: boolean;
  locked: boolean;
  tags?: string[];
  createdAt: number;
}

export interface UserSettings {
  homePageColor?: string;
  homePageBackground?: string;
  darkMode: boolean;
  messagePermission: 'everyone' | 'friends' | 'followers' | 'nobody';
}

export interface FriendRequest {
  id: string;
  fromUserId: string;
  toUserId: string;
  createdAt: number;
  status: 'pending' | 'accepted' | 'rejected';
}

export interface Warning {
  id: string;
  type: 'warning' | 'report' | 'timeout' | 'rule_break';
  reason: string;
  description: string;
  issuedAt: number;
  expiresAt?: number;
  severity: 'low' | 'medium' | 'high' | 'critical';
  active: boolean;
}

export type Rank = 'Silver' | 'Gold' | 'Platinum' | 'Diamond' | 'Elite';

export interface User {
  id: string;
  username: string;
  email: string;
  createdAt: number;
  followers: string[];
  following: string[];
  friends: string[]; // Mutual friend connections
  blockedUsers: string[]; // Users this user has blocked
  settings: UserSettings;
  // Discord OAuth fields
  discordId?: string;
  discordUsername?: string;
  discordDiscriminator?: string;
  discordAvatar?: string;
  // Profile fields
  displayName?: string;
  displayNameEdited: boolean;
  profilePicture?: string;
  profileBanner?: string;
  lastProfilePictureEdit?: number;
  bio?: string;
  partners?: string[];
  favoriteGames?: string[];
  status?: 'online' | 'invisible' | 'dnd' | 'sleeping' | 'busy' | 'away';
  // Moderation
  warnings: Warning[];
  // Ranking system
  level: number; // 0-7000
  rank: Rank;
  lastActivityUpdate: number;
  // Post unlock tracking
  followUnlockTimes: Record<string, number>; // userId -> unlock timestamp for followers-only posts
}

interface UserContextType {
  currentUser: User | null;
  users: User[];
  posts: Post[];
  friendRequests: FriendRequest[];
  login: (email: string, password: string) => boolean;
  register: (username: string, email: string, password: string) => boolean;
  registerOAuth: (username: string, email: string, provider: 'google' | 'twitter' | 'discord') => boolean;
  loginWithDiscord: (discordUser: any) => void;
  logout: () => void;
  createPost: (post: Omit<Post, 'id' | 'userId' | 'createdAt'>) => void;
  updatePost: (postId: string, updates: Partial<Post>) => void;
  deletePost: (postId: string) => void;
  getUserPosts: (userId: string) => Post[];
  getPublicPosts: () => Post[];
  canViewPost: (post: Post) => boolean;
  followUser: (userId: string) => void;
  unfollowUser: (userId: string) => void;
  updateUserSettings: (settings: Partial<UserSettings>) => void;
  updateDisplayName: (displayName: string) => boolean;
  updateProfilePicture: (imageUrl: string) => boolean;
  updateProfileBanner: (imageUrl: string) => boolean;
  updateBio: (bio: string) => void;
  addPartner: (partner: string) => void;
  removePartner: (partner: string) => void;
  addFavoriteGame: (game: string) => void;
  removeFavoriteGame: (game: string) => void;
  updateStatus: (status: 'online' | 'invisible' | 'dnd' | 'sleeping' | 'busy' | 'away') => void;
  canEditProfilePicture: () => boolean;
  getDaysUntilProfilePictureEdit: () => number;
  addWarning: (warning: Omit<Warning, 'id' | 'issuedAt'>) => void;
  isAccountLocked: () => boolean;
  arePostsLocked: () => boolean;
  getTimeUntilUnlock: () => number;
  getUserWithMostPosts: () => User | null;
  getUserWithMostFollowers: () => User | null;
  getLevelProgress: () => number;
  getRankIcon: (rank: Rank) => string;
  // Friend system
  sendFriendRequest: (userId: string) => void;
  acceptFriendRequest: (requestId: string) => void;
  rejectFriendRequest: (requestId: string) => void;
  removeFriend: (userId: string) => void;
  getPendingFriendRequests: () => FriendRequest[];
  getSentFriendRequests: () => FriendRequest[];
  // Blocking system
  blockUser: (userId: string) => void;
  unblockUser: (userId: string) => void;
  isUserBlocked: (userId: string) => boolean;
  // Messaging permissions
  canMessage: (targetUserId: string) => boolean;
  // Discord connection
  connectDiscord: (discordData: { id: string; username: string; discriminator: string; global_name: string | null; avatar: string | null }) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [posts, setPosts] = useState<Post[]>([]);
  const [passwords, setPasswords] = useState<Record<string, string>>({});
  const [friendRequests, setFriendRequests] = useState<FriendRequest[]>([]);

  // Load data from localStorage on mount
  useEffect(() => {
    try {
      console.log('📂 Loading data from localStorage...');
      
      const storedUsers = localStorage.getItem('forerunner_users');
      const storedPosts = localStorage.getItem('forerunner_posts');
      const storedPasswords = localStorage.getItem('forerunner_passwords');
      const storedCurrentUser = localStorage.getItem('forerunner_current_user');
      const storedFriendRequests = localStorage.getItem('forerunner_friend_requests');

      if (storedUsers) {
        try {
          const parsedUsers = JSON.parse(storedUsers);
          if (Array.isArray(parsedUsers)) {
            setUsers(parsedUsers);
            console.log('📂 Loaded users:', parsedUsers.length);
          } else {
            console.warn('⚠️ Invalid users data in localStorage, using empty array');
          }
        } catch (error) {
          console.error('❌ Error parsing users from localStorage:', error);
        }
      }
      
      if (storedPosts) {
        try {
          const parsedPosts = JSON.parse(storedPosts);
          if (Array.isArray(parsedPosts)) {
            setPosts(parsedPosts);
            console.log('📂 Loaded posts:', parsedPosts.length);
          } else {
            console.warn('⚠️ Invalid posts data in localStorage, using empty array');
          }
        } catch (error) {
          console.error('❌ Error parsing posts from localStorage:', error);
        }
      }
      
      if (storedPasswords) {
        try {
          const parsedPasswords = JSON.parse(storedPasswords);
          setPasswords(parsedPasswords);
        } catch (error) {
          console.error('❌ Error parsing passwords from localStorage:', error);
        }
      }
      
      if (storedCurrentUser) {
        try {
          const parsedUser = JSON.parse(storedCurrentUser);
          if (parsedUser && parsedUser.id) {
            setCurrentUser(parsedUser);
            console.log('📂 Loaded current user:', parsedUser.username);
            console.log('✅ USER IS LOGGED IN ON LOAD!');
          } else {
            console.warn('⚠️ Invalid current user in localStorage');
          }
        } catch (error) {
          console.error('❌ Error parsing current user from localStorage:', error);
        }
      } else {
        console.log('📂 No current user in localStorage - user is logged out');
      }
      
      if (storedFriendRequests) {
        try {
          const parsedRequests = JSON.parse(storedFriendRequests);
          if (Array.isArray(parsedRequests)) {
            setFriendRequests(parsedRequests);
          }
        } catch (error) {
          console.error('❌ Error parsing friend requests from localStorage:', error);
        }
      }
    } catch (error) {
      console.error('❌ Critical error loading from localStorage:', error);
      // Continue app initialization even if localStorage fails
    }
  }, []);

  // Save data to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('forerunner_users', JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    localStorage.setItem('forerunner_posts', JSON.stringify(posts));
  }, [posts]);

  useEffect(() => {
    localStorage.setItem('forerunner_passwords', JSON.stringify(passwords));
  }, [passwords]);

  useEffect(() => {
    try {
      if (currentUser) {
        console.log('💾 Saving current user to localStorage:', currentUser.username);
        localStorage.setItem('forerunner_current_user', JSON.stringify(currentUser));
        console.log('✅ Current user saved to localStorage!');
      } else {
        console.log('💾 Removing current user from localStorage');
        localStorage.removeItem('forerunner_current_user');
      }
    } catch (error) {
      console.error('❌ Error saving current user to localStorage:', error);
      // Show user-friendly error if quota exceeded
      if (error instanceof Error && error.name === 'QuotaExceededError') {
        console.error('❌ localStorage quota exceeded! Clear some data.');
      }
    }
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem('forerunner_friend_requests', JSON.stringify(friendRequests));
  }, [friendRequests]);

  const register = (username: string, email: string, password: string): boolean => {
    // Check if user already exists
    if (users.some(u => u.email === email || u.username === username)) {
      return false;
    }

    const newUser: User = {
      id: `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      username,
      email,
      createdAt: Date.now(),
      followers: [],
      following: [],
      friends: [],
      blockedUsers: [],
      settings: {
        darkMode: false,
        messagePermission: 'nobody',
      },
      displayNameEdited: false,
      warnings: [],
      level: 0,
      rank: 'Silver',
      lastActivityUpdate: Date.now(),
      followUnlockTimes: {},
    };

    setUsers([...users, newUser]);
    setPasswords({ ...passwords, [newUser.id]: password });
    setCurrentUser(newUser);
    return true;
  };

  const loginWithDiscord = (discordUser: any) => {
    try {
      console.log('🟢 loginWithDiscord called with:', discordUser);
      console.log('🟢 Current users in database:', users.length);
      
      // Validate Discord user data
      if (!discordUser || !discordUser.id || !discordUser.username) {
        console.error('❌ Invalid Discord user data:', discordUser);
        throw new Error('Invalid Discord user data');
      }
      
      // Check if user exists by Discord ID
      const existingUser = users.find(u => u.discordId === discordUser.id);
      
      if (existingUser) {
        console.log('🟢 Existing user found! Logging in user:', existingUser.username);
        // Update Discord data in case it changed
        const updatedUser = {
          ...existingUser,
          discordUsername: discordUser.username,
          discordDiscriminator: discordUser.discriminator || '0',
          discordAvatar: discordUser.avatar,
          // Update display name if not manually edited and global_name exists
          displayName: !existingUser.displayNameEdited && discordUser.global_name 
            ? discordUser.global_name 
            : existingUser.displayName,
        };
        setUsers(users.map(u => u.id === existingUser.id ? updatedUser : u));
        setCurrentUser(updatedUser);
        console.log('✅ User updated and logged in:', updatedUser.username);
      } else {
        console.log('🟢 No existing user found. Creating NEW account...');
        // Create new user account from Discord
        // Build Discord avatar URL if available
        const avatarUrl = discordUser.avatar 
          ? `https://cdn.discordapp.com/avatars/${discordUser.id}/${discordUser.avatar}.png?size=256`
          : undefined;
        
        const newUser: User = {
          id: `user_discord_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          username: discordUser.username,
          email: discordUser.email || `${discordUser.id}@discord.user`,
          createdAt: Date.now(),
          followers: [],
          following: [],
          friends: [],
          blockedUsers: [],
          settings: {
            darkMode: false,
            messagePermission: 'nobody',
          },
          discordId: discordUser.id,
          discordUsername: discordUser.username,
          discordDiscriminator: discordUser.discriminator || '0',
          discordAvatar: discordUser.avatar,
          displayName: discordUser.global_name || discordUser.username,
          profilePicture: avatarUrl,
          displayNameEdited: false,
          warnings: [],
          level: 0,
          rank: 'Silver',
          lastActivityUpdate: Date.now(),
          followUnlockTimes: {},
        };
        
        console.log('🟢 New user created:', {
          id: newUser.id,
          username: newUser.username,
          displayName: newUser.displayName,
          profilePicture: newUser.profilePicture,
          discordId: newUser.discordId
        });
        
        const updatedUsers = [...users, newUser];
        const updatedPasswords = { ...passwords, [newUser.id]: 'oauth_discord' };
        
        setUsers(updatedUsers);
        setPasswords(updatedPasswords);
        setCurrentUser(newUser);
        
        console.log('✅ NEW USER ACCOUNT CREATED AND LOGGED IN!');
        console.log('✅ Total users now:', updatedUsers.length);
        console.log('✅ Current user set to:', newUser.username);
      }
    } catch (error) {
      console.error('❌ Error in loginWithDiscord:', error);
      throw error;
    }
  };

  const registerOAuth = (username: string, email: string, provider: 'google' | 'twitter' | 'discord'): boolean => {
    // Check if user already exists
    if (users.some(u => u.email === email)) {
      // If user exists with OAuth, log them in
      const existingUser = users.find(u => u.email === email);
      if (existingUser) {
        setCurrentUser(existingUser);
        return true;
      }
      return false;
    }

    const newUser: User = {
      id: `user_${provider}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      username,
      email,
      createdAt: Date.now(),
      followers: [],
      following: [],
      friends: [],
      blockedUsers: [],
      settings: {
        darkMode: false,
        messagePermission: 'nobody',
      },
      displayNameEdited: false,
      warnings: [],
      level: 0,
      rank: 'Silver',
      lastActivityUpdate: Date.now(),
      followUnlockTimes: {},
    };

    setUsers([...users, newUser]);
    // OAuth users don't need passwords
    setPasswords({ ...passwords, [newUser.id]: `oauth_${provider}` });
    setCurrentUser(newUser);
    return true;
  };

  const login = (email: string, password: string): boolean => {
    const user = users.find(u => u.email === email);
    if (!user || passwords[user.id] !== password) {
      return false;
    }
    // Ensure user has settings object (for backwards compatibility)
    if (!user.settings) {
      const updatedUser = { ...user, settings: { darkMode: false } };
      setUsers(users.map(u => u.id === user.id ? updatedUser : u));
      setCurrentUser(updatedUser);
    } else {
      setCurrentUser(user);
    }
    return true;
  };

  const logout = () => {
    setCurrentUser(null);
  };

  const createPost = (post: Omit<Post, 'id' | 'userId' | 'createdAt'>) => {
    if (!currentUser) return;

    const newPost: Post = {
      ...post,
      id: `post_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      userId: currentUser.id,
      createdAt: Date.now(),
    };

    setPosts([newPost, ...posts]);
  };

  const updatePost = (postId: string, updates: Partial<Post>) => {
    setPosts(posts.map(post => 
      post.id === postId ? { ...post, ...updates } : post
    ));
  };

  const deletePost = (postId: string) => {
    setPosts(posts.filter(post => post.id !== postId));
  };

  const getUserPosts = (userId: string): Post[] => {
    return posts.filter(post => post.userId === userId);
  };

  const getPublicPosts = (): Post[] => {
    return posts.filter(post => {
      if (post.privacy === 'public') return true;
      if (post.privacy === 'followers' && currentUser) {
        const postOwner = users.find(u => u.id === post.userId);
        return postOwner?.followers.includes(currentUser.id);
      }
      return false;
    });
  };

  const followUser = (userId: string) => {
    if (!currentUser || currentUser.id === userId) return;

    // Set unlock time for followers-only posts (24 hours from now)
    const unlockTime = Date.now() + (24 * 60 * 60 * 1000);
    
    // Add userId to current user's following
    const updatedCurrentUser = {
      ...currentUser,
      following: [...currentUser.following, userId],
      followUnlockTimes: {
        ...currentUser.followUnlockTimes,
        [userId]: unlockTime,
      },
    };
    
    setCurrentUser(updatedCurrentUser);

    // Add current user to target user's followers
    setUsers(users.map(user =>
      user.id === userId
        ? { ...user, followers: [...user.followers, currentUser.id] }
        : user.id === currentUser.id
        ? updatedCurrentUser
        : user
    ));
  };

  const unfollowUser = (userId: string) => {
    if (!currentUser) return;

    setCurrentUser({
      ...currentUser,
      following: currentUser.following.filter(id => id !== userId),
    });

    setUsers(users.map(user =>
      user.id === userId
        ? { ...user, followers: user.followers.filter(id => id !== currentUser.id) }
        : user.id === currentUser.id
        ? { ...user, following: user.following.filter(id => id !== userId) }
        : user
    ));
  };

  const updateUserSettings = (settings: Partial<UserSettings>) => {
    if (!currentUser) return;

    const updatedUser = {
      ...currentUser,
      settings: { ...currentUser.settings, ...settings },
    };

    setCurrentUser(updatedUser);
    setUsers(users.map(user =>
      user.id === currentUser.id ? updatedUser : user
    ));
  };

  const isAccountLocked = (): boolean => {
    // Account lock is NO LONGER USED - everything is unlocked except posts
    return false;
  };

  const arePostsLocked = (): boolean => {
    if (!currentUser) return true;
    const hoursSinceCreation = (Date.now() - currentUser.createdAt) / (1000 * 60 * 60);
    return hoursSinceCreation < 24;
  };

  const getTimeUntilUnlock = (): number => {
    if (!currentUser) return 24;
    const hoursSinceCreation = (Date.now() - currentUser.createdAt) / (1000 * 60 * 60);
    return Math.max(0, 24 - hoursSinceCreation);
  };

  const updateDisplayName = (displayName: string): boolean => {
    if (!currentUser) return false;
    if (currentUser.displayNameEdited) return false; // Already edited once
    
    const updatedUser = {
      ...currentUser,
      displayName,
      displayNameEdited: true,
    };
    
    setCurrentUser(updatedUser);
    setUsers(users.map(user => user.id === currentUser.id ? updatedUser : user));
    return true;
  };

  const updateProfilePicture = (imageUrl: string): boolean => {
    if (!currentUser) return false;
    
    const now = Date.now();
    const thirtyDaysInMs = 30 * 24 * 60 * 60 * 1000;
    
    // Check if user can edit
    if (currentUser.lastProfilePictureEdit && 
        now - currentUser.lastProfilePictureEdit < thirtyDaysInMs) {
      return false;
    }
    
    const updatedUser = {
      ...currentUser,
      profilePicture: imageUrl,
      lastProfilePictureEdit: now,
    };
    
    setCurrentUser(updatedUser);
    setUsers(users.map(user => user.id === currentUser.id ? updatedUser : user));
    return true;
  };

  const updateProfileBanner = (imageUrl: string): boolean => {
    if (!currentUser) return false;
    
    const updatedUser = {
      ...currentUser,
      profileBanner: imageUrl,
    };
    
    setCurrentUser(updatedUser);
    setUsers(users.map(user => user.id === currentUser.id ? updatedUser : user));
    return true;
  };

  const updateBio = (bio: string) => {
    if (!currentUser) return;
    
    const updatedUser = {
      ...currentUser,
      bio,
    };
    
    setCurrentUser(updatedUser);
    setUsers(users.map(user => user.id === currentUser.id ? updatedUser : user));
  };

  const addPartner = (partner: string) => {
    if (!currentUser) return;
    
    const partners = currentUser.partners || [];
    if (partners.includes(partner)) return;
    
    const updatedUser = {
      ...currentUser,
      partners: [...partners, partner],
    };
    
    setCurrentUser(updatedUser);
    setUsers(users.map(user => user.id === currentUser.id ? updatedUser : user));
  };

  const removePartner = (partner: string) => {
    if (!currentUser) return;
    
    const partners = currentUser.partners || [];
    const updatedUser = {
      ...currentUser,
      partners: partners.filter(p => p !== partner),
    };
    
    setCurrentUser(updatedUser);
    setUsers(users.map(user => user.id === currentUser.id ? updatedUser : user));
  };

  const addFavoriteGame = (game: string) => {
    if (!currentUser) return;
    
    const favoriteGames = currentUser.favoriteGames || [];
    if (favoriteGames.includes(game)) return;
    
    const updatedUser = {
      ...currentUser,
      favoriteGames: [...favoriteGames, game],
    };
    
    setCurrentUser(updatedUser);
    setUsers(users.map(user => user.id === currentUser.id ? updatedUser : user));
  };

  const removeFavoriteGame = (game: string) => {
    if (!currentUser) return;
    
    const favoriteGames = currentUser.favoriteGames || [];
    const updatedUser = {
      ...currentUser,
      favoriteGames: favoriteGames.filter(g => g !== game),
    };
    
    setCurrentUser(updatedUser);
    setUsers(users.map(user => user.id === currentUser.id ? updatedUser : user));
  };

  const updateStatus = (status: 'online' | 'invisible' | 'dnd' | 'sleeping' | 'busy' | 'away') => {
    if (!currentUser) return;
    
    const updatedUser = {
      ...currentUser,
      status,
    };
    
    setCurrentUser(updatedUser);
    setUsers(users.map(user => user.id === currentUser.id ? updatedUser : user));
  };

  const canEditProfilePicture = (): boolean => {
    if (!currentUser) return false;
    if (!currentUser.lastProfilePictureEdit) return true;
    
    const now = Date.now();
    const thirtyDaysInMs = 30 * 24 * 60 * 60 * 1000;
    return now - currentUser.lastProfilePictureEdit >= thirtyDaysInMs;
  };

  const getDaysUntilProfilePictureEdit = (): number => {
    if (!currentUser || !currentUser.lastProfilePictureEdit) return 0;
    
    const now = Date.now();
    const thirtyDaysInMs = 30 * 24 * 60 * 60 * 1000;
    const timeSinceLastEdit = now - currentUser.lastProfilePictureEdit;
    const timeRemaining = thirtyDaysInMs - timeSinceLastEdit;
    
    if (timeRemaining <= 0) return 0;
    return Math.ceil(timeRemaining / (24 * 60 * 60 * 1000));
  };

  const addWarning = (warning: Omit<Warning, 'id' | 'issuedAt'>) => {
    if (!currentUser) return;
    
    const newWarning: Warning = {
      ...warning,
      id: `warn_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      issuedAt: Date.now(),
    };
    
    const updatedUser = {
      ...currentUser,
      warnings: [newWarning, ...currentUser.warnings],
    };
    
    setCurrentUser(updatedUser);
    setUsers(users.map(user => user.id === currentUser.id ? updatedUser : user));
  };

  const getUserWithMostPosts = (): User | null => {
    if (users.length === 0) return null;
    
    const userPostCounts = users.map(user => ({
      user,
      postCount: posts.filter(post => post.userId === user.id).length,
    }));
    
    const maxPosts = Math.max(...userPostCounts.map(u => u.postCount));
    if (maxPosts === 0) return null;
    
    const topUser = userPostCounts.find(u => u.postCount === maxPosts);
    return topUser ? topUser.user : null;
  };

  const getUserWithMostFollowers = (): User | null => {
    if (users.length === 0) return null;
    
    const maxFollowers = Math.max(...users.map(u => u.followers.length));
    if (maxFollowers === 0) return null;
    
    return users.find(u => u.followers.length === maxFollowers) || null;
  };

  // Ranking system functions
  const calculateRank = (level: number): Rank => {
    if (level >= 7000) return 'Elite';
    if (level >= 5000) return 'Diamond';
    if (level >= 3000) return 'Platinum';
    if (level >= 1000) return 'Gold';
    return 'Silver';
  };

  const updateUserLevel = () => {
    if (!currentUser) return;
    
    const now = Date.now();
    const lastUpdate = currentUser.lastActivityUpdate || currentUser.createdAt;
    const daysPassed = Math.floor((now - lastUpdate) / (24 * 60 * 60 * 1000));
    
    if (daysPassed > 0) {
      // 0.05% per day = 0.0005 of 7000 = 3.5 points per day
      const pointsPerDay = 3.5;
      const newLevel = Math.min(currentUser.level + (daysPassed * pointsPerDay), 7000);
      const newRank = calculateRank(newLevel);
      
      const updatedUser = {
        ...currentUser,
        level: newLevel,
        rank: newRank,
        lastActivityUpdate: now,
      };
      
      setCurrentUser(updatedUser);
      setUsers(users.map(u => u.id === currentUser.id ? updatedUser : u));
    }
  };

  const getLevelProgress = (): number => {
    if (!currentUser) return 0;
    return (currentUser.level / 7000) * 100;
  };

  const getRankIcon = (rank: Rank): string => {
    switch (rank) {
      case 'Elite': return '💀';
      case 'Diamond': return '💎';
      case 'Platinum': return '⚡';
      case 'Gold': return '👑';
      case 'Silver': return '⭐';
    }
  };

  // Post locking and viewing permissions
  const canViewPost = (post: Post): boolean => {
    if (!currentUser) return false;
    
    // Account must be 24 hours old to see ANY posts
    if (arePostsLocked()) return false;
    
    // Owner can always see their own posts
    if (post.userId === currentUser.id) return true;
    
    // Public posts are visible after 24-hour post lock
    if (post.privacy === 'public') return true;
    
    // Followers-only posts
    if (post.privacy === 'followers') {
      const postOwner = users.find(u => u.id === post.userId);
      if (!postOwner) return false;
      
      // Check if current user follows the post owner
      const isFollowing = postOwner.followers.includes(currentUser.id);
      if (!isFollowing) return false;
      
      // Check if 24 hours have passed since following
      const unlockTime = currentUser.followUnlockTimes?.[post.userId];
      if (!unlockTime) {
        // Just followed, set unlock time
        const newUnlockTime = Date.now() + (24 * 60 * 60 * 1000);
        const updatedUser = {
          ...currentUser,
          followUnlockTimes: {
            ...currentUser.followUnlockTimes,
            [post.userId]: newUnlockTime,
          },
        };
        setCurrentUser(updatedUser);
        setUsers(users.map(u => u.id === currentUser.id ? updatedUser : u));
        return false;
      }
      
      // Check if unlock time has passed
      return Date.now() >= unlockTime;
    }
    
    // Private posts - only visible to owner (already handled above)
    return false;
  };

  // Friend system
  const sendFriendRequest = (userId: string) => {
    if (!currentUser || currentUser.id === userId) return;
    
    // Check if already friends or request exists
    if (currentUser.friends?.includes(userId)) return;
    const existingRequest = friendRequests.find(
      req => req.fromUserId === currentUser.id && req.toUserId === userId && req.status === 'pending'
    );
    if (existingRequest) return;
    
    const newRequest: FriendRequest = {
      id: `freq_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      fromUserId: currentUser.id,
      toUserId: userId,
      createdAt: Date.now(),
      status: 'pending',
    };
    
    setFriendRequests([...friendRequests, newRequest]);
  };

  const acceptFriendRequest = (requestId: string) => {
    if (!currentUser) return;
    
    const request = friendRequests.find(req => req.id === requestId);
    if (!request || request.toUserId !== currentUser.id) return;
    
    // Update request status
    setFriendRequests(friendRequests.map(req =>
      req.id === requestId ? { ...req, status: 'accepted' as const } : req
    ));
    
    // Add to both users' friends lists
    const updatedCurrentUser = {
      ...currentUser,
      friends: [...(currentUser.friends || []), request.fromUserId],
    };
    
    setCurrentUser(updatedCurrentUser);
    setUsers(users.map(user => {
      if (user.id === currentUser.id) {
        return updatedCurrentUser;
      }
      if (user.id === request.fromUserId) {
        return { ...user, friends: [...(user.friends || []), currentUser.id] };
      }
      return user;
    }));
  };

  const rejectFriendRequest = (requestId: string) => {
    if (!currentUser) return;
    
    const request = friendRequests.find(req => req.id === requestId);
    if (!request || request.toUserId !== currentUser.id) return;
    
    setFriendRequests(friendRequests.map(req =>
      req.id === requestId ? { ...req, status: 'rejected' as const } : req
    ));
  };

  const removeFriend = (userId: string) => {
    if (!currentUser) return;
    
    const updatedCurrentUser = {
      ...currentUser,
      friends: (currentUser.friends || []).filter(id => id !== userId),
    };
    
    setCurrentUser(updatedCurrentUser);
    setUsers(users.map(user => {
      if (user.id === currentUser.id) {
        return updatedCurrentUser;
      }
      if (user.id === userId) {
        return { ...user, friends: (user.friends || []).filter(id => id !== currentUser.id) };
      }
      return user;
    }));
  };

  const getPendingFriendRequests = (): FriendRequest[] => {
    if (!currentUser) return [];
    return friendRequests.filter(
      req => req.toUserId === currentUser.id && req.status === 'pending'
    );
  };

  const getSentFriendRequests = (): FriendRequest[] => {
    if (!currentUser) return [];
    return friendRequests.filter(
      req => req.fromUserId === currentUser.id && req.status === 'pending'
    );
  };

  // Blocking system
  const blockUser = (userId: string) => {
    if (!currentUser || currentUser.id === userId) return;
    
    const blockedUsers = currentUser.blockedUsers || [];
    if (blockedUsers.includes(userId)) return;
    
    const updatedUser = {
      ...currentUser,
      blockedUsers: [...blockedUsers, userId],
      friends: (currentUser.friends || []).filter(id => id !== userId),
      followers: currentUser.followers.filter(id => id !== userId),
      following: currentUser.following.filter(id => id !== userId),
    };
    
    setCurrentUser(updatedUser);
    setUsers(users.map(user => {
      if (user.id === currentUser.id) {
        return updatedUser;
      }
      if (user.id === userId) {
        // Remove current user from blocked user's lists
        return {
          ...user,
          friends: (user.friends || []).filter(id => id !== currentUser.id),
          followers: user.followers.filter(id => id !== currentUser.id),
          following: user.following.filter(id => id !== currentUser.id),
        };
      }
      return user;
    }));
    
    // Remove any friend requests between them
    setFriendRequests(friendRequests.filter(req =>
      !((req.fromUserId === currentUser.id && req.toUserId === userId) ||
        (req.fromUserId === userId && req.toUserId === currentUser.id))
    ));
  };

  const unblockUser = (userId: string) => {
    if (!currentUser) return;
    
    const updatedUser = {
      ...currentUser,
      blockedUsers: (currentUser.blockedUsers || []).filter(id => id !== userId),
    };
    
    setCurrentUser(updatedUser);
    setUsers(users.map(user =>
      user.id === currentUser.id ? updatedUser : user
    ));
  };

  const isUserBlocked = (userId: string): boolean => {
    if (!currentUser) return false;
    return (currentUser.blockedUsers || []).includes(userId);
  };

  // Messaging permissions
  const canMessage = (targetUserId: string): boolean => {
    if (!currentUser) return false;
    
    const targetUser = users.find(u => u.id === targetUserId);
    if (!targetUser) return false;
    
    // Check if either user has blocked the other
    if (isUserBlocked(targetUserId)) return false;
    if (targetUser.blockedUsers?.includes(currentUser.id)) return false;
    
    const permission = targetUser.settings.messagePermission || 'nobody';
    
    switch (permission) {
      case 'everyone':
        return true;
      case 'friends':
        return (targetUser.friends || []).includes(currentUser.id);
      case 'followers':
        return targetUser.followers.includes(currentUser.id);
      case 'nobody':
      default:
        return false;
    }
  };

  // Connect Discord account
  const connectDiscord = (discordData: { id: string; username: string; discriminator: string; global_name: string | null; avatar: string | null }) => {
    if (!currentUser) return;
    
    const updatedUser: User = {
      ...currentUser,
      discordId: discordData.id,
      discordUsername: discordData.username,
      discordDiscriminator: discordData.discriminator,
      discordAvatar: discordData.avatar || undefined,
      // Update display name with Discord's global_name if available and not already edited
      displayName: !currentUser.displayNameEdited && discordData.global_name 
        ? discordData.global_name 
        : currentUser.displayName,
      // Update username if not edited yet
      username: !currentUser.displayNameEdited && discordData.username
        ? discordData.username
        : currentUser.username,
    };
    
    setCurrentUser(updatedUser);
    setUsers(users.map(user =>
      user.id === currentUser.id ? updatedUser : user
    ));
  };

  // Update level on mount and periodically
  useEffect(() => {
    updateUserLevel();
    const interval = setInterval(updateUserLevel, 60000); // Check every minute
    return () => clearInterval(interval);
  }, [currentUser?.id]);

  return (
    <UserContext.Provider value={{
      currentUser,
      users,
      posts,
      friendRequests,
      login,
      register,
      registerOAuth,
      loginWithDiscord,
      logout,
      createPost,
      updatePost,
      deletePost,
      getUserPosts,
      getPublicPosts,
      canViewPost,
      followUser,
      unfollowUser,
      updateUserSettings,
      updateDisplayName,
      updateProfilePicture,
      updateProfileBanner,
      updateBio,
      addPartner,
      removePartner,
      addFavoriteGame,
      removeFavoriteGame,
      updateStatus,
      canEditProfilePicture,
      getDaysUntilProfilePictureEdit,
      addWarning,
      isAccountLocked,
      arePostsLocked,
      getTimeUntilUnlock,
      getUserWithMostPosts,
      getUserWithMostFollowers,
      getLevelProgress,
      getRankIcon,
      sendFriendRequest,
      acceptFriendRequest,
      rejectFriendRequest,
      removeFriend,
      getPendingFriendRequests,
      getSentFriendRequests,
      blockUser,
      unblockUser,
      isUserBlocked,
      canMessage,
      connectDiscord,
    }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}
