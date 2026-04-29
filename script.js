document.addEventListener('DOMContentLoaded', () => {
    // Set current year in footer
    document.getElementById('currentYear').textContent = new Date().getFullYear();

    const form = document.getElementById('leadForm');
    const nomeInput = document.getElementById('nome');
    const emailInput = document.getElementById('email');
    const telefoneInput = document.getElementById('telefone');
    const submitBtn = document.getElementById('submitBtn');

    const successMessage = document.getElementById('successMessage');
    const errorMessage = document.getElementById('errorMessage');

    // Email Regex Validation
    const validateEmail = (email) => {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(String(email).toLowerCase());
    };

    // Phone Mask (BR: (XX) XXXXX-XXXX or (XX) XXXX-XXXX)
    const maskPhone = (value) => {
        if (!value) return "";
        value = value.replace(/\D/g, ''); // Remove non-digits
        if (value.length > 11) value = value.slice(0, 11);

        if (value.length > 2) {
            value = `(${value.substring(0, 2)}) ${value.substring(2)}`;
        }
        if (value.length > 9) {
            value = `${value.substring(0, 10)}-${value.substring(10)}`;
        }
        return value;
    };

    telefoneInput.addEventListener('input', (e) => {
        e.target.value = maskPhone(e.target.value);
    });

    // Real-time validation
    const showError = (input, errorId, message) => {
        const errorSpan = document.getElementById(errorId);
        if (message) {
            input.classList.add('invalid');
            errorSpan.textContent = message;
        } else {
            input.classList.remove('invalid');
            errorSpan.textContent = '';
        }
    };

    emailInput.addEventListener('blur', () => {
        if (emailInput.value && !validateEmail(emailInput.value)) {
            showError(emailInput, 'emailError', 'Por favor, insira um e-mail válido.');
        } else {
            showError(emailInput, 'emailError', '');
        }
    });

    telefoneInput.addEventListener('blur', () => {
        const digits = telefoneInput.value.replace(/\D/g, '');
        if (digits.length > 0 && digits.length < 10) {
            showError(telefoneInput, 'telefoneError', 'Telefone inválido. Digite o DDD + Número.');
        } else {
            showError(telefoneInput, 'telefoneError', '');
        }
    });

    // Form Submit Handler
    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        // Check if there are invalid fields
        if (!validateEmail(emailInput.value)) {
            showError(emailInput, 'emailError', 'Por favor, insira um e-mail válido.');
            emailInput.focus();
            return;
        }

        const phoneDigits = telefoneInput.value.replace(/\D/g, '');
        if (phoneDigits.length < 10) {
            showError(telefoneInput, 'telefoneError', 'Telefone inválido. Digite o DDD + Número.');
            telefoneInput.focus();
            return;
        }

        // Get form data
        const formData = new FormData(form);
        const data = {
            nome: formData.get('nome'),
            email: formData.get('email'),
            telefone: formData.get('telefone'),
            tipoContato: formData.get('tipoContato')
        };

        // UI Feedback
        submitBtn.disabled = true;
        submitBtn.textContent = 'Enviando...';
        successMessage.style.display = 'none';
        errorMessage.style.display = 'none';

        // REPLACE THIS URL WITH YOUR GOOGLE APPS SCRIPT WEB APP URL
        const scriptURL = 'https://script.google.com/macros/s/AKfycbwoP7RbIHnxaQjHiQAZ8h6GVyUgL3DaC72_5xa2zSayTBwS1YIFx2Yb26FVWk3i8FT4/exec';

        try {
            // Note: Use mode: 'no-cors' for Google Apps Script to avoid CORS errors from browser,
            // but keep in mind that fetch will return an opaque response where you can't read response.ok
            // For full JSON response, the Apps Script needs to handle CORS properly.
            // Using a standard POST with application/json or x-www-form-urlencoded

            // Because Google Apps Script standard doPost can be tricky with application/json CORS,
            // we will send it as plain text and parse it there, or handle CORS in Apps Script.
            const response = await fetch(scriptURL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'text/plain;charset=utf-8',
                },
                body: JSON.stringify(data)
            });

            // Assuming success if fetch didn't throw a network error
            successMessage.style.display = 'block';
            form.reset();
        } catch (error) {
            console.error('Erro ao enviar!', error.message);
            errorMessage.style.display = 'block';
        } finally {
            submitBtn.disabled = false;
            submitBtn.textContent = 'Solicitar Contato';
        }
    });
});
