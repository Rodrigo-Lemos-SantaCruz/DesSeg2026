import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios'

function Admin() {

  const navigate = useNavigate();

  useEffect(() => {
    async function verificaAcesso() {
        const token = localStorage.getItem('token');

        try {

        await axios.get(
            'http://localhost:3001/admin',
            {
            headers: {
                Authorization: `Bearer ${token}`
            }
            }
        )

        } catch {
        alert('Acesso não autorizado!')
        navigate('/usuario');
        }
    }
    verificaAcesso()
  }, [navigate]);


  const logout = () => {

    localStorage.removeItem('token')

    navigate('/');
  };

  return (
    <div style={{ padding: 40 }}>

      <h1>Nível Admin</h1>

      <button onClick={logout}>
        Logout
      </button>

    </div>
  );
}

export default Admin;