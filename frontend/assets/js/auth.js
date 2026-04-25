/**
 * ClubHair - Módulo de Autenticação
 * Gerencia o estado de autenticação do usuário
 */

const Auth = {

  saveUser(user) {
    try {
      localStorage.setItem('clubhair_user', JSON.stringify(user));
    } catch (error) {
      console.error('Erro ao salvar usuário:', error);
    }
  },

  getUser() {
    try {
      const user = localStorage.getItem('clubhair_user');
      return user ? JSON.parse(user) : null;
    } catch (error) {
      console.error('Erro ao obter usuário:', error);
      return null;
    }
  },

  isAuthenticated() {
    return this.getUser() !== null;
  },

  isClient() {
    const user = this.getUser();
    if (!user) return false;
    const type = user.userType || user.type;
    return type === 'client';
  },

  isBarbershop() {
    const user = this.getUser();
    if (!user) return false;
    const type = user.userType || user.type;
    return type === 'barbershop';
  },

  requireUserType(requiredType, redirectUrl = '/') {
    const user = this.getUser();

    if (!user) {
      window.location.href = redirectUrl;
      return false;
    }

    const type = user.userType || user.type;
    if (type !== requiredType) {
      if (typeof UI !== 'undefined') {
        UI.showAlert('Você não tem permissão para acessar esta página.', 'error');
      }
      window.location.href = redirectUrl;
      return false;
    }

    return true;
  },

  logout(redirectUrl = '/') {
    try {
      localStorage.removeItem('clubhair_user');
      window.location.href = redirectUrl;
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    }
  },

  updateUser(userData) {
    const user = this.getUser();
    if (user) {
      const updatedUser = { ...user, ...userData };
      this.saveUser(updatedUser);
    }
  },

  async login(email, password) {
    const response = await API.loginUser(email, password);

    if (!response.user) {
      throw new Error('Dados de login inválidos');
    }

    const user = {
      ...response.user,
      userType: response.user.type || response.user.userType
    };

    this.saveUser(user);
    return { ...response, user };
  },

  async register(userData) {
    console.log('🔐 Auth.register - Dados recebidos:', userData);
    const response = await API.registerUser(userData);
    console.log('🔐 Auth.register - Resposta da API:', response);

    if (!response.user) {
      throw new Error('Erro ao registrar usuário');
    }

    const user = {
      ...response.user,
      userType: response.user.type || response.user.userType
    };

    this.saveUser(user);
    return { ...response, user };
  }
};
