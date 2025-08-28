// Importa o Express e cria um roteador
const express = require('express');
const router = express.Router();

// Importa o modelo User que representa os dados do usuário no banco
const User = require('../models/User');

/**
 * Rota: POST /users
 * Descrição: Cria um novo usuário (Cliente ou Barbearia)
 * Espera no body: { name, email, password, type }
 */
router.post('/', async (req, res) => {
  const { name, email, password, type } = req.body;

  try {
    const user = await User.create({ name, email, password, type });
    res.status(201).json(user);
  } catch (error) {
    console.error(error);
    // Verifica se o erro é de e-mail duplicado (unique constraint)
    if (error.name === 'SequelizeUniqueConstraintError') {
      return res.status(400).json({ message: 'E-mail já cadastrado. Tente outro!' });
    }
    res.status(500).json({ message: 'Erro ao cadastrar usuário.' });
  }
});

/**
 * Rota: POST /users/login
 * Descrição: Faz o login de usuário verificando email e senha.
 * Espera no body: { email, password }
 */
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(404).json({ message: 'Usuário não encontrado.' });

    if (user.password !== password) return res.status(401).json({ message: 'Senha inválida.' });

    // Retorna apenas os dados seguros para o cliente
    const { id, name, email: userEmail, type } = user;
    res.json({
      message: 'Login realizado com sucesso!',
      user: { id, name, email: userEmail, type }
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erro interno durante o login.' });
  }
});

/**
 * Rota: PUT /users/:id
 * Descrição: Atualiza os dados do usuário (nome e senha).
 */
router.put('/:id', async (req, res) => {
  const { name, password } = req.body;
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ message: 'Usuário não encontrado.' });

    // Atualiza o nome e, caso enviado, a senha
    user.name = name || user.name;
    if (password) user.password = password;

    await user.save();

    res.json({ message: 'Usuário atualizado com sucesso!', user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erro ao atualizar usuário.' });
  }
});

/**
 * Rota: DELETE /users/:id
 * Descrição: Exclui um usuário pelo ID.
 */
router.delete('/:id', async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ message: 'Usuário não encontrado.' });

    await user.destroy();
    res.json({ message: 'Usuário excluído com sucesso!' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erro ao excluir usuário.' });
  }
});

/**
 * Rota: GET /users/:id
 * Descrição: Retorna as informações de um usuário pelo ID.
 */
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const user = await User.findByPk(id);
    if (!user) return res.status(404).json({ message: 'Usuário não encontrado.' });

    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erro ao buscar usuário.' });
  }
});

// Exporta o roteador para ser usado no app.js
module.exports = router;
