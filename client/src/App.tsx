import { Route, Routes } from 'react-router-dom';
import { Dashboard, Login, Logout } from './pages';
import { PrivateRoute, RedirectRoute } from './components';

function App() {
  return (
    <>
      <Routes>
        <Route path='/' element={<RedirectRoute path={'login'} />} />
        <Route path='/login' element={<Login />} />
        <Route path='/logout' element={<Logout />} />
        <Route
          path='/dashboard'
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />
        <Route path='*' element={<RedirectRoute path={'login'} />} />
      </Routes>
    </>
  );
}

export default App;
