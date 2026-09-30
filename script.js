// Dicionário de Estados (Código IBGE)
const tabelaEstados = {
    '11': 'Rondônia (RO)', '12': 'Acre (AC)', '13': 'Amazonas (AM)', '14': 'Roraima (RR)',
    '15': 'Pará (PA)', '16': 'Amapá (AP)', '17': 'Tocantins (TO)', '21': 'Maranhão (MA)',
    '22': 'Piauí (PI)', '23': 'Ceará (CE)', '24': 'Rio Grande do Norte (RN)', '25': 'Paraíba (PB)',
    '26': 'Pernambuco (PE)', '27': 'Alagoas (AL)', '28': 'Sergipe (SE)', '29': 'Bahia (BA)',
    '31': 'Minas Gerais (MG)', '32': 'Espírito Santo (ES)', '33': 'Rio de Janeiro (RJ)', '35': 'São Paulo (SP)',
    '41': 'Paraná (PR)', '42': 'Santa Catarina (SC)', '43': 'Rio Grande do Sul (RS)', '50': 'Mato Grosso do Sul (MS)',
    '51': 'Mato Grosso (MT)', '52': 'Goiás (GO)', '53': 'Distrito Federal (DF)'
};

// Dicionário de Modelos de Nota (todos os modelos que usam chave de acesso de 44 dígitos)
const tabelaModelos = {
    '55': 'NF-e (Nota Fiscal Eletrônica)',
    '57': 'CT-e (Conhecimento de Transporte Eletrônico)',
    '58': 'MDF-e (Manifesto Eletrônico de Documentos Fiscais)',
    '59': 'CF-e-SAT (Cupom Fiscal Eletrônico SAT)',
    '62': 'NFCom (Nota Fiscal de Comunicação Eletrônica)',
    '63': 'BP-e (Bilhete de Passagem Eletrônico)',
    '65': 'NFC-e (Nota Fiscal de Consumidor Eletrônica)',
    '66': 'NF3-e (Nota Fiscal de Energia Elétrica Eletrônica)',
    '67': 'CT-e OS (Conhecimento de Transporte Eletrônico para Outros Serviços)'
};

// Função para copiar a chave com a troca de ícone animada
// idTexto: id do elemento que contém a chave / idBtn: id do botão a animar
function copiarChave(idTexto = "chaveTeste", idBtn = "btnCopiar") {
    let textoChave = document.getElementById(idTexto).innerText;

    navigator.clipboard.writeText(textoChave).then(() => {
        let btn = document.getElementById(idBtn);

        let iconeCopiar = `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>`;
        let iconeCheck = `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#28a745" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>`;

        btn.innerHTML = iconeCheck;

        setTimeout(() => {
            btn.innerHTML = iconeCopiar;
        }, 2000);
    });
}

// Calcula o DV (dígito verificador) da chave de acesso pelo módulo 11.
// O algoritmo é o mesmo definido no Manual de Orientação do Contribuinte (layout
// da chave de acesso) e vale para todos os modelos de documento que usam essa
// chave de 44 dígitos (NF-e 55, CT-e 57, MDF-e 58, CF-e-SAT 59, NFCom 62,
// BP-e 63, NFC-e 65, CT-e OS 67...). O código do modelo é só mais um dos
// dígitos ponderados na soma, ele não muda a fórmula.
function calcularDV(chave43) {
    const pesos = [2, 3, 4, 5, 6, 7, 8, 9];
    let soma = 0;
    let pesoIndex = 0;

    for (let i = chave43.length - 1; i >= 0; i--) {
        let digito = parseInt(chave43.charAt(i), 10);
        soma += digito * pesos[pesoIndex % pesos.length];
        pesoIndex++;
    }

    let resto = soma % 11;
    return (resto === 0 || resto === 1) ? 0 : 11 - resto;
}

// Valida os dois dígitos verificadores de um CNPJ (14 dígitos) pelo módulo 11 padrão.
function validarCNPJ(cnpj) {
    if (!/^\d{14}$/.test(cnpj)) return false;
    if (/^(\d)\1{13}$/.test(cnpj)) return false; // rejeita sequências tipo "00000000000000"

    let calcularDigitoCnpj = (base, pesos) => {
        let soma = 0;
        for (let i = 0; i < base.length; i++) {
            soma += parseInt(base.charAt(i), 10) * pesos[i];
        }
        let resto = soma % 11;
        return resto < 2 ? 0 : 11 - resto;
    };

    let base = cnpj.substring(0, 12);
    let dv1 = calcularDigitoCnpj(base, [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2]);
    let dv2 = calcularDigitoCnpj(base + dv1, [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2]);

    return cnpj === base + String(dv1) + String(dv2);
}

// Função principal de separar os dados e buscar CNPJ
async function analisarChave() {
    let chave = document.getElementById("chaveInput").value.trim();

    if (chave.length !== 44) {
        alert("A chave precisa ter exatamente 44 números. Você digitou " + chave.length + ".");
        return;
    }

    let ufCodigo = chave.substring(0, 2);
    let anoMes = chave.substring(2, 6);
    let cnpj = chave.substring(6, 20);
    let modeloCodigo = chave.substring(20, 22);
    let serie = chave.substring(22, 25);
    let numero = chave.substring(25, 34);
    let emissao = chave.substring(34, 35);
    let codNum = chave.substring(35, 43);
    let dv = chave.substring(43, 44);

    // Validação do dígito verificador (mesma fórmula para qualquer modelo)
    let dvCalculado = calcularDV(chave.substring(0, 43));
    let dvInformado = parseInt(dv, 10);
    let dvValido = dvCalculado === dvInformado;

    // Validações extras: CNPJ, modelo existente e UF existente
    let cnpjValido = validarCNPJ(cnpj);
    let modeloValido = Object.prototype.hasOwnProperty.call(tabelaModelos, modeloCodigo);
    let ufValida = Object.prototype.hasOwnProperty.call(tabelaEstados, ufCodigo);

    let elStatusDv = document.getElementById("statusDv");
    if (dvValido) {
        elStatusDv.innerText = "DV válido";
        elStatusDv.className = "status-dv dv-valido";
    } else {
        elStatusDv.innerText = "DV inválido, o correto seria " + dvCalculado + ".";
        elStatusDv.className = "status-dv dv-invalido";
    }

    let elStatusCnpj = document.getElementById("statusCnpj");
    elStatusCnpj.innerText = cnpjValido ? "✅" : "❌ inválido";
    elStatusCnpj.title = cnpjValido ? "CNPJ válido" : "Os dígitos verificadores do CNPJ não conferem";
    elStatusCnpj.className = "nota-validacao " + (cnpjValido ? "nota-ok" : "nota-erro");

    let elStatusModelo = document.getElementById("statusModelo");
    elStatusModelo.innerText = modeloValido ? "✅" : "❌ desconhecido";
    elStatusModelo.title = modeloValido ? "Modelo existe" : "Não é um modelo de documento válido para emissão";
    elStatusModelo.className = "nota-validacao " + (modeloValido ? "nota-ok" : "nota-erro");

    let elStatusUf = document.getElementById("statusUf");
    elStatusUf.innerText = ufValida ? "✅" : "❌ inexistente";
    elStatusUf.title = ufValida ? "Código de UF existe" : "Não é um código de UF (IBGE) válido";
    elStatusUf.className = "nota-validacao " + (ufValida ? "nota-ok" : "nota-erro");

    // Reseta o aviso de divergência de UF (só é preenchido depois da consulta do CNPJ)
    let elDivergenciaUf = document.getElementById("statusDivergenciaUf");
    elDivergenciaUf.innerText = "";
    elDivergenciaUf.classList.add("escondido");

    let chaveValidaGeral = dvValido && cnpjValido && modeloValido && ufValida;
    let elStatusChaveGeral = document.getElementById("statusChaveGeral");
    if (chaveValidaGeral) {
        elStatusChaveGeral.innerText = "✅ Chave válida";
        elStatusChaveGeral.className = "status-dv dv-valido";
    } else {
        let problemas = [];
        if (!dvValido) problemas.push("DV incorreto");
        if (!cnpjValido) problemas.push("CNPJ inválido");
        if (!modeloValido) problemas.push("modelo desconhecido");
        if (!ufValida) problemas.push("UF inexistente");

        elStatusChaveGeral.innerText = "❌ Chave inválida (" + problemas.join(", ") + ")";
        elStatusChaveGeral.className = "status-dv dv-invalido";
    }

    // Chave pronta para copiar e colar (troca o DV pelo correto, se necessário)
    let chaveCorrigida = chave.substring(0, 43) + dvCalculado;
    document.getElementById("chaveResultado").innerText = chaveCorrigida;

    // Preenchendo a chave colorida visual (caixinhas de cima)
    document.getElementById("visUf").innerText = ufCodigo;
    document.getElementById("visData").innerText = anoMes;
    document.getElementById("visCnpj").innerText = cnpj;
    document.getElementById("visModelo").innerText = modeloCodigo;
    document.getElementById("visSerie").innerText = serie;
    document.getElementById("visNumero").innerText = numero;
    document.getElementById("visEmissao").innerText = emissao;
    document.getElementById("visCodNum").innerText = codNum;
    document.getElementById("visDv").innerText = dv;

    // Traduzindo códigos e formatando as máscaras
    let ufNome = tabelaEstados[ufCodigo] ? ufCodigo + " - " + tabelaEstados[ufCodigo] : ufCodigo; 
    let modeloNome = tabelaModelos[modeloCodigo] ? modeloCodigo + " - " + tabelaModelos[modeloCodigo] : modeloCodigo;
    let ano = "20" + anoMes.substring(0, 2); 
    let mes = anoMes.substring(2, 4); 
    let dataFormatada = mes + "/" + ano;
    let cnpjFormatado = cnpj.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, "$1.$2.$3/$4-$5");

    // Sigla da UF da chave, extraída de "Nome (SIGLA)" — usada para comparar com a UF do CNPJ
    let siglaMatch = (tabelaEstados[ufCodigo] || "").match(/\(([A-Z]{2})\)/);
    let siglaUfChave = siglaMatch ? siglaMatch[1] : null;

    // Preenchendo as linhas detalhadas (caixinhas de baixo)
    document.getElementById("resUf").innerText = ufNome;
    document.getElementById("resData").innerText = dataFormatada;
    document.getElementById("resCnpj").innerText = cnpjFormatado;
    document.getElementById("resModelo").innerText = modeloNome;
    document.getElementById("resSerie").innerText = serie;
    document.getElementById("resNumero").innerText = numero; 
    document.getElementById("resEmissao").innerText = emissao;
    document.getElementById("resCodNum").innerText = codNum;
    document.getElementById("resDv").innerText = dv;
    
    document.getElementById("resRazaoSocial").innerText = "Buscando nome na Receita...";
    document.getElementById("resultado").classList.remove("escondido");

    // Consulta do CNPJ via BrasilAPI
    let razaoSocialFinal = "";
    let divergenciaUf = false;
    try {
        let resposta = await fetch(`https://brasilapi.com.br/api/cnpj/v1/${cnpj}`);
        let dadosApi = await resposta.json();

        razaoSocialFinal = dadosApi.razao_social ? dadosApi.razao_social : "Nome não encontrado.";
        document.getElementById("resRazaoSocial").innerText = razaoSocialFinal;

        // Confere se a UF cadastrada do CNPJ bate com a UF informada na chave.
        // Isso é só um alerta (não invalida a chave): a fonte da UF do CNPJ é a
        // Receita Federal, não os dígitos do CNPJ, então tratamos como aviso.
        if (dadosApi.uf && siglaUfChave && dadosApi.uf !== siglaUfChave) {
            divergenciaUf = true;
            elDivergenciaUf.innerText = "⚠️ Possível divergência: a chave foi emitida em " + siglaUfChave + ", mas o CNPJ está cadastrado em " + dadosApi.uf + ".";
            elDivergenciaUf.className = "status-dv dv-aviso";
            elDivergenciaUf.classList.remove("escondido");
        }
    } catch (erro) {
        razaoSocialFinal = "Erro ao buscar CNPJ na base de dados.";
        document.getElementById("resRazaoSocial").innerText = razaoSocialFinal;
    }

    // Salva a chave analisada no histórico (menu lateral)
    adicionarAoHistorico({
        chave: chave,
        dataSalva: new Date().toISOString(),
        uf: ufCodigo,
        modelo: modeloCodigo,
        modeloNome: tabelaModelos[modeloCodigo] || modeloCodigo,
        numero: numero,
        serie: serie,
        cnpj: cnpjFormatado,
        razaoSocial: razaoSocialFinal,
        dvValido: dvValido,
        dvCalculado: dvCalculado,
        cnpjValido: cnpjValido,
        modeloValido: modeloValido,
        ufValida: ufValida,
        divergenciaUf: divergenciaUf,
        chaveValida: chaveValidaGeral
    });
}

// ===================== HISTÓRICO (localStorage) =====================

const HISTORICO_STORAGE_KEY = "separaChaveHistorico";

function carregarHistorico() {
    try {
        return JSON.parse(localStorage.getItem(HISTORICO_STORAGE_KEY)) || [];
    } catch (erro) {
        return [];
    }
}

function salvarHistoricoStorage(lista) {
    localStorage.setItem(HISTORICO_STORAGE_KEY, JSON.stringify(lista));
}

function adicionarAoHistorico(entrada) {
    let lista = carregarHistorico();

    // Evita duplicar a mesma chave: remove a ocorrência antiga e manda pro topo
    lista = lista.filter((item) => item.chave !== entrada.chave);
    lista.unshift(entrada);

    salvarHistoricoStorage(lista);
    renderizarHistorico();
}

function renderizarHistorico() {
    let lista = carregarHistorico();
    let container = document.getElementById("listaHistorico");
    let vazio = document.getElementById("historicoVazio");

    container.innerHTML = "";

    if (lista.length === 0) {
        vazio.classList.remove("escondido");
        return;
    }
    vazio.classList.add("escondido");

    lista.forEach((item, indice) => {
        let li = document.createElement("li");
        li.className = "item-historico";

        let numeroSemZeros = parseInt(item.numero, 10);

        // "chaveValida" só existe em itens salvos após a v2; itens antigos caem no fallback do DV
        let chaveValidaItem = item.chaveValida !== undefined ? item.chaveValida : item.dvValido;

        let textoStatus;
        let emojiStatus;
        if (!chaveValidaItem) {
            emojiStatus = "❌";
            textoStatus = "Chave inválida";
        } else if (item.divergenciaUf) {
            emojiStatus = "⚠️";
            textoStatus = "Divergência de UF";
        } else {
            emojiStatus = "✅";
            textoStatus = "Chave válida";
        }

        let divInfo = document.createElement("div");
        divInfo.className = "info-historico";
        divInfo.innerHTML = `
            <span class="linha1">🧾 Modelo ${item.modelo} • Nº ${numeroSemZeros} • ${item.uf}</span>
            <span class="linha2">${item.razaoSocial || item.cnpj}</span>
            <span class="linha3">${emojiStatus} ${textoStatus}</span>
        `;
        divInfo.title = "Clique para carregar essa chave";
        divInfo.onclick = () => {
            document.getElementById("chaveInput").value = item.chave;
            analisarChave();
        };

        let btnCopiar = document.createElement("button");
        btnCopiar.className = "btn-copiar-item";
        btnCopiar.title = "Copiar chave";
        btnCopiar.innerText = "📋";
        btnCopiar.onclick = (evento) => {
            evento.stopPropagation();
            copiarTextoHistorico(item.chave, btnCopiar);
        };

        let btnRemover = document.createElement("button");
        btnRemover.className = "btn-remover-item";
        btnRemover.title = "Remover esta chave do histórico";
        btnRemover.innerText = "✕";
        btnRemover.onclick = (evento) => {
            evento.stopPropagation();
            removerDoHistorico(item.chave);
        };

        let divAcoes = document.createElement("div");
        divAcoes.className = "acoes-item";
        divAcoes.appendChild(btnCopiar);
        divAcoes.appendChild(btnRemover);

        li.appendChild(divInfo);
        li.appendChild(divAcoes);
        container.appendChild(li);
    });
}

function removerDoHistorico(chave) {
    let lista = carregarHistorico();
    lista = lista.filter((item) => item.chave !== chave);
    salvarHistoricoStorage(lista);
    renderizarHistorico();
}

function copiarTextoHistorico(texto, btnEl) {
    navigator.clipboard.writeText(texto).then(() => {
        let original = btnEl.innerText;
        btnEl.innerText = "✅";
        setTimeout(() => {
            btnEl.innerText = original;
        }, 1500);
    });
}

function baixarHistoricoCSV() {
    let lista = carregarHistorico();

    if (lista.length === 0) {
        alert("Não há chaves salvas para baixar.");
        return;
    }

    let linhas = lista.map((item) => item.chave);

    let csv = "﻿" + linhas.join("\r\n");
    let blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    let url = URL.createObjectURL(blob);

    let link = document.createElement("a");
    link.href = url;
    link.download = "historico_chaves.csv";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
}

function limparHistorico() {
    if (confirm("🗑️ Tem certeza que quer apagar todo o histórico de chaves salvas?")) {
        localStorage.removeItem(HISTORICO_STORAGE_KEY);
        renderizarHistorico();
    }
}

document.addEventListener("DOMContentLoaded", renderizarHistorico);