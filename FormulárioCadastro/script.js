// VARIÁVEIS GLOBAIS
let etapaAtual = 1;
const totalEtapas = 4;

// INICIALIZAÇÃO
document.addEventListener('DOMContentLoaded', function() {
    atualizarBarraProgresso();
    inicializarMascaras();
    carregarEstados();
});

// MÁSCARAS
function inicializarMascaras() {
    // Máscara de telefone
    const telefoneInput = document.getElementById('telefone');
    telefoneInput.addEventListener('input', function(e) {
        let value = e.target.value.replace(/\D/g, '');
        if (value.length <= 11) {
            if (value.length <= 2) {
                value = value.replace(/^(\d{0,2})/, '($1');
            } else if (value.length <= 6) {
                value = value.replace(/^(\d{2})(\d{0,4})/, '($1) $2');
            } else if (value.length <= 10) {
                value = value.replace(/^(\d{2})(\d{4})(\d{0,4})/, '($1) $2-$3');
            } else {
                value = value.replace(/^(\d{2})(\d{5})(\d{0,4})/, '($1) $2-$3');
            }
            e.target.value = value;
        }
    });

    // Máscara de CEP
    const cepInput = document.getElementById('cep');
    cepInput.addEventListener('input', function(e) {
        let value = e.target.value.replace(/\D/g, '');
        if (value.length <= 8) {
            if (value.length > 5) {
                value = value.replace(/^(\d{5})(\d{0,3})/, '$1-$2');
            }
            e.target.value = value;
        }
    });
}

// CARREGAR ESTADOS
function carregarEstados() {
    const estados = [
        'AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA', 
        'MT', 'MS', 'MG', 'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN', 
        'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO'
    ];
    
    const selectEstado = document.getElementById('estado');
    estados.forEach(estado => {
        const option = document.createElement('option');
        option.value = estado;
        option.textContent = estado;
        selectEstado.appendChild(option);
    });
}

// NAVEGAÇÃO ENTRE ETAPAS
function avancarEtapa(proximaEtapa) {
    if (validarEtapaAtual()) {
        etapaAtual = proximaEtapa;
        mostrarEtapa(etapaAtual);
        atualizarBarraProgresso();
        
        // Gerar resumo na última etapa
        if (etapaAtual === 4) {
            gerarResumo();
        }
    }
}

function voltarEtapa(etapaAnterior) {
    etapaAtual = etapaAnterior;
    mostrarEtapa(etapaAtual);
    atualizarBarraProgresso();
}

function mostrarEtapa(numeroEtapa) {
    // Esconder todas as etapas
    document.querySelectorAll('.form-step').forEach(etapa => {
        etapa.classList.remove('active');
    });
    
    // Mostrar etapa atual
    document.getElementById(`step-${numeroEtapa}`).classList.add('active');
    
    // Atualizar indicadores de progresso
    document.querySelectorAll('.step').forEach((step, index) => {
        if (index < numeroEtapa) {
            step.classList.add('active');
        } else {
            step.classList.remove('active');
        }
    });
}

function atualizarBarraProgresso() {
    const progresso = ((etapaAtual - 1) / (totalEtapas - 1)) * 100;
    document.getElementById('progress').style.width = `${progresso}%`;
}

// VALIDAÇÕES
function validarEtapaAtual() {
    switch(etapaAtual) {
        case 1:
            return validarEtapa1();
        case 2:
            return validarEtapa2();
        case 3:
            return validarEtapa3();
        default:
            return true;
    }
}

function validarEtapa1() {
    let valido = true;
    
    // Validar nome
    const nome = document.getElementById('nome');
    const nomeError = document.getElementById('nomeError');
    if (!nome.value.trim()) {
        mostrarErro(nome, nomeError, 'Nome completo é obrigatório');
        valido = false;
    } else if (nome.value.trim().length < 3) {
        mostrarErro(nome, nomeError, 'Nome deve ter pelo menos 3 caracteres');
        valido = false;
    } else {
        mostrarSucesso(nome, nomeError);
    }
    
    // Validar email
    const email = document.getElementById('email');
    const emailError = document.getElementById('emailError');
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.value.trim()) {
        mostrarErro(email, emailError, 'E-mail é obrigatório');
        valido = false;
    } else if (!emailRegex.test(email.value)) {
        mostrarErro(email, emailError, 'Digite um e-mail válido');
        valido = false;
    } else {
        mostrarSucesso(email, emailError);
    }
    
    // Validar telefone
    const telefone = document.getElementById('telefone');
    const telefoneError = document.getElementById('telefoneError');
    const telefoneDigits = telefone.value.replace(/\D/g, '');
    if (!telefone.value.trim()) {
        mostrarErro(telefone, telefoneError, 'Telefone é obrigatório');
        valido = false;
    } else if (telefoneDigits.length < 10) {
        mostrarErro(telefone, telefoneError, 'Telefone deve ter pelo menos 10 dígitos');
        valido = false;
    } else {
        mostrarSucesso(telefone, telefoneError);
    }
    
    // Validar data de nascimento
    const nascimento = document.getElementById('nascimento');
    const nascimentoError = document.getElementById('nascimentoError');
    if (!nascimento.value) {
        mostrarErro(nascimento, nascimentoError, 'Data de nascimento é obrigatória');
        valido = false;
    } else {
        const dataNasc = new Date(nascimento.value);
        const hoje = new Date();
        const idade = hoje.getFullYear() - dataNasc.getFullYear();
        if (idade < 18) {
            mostrarErro(nascimento, nascimentoError, 'Você deve ter pelo menos 18 anos');
            valido = false;
        } else {
            mostrarSucesso(nascimento, nascimentoError);
        }
    }
    
    return valido;
}

function validarEtapa2() {
    let valido = true;
    
    // Validar CEP
    const cep = document.getElementById('cep');
    const cepError = document.getElementById('cepError');
    const cepDigits = cep.value.replace(/\D/g, '');
    if (!cep.value.trim()) {
        mostrarErro(cep, cepError, 'CEP é obrigatório');
        valido = false;
    } else if (cepDigits.length !== 8) {
        mostrarErro(cep, cepError, 'CEP deve ter 8 dígitos');
        valido = false;
    } else {
        mostrarSucesso(cep, cepError);
    }
    
    // Validar outros campos obrigatórios
    const camposObrigatorios = ['logradouro', 'numero', 'bairro', 'cidade', 'estado'];
    camposObrigatorios.forEach(campo => {
        const element = document.getElementById(campo);
        const errorElement = document.getElementById(`${campo}Error`);
        
        if (!element.value.trim()) {
            mostrarErro(element, errorElement, `Campo ${campo} é obrigatório`);
            valido = false;
        } else {
            mostrarSucesso(element, errorElement);
        }
    });
    
    return valido;
}

function validarEtapa3() {
    let valido = true;
    
    // Validar profissão
    const profissao = document.getElementById('profissao');
    const profissaoError = document.getElementById('profissaoError');
    if (!profissao.value.trim()) {
        mostrarErro(profissao, profissaoError, 'Profissão é obrigatória');
        valido = false;
    } else {
        mostrarSucesso(profissao, profissaoError);
    }
    
    // Validar interesses
    const interesses = document.querySelectorAll('input[name="interesses"]:checked');
    const interessesError = document.getElementById('interessesError');
    if (interesses.length === 0) {
        mostrarErro(null, interessesError, 'Selecione pelo menos uma área de interesse');
        valido = false;
    } else {
        mostrarSucesso(null, interessesError);
    }
    
    return valido;
}

// FUNÇÕES DE FEEDBACK
function mostrarErro(elemento, errorElement, mensagem) {
    errorElement.textContent = mensagem;
    errorElement.style.display = 'block';
    if (elemento) {
        elemento.classList.add('input-error');
        elemento.classList.remove('input-success');
    }
}

function mostrarSucesso(elemento, errorElement) {
    errorElement.style.display = 'none';
    if (elemento) {
        elemento.classList.remove('input-error');
        elemento.classList.add('input-success');
    }
}

// RESUMO E FINALIZAÇÃO
function gerarResumo() {
    const resumo = document.getElementById('resumo');
    const formData = new FormData(document.getElementById('cadastroForm'));
    
    const dados = {
        nome: formData.get('nome'),
        email: formData.get('email'),
        telefone: formData.get('telefone'),
        nascimento: formatarData(formData.get('nascimento')),
        cep: formData.get('cep'),
        logradouro: formData.get('logradouro'),
        numero: formData.get('numero'),
        bairro: formData.get('bairro'),
        cidade: formData.get('cidade'),
        estado: formData.get('estado'),
        complemento: formData.get('complemento') || 'Não informado',
        profissao: formData.get('profissao'),
        empresa: formData.get('empresa') || 'Não informado',
        interesses: Array.from(formData.getAll('interesses')).join(', '),
        sobre: formData.get('sobre') || 'Não informado'
    };
    
    let htmlResumo = '';
    for (const [chave, valor] of Object.entries(dados)) {
        const label = {
            nome: 'Nome Completo',
            email: 'E-mail',
            telefone: 'Telefone',
            nascimento: 'Data de Nascimento',
            cep: 'CEP',
            logradouro: 'Logradouro',
            numero: 'Número',
            bairro: 'Bairro',
            cidade: 'Cidade',
            estado: 'Estado',
            complemento: 'Complemento',
            profissao: 'Profissão',
            empresa: 'Empresa',
            interesses: 'Áreas de Interesse',
            sobre: 'Sobre você'
        }[chave];
        
        htmlResumo += `
            <div class="resumo-item">
                <span class="resumo-label">${label}:</span>
                <span>${valor}</span>
            </div>
        `;
    }
    
    resumo.innerHTML = htmlResumo;
}

function formatarData(data) {
    if (!data) return '';
    const [ano, mes, dia] = data.split('-');
    return `${dia}/${mes}/${ano}`;
}

function finalizarCadastro() {
    // Mostrar loading
    document.getElementById('loading').classList.remove('hidden');
    
    // Simular envio para API
    setTimeout(() => {
        document.getElementById('loading').classList.add('hidden');
        document.getElementById('successMessage').classList.remove('hidden');
        
        // Rollar para o topo para ver mensagem
        window.scrollTo(0, 0);
    }, 2000);
}

function reiniciarFormulario() {
    document.getElementById('cadastroForm').reset();
    document.getElementById('successMessage').classList.add('hidden');
    etapaAtual = 1;
    mostrarEtapa(1);
    atualizarBarraProgresso();
    
    // Limpar classes de sucesso/erro
    document.querySelectorAll('.input-success, .input-error').forEach(el => {
        el.classList.remove('input-success', 'input-error');
    });
}
