/**
 * ClubHair - Módulo de API
 * Gerencia todas as comunicações com o backend
 */

const API = {
  baseURL: 'http://localhost:3000',

  /**
   * Método genérico para fazer requisições HTTP
   * @param {string} endpoint - Endpoint da API
   * @param {object} options - Opções da requisição (method, body, headers)
   * @returns {Promise} - Promise com a resposta da API
   */
  async request(endpoint, options = {}) {
    const config = {
      method: options.method || 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      }
    };

    if (options.body) {
      config.body = JSON.stringify(options.body);
    }

    console.log(`🌐 API Request: ${options.method || 'GET'} ${this.baseURL}${endpoint}`);
    console.log('📦 Request Body:', options.body);

    try {
      const response = await fetch(`${this.baseURL}${endpoint}`, config);
      const data = await response.json();

      console.log(`📡 Response Status: ${response.status}`, response.ok ? '✅' : '❌');
      console.log('📥 Response Data:', data);

      if (!response.ok) {
        throw new Error(data.message || 'Erro na requisição');
      }

      return data;
    } catch (error) {
      console.error('❌ Erro na API:', error);
      throw error;
    }
  },

  // ========== USUÁRIOS ==========

  /**
   * Registrar novo usuário
   * @param {object} userData - Dados do usuário (name, email, password, phone, userType)
   * @returns {Promise} - Promise com os dados do usuário criado
   */
  async registerUser(userData) {
    return await this.request('/users', {
      method: 'POST',
      body: userData
    });
  },

  /**
   * Login de usuário
   * @param {string} email - Email do usuário
   * @param {string} password - Senha do usuário
   * @returns {Promise} - Promise com os dados do usuário logado
   */
  async loginUser(email, password) {
    return await this.request('/users/login', {
      method: 'POST',
      body: { email, password }
    });
  },

  /**
   * Obter usuário por ID
   * @param {number} userId - ID do usuário
   * @returns {Promise} - Promise com os dados do usuário
   */
  async getUser(userId) {
    return await this.request(`/users/${userId}`);
  },

  /**
   * Atualizar usuário
   * @param {number} userId - ID do usuário
   * @param {object} userData - Dados a serem atualizados
   * @returns {Promise} - Promise com os dados atualizados
   */
  async updateUser(userId, userData) {
    return await this.request(`/users/${userId}`, {
      method: 'PUT',
      body: userData
    });
  },

  /**
   * Deletar usuário
   * @param {number} userId - ID do usuário
   * @returns {Promise}
   */
  async deleteUser(userId) {
    return await this.request(`/users/${userId}`, {
      method: 'DELETE'
    });
  },

  // ========== BARBEARIAS ==========

  /**
   * Criar nova barbearia
   * @param {object} barbershopData - Dados da barbearia
   * @returns {Promise} - Promise com os dados da barbearia criada
   */
  async createBarbershop(barbershopData) {
    return await this.request('/barbershops', {
      method: 'POST',
      body: barbershopData
    });
  },

  /**
   * Listar todas as barbearias
   * @returns {Promise} - Promise com array de barbearias
   */
  async getAllBarbershops() {
    return await this.request('/barbershops');
  },

  /**
   * Obter barbearia por ID
   * @param {number} barbershopId - ID da barbearia
   * @returns {Promise} - Promise com os dados da barbearia
   */
  async getBarbershop(barbershopId) {
    return await this.request(`/barbershops/${barbershopId}`);
  },

  /**
   * Obter barbearia por userId
   * @param {number} userId - ID do usuário dono da barbearia
   * @returns {Promise} - Promise com os dados da barbearia
   */
  async getBarbershopByUserId(userId) {
    return await this.request(`/barbershops/user/${userId}`);
  },

  /**
   * Atualizar barbearia
   * @param {number} barbershopId - ID da barbearia
   * @param {object} barbershopData - Dados a serem atualizados
   * @returns {Promise} - Promise com os dados atualizados
   */
  async updateBarbershop(barbershopId, barbershopData) {
    return await this.request(`/barbershops/${barbershopId}`, {
      method: 'PUT',
      body: barbershopData
    });
  },

  /**
   * Deletar barbearia
   * @param {number} barbershopId - ID da barbearia
   * @returns {Promise}
   */
  async deleteBarbershop(barbershopId) {
    return await this.request(`/barbershops/${barbershopId}`, {
      method: 'DELETE'
    });
  },



  // ========== SERVIÇOS ==========

  /**
   * Criar novo serviço
   * @param {object} serviceData - Dados do serviço
   * @returns {Promise} - Promise com os dados do serviço criado
   */
  async createService(serviceData) {
    return await this.request('/services', {
      method: 'POST',
      body: serviceData
    });
  },

  /**
   * Listar serviços de uma barbearia
   * @param {number} barbershopId - ID da barbearia
   * @returns {Promise} - Promise com array de serviços
   */
  async getServicesByBarbershop(barbershopId) {
    return await this.request(`/services?barbershopId=${barbershopId}`);
  },

  /**
   * Obter serviço por ID
   * @param {number} serviceId - ID do serviço
   * @returns {Promise} - Promise com os dados do serviço
   */
  async getService(serviceId) {
    return await this.request(`/services/${serviceId}`);
  },

  /**
   * Atualizar serviço
   * @param {number} serviceId - ID do serviço
   * @param {object} serviceData - Dados a serem atualizados
   * @returns {Promise} - Promise com os dados atualizados
   */
  async updateService(serviceId, serviceData) {
    return await this.request(`/services/${serviceId}`, {
      method: 'PUT',
      body: serviceData
    });
  },

  /**
   * Deletar serviço
   * @param {number} serviceId - ID do serviço
   * @returns {Promise}
   */
  async deleteService(serviceId) {
    return await this.request(`/services/${serviceId}`, {
      method: 'DELETE'
    });
  },

  // ========== AGENDAMENTOS ==========

  /**
   * Criar novo agendamento
   * @param {object} scheduleData - Dados do agendamento
   * @returns {Promise} - Promise com os dados do agendamento criado
   */
  async createSchedule(scheduleData) {
    return await this.request('/schedules', {
      method: 'POST',
      body: scheduleData
    });
  },

  /**
   * Listar agendamentos do cliente
   * @param {number} clientId - ID do cliente
   * @returns {Promise} - Promise com array de agendamentos
   */
  async getSchedulesByClient(clientId) {
    return await this.request(`/schedules/client/${clientId}`);
  },

  /**
   * Listar agendamentos da barbearia
   * @param {number} barbershopId - ID da barbearia
   * @returns {Promise} - Promise com array de agendamentos
   */
  async getSchedulesByBarbershop(barbershopId) {
    return await this.request(`/schedules/barbershop/${barbershopId}`);
  },

  /**
   * Obter agendamento por ID
   * @param {number} scheduleId - ID do agendamento
   * @returns {Promise} - Promise com os dados do agendamento
   */
  async getSchedule(scheduleId) {
    return await this.request(`/schedules/${scheduleId}`);
  },

  /**
   * Atualizar status do agendamento
   * @param {number} scheduleId - ID do agendamento
   * @param {string} status - Novo status (pending, confirmed, completed, cancelled)
   * @returns {Promise} - Promise com os dados atualizados
   */
  async updateScheduleStatus(scheduleId, status) {
    return await this.request(`/schedules/${scheduleId}/status`, {
      method: 'PUT',
      body: { status }
    });
  },

  /**
   * Deletar agendamento
   * @param {number} scheduleId - ID do agendamento
   * @returns {Promise}
   */
  async deleteSchedule(scheduleId) {
    return await this.request(`/schedules/${scheduleId}/status`, {
      method: 'DELETE'
    });
  }
};
