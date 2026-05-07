import { useNavigate } from 'react-router-dom';

function Usuario() {

  const navigate = useNavigate();

  const logout = () => {

    localStorage.removeItem('token')

    navigate('/');
  }
  const admin = () => {

    navigate('/admin');
  }

  return (
    <div style={{ padding: 40 }}>

      <h1>Nível Usuário</h1>

      <button onClick={admin}>
        Admin
      </button>
      <button onClick={logout}>
        Logout
      </button>

    </div>
  );
}

export default Usuario;