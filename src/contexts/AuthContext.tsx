import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { login as apiLogin, signup as apiSignup } from "../api";

interface User {
  id: string;
  email: string;
  name: string;
  createdAt: string;
  isAdmin?: boolean;
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
    const currentUser = localStorage.getItem("currentUser");
    if (currentUser) {
      setUser(JSON.parse(currentUser));
    }
  }, []);

  const signup = async (email: string, password: string, name: string): Promise<boolean> => {
    // Hardcoded admin check
    if (email === "admin@gmail.com" && password === "Admin123") {
      const adminUser = {
        id: "admin",
        email,
        name,
        createdAt: new Date().toISOString(),
        isAdmin: true,
      };
      setUser(adminUser);
      localStorage.setItem("currentUser", JSON.stringify(adminUser));
      return true;
    }
    const response = await apiSignup({ email, password, name });
    if (response.id) {
      setUser(response);
      localStorage.setItem("currentUser", JSON.stringify(response));
      return true;
    }
    return false;
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    // Hardcoded admin check
    if (email === "admin@gmail.com" && password === "Admin123") {
      const adminUser = {
        id: "admin",
        email,
        name: "Admin",
        createdAt: new Date().toISOString(),
        isAdmin: true,
      };
      setUser(adminUser);
      localStorage.setItem("currentUser", JSON.stringify(adminUser));
      return true;
    }
    const response = await apiLogin({ email, password });
    if (response.id) {
      setUser(response);
      localStorage.setItem("currentUser", JSON.stringify(response));
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("currentUser");
    // Optionally, you could call a backend logout here.
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
