document.addEventListener('DOMContentLoaded', function() {
    // Elementos do formulário
    const tipoSelect = document.getElementById('tipo');
    const planFieldsContainer = document.getElementById('plan-fields');
    const generateBtn = document.getElementById('generateBtn');
    const outputContainer = document.getElementById('output');
    
    // Novos elementos para CPF/CNPJ
    const radioFisica = document.getElementById('tipoPessoaFisica');
    const radioJuridica = document.getElementById('tipoPessoaJuridica');
    const labelNome = document.getElementById('labelNome');
    const labelDocumento = document.getElementById('labelDocumento');
    const documentoInput = document.getElementById('documento');

    // Função para atualizar os campos com base no tipo de pessoa
    function updatePessoaTypeFields() {
        if (radioJuridica.checked) {
            labelNome.textContent = 'RAZÃO SOCIAL:';
            labelDocumento.textContent = 'CNPJ:';
            documentoInput.placeholder = '00.000.000/0000-00';
        } else {
            labelNome.textContent = 'NOME:';
            labelDocumento.textContent = 'CPF:';
            documentoInput.placeholder = '000.000.000-00';
        }
        documentoInput.value = ''; // Limpa o campo ao trocar
    }
    
    // Event listener para a troca de tipo de pessoa
    radioFisica.addEventListener('change', updatePessoaTypeFields);
    radioJuridica.addEventListener('change', updatePessoaTypeFields);

    // Função para máscara de entrada dinâmica (CPF ou CNPJ)
    documentoInput.addEventListener('input', function(e) {
        let value = e.target.value.replace(/\D/g, '');
        
        if (radioJuridica.checked) { // Máscara de CNPJ
            value = value.replace(/^(\d{2})(\d)/, '$1.$2');
            value = value.replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3');
            value = value.replace(/\.(\d{3})(\d)/, '.$1/$2');
            value = value.replace(/(\d{4})(\d)/, '$1-$2');
            e.target.value = value.slice(0, 18);
        } else { // Máscara de CPF
            value = value.replace(/(\d{3})(\d)/, '$1.$2');
            value = value.replace(/(\d{3})(\d)/, '$1.$2');
            value = value.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
            e.target.value = value.slice(0, 14);
        }
    });

    function updatePlanFields() {
        const selectedType = tipoSelect.value;
        let html = '';
        if (selectedType === 'AMPLIAÇÃO DE BANDA') {
            html = `
                <div class="form-group"><label>PLANO ANTIGO:</label><div class="plan-group">
                    <input type="text" id="plano_antigo" placeholder="Ex: 100MBPS" required>
                    <input type="number" id="valor_antigo" placeholder="Valor (Ex: 79,90)" step="0.01" required>
                </div></div>
                <div class="form-group"><label>PLANO NOVO:</label><div class="plan-group">
                    <input type="text" id="plano_novo" placeholder="Ex: 300MBPS" required>
                    <input type="number" id="valor_novo" placeholder="Valor (Ex: 89,90)" step="0.01" required>
                </div></div>`;
        } else {
            html = `
                <div class="form-group"><label>PLANO DO CLIENTE:</label><div class="plan-group">
                    <input type="text" id="plano" placeholder="Ex: 300MBPS" required>
                    <input type="number" id="valor" placeholder="Valor (Ex: 89,90)" step="0.01" required>
                </div></div>`;
        }
        planFieldsContainer.innerHTML = html;
    }

    function generateAndPrint() {
        const tipo = document.getElementById('tipo').value;
        const nome = document.getElementById('nome').value;
        const documento = document.getElementById('documento').value;
        const observacoes = document.getElementById('observacoes').value;
        
        const nomeLabel = radioJuridica.checked ? 'RAZÃO SOCIAL' : 'NOME';
        const documentoLabel = radioJuridica.checked ? 'CNPJ' : 'CPF';
        
        let planoLabel = 'PLANO';
        let planoInfo = '';
        if (tipo === 'AMPLIAÇÃO DE BANDA') {
            planoLabel = 'PLANOS';
            const planoAntigo = document.getElementById('plano_antigo').value;
            const valorAntigo = parseFloat(document.getElementById('valor_antigo').value).toFixed(2).replace('.', ',');
            const planoNovo = document.getElementById('plano_novo').value;
            const valorNovo = parseFloat(document.getElementById('valor_novo').value).toFixed(2).replace('.', ',');
            planoInfo = `ANTIGO: ${planoAntigo} - R$${valorAntigo} <br> NOVO: ${planoNovo} - R$${valorNovo}`;
        } else {
            const plano = document.getElementById('plano').value;
            const valor = parseFloat(document.getElementById('valor').value).toFixed(2).replace('.', ',');
            planoInfo = `${plano} - R$${valor}`;
        }
        
        let obsHTML = '';
        if (observacoes.trim() !== '') {
            obsHTML = `<div class="output-line"><span>OBSERVAÇÕES:</span> <div class="data">${observacoes.toUpperCase()}</div></div>`;
        }

        let outputHTML = `
            <h2>TIPO: ${tipo}</h2>
            <div class="output-line"><span>${nomeLabel}:</span> <div class="data">${nome.toUpperCase()}</div></div>
            <div class="output-line"><span>${documentoLabel}:</span> <div class="data">${documento}</div></div>
            <div class="output-line"><span>${planoLabel}:</span> <div class="data">${planoInfo.toUpperCase()}</div></div>
            <div class="output-line"><span>ROTEADOR EM COMODATO:</span> <div class="data">${document.getElementById('roteador').value}</div></div>
            <div class="output-line"><span>KIT FTTH EM COMODATO:</span> <div class="data">${document.getElementById('kit_ftth').value}</div></div>
            <div class="output-line"><span>ASSINATURA TERMOS:</span> <div class="data">${document.getElementById('termos_assinados').value}</div></div>
            <div class="output-line"><span>DOCUMENTOS ANEXADOS:</span> <div class="data">${document.getElementById('documentos_anexados').value}</div></div>
            ${obsHTML}
            <hr class="dashed">
            <div class="checklist-item">[${document.getElementById('check_contrato').checked ? 'X' : ' '}] CONTRATO VERIFICADO E ASSINADO CORRETAMENTE</div>
            <div class="checklist-item">[${document.getElementById('check_boletos').checked ? 'X' : ' '}] BOLETOS 2026 GERADOS E IMPRESSOS</div>
            <div class="checklist-item">[${document.getElementById('check_anotacoes').checked ? 'X' : ' '}] INFORMAÇÕES ADICIONADAS NO CAMPO ANOTAÇÕES DO SGP</div>
        `;

        outputContainer.innerHTML = outputHTML;
        window.print();
    }

    tipoSelect.addEventListener('change', updatePlanFields);
    generateBtn.addEventListener('click', () => {
        if (document.getElementById('customerForm').checkValidity()) {
            generateAndPrint();
        } else {
            alert('Por favor, preencha todos os campos obrigatórios.');
            document.getElementById('customerForm').reportValidity();
        }
    });

    updatePlanFields();
    updatePessoaTypeFields(); // Chama uma vez para iniciar com os valores corretos
});