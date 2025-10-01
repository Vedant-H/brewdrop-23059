import { createContext, useContext, useState, useEffect, ReactNode } from "react";

interface User {
  id: string;
  email: string;
  name: string;
  createdAt: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (email: string, password: string, name: string) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // Load current user from localStorage on mount
    const currentUser = localStorage.getItem("currentUser");
    if (currentUser) {
      setUser(JSON.parse(currentUser));
    }
  }, []);

  const signup = async (email: string, password: string, name: string): Promise<boolean> => {
    // Get existing users from localStorage (simulating users.json)
    const usersData = localStorage.getItem("users");
    const users = usersData ? JSON.parse(usersData) : [];

    // Check if user already exists
    const existingUser = users.find((u: any) => u.email === email);
    if (existingUser) {
      return false; // User already exists
    }

    // Create new user
    const newUser: User & { password: string } = {
      id: Math.random().toString(36).substring(7),
      email,
      name,
      password, // In production, this should be hashed
      createdAt: new Date().toISOString(),
    };

    // Save to users array
    users.push(newUser);
    localStorage.setItem("users", JSON.stringify(users));

    // Set as current user
    const userWithoutPassword = { ...newUser };
    delete (userWithoutPassword as any).password;
    setUser(userWithoutPassword);
    localStorage.setItem("currentUser", JSON.stringify(userWithoutPassword));

    return true;
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    // Get users from localStorage (simulating users.json)
    const usersData = localStorage.getItem("users");
    const users = usersData ? JSON.parse(usersData) : [];

    // Find user with matching credentials
    const user = users.find((u: any) => u.email === email && u.password === password);
    
    if (!user) {
      return false; // Invalid credentials
    }

    // Set as current user (without password)
    const userWithoutPassword = { ...user };
    delete userWithoutPassword.password;
    setUser(userWithoutPassword);
    localStorage.setItem("currentUser", JSON.stringify(userWithoutPassword));

    return true;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("currentUser");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        signup,
        logout,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
