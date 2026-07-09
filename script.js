// Dicionário de Estados (Código IBGE)
const tabelaEstados = {
    '11': 'Rondônia (RO)', '12': 'Acre (AC)', '13': 'Amazonas (AM)', '14': 'Roraima (RR)',
    '15': 'Pará (PA)', '16': 'Amapá (AP)', '17': 'Tocantins (TO)', '21': 'Maranhão (MA)',
    '22': 'Piauí (PI)', '23': 'Ceará (CE)', '24': 'Rio Grande do Norte (RN)', '25': 'Paraíba (PB)',
    '26': 'Pernambuco (PE)', '27': 'Alagoas (AL)', '28': 'Sergipe (SE)', '29': 'Bahia (BA)',
    '31': 'Minas Gerais (MG)', '32': 'Espírito Santo (ES)', '33': 'Rio de Janeiro (RJ)', '35': 'São Paulo (SP)',
    '41': 'Paraná', '42': 'Santa Catarina (SC)', '43': 'Rio Grande do Sul (RS)', '50': 'Mato Grosso do Sul (MS)',
    '51': 'Mato Grosso (MT)', '52': 'Goiás (GO)', '53': 'Distrito Federal (DF)'
};

// Dicionário de Modelos de Nota
const tabelaModelos = {
    '55': 'NF-e (Nota Fiscal Eletrônica)',
    '65': 'NFC-e (Nota de Consumidor)',
    '57': 'CT-e (Conhecimento de Transporte)',
    '59': 'CF-e (Cupom Fiscal Eletrônico SAT)'
};

// Função para copiar a chave com a troca de ícone animada
function copiarChave() {
    let textoChave = document.getElementById("chaveTeste").innerText;
    
    navigator.clipboard.writeText(textoChave).then(() => {
        let btn = document.getElementById("btnCopiar");
        
        let iconeCopiar = `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>`;
        let iconeCheck = `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#28a745" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>`;
        
        btn.innerHTML = iconeCheck;
        
        setTimeout(() => {
            btn.innerHTML = iconeCopiar; 
        }, 2000);
    });
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
    try {
        let resposta = await fetch(`https://brasilapi.com.br/api/cnpj/v1/${cnpj}`);
        let dadosApi = await resposta.json();
        
        if (dadosApi.razao_social) {
            document.getElementById("resRazaoSocial").innerText = dadosApi.razao_social;
        } else {
            document.getElementById("resRazaoSocial").innerText = "Nome não encontrado.";
        }
    } catch (erro) {
        document.getElementById("resRazaoSocial").innerText = "Erro ao buscar CNPJ na base de dados.";
    }
}