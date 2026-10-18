/* =============================================
   AUTH.JS – Authentication Logic & Session Management
   ============================================= */

// Auth guard – call on protected pages
function requireAuth() {
  if (!CSA.isLoggedIn()) {
    window.location.href = 'login.html';
    return false;
  }
  return true;
}

// Form Validators
const Validate = {
  email(v) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v); },
  phone(v) { return /^(\+91[-\s]?)?[6-9]\d{9}$/.test(v.replace(/[\s-]/g, '')); },
  password(v) { return v.length >= 8; },
  name(v) { return v.trim().length >= 2; },

  passwordStrength(v) {
    let score = 0;
    if (v.length >= 8) score++;
    if (v.length >= 12) score++;
    if (/[A-Z]/.test(v)) score++;
    if (/[0-9]/.test(v)) score++;
    if (/[^A-Za-z0-9]/.test(v)) score++;
    const labels = ['Very Weak', 'Weak', 'Fair', 'Strong', 'Very Strong'];
    const colors = ['#ef4444', '#f97316', '#f59e0b', '#22c55e', '#059669'];
    return { score, label: labels[Math.min(score, 4)], color: colors[Math.min(score, 4)], percent: Math.min(score * 25, 100) };
  }
};

// Toggle password visibility
function togglePasswordVisibility(inputId, toggleBtn) {
  const input = document.getElementById(inputId);
  if (!input) return;
  const isPassword = input.type === 'password';
  input.type = isPassword ? 'text' : 'password';
  const icon = toggleBtn.querySelector('i');
  if (icon) {
    icon.className = isPassword ? 'fa-solid fa-eye-slash' : 'fa-solid fa-eye';
  }
}

// Show/hide form errors
function showFieldError(inputId, message) {
  const input = document.getElementById(inputId);
  if (!input) return;
  input.classList.add('input-error');
  let err = input.parentElement.querySelector('.field-error');
  if (!err) {
    err = document.createElement('div');
    err.className = 'field-error';
    input.parentElement.appendChild(err);
  }
  err.textContent = message;
}

function clearFieldError(inputId) {
  const input = document.getElementById(inputId);
  if (!input) return;
  input.classList.remove('input-error');
  const err = input.parentElement.querySelector('.field-error');
  if (err) err.remove();
}

function clearAllErrors(formId) {
  const form = document.getElementById(formId);
  if (!form) return;
  form.querySelectorAll('.input-error').forEach(el => el.classList.remove('input-error'));
  form.querySelectorAll('.field-error').forEach(el => el.remove());
}
