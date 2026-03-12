/**
 * ClubHair - Módulo de Utilitários
 * Funções auxiliares para formatação, validação e manipulação de dados
 */

const Utils = {
  
  // ========== VALIDAÇÃO ==========
  
  /**
   * Validar email
   * @param {string} email - Email a ser validado
   * @returns {boolean} - true se válido
   */
  validateEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  },
  
  /**
   * Validar senha (mínimo 6 caracteres)
   * @param {string} password - Senha a ser validada
   * @returns {boolean} - true se válida
   */
  validatePassword(password) {
    return password && password.length >= 6;
  },
  
  /**
   * Validar telefone (formato brasileiro)
   * @param {string} phone - Telefone a ser validado
   * @returns {boolean} - true se válido
   */
  validatePhone(phone) {
    const cleaned = phone.replace(/\D/g, '');
    return cleaned.length === 10 || cleaned.length === 11;
  },
  
  /**
   * Validar campo obrigatório
   * @param {string} value - Valor a ser validado
   * @returns {boolean} - true se não estiver vazio
   */
  validateRequired(value) {
    return value && value.trim().length > 0;
  },
  
  /**
   * Validar número
   * @param {any} value - Valor a ser validado
   * @returns {boolean} - true se for um número válido
   */
  validateNumber(value) {
    return !isNaN(parseFloat(value)) && isFinite(value);
  },
  
  // ========== FORMATAÇÃO ==========
  
  /**
   * Formatar telefone brasileiro
   * @param {string} phone - Telefone a ser formatado
   * @returns {string} - Telefone formatado
   */
  formatPhone(phone) {
    const cleaned = phone.replace(/\D/g, '');
    
    if (cleaned.length === 11) {
      return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2, 7)}-${cleaned.slice(7)}`;
    }
    
    if (cleaned.length === 10) {
      return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2, 6)}-${cleaned.slice(6)}`;
    }
    
    return phone;
  },
  
  /**
   * Formatar moeda brasileira (R$)
   * @param {number} value - Valor a ser formatado
   * @returns {string} - Valor formatado
   */
  formatCurrency(value) {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  },
  
  /**
   * Formatar data
   * @param {string|Date} date - Data a ser formatada
   * @param {boolean} includeTime - Incluir hora na formatação
   * @returns {string} - Data formatada
   */
  formatDate(date, includeTime = false) {
    const dateObj = new Date(date);
    
    const options = {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    };
    
    if (includeTime) {
      options.hour = '2-digit';
      options.minute = '2-digit';
    }
    
    return dateObj.toLocaleString('pt-BR', options);
  },
  
  /**
   * Formatar hora
   * @param {string} time - Hora no formato HH:mm ou HH:mm:ss
   * @returns {string} - Hora formatada (HH:mm)
   */
  formatTime(time) {
    if (!time) return '';
    return time.slice(0, 5);
  },
  
  /**
   * Capitalizar primeira letra
   * @param {string} str - String a ser capitalizada
   * @returns {string} - String capitalizada
   */
  capitalize(str) {
    if (!str) return '';
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  },
  
  /**
   * Truncar texto
   * @param {string} text - Texto a ser truncado
   * @param {number} maxLength - Tamanho máximo
   * @returns {string} - Texto truncado
   */
  truncate(text, maxLength = 50) {
    if (!text) return '';
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength) + '...';
  },
  
  // ========== STATUS ==========
  
  /**
   * Obter texto do status em português
   * @param {string} status - Status em inglês
   * @returns {string} - Status em português
   */
  getStatusText(status) {
    const statusMap = {
      'pending': 'Pendente',
      'confirmed': 'Confirmado',
      'completed': 'Concluído',
      'cancelled': 'Cancelado'
    };
    
    return statusMap[status] || status;
  },
  
  /**
   * Obter classe CSS do status
   * @param {string} status - Status
   * @returns {string} - Classe CSS
   */
  getStatusClass(status) {
    const classMap = {
      'pending': 'badge-pending',
      'confirmed': 'badge-info',
      'completed': 'badge-success',
      'cancelled': 'badge-error'
    };
    
    return classMap[status] || 'badge-info';
  },
  
  // ========== DATA E HORA ==========
  
  /**
   * Obter data atual no formato YYYY-MM-DD
   * @returns {string} - Data atual
   */
  getTodayDate() {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  },
  
  /**
   * Obter hora atual no formato HH:mm
   * @returns {string} - Hora atual
   */
  getCurrentTime() {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    return `${hours}:${minutes}`;
  },
  
  /**
   * Verificar se uma data é futura
   * @param {string} date - Data a ser verificada (YYYY-MM-DD)
   * @returns {boolean} - true se for futura
   */
  isFutureDate(date) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const targetDate = new Date(date + 'T00:00:00');
    
    return targetDate >= today;
  },
  
  /**
   * Verificar se uma hora é futura (considerando data de hoje)
   * @param {string} time - Hora a ser verificada (HH:mm)
   * @returns {boolean} - true se for futura
   */
  isFutureTime(time) {
    const now = new Date();
    const [hours, minutes] = time.split(':');
    const targetTime = new Date();
    targetTime.setHours(parseInt(hours), parseInt(minutes), 0, 0);
    
    return targetTime > now;
  },
  
  // ========== DOM ==========
  
  /**
   * Criar elemento HTML com atributos
   * @param {string} tag - Tag HTML
   * @param {object} attributes - Atributos do elemento
   * @param {string} content - Conteúdo do elemento
   * @returns {HTMLElement} - Elemento criado
   */
  createElement(tag, attributes = {}, content = '') {
    const element = document.createElement(tag);
    
    Object.keys(attributes).forEach(key => {
      if (key === 'className') {
        element.className = attributes[key];
      } else if (key === 'dataset') {
        Object.keys(attributes[key]).forEach(dataKey => {
          element.dataset[dataKey] = attributes[key][dataKey];
        });
      } else {
        element.setAttribute(key, attributes[key]);
      }
    });
    
    if (content) {
      element.innerHTML = content;
    }
    
    return element;
  },
  
  /**
   * Escapar HTML para prevenir XSS
   * @param {string} html - HTML a ser escapado
   * @returns {string} - HTML escapado
   */
  escapeHtml(html) {
    const div = document.createElement('div');
    div.textContent = html;
    return div.innerHTML;
  },
  
  // ========== DEBOUNCE E THROTTLE ==========
  
  /**
   * Debounce - atrasa a execução de uma função
   * @param {Function} func - Função a ser executada
   * @param {number} wait - Tempo de espera em ms
   * @returns {Function} - Função com debounce
   */
  debounce(func, wait = 300) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  },
  
  /**
   * Copiar texto para área de transferência
   * @param {string} text - Texto a ser copiado
   * @returns {Promise} - Promise que resolve quando o texto for copiado
   */
  async copyToClipboard(text) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch (error) {
      console.error('Erro ao copiar texto:', error);
      return false;
    }
  }
};
