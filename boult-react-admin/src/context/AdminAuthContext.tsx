import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface AdminUser {
  id: string;
  username: string;
  email: string;
  role: 'admin' | 'super_admin';
  name: string;
  lastLogin?: string;
  createdAt: string;
}

interface AdminAuthContextType {
  user: AdminUser | null;
  login: (username: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  isLoading: boolean;
  isAuthenticated: boolean;
}

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined);

export const useAdminAuth = () => {
  const context = useContext(AdminAuthContext);
  if (context === undefined) {
    throw new Error('useAdminAuth must be used within an AdminAuthProvider');
  }
  return context;
};

interface AdminAuthProviderProps {
  children: ReactNode;
}

// Default admin credentials (in production, this should be in backend)
const DEFAULT_ADMIN_USERS = [
  {
    id: 'ADMIN_001',
    username: 'admin',
    email: 'admin@boultindia.com',
    password: 'admin123',
    role: 'super_admin' as const,
    name: 'Boult Admin',
    createdAt: '2026-01-30T00:00:00.000Z'
  },
  {
    id: 'ADMIN_002',
    username: 'boultadmin',
    email: 'support@boultindia.com',
    password: 'boult2026',
    role: 'admin' as const,
    name: 'Boult Support',
    createdAt: '2026-01-30T00:00:00.000Z'
  }
];

export const AdminAuthProvider: React.FC<AdminAuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<AdminUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const backendUrl = process.env.REACT_APP_BACKEND_URL || 'http://localhost:5000';
  
  // Session timeout: 30 minutes
  const SESSION_TIMEOUT = 30 * 60 * 1000; // 30 minutes in milliseconds
  
  // Generate unique session ID for this tab/window
  const [sessionId] = useState(() => `session_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`);

  // Initialize auth state from localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem('adminAuthUser');
    const loginTime = localStorage.getItem('adminLoginTime');
    const storedSessionId = localStorage.getItem('adminSessionId');

    if (storedUser && loginTime) {
      try {
        const parsedUser = JSON.parse(storedUser);
        const loginTimestamp = parseInt(loginTime);
        const currentTime = Date.now();
        
        // Check if session has expired
        if (currentTime - loginTimestamp > SESSION_TIMEOUT) {
          console.log('Admin session expired');
          localStorage.removeItem('adminAuthUser');
          localStorage.removeItem('adminLoginTime');
          localStorage.removeItem('adminSessionId');
          setUser(null);
        } 
        // Check if this is the active session
        else if (storedSessionId && storedSessionId !== sessionId) {
          console.log('Different session detected - another tab is logged in');
          // Don't set user, force login
          setUser(null);
        } 
        else {
          setUser(parsedUser);
          // Update session ID to current tab
          localStorage.setItem('adminSessionId', sessionId);
        }
      } catch (error) {
        console.error('Error parsing stored admin user data:', error);
        localStorage.removeItem('adminAuthUser');
        localStorage.removeItem('adminLoginTime');
        localStorage.removeItem('adminSessionId');
      }
    }
    setIsLoading(false);
  }, []);
  
  // Auto-logout on session timeout
  useEffect(() => {
    if (!user) return;
    
    const checkSession = setInterval(() => {
      const loginTime = localStorage.getItem('adminLoginTime');
      if (loginTime) {
        const loginTimestamp = parseInt(loginTime);
        const currentTime = Date.now();
        
        if (currentTime - loginTimestamp > SESSION_TIMEOUT) {
          console.log('Auto-logout: Session expired');
          logout();
        }
      }
    }, 60000); // Check every minute
    
    return () => clearInterval(checkSession);
  }, [user]);
  
  // Logout on window/tab close
  useEffect(() => {
    const handleBeforeUnload = () => {
      if (user) {
        // Clear session data when window closes
        localStorage.removeItem('adminAuthUser');
        localStorage.removeItem('adminLoginTime');
        localStorage.removeItem('adminSessionId');
      }
    };
    
    window.addEventListener('beforeunload', handleBeforeUnload);
    
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [user]);
  
  // Single session enforcement - only one tab/window can be logged in
  useEffect(() => {
    if (!user) return;
    
    const handleStorageChange = (e: StorageEvent) => {
      // If session ID changed in another tab, logout this tab
      if (e.key === 'adminSessionId' && e.newValue !== sessionId) {
        console.log('Another session detected, logging out this tab');
        setUser(null);
      }
      
      // If user was logged out in another tab, logout here too
      if (e.key === 'adminAuthUser' && !e.newValue) {
        console.log('Logged out in another tab');
        setUser(null);
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [user, sessionId]);

  const login = async (username: string, password: string): Promise<{ success: boolean; error?: string }> => {
    try {
      setIsLoading(true);
      
      // Basic validation
      if (!username || !password) {
        return { success: false, error: 'Username and password are required' };
      }
      
      // Check if another session is already active
      const existingSessionId = localStorage.getItem('adminSessionId');
      if (existingSessionId && existingSessionId !== sessionId) {
        return { 
          success: false, 
          error: 'Admin is already logged in another tab/window. Please logout from there first.' 
        };
      }
      
      // Try backend first, fallback to default admin users
      try {
        const response = await fetch(`${backendUrl}/api/admin/login`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
          body: JSON.stringify({ username, password }),
        });

        const data = await response.json();

        if (response.ok && data.success) {
          setUser(data.user);
          localStorage.setItem('adminAuthUser', JSON.stringify(data.user));
          localStorage.setItem('adminLoginTime', Date.now().toString());
          localStorage.setItem('adminSessionId', sessionId); // Save session ID
          return { success: true };
        } else {
          // If backend fails, try default admin users
          console.log('Backend login failed, trying default credentials');
        }
      } catch (backendError) {
        console.log('Backend not available, using default admin authentication');
      }
      
      // Fallback: Check default admin users
      const adminUser = DEFAULT_ADMIN_USERS.find(u => 
        (u.username === username || u.email === username) && u.password === password
      );
      
      if (adminUser) {
        const { password: _, ...userWithoutPassword } = adminUser;
        const authenticatedUser = {
          ...userWithoutPassword,
          lastLogin: new Date().toISOString()
        };
        
        setUser(authenticatedUser);
        localStorage.setItem('adminAuthUser', JSON.stringify(authenticatedUser));
        localStorage.setItem('adminLoginTime', Date.now().toString());
        localStorage.setItem('adminSessionId', sessionId); // Save session ID
        return { success: true };
      } else {
        return { success: false, error: 'Invalid username or password' };
      }
      
    } catch (error) {
      console.error('Admin login error:', error);
      return { success: false, error: 'Login failed. Please try again.' };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('adminAuthUser');
    localStorage.removeItem('adminLoginTime');
    localStorage.removeItem('adminSessionId');
    console.log('Admin logged out');
  };

  const value: AdminAuthContextType = {
    user,
    login,
    logout,
    isLoading,
    isAuthenticated: !!user,
  };

  return <AdminAuthContext.Provider value={value}>{children}</AdminAuthContext.Provider>;
};