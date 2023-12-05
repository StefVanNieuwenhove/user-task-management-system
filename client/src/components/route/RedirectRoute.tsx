import { Navigate } from 'react-router-dom';

const RedirectRoute = ({ path }: { path: string }) => {
  return <Navigate to={path} />;
};

export default RedirectRoute;
