import { axios } from '.';
import { User } from '../types';

// public api endpoints
export const getUser = async ({
  id,
  include_password = false,
}: {
  id: string;
  include_password?: boolean;
}): Promise<User> => {
  const user = await axios.get(
    `user/${id}?include_password=${include_password}`,
    { withCredentials: true }
  );
  return user.data;
};

export const login = async (
  email: string,
  password: string
): Promise<{ user: User; token: string }> => {
  try {
    const data = await axios.post(
      '/user/login',
      { email, password },
      { withCredentials: true }
    );
    return data.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const register = async (
  name: string,
  email: string,
  password: string,
  role: string
): Promise<User | undefined> => {
  try {
    const data = await axios.post(
      '/user/register',
      { name, email, password, role },
      { withCredentials: true }
    );
    return data.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const logout = async (): Promise<void> => {
  await axios.delete('/user/logout');
};

// private api endpoints
export const getEmployees = async (): Promise<User[]> => {
  const employees = await axios.get('/user/employees', {
    withCredentials: true,
  });
  return employees.data;
};
