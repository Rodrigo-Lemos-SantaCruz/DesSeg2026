import { Routes, Route,  } from 'react-router-dom'
import Login from './Login';
import Admin from './Admin';
import Usuario from './User';

function App() {

  return (
    <Routes>

      <Route
        path="/"
        element={<Login />}
      />

      <Route
        path="/admin"
        element={<Admin />}
      />

      <Route
        path="/usuario"
        element={<Usuario />}
      />

    </Routes>
  );
}

export default App