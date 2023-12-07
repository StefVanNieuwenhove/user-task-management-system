import { Navbar as NavbarType } from '../../types';
import { Link, Outlet } from 'react-router-dom';

const Navbar = ({ routes, user }: NavbarType) => {
  return (
    <nav>
      <h1>
        {user?.name} - {user?.role}
      </h1>
      <ul>
        {routes.map((route) => (
          <Link key={route.path} to={route.path}>
            <p>{route.name}</p>
          </Link>
        ))}
      </ul>
      <Outlet />
    </nav>
  );
};

export default Navbar;
