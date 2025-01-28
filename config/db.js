const mysql = require("mysql2");

// Configuração do banco de dados
const db = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "Gui80120444", // Troque pela sua senha do MySQL
  database: "NavegaZone"
});

module.exports = db;
