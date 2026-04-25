const express = require('express');
const router = express.Router();
const Service = require('../models/Service');

/**
 * Rota: POST /services
 * Descrição: Cadastra um novo serviço para uma barbearia.
 * Espera no corpo da requisição: { name, price, duration, barbershopId }
 */
router.post('/', async (req, res) => {
  const { name, price, duration, barbershopId } = req.body;

  try {
    // Validações de entrada
    if (!name || name.trim() === '') {
      return res.status(400).json({ message: 'Nome do serviço é obrigatório.' });
    }

    if (name.trim().length < 2 || name.trim().length > 100) {
      return res.status(400).json({ message: 'Nome do serviço deve ter entre 2 e 100 caracteres.' });
    }

    if (!price || isNaN(price) || parseFloat(price) <= 0) {
      return res.status(400).json({ message: 'Preço deve ser um número maior que zero.' });
    }

    if (!duration || isNaN(duration) || parseInt(duration) <= 0 || parseInt(duration) > 480) {
      return res.status(400).json({ message: 'Duração deve ser entre 1 e 480 minutos.' });
    }

    if (!barbershopId || isNaN(barbershopId)) {
      return res.status(400).json({ message: 'ID da barbearia inválido.' });
    }

    // Verificar se a barbearia existe
    const Barbershop = require('../models/Barbershop');
    const barbershopExists = await Barbershop.findByPk(barbershopId);
    if (!barbershopExists) {
      return res.status(404).json({ message: 'Barbearia não encontrada.' });
    }

    const service = await Service.create({
      name: name.trim(),
      price: parseFloat(price),
      duration: parseInt(duration),
      barbershopId: parseInt(barbershopId)
    });
    res.status(201).json(service);
  } catch (error) {
    console.error(error);

    if (error.name === 'SequelizeForeignKeyConstraintError') {
      return res.status(400).json({ message: 'Barbearia não encontrada.' });
    }

    res.status(500).json({ message: 'Erro ao criar serviço.' });
  }
});

/**
 * Rota: GET /services
 * Descrição: Lista todos os serviços ou filtra pelo ID da barbearia.
 * Query opcional: ?barbershopId=1
 * Padroniza resposta da API
 */
router.get('/', async (req, res) => {
  const { barbershopId } = req.query;

  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const offset = (page - 1) * limit;

  try {
    const where = {};
    if (barbershopId) {
      where.barbershopId = barbershopId;
    }

    const { count, rows } = await Service.findAndCountAll({
      where,
      limit,
      offset,
      order: [['name', 'ASC']]
    });

    // Resposta padronizada
    res.json({
      services: rows,
      pagination: {
        total: count,
        page,
        limit,
        totalPages: Math.ceil(count / limit)
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erro ao buscar serviços.' });
  }
});


/**
 * Rota: GET /services/:id
 * Descrição: Busca um serviço pelo seu ID.
 */
router.get('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const service = await Service.findByPk(id);
    if (!service) {
      return res.status(404).json({ message: 'Serviço não encontrado.' });
    }
    res.json(service);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erro ao buscar serviço.' });
  }
});

/**
 * Rota: DELETE /services/:id
 * Descrição: Exclui um serviço específico pelo ID.
 */
router.delete('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const service = await Service.findByPk(id);
    if (!service) {
      return res.status(404).json({ message: 'Serviço não encontrado.' });
    }

    await service.destroy();
    res.json({ message: 'Serviço excluído com sucesso!' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erro ao excluir serviço.' });
  }
});
/**
 * Rota: PUT /services/:id
 * Descrição: Atualiza os dados de um serviço existente.
 */
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { name, price, duration } = req.body;

  try {
    // Validações
    if (name !== undefined && (name.trim() === '' || name.trim().length < 2 || name.trim().length > 100)) {
      return res.status(400).json({ message: 'Nome do serviço deve ter entre 2 e 100 caracteres.' });
    }

    if (price !== undefined && (isNaN(price) || parseFloat(price) <= 0)) {
      return res.status(400).json({ message: 'Preço deve ser um número maior que zero.' });
    }

    if (duration !== undefined && (isNaN(duration) || parseInt(duration) <= 0 || parseInt(duration) > 480)) {
      return res.status(400).json({ message: 'Duração deve ser entre 1 e 480 minutos.' });
    }

    const service = await Service.findByPk(id);
    if (!service) {
      return res.status(404).json({ message: 'Serviço não encontrado.' });
    }

    // Atualizar apenas campos fornecidos
    if (name !== undefined) service.name = name.trim();
    if (price !== undefined) service.price = parseFloat(price);
    if (duration !== undefined) service.duration = parseInt(duration);

    await service.save();

    res.json({
      message: 'Serviço atualizado com sucesso!',
      service
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erro ao atualizar serviço.' });
  }
});
module.exports = router;
