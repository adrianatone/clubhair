/**
 * ClubHair - Módulo de Utilitários
 * Funções auxiliares para formatação, validação e manipulação de dados
 */

const Utils = {

  // ========== VALIDAÇÃO ==========

  validateEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  },

  validatePassword(password) {
    return password && password.length >= 6;
  },

  validatePhone(phone) {
    const cleaned = phone.replace(/\D/g, '');
    return cleaned.length === 10 || cleaned.length === 11;
  },

  validateRequired(value) {
    return value && value.trim().length > 0;
  },

  validateNumber(value) {
    return !isNaN(parseFloat(value)) && isFinite(value);
  },

  // ========== FORMATAÇÃO ==========

  formatPhone(phone) {
    if (!phone) return '';
    const cleaned = phone.replace(/\D/g, '');

    if (cleaned.length === 11) {
      return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2, 7)}-${cleaned.slice(7)}`;
    }

    if (cleaned.length === 10) {
      return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2, 6)}-${cleaned.slice(6)}`;
    }

    return phone;
  },

  formatCurrency(value) {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  },

  formatDate(date, includeTime = false) {
    if (!date) return '';
    // Força interpretação como UTC para evitar off-by-one de timezone
    const dateObj = new Date(date + (date.includes('T') ? '' : 'T00:00:00'));

    const options = {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      timeZone: 'America/Sao_Paulo'
    };

    if (includeTime) {
      options.hour = '2-digit';
      options.minute = '2-digit';
    }

    return dateObj.toLocaleString('pt-BR', options);
  },

  formatTime(time) {
    if (!time) return '';
    return time.slice(0, 5);
  },

  capitalize(str) {
    if (!str) return '';
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  },

  truncate(text, maxLength = 50) {
    if (!text) return '';
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength) + '...';
  },

  // ========== STATUS ==========

  getStatusText(status) {
    const statusMap = {
      pending:   'Pendente',
      confirmed: 'Confirmado',
      completed: 'Concluído',
      canceled:  'Cancelado'
    };
    return statusMap[status] || status;
  },

  getStatusClass(status) {
    const classMap = {
      pending:   'badge-pending',
      confirmed: 'badge-info',
      completed: 'badge-success',
      canceled:  'badge-error'
    };
    return classMap[status] || 'badge-info';
  },

  // ========== DATA E HORA ==========

  getTodayDate() {
    const today = new Date();
    const year  = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day   = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  },

  getCurrentTime() {
    const now     = new Date();
    const hours   = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    return `${hours}:${minutes}`;
  },

  isFutureDate(date) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const targetDate = new Date(date + 'T00:00:00');
    return targetDate >= today;
  },

  isFutureTime(time) {
    const now = new Date();
    const [hours, minutes] = time.split(':');
    const targetTime = new Date();
    targetTime.setHours(parseInt(hours), parseInt(minutes), 0, 0);
    return targetTime > now;
  },

  // ========== DOM ==========

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

  escapeHtml(html) {
    if (html === null || html === undefined) return '';
    const div = document.createElement('div');
    div.textContent = String(html);
    return div.innerHTML;
  },

  // ========== DEBOUNCE ==========

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
