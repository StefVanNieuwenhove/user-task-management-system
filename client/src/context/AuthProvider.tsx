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
import { login as loginUser, logout as logoutUser, getUser } from '../api/user';
import * as api from '../api';
import { Buffer } from 'buffer';

const TOKEN_KEY = import.meta.env.VITE_TOKEN_KEY as string;

const AuthContext = createContext<AuthProviderType>({
  user: null,
  loading: true,
  error: '',
  token: '',
  login: async () => {
    return { user: null, token: '' };
  },
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
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [token, setToken] = useState<string>(
    localStorage.getItem(TOKEN_KEY) || ''
  );
  const isManager = useMemo(() => user?.role === 'manager', [user]);

  const setSession = useCallback(async (token: string, user: User | null) => {
    try {
      setLoading(true);
      if (token) {
        const { exp, id } = parseJwt(token);
        const expiresAt = parseExp(exp);
        const validToken = expiresAt > new Date();

        if (validToken) {
          localStorage.setItem(TOKEN_KEY, token);
          api.setAuthToken(token);
          setToken(token);

          if (!user && validToken) {
            user = await getUser({ id: id, include_password: false });
          }
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
  }, []);

  useEffect(() => {
    setSession(token, null);
  }, [token, setSession]);

  const login = useCallback(
    async (email: string, password: string) => {
      try {
        console.log('login');
        setLoading(true);
        setError('');
        const { token, user } = await loginUser(email, password);
        await setSession(token, user);
        return { token, user };
      } catch (error) {
        setError('Error occured when loggin in');
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [setSession]
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
    if (!token) return false;

    const { exp } = parseJwt(token);
    return parseExp(exp) > new Date();
  }, [token]);

  const logout = useCallback(async () => {
    await logoutUser();
    await setSession('', null);
  }, [setSession]);

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
