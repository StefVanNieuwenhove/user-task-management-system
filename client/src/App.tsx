import { Route, Routes } from 'react-router-dom';
import { Login, Logout } from './pages';
import { RedirectRoute } from './components';

function App() {
  return (
    <>
      <Routes>
        <Route path='/' element={<RedirectRoute path={'login'} />} />
        <Route path='/login' element={<Login />} />
        <Route path='/logout' element={<Logout />} />
        <Route path='manager' element={<p>manager</p>}>
          <Route index element={<p>manager index</p>} />
        </Route>
        <Route path='employee' element={<p>empoyee</p>}>
          <Route index element={<p>employee index</p>} />
        </Route>
      </Routes>
    </>
  );
}

export default App;
