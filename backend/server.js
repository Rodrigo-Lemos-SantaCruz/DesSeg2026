const express = require('express');
const bcrypt = require('bcrypt');
const cors = require('cors');
const db = require('./db');
const jwt = require('jsonwebtoken');
const app = express();

app.use(express.json());
app.use(cors());
const secret = 'SEGREDO_JWT'
const politicaSenha = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{7,}$/

app.post('/register', async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: "Dados obrigatórios" });
  }
  
  if(!politicaSenha.test(password)){
    console.log('Politica de senha negada')
    return res.status(400).json({ error: "Politica não atendida!" })
  }
  try {
    const hash = await bcrypt.hash(password, 10);

    db.run(
      `INSERT INTO users (username, password_hash, nivelAcesso, numTentativas) VALUES (?, ?, ?, ?)`,
      [username, hash, 0, 0],
      function (err) {
        if (err) {
          return res.status(400).json({ error: "Usuário já existe" });
        }
        res.status(200).json({ message: "Usuário criado com sucesso" });
      }
    );
  } catch (error) {
    res.status(500).json({ error: "Erro interno" });
  }
});


app.post('/login', (req, res) => {
  const { username, password } = req.body;

  db.get(
    `SELECT * FROM users WHERE username = ?`,
    [username],
    async (err, user) => {

      if (!user) {
        return res.status(401).json({ error: "Credenciais inválidas" });
      }

      if(user.numTentativas === 3){
        console.log('Usuario Bloqueado')
        return res.status(401).json({ error: "Número de Tentativas Excedido" })
      }

      const senhaCorreta = await bcrypt.compare(
        password,
        user.password_hash
      );

      if (!senhaCorreta) {
        db.run(
          `UPDATE users SET numTentativas = ? WHERE id = ?`,
          [user.numTentativas+1, user.id],
          function (err) {
            if (err) {
              console.log(err);
            }
          }
        )
        return res.status(401).json({ error: "Credenciais inválidas" });
      }

    const token = jwt.sign(
        {
          id: user.id,
          username: user.username,
          nivelAcesso: user.nivelAcesso
        },
        secret,
        {
          expiresIn: '1h'
        }
      )

      res.json({ message: "Login realizado com sucesso", token: token });
    }
  );
});

function verificarToken(req, res, next) {

  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({
      error: 'Token não enviado'
    });
  }

  const token = authHeader.split(' ')[1];

  try {

    const decoded = jwt.verify(
      token,
      secret
    );

    req.user = decoded;

    next();

  } catch {

    return res.status(403).json({
      error: 'Token inválido'
    });
  }
}

app.get(
  '/admin',
  verificarToken,
  (req, res) => {

    if (req.user.nivelAcesso !== 1) {
      return res.status(403).json({
        error: 'Acesso negado'
      });
    }

    res.status(200).json({
      message: 'Área admin'
    });
  }
);

app.listen(3001, () => {
  console.log("Servidor rodando na porta 3001");
});