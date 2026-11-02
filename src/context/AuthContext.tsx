import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { API_BASE } from '../config';
import { translateAuthError } from '../utils/authErrors';

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; message?: string }>;
  signup: (data: SignupData) => Promise<{ success: boolean; message?: string }>;
  logout: () => Promise<void>;
}

export interface SignupData {
  name: string;
  email: string;
  phone: string;
  countryDial: string;
  password: string;
  birthDate?: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const TOKEN_KEY = 'sakina_auth_token';

// Primary auth mechanism: a token saved in localStorage and sent via the Authorization header.
// Cookies (credentials: 'include') are also sent as a fallback for local dev, but are not relied
// on in production because mobile Safari and many privacy browsers block cross-site cookies —
// the frontend (Vercel) and backend (Render) are on different domains, which silently broke
// login persistence for a meaningful share of real users.
export function getAuthHeaders(): HeadersInit {
  const token = localStorage.getItem(TOKEN_KEY);
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshMe = async () => {
    try {
      const res = await fetch(`${API_BASE}/auth/me`, {
        credentials: 'include',
        headers: getAuthHeaders(),
      });
      if (res.ok) {
        const data = await res.json();
        setUser(data.user);
      } else {
        setUser(null);
        localStorage.removeItem(TOKEN_KEY);
      }
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshMe();
  }, []);

  const login: AuthContextType['login'] = async (email, password) => {
    try {
      const res = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        if (data.token) localStorage.setItem(TOKEN_KEY, data.token);
        setUser(data.user);
        return { success: true };
      }
      return { success: false, message: translateAuthError(data.code, data.message || 'Échec de la connexion.') };
    } catch {
      return { success: false, message: 'Impossible de contacter le serveur.' };
    }
  };

  const signup: AuthContextType['signup'] = async (formData) => {
    try {
      const res = await fetch(`${API_BASE}/auth/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        if (data.token) localStorage.setItem(TOKEN_KEY, data.token);
        setUser(data.user);
        return { success: true };
      }
      return { success: false, message: translateAuthError(data.code, data.message || "Échec de l'inscription.") };
    } catch {
      return { success: false, message: 'Impossible de contacter le serveur.' };
    }
  };

  const logout = async () => {
    try {
      await fetch(`${API_BASE}/auth/logout`, {
        method: 'POST',
        credentials: 'include',
        headers: getAuthHeaders(),
      });
    } finally {
      localStorage.removeItem(TOKEN_KEY);
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
  return ctx;
}
