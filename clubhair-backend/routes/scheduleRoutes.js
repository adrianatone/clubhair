const express = require('express');
const router = express.Router();
const Schedule = require('../models/Schedule');

/**
 * Rota: POST /schedules
 * Descrição: Cadastra um novo agendamento de serviço.
 * Espera no corpo: { date, time, clientId, barbershopId, serviceId }
 * Status inicial: 'pending'
 */
router.post('/', async (req, res) => {
  const { date, time, clientId, barbershopId, serviceId } = req.body;

  try {
    const schedule = await Schedule.create({
      date,
      time,
      status: 'pending',
      clientId,
      barbershopId,
      serviceId
    });
    res.status(201).json(schedule);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erro ao criar agendamento.' });
  }
});

/**
 * Rota: GET /schedules
 * Descrição: Lista todos os agendamentos cadastrados no sistema.
 */
router.get('/', async (req, res) => {
  try {
    const schedules = await Schedule.findAll();
    res.json(schedules);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erro ao buscar agendamentos.' });
  }
});

/**
 * Rota: GET /schedules/filter
 * Descrição: Filtra agendamentos por status, cliente ou barbearia.
 * Query Params aceitos: status, clientId, barbershopId.
 */
router.get('/filter', async (req, res) => {
  const { status, clientId, barbershopId } = req.query;
  const where = {};

  if (status) where.status = status;
  if (clientId) where.clientId = clientId;
  if (barbershopId) where.barbershopId = barbershopId;

  try {
    const schedules = await Schedule.findAll({ where });
    res.json(schedules);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erro ao buscar agendamentos com filtro.' });
  }
});

/**
 * Rota: PUT /schedules/:id/cancel
 * Descrição: Cancela um agendamento (status = 'canceled').
 * Uso principal: clientes podem cancelar.
 */
router.put('/:id/cancel', async (req, res) => {
  const { id } = req.params;

  try {
    const schedule = await Schedule.findByPk(id);
    if (!schedule) {
      return res.status(404).json({ message: 'Agendamento não encontrado.' });
    }

    schedule.status = 'canceled';
    await schedule.save();

    res.json({ message: 'Agendamento cancelado com sucesso!', schedule });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erro ao cancelar agendamento.' });
  }
});

/**
 * Rota: PUT /schedules/:id/status
 * Descrição: Atualiza o status de um agendamento.
 * Aceita valores: pending, confirmed, canceled, completed.
 */
router.put('/:id/status', async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  const validStatuses = ['pending', 'confirmed', 'canceled', 'completed'];
  if (!validStatuses.includes(status)) {
    return res.status(400).json({ message: 'Status inválido.' });
  }

  try {
    const schedule = await Schedule.findByPk(id);
    if (!schedule) {
      return res.status(404).json({ message: 'Agendamento não encontrado.' });
    }

    schedule.status = status;
    await schedule.save();

    res.json({ message: `Status atualizado para '${status}' com sucesso!`, schedule });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erro ao atualizar status do agendamento.' });
  }
});

module.exports = router;