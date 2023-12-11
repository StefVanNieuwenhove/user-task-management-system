import { Route, Routes } from 'react-router-dom';
import { DashboardEmployee, DashboardManager, Login, Logout } from './pages';
import { PrivateRoute, RedirectRoute } from './components';

function App() {
  return (
    <>
      <Routes>
        <Route path='/' element={<RedirectRoute path={'login'} />} />
        <Route path='/login' element={<Login />} />
        <Route path='/logout' element={<Logout />} />
        <Route
          path='/manager/'
          element={
            <PrivateRoute>
              <DashboardManager />
            </PrivateRoute>
          }
        />
        <Route
          path='/employee/'
          element={
            <PrivateRoute>
              <DashboardEmployee />
            </PrivateRoute>
          }
        />
      </Routes>
    </>
  );
}

export default App;
