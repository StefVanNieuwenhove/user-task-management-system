import { useEffect } from 'react';
import { useAuth } from '../../context';

const Logout = () => {
  const { logout } = useAuth();

  useEffect(() => {
    logout();
  }, [logout]);

  return <div>logouL</div>;
};

export default Logout;
