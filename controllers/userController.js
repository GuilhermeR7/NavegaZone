const bcrypt = require("bcrypt");
const userModel = require("../models/userModel");
const multer = require("multer");
const path = require("path");

// Configuração de upload de imagem
const storage = multer.diskStorage({
  destination: "./public/uploads",
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});
const upload = multer({ storage });

const registerUser = async (req, res) => {
  const { username, email, password } = req.body;
  const photo = req.file ? `/uploads/${req.file.filename}` : "/uploads/default.png";

  try {
    // Verificar se o usuário ou o e-mail já estão cadastrados
    userModel.checkUserExists(username, email, async (err, results) => {
      if (results.length > 0) {
        return res.status(400).json({ message: "Usuário ou e-mail já cadastrados!" });
      }

      // Criptografar a senha
      const hashedPassword = await bcrypt.hash(password, 10);

      // Criar o novo usuário
      userModel.createUser(username, email, hashedPassword, photo, (err) => {
        if (err) return res.status(500).json({ message: "Erro ao registrar usuário." });
        res.status(200).json({ message: "Usuário registrado com sucesso!" });
      });
    });
  } catch (error) {
    res.status(500).json({ message: "Erro interno no servidor." });
  }
};

const loginUser = (req, res) => {
  const { email, password } = req.body;

  userModel.findUserByEmail(email, async (err, results) => {
    if (err) return res.status(500).json({ message: "Erro interno no servidor." });

    if (results.length === 0) {
      return res.status(401).json({ message: "Credenciais inválidas." });
    }

    const user = results[0];

    try {
      // Verificar se a senha está correta
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) return res.status(401).json({ message: "Credenciais inválidas." });

      // Salvar informações do usuário na sessão
      req.session.user = {
        id: user.id,
        username: user.username,
        email: user.email,
        photo: user.photo
      };

      res.status(200).json({ message: "Login realizado com sucesso!" });
    } catch (error) {
      res.status(500).json({ message: "Erro interno no servidor." });
    }
  });
};

const getProfile = (req, res) => {
  if (!req.session.user) {
    return res.status(401).json({ message: "Usuário não está autenticado." });
  }

  res.status(200).json(req.session.user);
};

const logoutUser = (req, res) => {
  req.session.destroy(() => {
    res.status(200).json({ message: "Logout realizado com sucesso!" });
  });
};

module.exports = { registerUser, loginUser, getProfile, logoutUser, upload };
