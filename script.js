function analisarChave() {
    let chave = document.getElementById("chaveInput").value.trim();

    if (chave.length !== 44) {
        alert("A chave precisa ter exatamente 44 números. Você digitou " + chave.length + ".");
        return;
    }
    let uf = chave.substring(0, 2);
    let anoMes = chave.substring(2, 6);
    let cnpj = chave.substring(6, 20);
    let modelo = chave.substring(20, 22);
    let serie = chave.substring(22, 25);
    let numero = chave.substring(25, 34); 
    let emissao = chave.substring(34, 35);
    let codNum = chave.substring(35, 43);
    let dv = chave.substring(43, 44);

    let cnpjFormatado = cnpj.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, "$1.$2.$3/$4-$5");

    document.getElementById("resUf").innerText = uf;
    document.getElementById("resData").innerText = anoMes;
    document.getElementById("resCnpj").innerText = cnpjFormatado;
    document.getElementById("resModelo").innerText = modelo;
    document.getElementById("resSerie").innerText = serie;
    document.getElementById("resNumero").innerText = numero; 
    document.getElementById("resEmissao").innerText = emissao;
    document.getElementById("resCodNum").innerText = codNum;
    document.getElementById("resDv").innerText = dv;

    document.getElementById("resultado").classList.remove("escondido");
}