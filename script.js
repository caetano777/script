 document.addEventListener('DOMContentLoaded', function() {
            const tipoSelect = document.getElementById('tipo');
            const planFieldsContainer = document.getElementById('plan-fields');
            const generateBtn = document.getElementById('generateBtn');
            const outputContainer = document.getElementById('output');
            const cpfInput = document.getElementById('cpf');

            function updatePlanFields() {
                const selectedType = tipoSelect.value;
                let html = '';

                if (selectedType === 'AMPLIAÇÃO DE BANDA') {
                    html = `
                        <div class="form-group">
                            <label>PLANO ANTIGO:</label>
                            <div class="plan-group">
                                <input type="text" id="plano_antigo" placeholder="Ex: 100MBPS" required>
                                <input type="number" id="valor_antigo" placeholder="Valor (Ex: 79,90)" step="0.01" required>
                            </div>
                        </div>
                        <div class="form-group">
                            <label>PLANO NOVO:</label>
                            <div class="plan-group">
                                <input type="text" id="plano_novo" placeholder="Ex: 300MBPS" required>
                                <input type="number" id="valor_novo" placeholder="Valor (Ex: 89,90)" step="0.01" required>
                            </div>
                        </div>
                    `;
                } else {
                    html = `
                        <div class="form-group">
                            <label>PLANO DO CLIENTE:</label>
                             <div class="plan-group">
                                <input type="text" id="plano" placeholder="Ex: 300MBPS" required>
                                <input type="number" id="valor" placeholder="Valor (Ex: 89,90)" step="0.01" required>
                            </div>
                        </div>
                    `;
                }
                planFieldsContainer.innerHTML = html;
            }

            cpfInput.addEventListener('input', function(e) {
                let value = e.target.value.replace(/\D/g, '');
                value = value.replace(/(\d{3})(\d)/, '$1.$2');
                value = value.replace(/(\d{3})(\d)/, '$1.$2');
                value = value.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
                e.target.value = value.slice(0, 14);
            });

            function generateAndPrint() {
                const tipo = document.getElementById('tipo').value;
                const nome = document.getElementById('nome').value;
                const cpf = document.getElementById('cpf').value;
                
                // NOVO: Captura o valor das observações
                const observacoes = document.getElementById('observacoes').value;
                
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
                
                // NOVO: Cria o HTML para as observações apenas se houver texto
                let obsHTML = '';
                if (observacoes.trim() !== '') {
                    obsHTML = `<div class="output-line"><span>OBSERVAÇÕES:</span> <div class="data">${observacoes.toUpperCase()}</div></div>`;
                }

                let outputHTML = `
                    <h2>TIPO: ${tipo}</h2>
                    <div class="output-line"><span>NOME:</span> <div class="data">${nome.toUpperCase()}</div></div>
                    <div class="output-line"><span>CPF:</span> <div class="data">${cpf}</div></div>
                    <div class="output-line"><span>${planoLabel}:</span> <div class="data">${planoInfo.toUpperCase()}</div></div>
                    <div class="output-line"><span>ROTEADOR EM COMODATO:</span> <div class="data">${document.getElementById('roteador').value}</div></div>
                    <div class="output-line"><span>KIT FTTH EM COMODATO:</span> <div class="data">${document.getElementById('kit_ftth').value}</div></div>
                    <div class="output-line"><span>ASSINATURA TERMOS:</span> <div class="data">${document.getElementById('termos_assinados').value}</div></div>
                    <div class="output-line"><span>DOCUMENTOS ANEXADOS:</span> <div class="data">${document.getElementById('documentos_anexados').value}</div></div>
                    
                    ${obsHTML}
                    
                    <hr class="dashed">
                    
                    <div class="checklist-item">
                        [${document.getElementById('check_contrato').checked ? 'X' : ' '}] CONTRATO VERIFICADO E ASSINADO CORRETAMENTE
                    </div>
                    <div class="checklist-item">
                        [${document.getElementById('check_boletos').checked ? 'X' : ' '}] BOLETOS 2026 GERADOS E IMPRESSOS
                    </div>
                    <div class="checklist-item">
                        [${document.getElementById('check_anotacoes').checked ? 'X' : ' '}] INFORMAÇÕES ADICIONADAS NO CAMPO ANOTAÇÕES DO SGP
                    </div>
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
        });