/**
 * ClubHair - Módulo de API
 * Gerencia todas as comunicações com o backend
 */

const API = {
  baseURL: 'https://api-clubhair.onrender.com',

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

    console.log(`🌐 API Request: ${config.method} ${this.baseURL}${endpoint}`);
    if (options.body) console.log('📦 Request Body:', options.body);

    try {
      const response = await fetch(`${this.baseURL}${endpoint}`, config);
      const data = await response.json();

      console.log(`📡 Response ${response.status}`, response.ok ? '✅' : '❌');
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

  async registerUser(userData) {
    return await this.request('/users', { method: 'POST', body: userData });
  },

  async loginUser(email, password) {
    return await this.request('/users/login', { method: 'POST', body: { email, password } });
  },

  async getUser(userId) {
    return await this.request(`/users/${userId}`);
  },

  async updateUser(userId, userData) {
    return await this.request(`/users/${userId}`, { method: 'PUT', body: userData });
  },

  async deleteUser(userId) {
    return await this.request(`/users/${userId}`, { method: 'DELETE' });
  },

  // ========== BARBEARIAS ==========

  async createBarbershop(barbershopData) {
    return await this.request('/barbershops', { method: 'POST', body: barbershopData });
  },

  async getAllBarbershops() {
    return await this.request('/barbershops');
  },

  async getBarbershop(barbershopId) {
    return await this.request(`/barbershops/${barbershopId}`);
  },

  async getBarbershopByUserId(userId) {
    return await this.request(`/barbershops/user/${userId}`);
  },

  async updateBarbershop(barbershopId, barbershopData) {
    return await this.request(`/barbershops/${barbershopId}`, { method: 'PUT', body: barbershopData });
  },

  async deleteBarbershop(barbershopId) {
    return await this.request(`/barbershops/${barbershopId}`, { method: 'DELETE' });
  },

  // ========== SERVIÇOS ==========

  async createService(serviceData) {
    return await this.request('/services', { method: 'POST', body: serviceData });
  },

  async getServicesByBarbershop(barbershopId) {
    return await this.request(`/services?barbershopId=${barbershopId}`);
  },

  async getService(serviceId) {
    return await this.request(`/services/${serviceId}`);
  },

  async updateService(serviceId, serviceData) {
    return await this.request(`/services/${serviceId}`, { method: 'PUT', body: serviceData });
  },

  async deleteService(serviceId) {
    return await this.request(`/services/${serviceId}`, { method: 'DELETE' });
  },

  // ========== AGENDAMENTOS ==========

  async createSchedule(scheduleData) {
    return await this.request('/schedules', { method: 'POST', body: scheduleData });
  },

  async getSchedulesByClient(clientId) {
    return await this.request(`/schedules/client/${clientId}`);
  },

  async getSchedulesByBarbershop(barbershopId) {
    return await this.request(`/schedules/barbershop/${barbershopId}`);
  },

  async getSchedule(scheduleId) {
    return await this.request(`/schedules/${scheduleId}`);
  },

  /**
   * Atualiza o status de um agendamento.
   * Status válidos (conforme ENUM do banco): pending | confirmed | completed | canceled
   * CORREÇÃO: 'canceled' com 1 'l' — alinhado com o backend.
   */
  async updateScheduleStatus(scheduleId, status) {
    return await this.request(`/schedules/${scheduleId}/status`, {
      method: 'PUT',
      body: { status }
    });
  },

  /**
   * CORREÇÃO: URL corrigida de `/schedules/${scheduleId}/status` para `/schedules/${scheduleId}`
   * O endpoint DELETE correto é DELETE /schedules/:id
   */
  async deleteSchedule(scheduleId) {
    return await this.request(`/schedules/${scheduleId}`, { method: 'DELETE' });
  }
};
