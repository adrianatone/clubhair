/**
 * ClubHair - Módulo de Autenticação
 * Gerencia o estado de autenticação do usuário
 */

const Auth = {
  
  /**
   * Salvar dados do usuário no localStorage
   * @param {object} user - Dados do usuário
   */
  saveUser(user) {
    try {
      localStorage.setItem('clubhair_user', JSON.stringify(user));
    } catch (error) {
      console.error('Erro ao salvar usuário:', error);
    }
  },
  
  /**
   * Obter dados do usuário logado
   * @returns {object|null} - Dados do usuário ou null se não estiver logado
   */
  getUser() {
    try {
      const user = localStorage.getItem('clubhair_user');
      return user ? JSON.parse(user) : null;
    } catch (error) {
      console.error('Erro ao obter usuário:', error);
      return null;
    }
  },
  
  /**
   * Verificar se o usuário está logado
   * @returns {boolean} - true se estiver logado, false caso contrário
   */
  isAuthenticated() {
    return this.getUser() !== null;
  },
  
  /**
   * Verificar se o usuário é um cliente
   * @returns {boolean} - true se for cliente
   */
  isClient() {
    const user = this.getUser();
    return user && user.userType === 'client';
  },
  
  /**
   * Verificar se o usuário é uma barbearia
   * @returns {boolean} - true se for barbearia
   */
  isBarbershop() {
    const user = this.getUser();
    return user && user.userType === 'barbershop';
  },
  
  /**
   * Verificar tipo de usuário e redirecionar se necessário
   * @param {string} requiredType - Tipo de usuário necessário (client ou barbershop)
   * @param {string} redirectUrl - URL para redirecionar se o tipo não for o correto
   */
  requireUserType(requiredType, redirectUrl = '/') {
    const user = this.getUser();
    
    if (!user) {
      window.location.href = redirectUrl;
      return false;
    }
    
    if (user.userType !== requiredType) {
      UI.showAlert('Você não tem permissão para acessar esta página.', 'error');
      window.location.href = redirectUrl;
      return false;
    }
    
    return true;
  },
  
  /**
   * Fazer logout do usuário
   * @param {string} redirectUrl - URL para redirecionar após logout (padrão: /)
   */
  logout(redirectUrl = '/') {
    try {
      localStorage.removeItem('clubhair_user');
      window.location.href = redirectUrl;
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    }
  },
  
  /**
   * Atualizar dados do usuário no localStorage
   * @param {object} userData - Dados a serem atualizados
   */
  updateUser(userData) {
    const user = this.getUser();
    if (user) {
      const updatedUser = { ...user, ...userData };
      this.saveUser(updatedUser);
    }
  },
  
  /**
   * Fazer login do usuário
   * @param {string} email - Email do usuário
   * @param {string} password - Senha do usuário
   * @returns {Promise} - Promise com os dados do usuário logado
   */
  async login(email, password) {
    try {
      const response = await API.loginUser(email, password);
      
      if (response.user) {

        const user = {
          ...response.user,
          userType: response.user.type || response.user.userType
        };
        
        this.saveUser(user);
        return { ...response, user };
      }
      
      throw new Error('Dados de login inválidos');
    } catch (error) {
      throw error;
    }
  },
  
  /**
   * Registrar novo usuário
   * @param {object} userData - Dados do usuário
   * @returns {Promise} - Promise com os dados do usuário criado
   */
  async register(userData) {
    try {
      console.log('🔐 Auth.register - Dados recebidos:', userData);
      const response = await API.registerUser(userData);
      console.log('🔐 Auth.register - Resposta da API:', response);
      
      if (response.user) {
        console.log('✅ Usuário encontrado na resposta, salvando...');
        
        // Normalizar o campo 'type' para 'userType' para consistência no frontend
        const user = {
          ...response.user,
          userType: response.user.type || response.user.userType
        };
        
        this.saveUser(user);
        return { ...response, user };
      }
      
      console.log('⚠️ Resposta não contém propriedade "user"');
      throw new Error('Erro ao registrar usuário');
    } catch (error) {
      console.error('❌ Auth.register - Erro:', error);
      throw error;
    }
  }
};
