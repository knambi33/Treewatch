import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, UserRole } from '../types';
import { fetchUsers } from '../api';

interface AuthContextType {
  currentUser: User | null;
  allUsers: User[];
  switchUser: (user: User) => void;
  switchRole: (role: UserRole) => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsers()
      .then((users) => {
        setAllUsers(users);
        if (users.length > 0) {
          // Default to Planter Ravi Kumar
          setCurrentUser(users[0]);
        }
      })
      .catch((err) => console.error('Failed to load users', err))
      .finally(() => setLoading(false));
  }, []);

  const switchUser = (user: User) => {
    setCurrentUser(user);
  };

  const switchRole = (role: UserRole) => {
    const matched = allUsers.find((u) => u.role === role);
    if (matched) {
      setCurrentUser(matched);
    }
  };

  return (
    <AuthContext.Provider value={{ currentUser, allUsers, switchUser, switchRole, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
