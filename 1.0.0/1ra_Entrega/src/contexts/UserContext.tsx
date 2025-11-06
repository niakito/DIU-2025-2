import { createContext, useContext, useState, ReactNode } from "react";
import { UserPreferences } from "@/types/casino";

interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  preferences: UserPreferences;
}

interface UserContextType {
  user: User;
  updateUser: (updates: Partial<User>) => void;
  updatePreferences: (preferences: Partial<UserPreferences>) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser debe ser usado dentro de un UserProvider');
  }
  return context;
};

interface UserProviderProps {
  children: ReactNode;
}

export const UserProvider = ({ children }: UserProviderProps) => {
  const [user, setUser] = useState<User>({
    id: "1",
    name: "María González",
    email: "maria.gonzalez@universidad.edu",
    avatar: "https://images.unsplash.com/photo-1494790108755-2616b332c108?w=150&h=150&fit=crop&crop=face",
    preferences: {
      defaultMenuType: "normal",
      notifications: true,
      autoReserve: false,
    },
  });

  const updateUser = (updates: Partial<User>) => {
    setUser(prev => ({ ...prev, ...updates }));
  };

  const updatePreferences = (preferences: Partial<UserPreferences>) => {
    setUser(prev => ({
      ...prev,
      preferences: { ...prev.preferences, ...preferences }
    }));
  };

  return (
    <UserContext.Provider value={{ user, updateUser, updatePreferences }}>
      {children}
    </UserContext.Provider>
  );
};