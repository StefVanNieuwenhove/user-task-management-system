import {
  ReactNode,
  createContext,
  memo,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { AuthProvider as AuthProviderType, User } from '../types';
import { login as loginUser, logout as logoutUser } from '../api/user';
import * as api from '../api';
import { Buffer } from 'buffer';
import { useNavigate } from 'react-router-dom';

const TOKEN_KEY = import.meta.env.VITE_TOKEN_KEY as string;

const AuthContext = createContext<AuthProviderType>({
  user: null,
  loading: true,
  error: '',
  token: '',
  login: async () => {},
  logout: async () => {},
  setSession: async () => {},
  isManager: false,
  isAuth: false,
  hasPermission: () => false,
  isSignedIn: () => false,
});

const parseJwt = (token: string) => {
  const base64Url = token.split('.')[1];
  const payload = Buffer.from(base64Url, 'base64').toString('ascii');
  return JSON.parse(payload);
};

const parseExp = (exp: number) => {
  return new Date(exp * 1000);
};

export const useAuth = () => {
  return useContext(AuthContext);
};

const AuthProvider = memo(({ children }: { children: ReactNode }) => {
  const navigate = useNavigate();

  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [token, setToken] = useState<string>(
    localStorage.getItem(TOKEN_KEY) || ''
  );
  const isManager = useMemo(() => user?.role === 'manager', [user]);

  const setSession = useCallback(
    async (token: string) => {
      try {
        setLoading(true);
        if (token) {
          const { exp, user } = parseJwt(token);
          const expiresAt = parseExp(exp);
          const validToken = expiresAt > new Date();

          if (validToken) {
            localStorage.setItem(TOKEN_KEY, token);
            api.setAuthToken(token);
            setToken(token);
            setUser(user);
          } else {
            localStorage.removeItem(TOKEN_KEY);
            token = '';
          }
        }
      } catch (error) {
        setError('Error occured when setting session');
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [setToken, setLoading]
  );

  useEffect(() => {
    setSession(token);
  }, [token, setSession]);

  const login = useCallback(
    async (email: string, password: string) => {
      try {
        setLoading(true);
        setError('');
        const { token, user } = await loginUser(email, password);
        await setSession(token);
        return navigate(`/${user.role}`);
      } catch (error) {
        setError('Error occured when loggin in');
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [setSession, navigate]
  );

  const hasPermission = useCallback(
    (permission: string) => {
      const rolePermissions = {
        manager: ['read', 'write', 'delete'],
        employee: ['read'],
      };

      if (!user) {
        return false;
      }
      return rolePermissions[user.role].includes(permission);
    },
    [user]
  );

  const isAuth = useMemo(() => !!token, [token]);

  const isSignedIn = useCallback(() => {
    try {
      if (!token) return false;
      const { exp } = parseJwt(token);
      return parseExp(exp) > new Date();
    } catch (error) {
      return false;
    }
  }, [token]);

  const logout = useCallback(async () => {
    await logoutUser();
    localStorage.removeItem(TOKEN_KEY);
  }, []);

  const value = useMemo(() => {
    return {
      user,
      loading,
      error,
      token,
      login,
      logout,
      setSession,
      isManager,
      isAuth,
      hasPermission,
      isSignedIn,
    };
  }, [
    user,
    loading,
    error,
    token,
    login,
    logout,
    setSession,
    isManager,
    isAuth,
    hasPermission,
    isSignedIn,
  ]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
});

export default AuthProvider;
