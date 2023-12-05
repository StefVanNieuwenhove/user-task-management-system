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

export type Role = 'manager' | 'emoplpyee';
export type Status = 'todo' | 'in progress' | 'done';

export type AuthProvider = {
  user: User | null;
  login: (
    email: string,
    password: string
  ) => Promise<{ user: User | null; token: string }>;
  logout: () => Promise<void>;
  loading: boolean;
  error: string;
  token: string | null;
  setSession: (token: string, user: User | null) => Promise<void>;
  isManager: boolean;
};
