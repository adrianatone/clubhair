/**
 * ClubHair - Módulo de UI
 * Funções para manipulação da interface do usuário
 */

const UI = {
  
  // ========== ALERTAS ==========
  
  /**
   * Mostrar alerta
   * @param {string} message - Mensagem do alerta
   * @param {string} type - Tipo do alerta (success, error, warning, info)
   * @param {number} duration - Duração em ms (0 para não fechar automaticamente)
   */
  showAlert(message, type = 'info', duration = 5000) {
    // Remove alertas anteriores
    this.removeAlerts();
    
    const alertElement = Utils.createElement('div', {
      className: `alert alert-${type}`,
      role: 'alert',
      'aria-live': 'assertive'
    }, `
      <span>${Utils.escapeHtml(message)}</span>
      <button class="alert-close" aria-label="Fechar alerta">
        <i class="fas fa-times"></i>
      </button>
    `);
    
    // Inserir no topo da página
    document.body.insertAdjacentElement('afterbegin', alertElement);
    
    // Botão de fechar
    const closeBtn = alertElement.querySelector('.alert-close');
    closeBtn.addEventListener('click', () => {
      alertElement.remove();
    });
    
    // Fechar automaticamente
    if (duration > 0) {
      setTimeout(() => {
        if (alertElement.parentElement) {
          alertElement.remove();
        }
      }, duration);
    }
  },
  
  /**
   * Remover todos os alertas
   */
  removeAlerts() {
    const alerts = document.querySelectorAll('.alert');
    alerts.forEach(alert => alert.remove());
  },
  
  // ========== LOADING ==========
  
  /**
   * Mostrar loading overlay
   * @param {string} message - Mensagem de loading
   */
  showLoading(message = 'Carregando...') {
    // Remove loading anterior se existir
    this.hideLoading();
    
    const loadingElement = Utils.createElement('div', {
      className: 'loading-overlay',
      role: 'status',
      'aria-live': 'polite'
    }, `
      <div class="spinner"></div>
      <p class="loading-text">${Utils.escapeHtml(message)}</p>
    `);
    
    document.body.appendChild(loadingElement);
  },
  
  /**
   * Esconder loading overlay
   */
  hideLoading() {
    const loading = document.querySelector('.loading-overlay');
    if (loading) {
      loading.remove();
    }
  },
  
  // ========== MODAL ==========
  
  /**
   * Mostrar modal
   * @param {string} title - Título do modal
   * @param {string} content - Conteúdo do modal (HTML)
   * @param {Array} buttons - Array de botões {text, className, onClick}
   * @returns {HTMLElement} - Elemento do modal
   */
  showModal(title, content, buttons = []) {
    // Remove modal anterior se existir
    this.hideModal();
    
    const modalOverlay = Utils.createElement('div', {
      className: 'modal-overlay',
      role: 'dialog',
      'aria-modal': 'true',
      'aria-labelledby': 'modal-title'
    });
    
    const modal = Utils.createElement('div', {
      className: 'modal'
    });
    
    // Header
    const header = Utils.createElement('div', {
      className: 'modal-header'
    }, `
      <h2 class="modal-title" id="modal-title">${Utils.escapeHtml(title)}</h2>
      <button class="modal-close" aria-label="Fechar modal">
        <i class="fas fa-times"></i>
      </button>
    `);
    
    // Body
    const body = Utils.createElement('div', {
      className: 'modal-body'
    }, content);
    
    // Footer
    const footer = Utils.createElement('div', {
      className: 'modal-footer'
    });
    
    // Adicionar botões
    buttons.forEach(button => {
      const btn = Utils.createElement('button', {
        className: button.className || 'btn btn-primary'
      }, button.text);
      
      btn.addEventListener('click', () => {
        if (button.onClick) {
          button.onClick();
        }
        this.hideModal();
      });
      
      footer.appendChild(btn);
    });
    
    // Montar modal
    modal.appendChild(header);
    modal.appendChild(body);
    if (buttons.length > 0) {
      modal.appendChild(footer);
    }
    modalOverlay.appendChild(modal);
    
    // Botão de fechar
    const closeBtn = header.querySelector('.modal-close');
    closeBtn.addEventListener('click', () => {
      this.hideModal();
    });
    
    // Fechar ao clicar fora
    modalOverlay.addEventListener('click', (e) => {
      if (e.target === modalOverlay) {
        this.hideModal();
      }
    });
    
    // Fechar com ESC
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        this.hideModal();
        document.removeEventListener('keydown', handleEscape);
      }
    };
    document.addEventListener('keydown', handleEscape);
    
    document.body.appendChild(modalOverlay);
    
    return modal;
  },
  
  /**
   * Esconder modal
   */
  hideModal() {
    const modal = document.querySelector('.modal-overlay');
    if (modal) {
      modal.remove();
    }
  },
  
  /**
   * Modal de confirmação
   * @param {string} title - Título
   * @param {string} message - Mensagem
   * @param {Function} onConfirm - Callback ao confirmar
   * @param {Function} onCancel - Callback ao cancelar
   */
  confirmModal(title, message, onConfirm, onCancel = null) {
    this.showModal(title, `<p>${Utils.escapeHtml(message)}</p>`, [
      {
        text: 'Cancelar',
        className: 'btn btn-outline',
        onClick: () => {
          if (onCancel) onCancel();
        }
      },
      {
        text: 'Confirmar',
        className: 'btn btn-primary',
        onClick: onConfirm
      }
    ]);
  },
  
  // ========== VALIDAÇÃO DE FORMULÁRIOS ==========
  
  /**
   * Mostrar erro em campo de formulário
   * @param {HTMLElement} input - Campo de input
   * @param {string} message - Mensagem de erro
   */
  showFieldError(input, message) {
    // Remove erro anterior
    this.clearFieldError(input);
    
    input.classList.add('error');
    input.setAttribute('aria-invalid', 'true');
    
    const errorElement = Utils.createElement('span', {
      className: 'form-error',
      role: 'alert'
    }, Utils.escapeHtml(message));
    
    input.parentElement.appendChild(errorElement);
  },
  
  /**
   * Limpar erro de campo de formulário
   * @param {HTMLElement} input - Campo de input
   */
  clearFieldError(input) {
    input.classList.remove('error');
    input.removeAttribute('aria-invalid');
    
    const error = input.parentElement.querySelector('.form-error');
    if (error) {
      error.remove();
    }
  },
  
  /**
   * Validar formulário
   * @param {HTMLFormElement} form - Formulário a ser validado
   * @param {object} rules - Regras de validação {fieldName: {required, email, phone, etc}}
   * @returns {boolean} - true se válido
   */
  validateForm(form, rules) {
    let isValid = true;
    
    Object.keys(rules).forEach(fieldName => {
      const input = form.querySelector(`[name="${fieldName}"]`);
      if (!input) return;
      
      const value = input.value.trim();
      const fieldRules = rules[fieldName];
      
      // Limpar erro anterior
      this.clearFieldError(input);
      
      // Validar obrigatoriedade
      if (fieldRules.required && !Utils.validateRequired(value)) {
        this.showFieldError(input, 'Este campo é obrigatório');
        isValid = false;
        return;
      }
      
      // Se campo não é obrigatório e está vazio, pular outras validações
      if (!fieldRules.required && !value) {
        return;
      }
      
      // Validar email
      if (fieldRules.email && !Utils.validateEmail(value)) {
        this.showFieldError(input, 'Email inválido');
        isValid = false;
        return;
      }
      
      // Validar senha
      if (fieldRules.password && !Utils.validatePassword(value)) {
        this.showFieldError(input, 'Senha deve ter no mínimo 6 caracteres');
        isValid = false;
        return;
      }
      
      // Validar telefone
      if (fieldRules.phone && !Utils.validatePhone(value)) {
        this.showFieldError(input, 'Telefone inválido');
        isValid = false;
        return;
      }
      
      // Validar número
      if (fieldRules.number && !Utils.validateNumber(value)) {
        this.showFieldError(input, 'Deve ser um número válido');
        isValid = false;
        return;
      }
      
      // Validar tamanho mínimo
      if (fieldRules.minLength && value.length < fieldRules.minLength) {
        this.showFieldError(input, `Deve ter no mínimo ${fieldRules.minLength} caracteres`);
        isValid = false;
        return;
      }
      
      // Validar tamanho máximo
      if (fieldRules.maxLength && value.length > fieldRules.maxLength) {
        this.showFieldError(input, `Deve ter no máximo ${fieldRules.maxLength} caracteres`);
        isValid = false;
        return;
      }
      
      // Validação customizada
      if (fieldRules.custom && !fieldRules.custom(value)) {
        this.showFieldError(input, fieldRules.customMessage || 'Valor inválido');
        isValid = false;
        return;
      }
    });
    
    return isValid;
  },
  
  // ========== RENDERIZAÇÃO ==========
  
  /**
   * Renderizar lista vazia
   * @param {HTMLElement} container - Container onde renderizar
   * @param {string} message - Mensagem a exibir
   * @param {string} icon - Ícone FontAwesome
   */
  renderEmptyState(container, message, icon = 'fa-inbox') {
    container.innerHTML = `
      <div class="empty-state">
        <div class="empty-state-icon">
          <i class="fas ${icon}"></i>
        </div>
        <p class="empty-state-text">${Utils.escapeHtml(message)}</p>
      </div>
    `;
  }
};
