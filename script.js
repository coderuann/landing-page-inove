const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbzaK-OqogZqd90nBUO8X8T9XPo8i_1sqJ9CM2wcpwwVpM6SDH_tGKViw5S0QkHyZ8PC/exec";

document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('currentYear').textContent = new Date().getFullYear();

    const form = document.getElementById('leadForm');
    const nomeInput = document.getElementById('nome');
    const emailInput = document.getElementById('email');
    const telefoneInput = document.getElementById('telefone');
    const empresaFields = document.getElementById('empresaFields');
    const nomeEmpresaInput = document.getElementById('nomeEmpresa');
    const segmentoInput = document.getElementById('segmento');
    const motivoContatoInput = document.getElementById('motivoContato');
    const origemLeadInput = document.getElementById('origemLead');
    const submitBtn = document.getElementById('submitBtn');

    document.querySelectorAll('input[name="tipoContato"]').forEach((radio) => {
        radio.addEventListener('change', (e) => {
            if (e.target.value === 'Empresa') {
                empresaFields.style.display = 'block';
            } else {
                empresaFields.style.display = 'none';
                nomeEmpresaInput.value = '';
                segmentoInput.value = '';
                showError(nomeEmpresaInput, 'nomeEmpresaError', '');
                showError(segmentoInput, 'segmentoError', '');
            }
        });
    });

    const successMessage = document.getElementById('successMessage');
    const errorMessage = document.getElementById('errorMessage');

    const validateEmail = (email) => {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(String(email).toLowerCase());
    };

    const maskPhone = (value) => {
        if (!value) return "";
        value = value.replace(/\D/g, '');
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

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

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

        const nome = nomeInput.value.trim();
        const email = emailInput.value.trim();
        const telefone = telefoneInput.value.trim();
        const tipoContato = document.querySelector('input[name="tipoContato"]:checked')?.value || "";
        const nomeEmpresa = document.getElementById('nomeEmpresa').value.trim();
        const segmento = document.getElementById('segmento').value;
        const motivoContato = document.getElementById('motivoContato').value;
        const origemLead = document.getElementById('origemLead').value;

        if (!tipoContato) {
            errorMessage.style.display = 'block';
            return;
        }

        if (tipoContato === 'Empresa' && nomeEmpresa === '') {
            showError(nomeEmpresaInput, 'nomeEmpresaError', 'Informe o nome da empresa.');
            nomeEmpresaInput.focus();
            return;
        } else {
            showError(nomeEmpresaInput, 'nomeEmpresaError', '');
        }

        if (tipoContato === 'Empresa' && segmento === '') {
            showError(segmentoInput, 'segmentoError', 'Selecione o segmento da empresa.');
            segmentoInput.focus();
            return;
        } else {
            showError(segmentoInput, 'segmentoError', '');
        }

        if (motivoContato === '') {
            showError(motivoContatoInput, 'motivoContatoError', 'Selecione o motivo do contato.');
            motivoContatoInput.focus();
            return;
        } else {
            showError(motivoContatoInput, 'motivoContatoError', '');
        }

        if (origemLead === '') {
            showError(origemLeadInput, 'origemLeadError', 'Selecione como nos conheceu.');
            origemLeadInput.focus();
            return;
        } else {
            showError(origemLeadInput, 'origemLeadError', '');
        }

        const payload = { nome, email, telefone, tipoContato, nomeEmpresa, segmento, motivoContato, origemLead };

        submitBtn.disabled = true;
        submitBtn.textContent = 'Enviando...';
        successMessage.style.display = 'none';
        errorMessage.style.display = 'none';

        try {
            await fetch(GOOGLE_SCRIPT_URL, {
                method: "POST",
                mode: "no-cors",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(payload)
            });

            successMessage.style.display = 'block';
            form.reset();
            document.getElementById('empresaFields').style.display = 'none';
        } catch (error) {
            console.error('Erro ao enviar!', error);
            errorMessage.style.display = 'block';
        } finally {
            submitBtn.disabled = false;
            submitBtn.textContent = 'Solicitar Contato';
        }
    });
});
