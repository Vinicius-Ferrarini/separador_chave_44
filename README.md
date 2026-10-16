# Separador de Chave de Acesso (44 dígitos)

Uma ferramenta simples e leve para separar e visualizar os dados contidos em uma chave de acesso de Nota Fiscal Eletrônica (NF-e) ou CT-e de 44 dígitos.

Feito com HTML, CSS e JavaScript puro (Vanilla JS), sem uso de frameworks ou expressões regulares complexas, visando a facilidade de manutenção.

## 🚀 Acesse a ferramenta online
**[Clique aqui para acessar o Separador de Chaves](https://vinicius-ferrarini.github.io/separador_chave_44/)**

## 🧪 Como testar

Se você não tiver uma chave em mãos agora, copie a chave de teste abaixo e cole no site para ver a separação dos dados:

**Chave válida para teste:**
> 41230414132551000113651110000264591000264601

### Dados que serão extraídos:
* Estado (UF)
* Ano e Mês de emissão
* CNPJ (formatado automaticamente)
* Modelo da Nota
* Série
* Número da Nota
* Forma de Emissão, com descrição do código conforme o modelo (normal, contingência, NFF etc.)
* Código Numérico
* Dígito Verificador (DV)

## 🛠️ Tecnologias

O ambiente **Produção ou Homologação não faz parte da chave de acesso**. A ferramenta explica como conferir o campo `tpAmb` no XML: `1` = Produção e `2` = Homologação. O código de emissão `1` significa emissão normal e não identifica o ambiente.

A descrição da emissão considera o modelo do documento e avisa quando o código não é reconhecido. No CF-e-SAT (59), a chave tem leiaute próprio e não contém esse campo; a ferramenta não interpreta o dígito da posição 35 como forma de emissão.

Referências: [NF-e — NT 2026.002](https://www.nfe.fazenda.gov.br/portal/exibirArquivo.aspx?AspxAutoDetectCookieSupport=1&conteudo=3v7VFvaogiA%3D) e [Manuais dos documentos fiscais — CONFAZ](https://www.confaz.fazenda.gov.br/legislacao/arquivo-manuais).

* HTML5
* CSS3
* JavaScript
