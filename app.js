const express = require('express');
const mysql = require('mysql2');
const path = require('path');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');

const app = express();
const port = 3000;

// Configurar conexão com o banco de dados MySQL
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'aluno01',
    database: 'NavegaZone'
});

db.connect(err => {
    if (err) {
        console.error('Erro ao conectar ao banco de dados:', err);
        return;
    }
    console.log('Conectado ao banco de dados MySQL.');
});

// Middleware para analisar dados do formulário
app.use(bodyParser.urlencoded({ extended: true }));

// Servir arquivos estáticos da pasta 'public'
app.use(express.static(path.join(__dirname, 'public')));



// Rota Cadastro
app.post('/submit-registration', (req, res) => {
    const { username, email, senha, confirmsenha } = req.body;

    if (senha !== confirmsenha) {
        res.send('As senhas não correspondem.');
        return;
    }

    bcrypt.hash(senha, 10, (err, hash) => {
        if (err) {
            console.error('Erro ao hash da senha:', err);
            res.send('Erro ao processar a senha.');
            return;
        }

        const query = 'INSERT INTO Users (username, email, senha) VALUES (?, ?, ?)';
        db.query(query, [username, email, hash], (err, results) => {
            if (err) {
                console.error('Erro ao cadastrar usuário:', err);
                res.send('Erro ao cadastrar usuário.');
                return;
            }

            // Redirecionar para a página de perfil com o ID do usuário recém-criado
            res.redirect(`/profile/${results.insertId}`);
        });
    });
});

// Iniciar o servidor
app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
});



// Rota Login
app.post('/submit-login', (req, res) => {
    const { email, senha } = req.body;

    const query = 'SELECT * FROM Users WHERE email = ?';
    db.query(query, [email], (err, results) => {
        if (err) {
            console.error('Erro ao fazer login:', err);
            res.send('Erro ao fazer login.');
            return;
        }

        if (results.length === 0) {
            res.send('Email ou senha incorretos.');
            return;
        }

        const user = results[0];
        bcrypt.compare(senha, user.senha, (err, isMatch) => {
            if (err) {
                console.error('Erro ao comparar senha:', err);
                res.send('Erro ao fazer login.');
                return;
            }

            if (isMatch) {
                // Redirecionar para a página de perfil do usuário
                res.redirect(`/profile/${user.id}`);
            } else {
                res.send('Email ou senha incorretos.');
            }
        });
    });
});

app.post('/submit-login', async (req, res) => {
    const { email, senha } = req.body;
    // Aqui você adiciona a lógica de autenticação do usuário
    // Suponha que você tenha validado e tenha o `userId`
    
    const userId = // ID do usuário autenticado
    res.redirect(`/profile/${userId}`);
});