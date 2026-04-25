/**
 * ClubHair - Módulo de UI
 * Funções para manipulação da interface do usuário
 */

const UI = {

  // ========== ALERTAS ==========

  showAlert(message, type = 'info', duration = 5000) {
    this.removeAlerts();

    const alertElement = Utils.createElement('div', {
      className: `alert alert-${type}`,
      role: 'alert',
      'aria-live': 'assertive',
      'aria-atomic': 'true'
    }, `
      <span>${Utils.escapeHtml(message)}</span>
      <button class="alert-close" aria-label="Fechar alerta" type="button">
        <i class="fas fa-times" aria-hidden="true"></i>
      </button>
    `);

    document.body.insertAdjacentElement('afterbegin', alertElement);

    const closeBtn = alertElement.querySelector('.alert-close');
    closeBtn.addEventListener('click', () => alertElement.remove());

    if (duration > 0) {
      setTimeout(() => {
        if (alertElement.parentElement) alertElement.remove();
      }, duration);
    }
  },

  removeAlerts() {
    document.querySelectorAll('.alert').forEach(alert => alert.remove());
  },

  // ========== LOADING ==========

  showLoading(message = 'Carregando...') {
    this.hideLoading();

    const loadingElement = Utils.createElement('div', {
      className: 'loading-overlay',
      role: 'status',
      'aria-live': 'polite',
      'aria-label': message
    }, `
      <div class="spinner" aria-hidden="true"></div>
      <p class="loading-text">${Utils.escapeHtml(message)}</p>
    `);

    document.body.appendChild(loadingElement);
    // Impede scroll do body enquanto loading está ativo
    document.body.style.overflow = 'hidden';
  },

  hideLoading() {
    const loading = document.querySelector('.loading-overlay');
    if (loading) {
      loading.remove();
      document.body.style.overflow = '';
    }
  },

  // ========== MODAL ==========

  showModal(title, content, buttons = []) {
    this.hideModal();

    const modalOverlay = Utils.createElement('div', {
      className: 'modal-overlay',
      role: 'dialog',
      'aria-modal': 'true',
      'aria-labelledby': 'modal-title'
    });

    const modal = Utils.createElement('div', { className: 'modal' });

    const header = Utils.createElement('div', { className: 'modal-header' }, `
      <h2 class="modal-title" id="modal-title">${Utils.escapeHtml(title)}</h2>
      <button class="modal-close" aria-label="Fechar modal" type="button">
        <i class="fas fa-times" aria-hidden="true"></i>
      </button>
    `);

    const body = Utils.createElement('div', { className: 'modal-body' }, content);
    const footer = Utils.createElement('div', { className: 'modal-footer' });

    buttons.forEach(button => {
      const btn = Utils.createElement('button', {
        className: button.className || 'btn btn-primary',
        type: 'button'
      }, button.text);

      btn.addEventListener('click', () => {
        if (button.onClick) button.onClick();
        // Só fecha se não tiver onClick customizado que já controle isso
        if (!button.keepOpen) this.hideModal();
      });

      footer.appendChild(btn);
    });

    modal.appendChild(header);
    modal.appendChild(body);
    if (buttons.length > 0) modal.appendChild(footer);
    modalOverlay.appendChild(modal);

    // Fechar pelo botão X
    header.querySelector('.modal-close').addEventListener('click', () => this.hideModal());

    // Fechar ao clicar fora
    modalOverlay.addEventListener('click', (e) => {
      if (e.target === modalOverlay) this.hideModal();
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

    // Foco no modal para acessibilidade
    setTimeout(() => {
      const firstFocusable = modal.querySelector(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      if (firstFocusable) firstFocusable.focus();
    }, 50);

    return modal;
  },

  hideModal() {
    const modal = document.querySelector('.modal-overlay');
    if (modal) modal.remove();
  },

  confirmModal(title, message, onConfirm, onCancel = null) {
    this.showModal(
      title,
      `<p>${Utils.escapeHtml(message)}</p>`,
      [
        {
          text: 'Cancelar',
          className: 'btn btn-outline',
          onClick: () => { if (onCancel) onCancel(); }
        },
        {
          text: 'Confirmar',
          className: 'btn btn-primary',
          onClick: onConfirm
        }
      ]
    );
  },

  // ========== VALIDAÇÃO DE FORMULÁRIOS ==========

  showFieldError(input, message) {
    this.clearFieldError(input);

    input.classList.add('error');
    input.setAttribute('aria-invalid', 'true');

    // Gera ID único para associar label ao erro via aria-describedby
    const errorId = `error-${input.name || Math.random().toString(36).slice(2)}`;
    input.setAttribute('aria-describedby', errorId);

    const errorElement = Utils.createElement('span', {
      className: 'form-error',
      role: 'alert',
      id: errorId
    }, Utils.escapeHtml(message));

    // Insere após o input-group ou o próprio input
    const container = input.closest('.input-group') || input;
    container.insertAdjacentElement('afterend', errorElement);
  },

  clearFieldError(input) {
    input.classList.remove('error');
    input.removeAttribute('aria-invalid');

    const describedBy = input.getAttribute('aria-describedby');
    if (describedBy) {
      const errorEl = document.getElementById(describedBy);
      if (errorEl && errorEl.classList.contains('form-error')) errorEl.remove();
      input.removeAttribute('aria-describedby');
    }

    // Fallback: remove erros próximos
    const parent = input.closest('.form-group');
    if (parent) {
      parent.querySelectorAll('.form-error').forEach(el => el.remove());
    }
  },

  validateForm(form, rules) {
    let isValid = true;

    Object.keys(rules).forEach(fieldName => {
      const input = form.querySelector(`[name="${fieldName}"]`);
      if (!input) return;

      const value = input.value.trim();
      const fieldRules = rules[fieldName];

      this.clearFieldError(input);

      if (fieldRules.required && !Utils.validateRequired(value)) {
        this.showFieldError(input, 'Este campo é obrigatório');
        isValid = false;
        return;
      }

      if (!fieldRules.required && !value) return;

      if (fieldRules.email && !Utils.validateEmail(value)) {
        this.showFieldError(input, 'Email inválido');
        isValid = false;
        return;
      }

      if (fieldRules.password && !Utils.validatePassword(value)) {
        this.showFieldError(input, 'Senha deve ter no mínimo 6 caracteres');
        isValid = false;
        return;
      }

      if (fieldRules.phone && !Utils.validatePhone(value)) {
        this.showFieldError(input, 'Telefone inválido (10 ou 11 dígitos)');
        isValid = false;
        return;
      }

      if (fieldRules.number && !Utils.validateNumber(value)) {
        this.showFieldError(input, 'Deve ser um número válido');
        isValid = false;
        return;
      }

      if (fieldRules.minLength && value.length < fieldRules.minLength) {
        this.showFieldError(input, `Deve ter no mínimo ${fieldRules.minLength} caracteres`);
        isValid = false;
        return;
      }

      if (fieldRules.maxLength && value.length > fieldRules.maxLength) {
        this.showFieldError(input, `Deve ter no máximo ${fieldRules.maxLength} caracteres`);
        isValid = false;
        return;
      }

      if (fieldRules.custom && !fieldRules.custom(value)) {
        this.showFieldError(input, fieldRules.customMessage || 'Valor inválido');
        isValid = false;
        return;
      }
    });

    // Rola até o primeiro erro
    if (!isValid) {
      const firstError = form.querySelector('.form-input.error, .form-select.error');
      if (firstError) firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }

    return isValid;
  },

  // ========== RENDERIZAÇÃO ==========

  renderEmptyState(container, message, icon = 'fa-inbox') {
    container.innerHTML = `
      <div class="empty-state" role="status">
        <div class="empty-state-icon" aria-hidden="true">
          <i class="fas ${Utils.escapeHtml(icon)}"></i>
        </div>
        <p class="empty-state-text">${Utils.escapeHtml(message)}</p>
      </div>
    `;
  },

  // ========== NAVBAR MOBILE ==========

  /**
   * Inicializa o menu hamburger para mobile.
   * Chame esta função em cada página que tenha navbar.
   */
  initMobileNav() {
    const hamburger = document.querySelector('.navbar-hamburger');
    const menu = document.querySelector('.navbar-menu');
    if (!hamburger || !menu) return;

    hamburger.addEventListener('click', () => {
      const isOpen = menu.classList.toggle('is-open');
      hamburger.setAttribute('aria-expanded', String(isOpen));
    });

    // Fecha o menu ao clicar em um link
    menu.querySelectorAll('.navbar-link').forEach(link => {
      link.addEventListener('click', () => {
        menu.classList.remove('is-open');
        hamburger.setAttribute('aria-expanded', 'false');
      });
    });

    // Fecha ao clicar fora
    document.addEventListener('click', (e) => {
      if (!hamburger.contains(e.target) && !menu.contains(e.target)) {
        menu.classList.remove('is-open');
        hamburger.setAttribute('aria-expanded', 'false');
      }
    });
  }
};
