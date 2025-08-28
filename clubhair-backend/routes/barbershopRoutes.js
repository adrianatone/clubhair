const express = require('express');
const router = express.Router();

// Importa o modelo da barbearia e do usuário
const Barbershop = require('../models/Barbershop');
const User = require('../models/User');

/**
 * Rota: GET /barbershops
 * Descrição: Retorna todas as barbearias cadastradas.
 */
router.get('/', async (req, res) => {
  try {
    const barbershops = await Barbershop.findAll();
    res.json(barbershops);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching barbershops' });
  }
});

/**
 * Rota: POST /barbershops
 * Descrição: Cria uma nova barbearia associada a um usuário.
 * Body esperado: { name, phone, address, userId }
 */
router.post('/', async (req, res) => {
  const { name, phone, address, userId } = req.body;

  // Validação de campos obrigatórios
  if (!name || !phone || !address || !userId) {
    return res.status(400).json({ message: 'Todos os campos são obrigatórios.' });
  }

  try {
    const newBarbershop = await Barbershop.create({ name, phone, address, userId });
    res.status(201).json(newBarbershop);
  } catch (error) {
    console.error(error);
    if (error.name === 'SequelizeUniqueConstraintError') {
      return res.status(400).json({ message: 'Barbearia já cadastrada para este usuário ou nome já existente!' });
    }
    res.status(500).json({ message: 'Error creating barbershop' });
  }
});

/**
 * Rota: PUT /barbershops/:id
 * Descrição: Atualiza os dados de uma barbearia existente.
 * Body esperado: { name, phone, address }
 */
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { name, phone, address } = req.body;

  try {
    const barbershop = await Barbershop.findByPk(id);

    if (!barbershop) {
      return res.status(404).json({ message: 'Barbearia não encontrada.' });
    }

    // Atualiza os dados
    barbershop.name = name;
    barbershop.phone = phone;
    barbershop.address = address;

    await barbershop.save();
    res.json({ message: 'Perfil atualizado com sucesso!', barbershop });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erro ao atualizar perfil da barbearia.' });
  }
});

/**
 * Rota: DELETE /barbershops/:id
 * Descrição: Exclui uma barbearia e o usuário associado a ela.
 */
router.delete('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const barbershop = await Barbershop.findByPk(id);

    if (!barbershop) {
      return res.status(404).json({ message: 'Barbearia não encontrada.' });
    }

    const userId = barbershop.userId;

    // Exclui a barbearia primeiro
    await barbershop.destroy();

    // Se existir, exclui o usuário dono também
    const user = await User.findByPk(userId);
    if (user) {
      await user.destroy();
    }

    res.json({ message: 'Barbearia e usuário dono excluídos com sucesso!' });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erro ao excluir barbearia e usuário.' });
  }
});

/**
 * Rota: GET /barbershops/:id
 * Descrição: Busca uma barbearia pelo ID.
 */
router.get('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const barbershop = await Barbershop.findByPk(id);
    if (!barbershop) {
      return res.status(404).json({ message: 'Barbearia não encontrada.' });
    }
    res.json(barbershop);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erro ao buscar barbearia.' });
  }
});

module.exports = router;
