import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'
function Login() {
  const navigate = useNavigate()
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [mensagem, setMensagem] = useState('');

  const registrar = async () => {
    try {
      const res = await axios.post('http://localhost:3001/register', {
        username,
        password
      });
      console.log(res)
      setMensagem(res.data.message);
    } catch (err) {
      setMensagem("Erro ao registrar");
    }
  };

  const login = async () => {
    try {
      const res = await axios.post('http://localhost:3001/login', {
        username,
        password
      });
      
      console.log(res)
      if (res.status === 200)
        {
        localStorage.setItem('token', res.data.token);
        navigate('/usuario')
        }
      else
        setMensagem(res.data.message)
    } catch (err) {
      setMensagem("Credenciais inválidas");
    }
  };

  return (
    <div style={{ padding: 40 }}>
      <h2>PoC - Login com Hash</h2>

      <input
        placeholder="Usuário"
        onChange={e => setUsername(e.target.value)}
      />
      <br /><br />

      <input
        type="password"
        placeholder="Senha"
        onChange={e => setPassword(e.target.value)}
      />
      <br /><br />

      <button onClick={registrar}>Registrar</button>
      <button onClick={login}>Login</button>

      <p>{mensagem}</p>
    </div>
  );
}

export default Login;