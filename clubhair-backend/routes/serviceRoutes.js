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
    const service = await Service.create({
      name,
      price,
      duration,
      barbershopId
    });
    res.status(201).json(service);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error creating service' });
  }
});

/**
 * Rota: GET /services
 * Descrição: Lista todos os serviços ou filtra pelo ID da barbearia.
 * Query opcional: ?barbershopId=1
 */
router.get('/', async (req, res) => {
  const { barbershopId } = req.query;

  try {
    let services;
    if (barbershopId) {
      services = await Service.findAll({ where: { barbershopId } });
    } else {
      services = await Service.findAll();
    }
    res.json(services);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching services' });
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

module.exports = router;
