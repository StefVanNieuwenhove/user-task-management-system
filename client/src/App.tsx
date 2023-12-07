import { Route, Routes } from 'react-router-dom';
import { Login, Logout } from './pages';
import { PrivateRoute, RedirectRoute } from './components';
import { DashboardProvider } from './context';

function App() {
  return (
    <>
      <Routes>
        <Route path='/' element={<RedirectRoute path={'login'} />} />
        <Route path='/login' element={<Login />} />
        <Route path='/logout' element={<Logout />} />
      </Routes>
    </>
  );
}

export default App;
