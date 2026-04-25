const express = require('express');
const router = express.Router();
const Schedule = require('../models/Schedule');
const User = require('../models/User');
const Barbershop = require('../models/Barbershop');
const Service = require('../models/Service');

/**
 * Rota: POST /schedules
 * Descrição: Cadastra um novo agendamento de serviço.
 * Espera no corpo: { date, time, clientId, barbershopId, serviceId }
 * Status inicial: 'pending'
 * Adiciona verificação de conflitos de horário
 * Adiciona validação de existência de foreign keys
 * Adiciona validação de datas futuras
 */
router.post('/', async (req, res) => {
  const { date, time, clientId, barbershopId, serviceId } = req.body;

  try {
    //Validar data futura
    const scheduleDate = new Date(date + 'T00:00:00');
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (scheduleDate < today) {
      return res.status(400).json({
        message: 'Não é possível criar agendamento em data passada.'
      });
    }

    // Validar se é hoje e a hora já passou
    if (scheduleDate.getTime() === today.getTime()) {
      const [hours, minutes] = time.split(':');
      const scheduleTime = new Date();
      scheduleTime.setHours(parseInt(hours), parseInt(minutes), 0, 0);

      const now = new Date();
      if (scheduleTime < now) {
        return res.status(400).json({
          message: 'Não é possível criar agendamento em horário que já passou.'
        });
      }
    }

    // Validar formato de hora
    if (!/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/.test(time)) {
      return res.status(400).json({ message: 'Formato de hora inválido.' });
    }

    //Verificar se cliente, barbearia e serviço existem
    const [client, barbershop, service] = await Promise.all([
      User.findByPk(clientId),
      Barbershop.findByPk(barbershopId),
      Service.findByPk(serviceId)
    ]);

    if (!client) {
      return res.status(404).json({ message: 'Cliente não encontrado.' });
    }
    if (!barbershop) {
      return res.status(404).json({ message: 'Barbearia não encontrada.' });
    }
    if (!service) {
      return res.status(404).json({ message: 'Serviço não encontrado.' });
    }

    // Verificar se o serviço pertence à barbearia
    if (service.barbershopId !== parseInt(barbershopId)) {
      return res.status(400).json({
        message: 'Este serviço não pertence à barbearia selecionada.'
      });
    }

    //Verificar se já existe agendamento para esse horário
    const existingSchedule = await Schedule.findOne({
      where: {
        date,
        time,
        barbershopId,
        status: ['pending', 'confirmed'] // Só considera agendamentos ativos
      }
    });

    if (existingSchedule) {
      return res.status(409).json({
        message: 'Este horário já está ocupado. Por favor, escolha outro horário.'
      });
    }

    // Verificar se o cliente já tem um agendamento nesse horário
    const clientHasSchedule = await Schedule.findOne({
      where: {
        date,
        time,
        clientId,
        status: ['pending', 'confirmed']
      }
    });

    if (clientHasSchedule) {
      return res.status(409).json({
        message: 'Você já tem um agendamento neste horário.'
      });
    }

    // Criar agendamento
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

    // Tratamento específico de erros
    if (error.name === 'SequelizeForeignKeyConstraintError') {
      return res.status(400).json({
        message: 'Referência inválida. Verifique se cliente, barbearia e serviço existem.'
      });
    }

    res.status(500).json({ message: 'Erro ao criar agendamento.' });
  }
});

/**
 * Rota: GET /schedules
 * Descrição: Lista todos os agendamentos cadastrados no sistema.
 */
router.get('/', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    const { count, rows } = await Schedule.findAndCountAll({
      include: [
        {
          model: User,
          attributes: ['id', 'name', 'email']
        },
        {
          model: Barbershop,
          attributes: ['id', 'name', 'address', 'phone']
        },
        {
          model: Service,
          attributes: ['id', 'name', 'price', 'duration']
        }
      ],
      limit,
      offset,
      order: [['date', 'DESC'], ['time', 'DESC']]
    });

    res.json({
      schedules: rows,
      pagination: {
        total: count,
        page,
        limit,
        totalPages: Math.ceil(count / limit)
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erro ao buscar agendamentos.' });
  }
});

/**
 * Rota: GET /schedules/client/:clientId
 * Descrição: Busca todos os agendamentos de um cliente específico.
 * Rota adicionada para compatibilidade com frontend
 */
router.get('/client/:clientId', async (req, res) => {
  const { clientId } = req.params;

  try {
    const schedules = await Schedule.findAll({
      where: { clientId },
      include: [
        {
          model: Barbershop,
          attributes: ['id', 'name', 'address', 'phone']
        },
        {
          model: Service,
          attributes: ['id', 'name', 'price', 'duration']
        }
      ],
      order: [['date', 'DESC'], ['time', 'DESC']]
    });
    res.json({schedules});
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erro ao buscar agendamentos.' });
  }
});

/**
 * Rota: GET /schedules/barbershop/:barbershopId
 * Descrição: Busca todos os agendamentos de uma barbearia específica.
 * Rota adicionada para compatibilidade com frontend
 */
router.get('/barbershop/:barbershopId', async (req, res) => {
  const { barbershopId } = req.params;

  try {
    const schedules = await Schedule.findAll({
      where: { barbershopId },
      include: [
        {
          model: User,
          attributes: ['id', 'name', 'email']
        },
        {
          model: Service,
          attributes: ['id', 'name', 'price', 'duration']
        }
      ],
      order: [['date', 'DESC'], ['time', 'DESC']]
    });
    res.json({schedules});
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
    const schedules = await Schedule.findAll({
      where,
      include: [
        {
          model: User,
          attributes: ['id', 'name', 'email']
        },
        {
          model: Barbershop,
          attributes: ['id', 'name', 'address', 'phone']
        },
        {
          model: Service,
          attributes: ['id', 'name', 'price', 'duration']
        }
      ],
      order: [['date', 'DESC'], ['time', 'DESC']]
    });
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
/**
 * Rota: DELETE /schedules/:id
 * Descrição: Deleta um agendamento permanentemente (hard delete).
 */
router.delete('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const schedule = await Schedule.findByPk(id);
    if (!schedule) {
      return res.status(404).json({ message: 'Agendamento não encontrado.' });
    }

    await schedule.destroy();
    res.json({ message: 'Agendamento excluído permanentemente!' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erro ao excluir agendamento.' });
  }
});

module.exports = router;