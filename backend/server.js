const express = require('express');
const bcrypt = require('bcrypt');
const cors = require('cors');
const db = require('./db');

const app = express();

app.use(express.json());
app.use(cors());


app.post('/register', async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: "Dados obrigatórios" });
  }

  try {
    const hash = await bcrypt.hash(password, 10);

    db.run(
      `INSERT INTO users (username, password_hash) VALUES (?, ?)`,
      [username, hash],
      function (err) {
        if (err) {
          return res.status(400).json({ error: "Usuário já existe" });
        }
        res.json({ message: "Usuário criado com sucesso" });
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

      const senhaCorreta = await bcrypt.compare(
        password,
        user.password_hash
      );

      if (!senhaCorreta) {
        return res.status(401).json({ error: "Credenciais inválidas" });
      }

      res.json({ message: "Login realizado com sucesso" });
    }
  );
});

app.listen(3001, () => {
  console.log("Servidor rodando na porta 3001");
});