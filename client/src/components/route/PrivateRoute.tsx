import { ReactNode } from 'react';
import { useAuth } from '../../context';
import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ children }: { children: ReactNode }) => {
  const { isAuth } = useAuth();

  if (!isAuth) return <Navigate to='/login' replace />;

  return <>{children}</>;
};

export default PrivateRoute;
