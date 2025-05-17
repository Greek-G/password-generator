import React, { useEffect, useRef } from 'react';

function App() {
  const passwordInputRef = useRef<HTMLInputElement>(null);
  const lengthInputRef = useRef<HTMLInputElement>(null);
  const lengthValueRef = useRef<HTMLSpanElement>(null);
  const generateBtnRef = useRef<HTMLButtonElement>(null);
  const copyBtnRef = useRef<HTMLButtonElement>(null);
  const uppercaseCheckRef = useRef<HTMLInputElement>(null);
  const lowercaseCheckRef = useRef<HTMLInputElement>(null);
  const numbersCheckRef = useRef<HTMLInputElement>(null);
  const symbolsCheckRef = useRef<HTMLInputElement>(null);
  const strengthIndicatorRef = useRef<HTMLDivElement>(null);
  const strengthDetailsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const lowercase = 'abcdefghijklmnopqrstuvwxyz';
    const numbers = '0123456789';
    const symbols = '!@#$%^&*()_+-=[]{}|;:,.<>?';

    function generatePassword() {
      let chars = '';
      if (uppercaseCheckRef.current?.checked) chars += uppercase;
      if (lowercaseCheckRef.current?.checked) chars += lowercase;
      if (numbersCheckRef.current?.checked) chars += numbers;
      if (symbolsCheckRef.current?.checked) chars += symbols;

      if (chars === '') {
        if (passwordInputRef.current) passwordInputRef.current.value = 'Please select at least one option';
        if (strengthIndicatorRef.current) strengthIndicatorRef.current.textContent = '';
        if (strengthDetailsRef.current) strengthDetailsRef.current.innerHTML = '';
        return;
      }

      const length = lengthInputRef.current?.value || '12';
      let password = '';
      for (let i = 0; i < parseInt(length); i++) {
        const randomIndex = Math.floor(Math.random() * chars.length);
        password += chars[randomIndex];
      }

      if (passwordInputRef.current) passwordInputRef.current.value = password;
      testPassword(password);
    }

    function testPassword(password: string) {
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

      if (strengthIndicatorRef.current) {
        strengthIndicatorRef.current.textContent = strengthText;
        strengthIndicatorRef.current.className = `text-sm font-medium ${strengthClass}`;
      }
      if (strengthDetailsRef.current) {
        strengthDetailsRef.current.innerHTML = details.join('<br>');
      }
    }

    async function copyToClipboard() {
      const password = passwordInputRef.current?.value;
      if (password && password !== 'Please select at least one option') {
        await navigator.clipboard.writeText(password);
        if (copyBtnRef.current) {
          copyBtnRef.current.textContent = 'Copied!';
          setTimeout(() => {
            if (copyBtnRef.current) copyBtnRef.current.textContent = 'Copy';
          }, 2000);
        }
      }
    }

    // Event Listeners
    generateBtnRef.current?.addEventListener('click', generatePassword);
    copyBtnRef.current?.addEventListener('click', copyToClipboard);
    lengthInputRef.current?.addEventListener('input', () => {
      if (lengthValueRef.current) {
        lengthValueRef.current.textContent = lengthInputRef.current?.value || '12';
      }
    });
    passwordInputRef.current?.addEventListener('input', (e) => {
      const target = e.target as HTMLInputElement;
      testPassword(target.value);
    });

    // Generate initial password
    generatePassword();

    // Cleanup event listeners
    return () => {
      generateBtnRef.current?.removeEventListener('click', generatePassword);
      copyBtnRef.current?.removeEventListener('click', copyToClipboard);
    };
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl p-8 w-full max-w-md">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Password Generator & Tester</h1>
          <p className="text-sm text-gray-600 mt-1">Generate secure passwords or test your own</p>
        </div>

        <div className="space-y-4">
          <div className="relative">
            <input
              type="text"
              id="password"
              ref={passwordInputRef}
              className="w-full bg-gray-50 p-4 rounded-lg pr-24 font-mono text-gray-800"
              placeholder="Enter or generate a password"
            />
            <div className="absolute right-2 top-1/2 -translate-y-1/2 flex gap-2">
              <button
                id="generateBtn"
                ref={generateBtnRef}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Generate
              </button>
              <button
                id="copyBtn"
                ref={copyBtnRef}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Copy
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Password Length: <span id="lengthValue" ref={lengthValueRef}>12</span>
            </label>
            <input
              type="range"
              id="length"
              ref={lengthInputRef}
              min="6"
              max="32"
              defaultValue="12"
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
          </div>

          <div className="space-y-2">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                id="uppercase"
                ref={uppercaseCheckRef}
                className="rounded"
                defaultChecked
              />
              <span className="text-sm text-gray-700">Include Uppercase Letters</span>
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                id="lowercase"
                ref={lowercaseCheckRef}
                className="rounded"
                defaultChecked
              />
              <span className="text-sm text-gray-700">Include Lowercase Letters</span>
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                id="numbers"
                ref={numbersCheckRef}
                className="rounded"
                defaultChecked
              />
              <span className="text-sm text-gray-700">Include Numbers</span>
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                id="symbols"
                ref={symbolsCheckRef}
                className="rounded"
                defaultChecked
              />
              <span className="text-sm text-gray-700">Include Symbols</span>
            </label>
          </div>

          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <div id="strength" ref={strengthIndicatorRef} className="text-sm font-medium mb-2"></div>
            <div id="strengthDetails" ref={strengthDetailsRef} className="text-sm space-y-1"></div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;