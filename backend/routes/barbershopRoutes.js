const express = require('express');
const router = express.Router();

// Importa o modelo da barbearia e do usuário
const Barbershop = require('../models/Barbershop');
const User = require('../models/User');
const Service = require('../models/Service');
const Schedule = require('../models/Schedule');


/*  * Rota: GET /barbershops
 * Descrição: Retorna todas as barbearias cadastradas com paginação. */

router.get('/', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    const { count, rows } = await Barbershop.findAndCountAll({
      limit,
      offset,
      order: [['name', 'ASC']]
    });

    res.json({
      barbershops: rows,
      pagination: {
        total: count,
        page,
        limit,
        totalPages: Math.ceil(count / limit)
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erro ao buscar barbearias.' });
  }
});

/**
 * Rota: POST /barbershops
 * Descrição: Cria uma nova barbearia associada a um usuário.
 */
router.post('/', async (req, res) => {
  const { name, phone, address, userId } = req.body;

  try {
    if (!name || name.trim() === '') {
      return res.status(400).json({ message: 'Nome da barbearia é obrigatório.' });
    }

    if (name.trim().length < 3 || name.trim().length > 100) {
      return res.status(400).json({ message: 'Nome deve ter entre 3 e 100 caracteres.' });
    }

    if (!phone || phone.trim() === '') {
      return res.status(400).json({ message: 'Telefone é obrigatório.' });
    }
    const phoneDigits = phone.replace(/\D/g, '');
    if (phoneDigits.length < 10 || phoneDigits.length > 11) {
      return res.status(400).json({ message: 'Telefone deve ter 10 ou 11 dígitos.' });
    }
    if (!address || address.trim() === '') {
      return res.status(400).json({ message: 'Endereço é obrigatório.' });
    }
    if (address.trim().length < 10 || address.trim().length > 200) {
      return res.status(400).json({ message: 'Endereço deve ter entre 10 e 200 caracteres.' });
    }
    if (!userId || isNaN(userId)) {
      return res.status(400).json({ message: 'ID do usuário inválido.' });
    }

    // Verificar se o usuário existe e é do tipo barbershop
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ message: 'Usuário não encontrado.' });
    }

    if (user.type !== 'barbershop') {
      return res.status(400).json({ message: 'Apenas usuários do tipo "barbershop" podem criar barbearias.' });
    }

    // Verificar se usuário já tem uma barbearia
    const existingBarbershop = await Barbershop.findOne({ where: { userId } });
    if (existingBarbershop) {
      return res.status(400).json({ message: 'Este usuário já possui uma barbearia cadastrada.' });
    }

    const newBarbershop = await Barbershop.create({
      name: name.trim(),
      phone: phone.trim(),
      address: address.trim(),
      userId: parseInt(userId)
    });
    res.status(201).json(newBarbershop);
  } catch (error) {
    console.error(error);
    if (error.name === 'SequelizeUniqueConstraintError') {
      return res.status(400).json({ message: 'Nome de barbearia já existente!' });
    }
    if (error.name === 'SequelizeForeignKeyConstraintError') {
      return res.status(400).json({ message: 'Usuário não encontrado.' });
    }
    res.status(500).json({ message: 'Erro ao criar barbearia.' });
  }
});

/**
 * Rota: PUT /barbershops/:id
 * Descrição: Atualiza os dados de uma barbearia existente.
 */
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { name, phone, address } = req.body;

  try {
    const barbershop = await Barbershop.findByPk(id);

    if (!barbershop) {
      return res.status(404).json({ message: 'Barbearia não encontrada.' });
    }
    if (name !== undefined && name.trim() !== '') {
      barbershop.name = name.trim();
    }
    if (phone !== undefined && phone.trim() !== '') {
      barbershop.phone = phone.trim();
    }
    if (address !== undefined && address.trim() !== '') {
      barbershop.address = address.trim();
    }

    await barbershop.save();
    res.json({ message: 'Perfil atualizado com sucesso!', barbershop });

  } catch (error) {
    console.error(error);

    // Tratamento de erro de nome duplicado
    if (error.name === 'SequelizeUniqueConstraintError') {
      return res.status(400).json({ message: 'Este nome de barbearia já está em uso.' });
    }

    res.status(500).json({ message: 'Erro ao atualizar perfil da barbearia.' });
  }
});

/**
 * Rota: DELETE /barbershops/:id
 * Descrição: Exclui uma barbearia.
 * Não deleta automaticamente o usuário, apenas sob requisição explícita
 */
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  const { deleteUser } = req.query; // Parâmetro opcional

  try {
    const barbershop = await Barbershop.findByPk(id);

    if (!barbershop) {
      return res.status(404).json({ message: 'Barbearia não encontrada.' });
    }

    const userId = barbershop.userId;

    // Deletar serviços e agendamentos primeiro (CASCADE já faz isso no modelo)
    // mas mantemos explícito para clareza
    await Service.destroy({ where: { barbershopId: id } });
    await Schedule.destroy({ where: { barbershopId: id } });

    // Deletar barbearia
    await barbershop.destroy();

    //Deletar usuário apenas se explicitamente solicitado
    if (deleteUser === 'true') {
      const user = await User.findByPk(userId);
      if (user) {
        await user.destroy();
      }
      return res.json({ message: 'Barbearia e usuário excluídos com sucesso!' });
    }

    res.json({ message: 'Barbearia excluída com sucesso!' });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erro ao excluir barbearia.' });
  }
});

/**
 * Rota: GET /barbershops/user/:userId
 * Descrição: Busca uma barbearia pelo userId.
 * Rota adicionada para compatibilidade com frontend
 */
router.get('/user/:userId', async (req, res) => {
  const { userId } = req.params;

  try {
    const barbershop = await Barbershop.findOne({
      where: { userId },
      include: [{
        model: User,
        attributes: ['id', 'name', 'email', 'type']
      }]
    });

    if (!barbershop) {
      return res.status(404).json({ message: 'Barbearia não encontrada para este usuário.' });
    }

    res.json({ barbershop });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erro ao buscar barbearia.' });
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
