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
  const { name, email, phone, password, type } = req.body;

  try {
    if (!name || name.trim() === '') {
      return res.status(400).json({ message: 'Nome é obrigatório.' });
    }

    if (name.trim().length < 3 || name.trim().length > 100) {
      return res.status(400).json({ message: 'Nome deve ter entre 3 e 100 caracteres.' });
    }

    if (!email || email.trim() === '') {
      return res.status(400).json({ message: 'Email é obrigatório.' });
    }

    // Validação de email simples
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      return res.status(400).json({ message: 'Email inválido.' });
    }
    // Validação opcional de telefone
    if (phone && phone.trim() !== '') {
      const phoneDigits = phone.replace(/\D/g, '');
      if (phoneDigits.length < 10 || phoneDigits.length > 11) {
        return res.status(400).json({ message: 'Telefone deve ter 10 ou 11 dígitos.' });
      }
    }
    if (!password || password.trim() === '') {
      return res.status(400).json({ message: 'Senha é obrigatória.' });
    }

    if (password.trim().length < 6) {
      return res.status(400).json({ message: 'Senha deve ter no mínimo 6 caracteres.' });
    }

    if (!type || !['client', 'barbershop'].includes(type)) {
      return res.status(400).json({ message: 'Tipo deve ser "client" ou "barbershop".' });
    }

    const user = await User.create({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      phone: phone ? phone.trim() : null,
      password: password.trim(),
      type
    });

    // Retorna o usuário envelopado em um objeto para consistência com outras rotas
    res.status(201).json({
      message: 'Usuário cadastrado com sucesso!',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        type: user.type
      }
    });
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
    const { id, name, email: userEmail, phone, type } = user;
    res.json({
      message: 'Login realizado com sucesso!',
      user: { id, name, email: userEmail, phone, type } 
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erro interno durante o login.' });
  }
});

/**
 * Rota: PUT /users/:id
 * Descrição: Atualiza os dados do usuário (nome e senha).
 * Atualizar apenas campos fornecidos e não vazios
 */
router.put('/:id', async (req, res) => {
  const { name, email, phone, password } = req.body;
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ message: 'Usuário não encontrado.' });

    // Atualizar nome com validação
    if (name !== undefined && name.trim() !== '') {
      if (name.trim().length < 3 || name.trim().length > 100) {
        return res.status(400).json({ message: 'Nome deve ter entre 3 e 100 caracteres.' });
      }
      user.name = name.trim();
    }
    if (email !== undefined && email.trim() !== '') {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email.trim())) {
        return res.status(400).json({ message: 'Email inválido.' });
      }

      // Verificar se o email já está em uso por outro usuário
      const existingUser = await User.findOne({
        where: { email: email.trim().toLowerCase() }
      });
      if (existingUser && existingUser.id !== user.id) {
        return res.status(400).json({ message: 'Este email já está em uso.' });
      }

      user.email = email.trim().toLowerCase();
    }

    if (phone !== undefined && phone.trim() !== '') {
      const phoneDigits = phone.replace(/\D/g, '');
      if (phoneDigits.length < 10 || phoneDigits.length > 11) {
        return res.status(400).json({ message: 'Telefone deve ter 10 ou 11 dígitos.' });
      }
      user.phone = phone.trim();
    }

    if (password !== undefined && password.trim() !== '') {
      if (password.trim().length < 6) {
        return res.status(400).json({ message: 'Senha deve ter no mínimo 6 caracteres.' });
      }
      user.password = password.trim();
    }

    await user.save();

    const { id, name: userName, email: userEmail, phone: userPhone, type } = user;
    res.json({
      message: 'Usuário atualizado com sucesso!',
      user: { id, name: userName, email: userEmail, phone: userPhone, type }
    });
  } catch (error) {
    console.error(error);

    if (error.name === 'SequelizeUniqueConstraintError') {
      return res.status(400).json({ message: 'Este email já está em uso.' });
    }

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
