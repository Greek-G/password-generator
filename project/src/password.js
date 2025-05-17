document.addEventListener('DOMContentLoaded', () => {
  const passwordInput = document.getElementById('password');
  const lengthInput = document.getElementById('length');
  const lengthValue = document.getElementById('lengthValue');
  const generateBtn = document.getElementById('generateBtn');
  const copyBtn = document.getElementById('copyBtn');
  const uppercaseCheck = document.getElementById('uppercase');
  const lowercaseCheck = document.getElementById('lowercase');
  const numbersCheck = document.getElementById('numbers');
  const symbolsCheck = document.getElementById('symbols');
  const strengthIndicator = document.getElementById('strength');
  const strengthDetails = document.getElementById('strengthDetails');

  const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const lowercase = 'abcdefghijklmnopqrstuvwxyz';
  const numbers = '0123456789';
  const symbols = '!@#$%^&*()_+-=[]{}|;:,.<>?';

  function generatePassword() {
    let chars = '';
    if (uppercaseCheck.checked) chars += uppercase;
    if (lowercaseCheck.checked) chars += lowercase;
    if (numbersCheck.checked) chars += numbers;
    if (symbolsCheck.checked) chars += symbols;

    if (chars === '') {
      passwordInput.value = 'Please select at least one option';
      strengthIndicator.textContent = '';
      strengthDetails.innerHTML = '';
      return;
    }

    const length = lengthInput.value;
    let password = '';
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * chars.length);
      password += chars[randomIndex];
    }

    passwordInput.value = password;
    testPassword(password);
  }

  function testPassword(password) {
    const criteria = {
      length: password.length >= 12,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      numbers: /[0-9]/.test(password),
      symbols: /[^A-Za-z0-9]/.test(password),
      noRepeating: !/(.)\1{2,}/.test(password),
      noSequential: !/(?:abc|bcd|cde|def|efg|fgh|ghi|hij|ijk|jkl|klm|lmn|mno|nop|opq|pqr|qrs|rst|stu|tuv|uvw|vwx|wxy|xyz|012|123|234|345|456|567|678|789)/i.test(password)
    };

    let strength = 0;
    let details = [];

    // Calculate strength and generate feedback
    if (criteria.length) {
      strength += 2;
      details.push('<span class="text-green-600">✓ Good length (12+ characters)</span>');
    } else {
      details.push('<span class="text-red-600">✗ Should be at least 12 characters</span>');
    }

    if (criteria.uppercase) {
      strength++;
      details.push('<span class="text-green-600">✓ Contains uppercase letters</span>');
    } else {
      details.push('<span class="text-red-600">✗ Add uppercase letters</span>');
    }

    if (criteria.lowercase) {
      strength++;
      details.push('<span class="text-green-600">✓ Contains lowercase letters</span>');
    } else {
      details.push('<span class="text-red-600">✗ Add lowercase letters</span>');
    }

    if (criteria.numbers) {
      strength++;
      details.push('<span class="text-green-600">✓ Contains numbers</span>');
    } else {
      details.push('<span class="text-red-600">✗ Add numbers</span>');
    }

    if (criteria.symbols) {
      strength++;
      details.push('<span class="text-green-600">✓ Contains symbols</span>');
    } else {
      details.push('<span class="text-red-600">✗ Add special characters</span>');
    }

    if (criteria.noRepeating) {
      strength++;
      details.push('<span class="text-green-600">✓ No repeating characters</span>');
    } else {
      details.push('<span class="text-red-600">✗ Avoid repeating characters</span>');
    }

    if (criteria.noSequential) {
      strength++;
      details.push('<span class="text-green-600">✓ No sequential patterns</span>');
    } else {
      details.push('<span class="text-red-600">✗ Avoid sequential patterns</span>');
    }

    // Update strength indicator
    let strengthText = '';
    let strengthClass = '';

    if (strength <= 2) {
      strengthText = 'Very Weak Password';
      strengthClass = 'text-red-600';
    } else if (strength <= 4) {
      strengthText = 'Weak Password';
      strengthClass = 'text-orange-600';
    } else if (strength <= 6) {
      strengthText = 'Medium Password';
      strengthClass = 'text-yellow-600';
    } else {
      strengthText = 'Strong Password';
      strengthClass = 'text-green-600';
    }

    strengthIndicator.textContent = strengthText;
    strengthIndicator.className = `text-sm font-medium ${strengthClass}`;
    strengthDetails.innerHTML = details.join('<br>');
  }

  async function copyToClipboard() {
    const password = passwordInput.value;
    if (password && password !== 'Please select at least one option') {
      await navigator.clipboard.writeText(password);
      copyBtn.textContent = 'Copied!';
      setTimeout(() => {
        copyBtn.textContent = 'Copy';
      }, 2000);
    }
  }

  // Event Listeners
  generateBtn.addEventListener('click', generatePassword);
  copyBtn.addEventListener('click', copyToClipboard);
  lengthInput.addEventListener('input', () => {
    lengthValue.textContent = lengthInput.value;
  });
  passwordInput.addEventListener('input', (e) => {
    testPassword(e.target.value);
  });

  // Generate initial password
  generatePassword();
});