// ============ CONFIGURAÇÕES GLOBAIS ============
const CONFIG = {
  DEBUG_MODE: false,
  SOCIAL_LOGIN_REDIRECT_DELAY: 1500,
  FORM_SUBMIT_DELAY: 2000,
  MESSAGE_DISPLAY_TIME: 4000,
  MOBILE_BREAKPOINT: 768,
  MIN_FORM_HEIGHT: 400
};

// ============ SELEÇÃO DE ELEMENTOS ============
const DOM = {
  container: document.querySelector('.container'),
  registerBtns: document.querySelectorAll('.register-btn'),
  loginBtns: document.querySelectorAll('.login-btn'),
  socialBtns: document.querySelectorAll('.social-btn'),
  forms: document.querySelectorAll('form'),
  inputs: document.querySelectorAll('input'),
  logoSection: document.querySelector('.logo-section')
};

// ============ ESTADO DA APLICAÇÃO ============
const APP_STATE = {
  isMobile: window.innerWidth <= CONFIG.MOBILE_BREAKPOINT,
  isTransitioning: false,
  currentForm: 'login',
  lastWindowWidth: window.innerWidth,
  lastWindowHeight: window.innerHeight,
  keyboardVisible: false
};

// ============ INICIALIZAÇÃO ============
function init() {
  setupEventListeners();
  setupAccessibility();
  handleResponsiveChanges();
  preventIOSZoom();
  debugLog('Aplicação inicializada');
}

// ============ CONFIGURAÇÃO DE EVENTOS ============
function setupEventListeners() {
  // Alternância entre formulários
  DOM.registerBtns.forEach(btn => {
    btn.addEventListener('click', () => handleToggle('register'));
  });

  DOM.loginBtns.forEach(btn => {
    btn.addEventListener('click', () => handleToggle('login'));
  });

  // Autenticação social
  DOM.socialBtns.forEach(btn => {
    btn.addEventListener('click', handleSocialLogin);
  });

  // Formulários
  DOM.forms.forEach(form => {
    form.addEventListener('submit', handleFormSubmit);
  });

  // Inputs
  DOM.inputs.forEach(input => {
    input.addEventListener('focus', handleInputFocus);
    input.addEventListener('blur', handleInputBlur);
    input.addEventListener('input', handleInputValidation);
  });

  // Eventos de janela
  window.addEventListener('resize', throttle(handleResponsiveChanges, 150));
  window.addEventListener('orientationchange', handleOrientationChange);
  window.addEventListener('load', handleWindowLoad);
  document.addEventListener('visibilitychange', handleVisibilityChange);
}

// ============ FUNÇÕES PRINCIPAIS ============

// Controle de transição entre formulários
function handleToggle(action) {
  if (APP_STATE.isTransitioning) return;
  
  APP_STATE.isTransitioning = true;
  APP_STATE.currentForm = action;
  
  if (action === 'register') {
    DOM.container.classList.add('active');
  } else {
    DOM.container.classList.remove('active');
  }

  const transitionTime = APP_STATE.isMobile ? 1000 : 1800;
  
  setTimeout(() => {
    APP_STATE.isTransitioning = false;
    updateContainerHeight();
    debugLog(`Alternado para: ${action}`);
  }, transitionTime);
}

// Autenticação social
function handleSocialLogin() {
  if (APP_STATE.isTransitioning) return;
  
  const platform = this.classList.contains('google-btn') ? 'Google' :
                  this.classList.contains('apple-btn') ? 'Apple' : 'Facebook';
  
  const originalContent = this.innerHTML;
  this.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
  this.disabled = true;
  
  // Simulação de redirecionamento
  setTimeout(() => {
    showMessage(`Redirecionando para ${platform}...`, 'info');
    
    // Simulação de callback
    setTimeout(() => {
      if (platform === 'Apple') {
        showMessage('Login com Apple não disponível', 'error');
      } else {
        showMessage(`Autenticado via ${platform} com sucesso!`, 'success');
        // window.location.href = `auth/social-login.php?provider=${platform.toLowerCase()}`;
      }
      
      this.innerHTML = originalContent;
      this.disabled = false;
    }, CONFIG.SOCIAL_LOGIN_REDIRECT_DELAY);
  }, 500);
}

// Envio de formulário
function handleFormSubmit(e) {
  e.preventDefault();
  
  if (APP_STATE.isTransitioning) return;
  
  const form = e.target;
  const formType = form.closest('.login') ? 'login' : 'register';
  const isValid = validateForm(form);
  
  if (!isValid) {
    showMessage('Preencha todos os campos corretamente', 'error');
    return;
  }
  
  const submitBtn = form.querySelector('.btn');
  const originalContent = submitBtn.innerHTML;
  
  submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processando...';
  submitBtn.disabled = true;
  
  // Simulação de envio AJAX
  setTimeout(() => {
    if (formType === 'login') {
      simulateLogin(form);
    } else {
      simulateRegistration(form);
    }
    
    submitBtn.innerHTML = originalContent;
    submitBtn.disabled = false;
  }, CONFIG.FORM_SUBMIT_DELAY);
}

// ============ FUNÇÕES DE VALIDAÇÃO ============
function validateForm(form) {
  let isValid = true;
  const inputs = form.querySelectorAll('input[required]');
  
  inputs.forEach(input => {
    if (!input.value.trim()) {
      markAsInvalid(input);
      isValid = false;
    } else if (input.type === 'email' && !isValidEmail(input.value)) {
      markAsInvalid(input, 'E-mail inválido');
      isValid = false;
    } else if (input.type === 'password' && input.value.length < 6) {
      markAsInvalid(input, 'Mínimo 6 caracteres');
      isValid = false;
    }
  });
  
  return isValid;
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function markAsInvalid(input, message = 'Campo obrigatório') {
  input.style.borderColor = '#e74c3c';
  input.style.boxShadow = '0 0 0 3px rgba(231, 76, 60, 0.1)';
  
  // Adiciona tooltip de erro
  const errorTooltip = document.createElement('div');
  errorTooltip.className = 'error-tooltip';
  errorTooltip.textContent = message;
  
  const rect = input.getBoundingClientRect();
  errorTooltip.style.top = `${rect.bottom + 5}px`;
  errorTooltip.style.left = `${rect.left}px`;
  
  input.parentNode.appendChild(errorTooltip);
  
  setTimeout(() => {
    input.style.borderColor = 'var(--fe-gray)';
    input.style.boxShadow = 'none';
    errorTooltip.remove();
  }, 3000);
}

// ============ FUNÇÕES DE SIMULAÇÃO ============
function simulateLogin(form) {
  const email = form.querySelector('input[type="email"]').value;
  const password = form.querySelector('input[type="password"]').value;
  
  // Simulação de credenciais válidas
  if (email.includes('@example.com') && password.length >= 6) {
    showMessage('Login realizado com sucesso!', 'success');
    // Redirecionamento simulado
    setTimeout(() => {
      window.location.href = 'dashboard.html';
    }, 1500);
  } else {
    showMessage('Credenciais inválidas', 'error');
  }
}

function simulateRegistration(form) {
  showMessage('Conta criada com sucesso!', 'success');
  setTimeout(() => {
    handleToggle('login');
    showMessage('Agora você pode fazer login', 'info');
  }, 1500);
}

// ============ FUNÇÕES DE UTILIDADE ============
function showMessage(message, type) {
  const existingMessage = document.querySelector('.message');
  if (existingMessage) existingMessage.remove();
  
  const messageDiv = document.createElement('div');
  messageDiv.className = `message ${type}-message`;
  messageDiv.textContent = message;
  
  // Estilos dinâmicos
  const styles = {
    success: {
      bg: 'linear-gradient(135deg, #e6f7ff 0%, #d1f2eb 100%)',
      color: 'var(--fe-blue)',
      border: 'var(--fe-blue)'
    },
    error: {
      bg: 'linear-gradient(135deg, #ffe6e6 0%, #ffd1d1 100%)',
      color: '#c33',
      border: '#c33'
    },
    info: {
      bg: 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)',
      color: 'var(--fe-blue)',
      border: 'var(--fe-blue)'
    }
  };
  
  const top = APP_STATE.isMobile ? '10px' : '20px';
  const right = APP_STATE.isMobile ? '10px' : '20px';
  
  messageDiv.style.cssText = `
    position: fixed;
    top: ${top};
    right: ${right};
    padding: 12px 20px;
    border-radius: 8px;
    font-size: 14px;
    z-index: 9999;
    animation: slideIn 0.3s ease;
    background: ${styles[type].bg};
    color: ${styles[type].color};
    border-left: 4px solid ${styles[type].border};
    box-shadow: 0 4px 12px rgba(0,0,0,0.1);
    max-width: ${APP_STATE.isMobile ? '90vw' : '350px'};
  `;
  
  document.body.appendChild(messageDiv);
  
  setTimeout(() => {
    messageDiv.style.animation = 'slideOut 0.3s ease';
    setTimeout(() => messageDiv.remove(), 300);
  }, CONFIG.MESSAGE_DISPLAY_TIME);
}

function throttle(func, limit) {
  let inThrottle;
  return function() {
    const args = arguments;
    const context = this;
    if (!inThrottle) {
      func.apply(context, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}

function debugLog(message) {
  if (CONFIG.DEBUG_MODE) {
    console.log(`[DEBUG] ${new Date().toISOString()}: ${message}`);
  }
}

// ============ FUNÇÕES DE RESPONSIVIDADE ============
function handleResponsiveChanges() {
  const newIsMobile = window.innerWidth <= CONFIG.MOBILE_BREAKPOINT;
  
  if (newIsMobile !== APP_STATE.isMobile) {
    APP_STATE.isMobile = newIsMobile;
    debugLog(`Modo mobile: ${APP_STATE.isMobile}`);
  }
  
  updateContainerHeight();
  detectKeyboard();
}

function updateContainerHeight() {
  if (APP_STATE.isMobile) {
    const logoHeight = DOM.logoSection.offsetHeight;
    const availableHeight = window.innerHeight - logoHeight - 20;
    DOM.container.style.height = `${Math.max(availableHeight, CONFIG.MIN_FORM_HEIGHT)}px`;
  } else {
    DOM.container.style.height = '';
  }
}

function detectKeyboard() {
  const heightDiff = window.innerHeight - APP_STATE.lastWindowHeight;
  APP_STATE.keyboardVisible = heightDiff < -100;
  
  if (APP_STATE.keyboardVisible) {
    DOM.container.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }
  
  APP_STATE.lastWindowHeight = window.innerHeight;
}

// ============ FUNÇÕES DE ACESSIBILIDADE ============
function setupAccessibility() {
  // Foco visível para teclado
  document.body.classList.add('keyboard-focus');
  
  document.addEventListener('mousedown', () => {
    document.body.classList.remove('keyboard-focus');
  });
  
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Tab') {
      document.body.classList.add('keyboard-focus');
    }
  });
}

// ============ MANIPULAÇÃO DE EVENTOS ============
function handleInputFocus() {
  if (!APP_STATE.isTransitioning) {
    this.parentElement.style.transform = 'scale(1.02)';
  }
}

function handleInputBlur() {
  this.parentElement.style.transform = 'scale(1)';
}

function handleInputValidation() {
  // Validação em tempo real pode ser adicionada aqui
}

function handleOrientationChange() {
  setTimeout(() => {
    handleResponsiveChanges();
    debugLog('Orientação alterada');
  }, 300);
}

function handleWindowLoad() {
  // Verificar autenticação existente
  if (localStorage.getItem('authToken')) {
    showMessage('Sessão restaurada', 'info');
  }
}

function handleVisibilityChange() {
  if (document.hidden) {
    DOM.container.style.animationPlayState = 'paused';
  } else {
    DOM.container.style.animationPlayState = 'running';
  }
}

function preventIOSZoom() {
  if (/iPhone|iPad|iPod/.test(navigator.userAgent)) {
    document.addEventListener('touchstart', function() {
      DOM.inputs.forEach(input => {
        input.addEventListener('focus', function() {
          if (parseFloat(getComputedStyle(this).fontSize) < 16) {
            this.style.fontSize = '16px';
          }
        });
      });
    });
  }
}

// ============ INICIALIZAR APLICAÇÃO ============
document.addEventListener('DOMContentLoaded', init);

// ============ ESTILOS DINÂMICOS ============
const dynamicStyles = document.createElement('style');
dynamicStyles.textContent = `
  @keyframes slideIn {
    from { transform: translateX(100%); opacity: 0; }
    to { transform: translateX(0); opacity: 1; }
  }
  
  @keyframes slideOut {
    from { transform: translateX(0); opacity: 1; }
    to { transform: translateX(100%); opacity: 0; }
  }
  
  .keyboard-focus *:focus {
    outline: 2px solid var(--fe-blue);
    outline-offset: 2px;
  }
  
  .error-tooltip {
    position: absolute;
    background: #e74c3c;
    color: white;
    padding: 4px 8px;
    border-radius: 4px;
    font-size: 12px;
    z-index: 10;
    animation: fadeIn 0.2s ease;
  }
  
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(-5px); }
    to { opacity: 1; transform: translateY(0); }
  }
`;
document.head.appendChild(dynamicStyles);
