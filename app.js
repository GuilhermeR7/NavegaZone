const express = require("express");
const session = require("express-session");
const userRoutes = require("./routes/userRoutes");
const app = express();

// Configurações de Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public")); // Para arquivos estáticos como fotos

// Configuração de sessões
app.use(session({
  secret: "chave-secreta", // Troque isso por uma chave forte em produção
  resave: false,
  saveUninitialized: false
}));

// Usar as rotas de usuário
app.use("/user", userRoutes);

// Iniciar o servidor
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
