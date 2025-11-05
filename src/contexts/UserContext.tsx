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
  createdAt: number;
}

export interface UserSettings {
  homePageColor?: string;
  homePageBackground?: string;
  darkMode: boolean;
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

export interface User {
  id: string;
  username: string;
  email: string;
  createdAt: number;
  followers: string[];
  following: string[];
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
  lastProfilePictureEdit?: number;
  // Moderation
  warnings: Warning[];
}

interface UserContextType {
  currentUser: User | null;
  users: User[];
  posts: Post[];
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
  followUser: (userId: string) => void;
  unfollowUser: (userId: string) => void;
  updateUserSettings: (settings: Partial<UserSettings>) => void;
  updateDisplayName: (displayName: string) => boolean;
  updateProfilePicture: (imageUrl: string) => boolean;
  canEditProfilePicture: () => boolean;
  getDaysUntilProfilePictureEdit: () => number;
  addWarning: (warning: Omit<Warning, 'id' | 'issuedAt'>) => void;
  isAccountLocked: () => boolean;
  getTimeUntilUnlock: () => number;
  getUserWithMostPosts: () => User | null;
  getUserWithMostFollowers: () => User | null;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [posts, setPosts] = useState<Post[]>([]);
  const [passwords, setPasswords] = useState<Record<string, string>>({});

  // Load data from localStorage on mount
  useEffect(() => {
    const storedUsers = localStorage.getItem('forerunner_users');
    const storedPosts = localStorage.getItem('forerunner_posts');
    const storedPasswords = localStorage.getItem('forerunner_passwords');
    const storedCurrentUser = localStorage.getItem('forerunner_current_user');

    if (storedUsers) setUsers(JSON.parse(storedUsers));
    if (storedPosts) setPosts(JSON.parse(storedPosts));
    if (storedPasswords) setPasswords(JSON.parse(storedPasswords));
    if (storedCurrentUser) setCurrentUser(JSON.parse(storedCurrentUser));
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
    if (currentUser) {
      localStorage.setItem('forerunner_current_user', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('forerunner_current_user');
    }
  }, [currentUser]);

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
      settings: {
        darkMode: false,
      },
      displayNameEdited: false,
      warnings: [],
    };

    setUsers([...users, newUser]);
    setPasswords({ ...passwords, [newUser.id]: password });
    setCurrentUser(newUser);
    return true;
  };

  const loginWithDiscord = (discordUser: any) => {
    // Check if user exists by Discord ID
    const existingUser = users.find(u => u.discordId === discordUser.id);
    
    if (existingUser) {
      // Update Discord data in case it changed
      const updatedUser = {
        ...existingUser,
        discordUsername: discordUser.username,
        discordDiscriminator: discordUser.discriminator,
        discordAvatar: discordUser.avatar,
      };
      setUsers(users.map(u => u.id === existingUser.id ? updatedUser : u));
      setCurrentUser(updatedUser);
    } else {
      // Create new user
      const newUser: User = {
        id: `user_discord_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        username: discordUser.username,
        email: discordUser.email || `${discordUser.id}@discord.user`,
        createdAt: Date.now(),
        followers: [],
        following: [],
        settings: {
          darkMode: false,
        },
        discordId: discordUser.id,
        discordUsername: discordUser.username,
        discordDiscriminator: discordUser.discriminator,
        discordAvatar: discordUser.avatar,
        displayNameEdited: false,
        warnings: [],
      };
      
      setUsers([...users, newUser]);
      setPasswords({ ...passwords, [newUser.id]: 'oauth_discord' });
      setCurrentUser(newUser);
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
      settings: {
        darkMode: false,
      },
      displayNameEdited: false,
      warnings: [],
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

    // Add userId to current user's following
    setCurrentUser({
      ...currentUser,
      following: [...currentUser.following, userId],
    });

    // Add current user to target user's followers
    setUsers(users.map(user =>
      user.id === userId
        ? { ...user, followers: [...user.followers, currentUser.id] }
        : user.id === currentUser.id
        ? { ...user, following: [...user.following, userId] }
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

  return (
    <UserContext.Provider value={{
      currentUser,
      users,
      posts,
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
      followUser,
      unfollowUser,
      updateUserSettings,
      updateDisplayName,
      updateProfilePicture,
      canEditProfilePicture,
      getDaysUntilProfilePictureEdit,
      addWarning,
      isAccountLocked,
      getTimeUntilUnlock,
      getUserWithMostPosts,
      getUserWithMostFollowers,
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
