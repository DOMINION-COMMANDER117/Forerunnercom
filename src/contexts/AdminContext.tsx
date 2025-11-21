import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface Post {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  createdAt: number;
  likes: number;
}

export interface Drive {
  id: 'kayo' | 'dogs' | 'evecita';
  owner: string;
  title: string;
  description: string;
  bio: string;
  link: string;
  images: string[]; // Base64 encoded images - slideshow
  comparisonImageBefore?: string; // Before image for comparison slider
  comparisonImageAfter?: string; // After image for comparison slider
  lastUpdated: number;
  isPublished: boolean;
  nextUpdate?: string; // ISO date string
  theme: 'kayo' | 'dogs' | 'evecita'; // Theme identifier
  whatsNewBullets?: string[]; // Editable bullet points for "What's New"
}

interface AdminContextType {
  isAdmin: boolean;
  posts: Post[];
  drives: Drive[];
  loginAdmin: (password: string) => boolean;
  logoutAdmin: () => void;
  addPost: (post: Omit<Post, 'id' | 'createdAt' | 'likes'>) => void;
  deletePost: (id: string) => void;
  updateDrive: (driveId: 'kayo' | 'dogs' | 'evecita', drive: Omit<Drive, 'id' | 'lastUpdated'>) => void;
  getDrive: (driveId: 'kayo' | 'dogs' | 'evecita') => Drive | undefined;
  likePost: (id: string) => void;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

const ADMIN_PASSWORD = 'July092006!!';
const STORAGE_KEYS = {
  ADMIN: 'forerunner_admin',
  POSTS: 'forerunner_posts',
  DRIVES: 'forerunner_drives',
};

// Default drive configurations
const DEFAULT_DRIVES: Drive[] = [
  {
    id: 'kayo',
    owner: 'KAYO',
    title: "KAYO'S DRIVE",
    description: '',
    bio: '',
    link: 'https://drive.google.com/drive/folders/1M-yIWJWvQMdV9vu6N6DM48HUyyiNR8zL?usp=sharing',
    images: [],
    lastUpdated: Date.now(),
    isPublished: true,
    theme: 'kayo',
    whatsNewBullets: [],
  },
  {
    id: 'dogs',
    owner: 'DOGS',
    title: "DOGS DRIVE",
    description: '',
    bio: '',
    link: 'https://drive.google.com/drive/folders/1UCMV5W71d2WI3lVTLwfCFiJuf2sAgXPD',
    images: [],
    lastUpdated: Date.now(),
    isPublished: true,
    theme: 'dogs',
    whatsNewBullets: [],
  },
  {
    id: 'evecita',
    owner: 'EVECITA',
    title: "EVECITA'S DRIVE",
    description: '',
    bio: '',
    link: 'https://drive.google.com/drive/folders/1ox5pF8iGZRM6CJ-m2P4UNqD33EKFjmSU',
    images: [],
    lastUpdated: Date.now(),
    isPublished: true,
    theme: 'evecita',
    whatsNewBullets: [],
  },
];

export function AdminProvider({ children }: { children: ReactNode }) {
  const [isAdmin, setIsAdmin] = useState(false);
  const [posts, setPosts] = useState<Post[]>([]);
  const [drives, setDrives] = useState<Drive[]>(DEFAULT_DRIVES);

  // Load from localStorage
  useEffect(() => {
    try {
      const adminStatus = localStorage.getItem(STORAGE_KEYS.ADMIN);
      const storedPosts = localStorage.getItem(STORAGE_KEYS.POSTS);
      const storedDrives = localStorage.getItem(STORAGE_KEYS.DRIVES);

      if (adminStatus === 'true') setIsAdmin(true);
      if (storedPosts) setPosts(JSON.parse(storedPosts));
      if (storedDrives) {
        const parsedDrives = JSON.parse(storedDrives);
        // Ensure all three drives exist and merge with defaults to get updated links
        const hasAllDrives = ['kayo', 'dogs', 'evecita'].every(id => 
          parsedDrives.some((d: Drive) => d.id === id)
        );
        if (hasAllDrives) {
          // Merge stored drives with defaults to ensure links are updated
          const mergedDrives = parsedDrives.map((storedDrive: Drive) => {
            const defaultDrive = DEFAULT_DRIVES.find(d => d.id === storedDrive.id);
            return {
              ...storedDrive,
              // Update link from default if stored link is empty
              link: storedDrive.link || (defaultDrive?.link || ''),
            };
          });
          setDrives(mergedDrives);
        } else {
          console.log('Missing drives, resetting to defaults');
          setDrives(DEFAULT_DRIVES);
        }
      }
    } catch (error) {
      console.error('Error loading admin data:', error);
    }
  }, []);

  // Save admin status
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.ADMIN, isAdmin.toString());
  }, [isAdmin]);

  // Save posts
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.POSTS, JSON.stringify(posts));
  }, [posts]);

  // Save drives
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.DRIVES, JSON.stringify(drives));
  }, [drives]);

  const loginAdmin = (password: string): boolean => {
    if (password === ADMIN_PASSWORD) {
      setIsAdmin(true);
      console.log('✅ Admin logged in successfully');
      return true;
    } else {
      console.log('❌ Wrong password');
      return false;
    }
  };

  const logoutAdmin = () => {
    setIsAdmin(false);
    console.log('👋 Admin logged out');
  };

  const addPost = (postData: Omit<Post, 'id' | 'createdAt' | 'likes'>) => {
    if (!isAdmin) return;

    const newPost: Post = {
      ...postData,
      id: `post_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      createdAt: Date.now(),
      likes: 0,
    };

    setPosts([newPost, ...posts]);
    console.log('✅ Post added:', newPost.title);
  };

  const deletePost = (id: string) => {
    if (!isAdmin) return;
    setPosts(posts.filter(p => p.id !== id));
    console.log('🗑️ Post deleted:', id);
  };

  const updateDrive = (driveId: 'kayo' | 'dogs' | 'evecita', driveData: Omit<Drive, 'id' | 'lastUpdated'>) => {
    if (!isAdmin) return;
    
    setDrives(drives.map(d => 
      d.id === driveId 
        ? { 
            ...driveData, 
            id: driveId,
            lastUpdated: Date.now() 
          } 
        : d
    ));
    
    console.log(`✅ ${driveId.toUpperCase()} drive updated`);
  };

  const getDrive = (driveId: 'kayo' | 'dogs' | 'evecita') => {
    return drives.find(d => d.id === driveId);
  };

  const likePost = (id: string) => {
    setPosts(posts.map(p => 
      p.id === id ? { ...p, likes: p.likes + 1 } : p
    ));
  };

  return (
    <AdminContext.Provider
      value={{
        isAdmin,
        posts,
        drives,
        loginAdmin,
        logoutAdmin,
        addPost,
        deletePost,
        updateDrive,
        getDrive,
        likePost,
      }}
    >
      {children}
    </AdminContext.Provider>
  );
}

export function useAdmin() {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error('useAdmin must be used within AdminProvider');
  }
  return context;
}
