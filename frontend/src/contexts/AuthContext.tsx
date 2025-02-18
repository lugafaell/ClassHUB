import { createContext, useContext, useState, ReactNode, useEffect } from 'react';

interface User {
  id: number;
  email: string;
  tipo: string;
  nome: string;
}

interface AuthState {
  token: string | null;
  user: User | null;
}

interface AuthContextType {
  isAuthenticated: boolean;
  token: string | null;
  user: User | null;
  login: (token: string, user: User) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [authState, setAuthState] = useState<AuthState>(() => {
    const storedAuth = localStorage.getItem('auth');
    if (storedAuth) {
      return JSON.parse(storedAuth);
    }
    return { token: null, user: null };
  });

  const isAuthenticated = !!authState.token;

  useEffect(() => {
    if (authState.token && authState.user) {
      localStorage.setItem('auth', JSON.stringify(authState));
    } else {
      localStorage.removeItem('auth');
    }
  }, [authState]);

  const login = (token: string, user: User) => {
    setAuthState({ token, user });
  };

  const logout = () => {
    setAuthState({ token: null, user: null });
  };

  return (
    <AuthContext.Provider 
      value={{ 
        isAuthenticated, 
        token: authState.token, 
        user: authState.user, 
        login, 
        logout 
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}