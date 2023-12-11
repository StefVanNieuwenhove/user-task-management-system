export type User = {
  id: string;
  name: string;
  email: string;
  role: Role;
  created_at: string;
  updated_at: string;
  tasks?: Task[];
};

export type Task = {
  id: string;
  title: string;
  status: Status;
  user_id: string;
  created_at: string;
  updated_at: string;
};

export type Role = 'manager' | 'employee';
export type Status = 'todo' | 'in progress' | 'done';

export type AuthProvider = {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  loading: boolean;
  error: string;
  token: string | null;
  setSession: (token: string, user: User | null) => Promise<void>;
  isManager: boolean;
  isAuth: boolean;
  hasPermission: (role: Role) => boolean;
  isSignedIn: () => boolean;
};

export type DashboardProvider = {
  role: Role | undefined;
};

export type Navbar = {
  routes: {
    path: string;
    name: string;
  }[];
  user: User | null;
};
