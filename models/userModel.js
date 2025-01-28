
const db = require('../config/db');

// Verificar se o usuário ou o e-mail já estão cadastrados
const checkUserExists = (username, email, callback) => {
  db.query("SELECT * FROM users WHERE username = ? OR email = ?", [username, email], callback);
};

// Criar um novo usuário no banco de dados
const createUser = (username, email, hashedPassword, photo, callback) => {
  db.query(
    "INSERT INTO users (username, email, password, photo) VALUES (?, ?, ?, ?)",
    [username, email, hashedPassword, photo],
    callback
  );
};

// Buscar usuário por e-mail para login
const findUserByEmail = (email, callback) => {
  db.query("SELECT * FROM users WHERE email = ?", [email], callback);
};

module.exports = { checkUserExists, createUser, findUserByEmail };
