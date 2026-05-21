# Landing Page i9+ Baterias — Captação de Leads

[![Deploy](https://img.shields.io/badge/status-live-brightgreen)](https://coderuann.github.io/landing-page-inove/)
[![GitHub Pages](https://img.shields.io/badge/hosted%20on-GitHub%20Pages-blue)](https://pages.github.com/)
[![License](https://img.shields.io/badge/license-MIT-lightgrey)](#)

Landing page estática para captação de leads da **i9+ Baterias**, com formulário integrado ao Google Sheets via Google Apps Script. Sem backend próprio, sem servidor — apenas HTML, CSS e JavaScript puro hospedados no GitHub Pages.

**🔗 Em produção:** https://coderuann.github.io/landing-page-inove/

![Preview](preview.png)

---

## Sobre

Página de uma única view focada em conversão. O usuário preenche o formulário, os dados caem direto em uma planilha do Google Sheets e o lead recebe um e-mail automático de confirmação. Toda a infraestrutura roda em serviços gratuitos do Google + GitHub.

## Funcionalidades

- Layout responsivo (mobile, tablet, desktop)
- Formulário de captação com os campos:
  - Nome completo
  - E-mail corporativo ou pessoal
  - Telefone / WhatsApp (com máscara)
  - Tipo de Contato — **Empresa** ou **Pessoa Física**
  - Nome da Empresa *(exibido apenas se "Empresa" for selecionado)*
  - Segmento da Empresa *(exibido apenas se "Empresa" for selecionado)*
  - Motivo do Contato
  - Como nos Conheceu
- Campos condicionais aparecem dinamicamente conforme o tipo de contato
- Validação no frontend antes do envio (campos obrigatórios e formatos)
- Envio assíncrono via `fetch` POST para o Google Apps Script
- Persistência automática no Google Sheets (aba `Leads`)
- E-mail de confirmação automático para o lead
- Feedback visual de sucesso / erro pós-envio

## Tecnologias

| Camada       | Stack                                       |
|--------------|---------------------------------------------|
| Estrutura    | HTML5                                       |
| Estilização  | CSS3 (Flexbox, Grid, media queries)         |
| Lógica       | JavaScript puro (ES6+)                      |
| Backend      | Google Apps Script (Web App)                |
| Persistência | Google Sheets                               |
| E-mail       | Google MailApp                              |
| Hospedagem   | GitHub Pages                                |

## Estrutura do projeto

```
landing-page-inove/
├── index.html      # Estrutura da página e formulário
├── styles.css      # Estilização completa
├── script.js       # Lógica do formulário, validações e envio
└── README.md
```

## Fluxo de dados

```
[Usuário preenche formulário]
            │
            ▼
[script.js — validação e fetch POST]
            │
            ▼
[Google Apps Script (Web App)]
            │
            ├──► [Google Sheets — aba "Leads"]
            │
            └──► [MailApp — e-mail de confirmação ao lead]
```

## Como configurar do zero

### 1. Clonar o repositório

```bash
git clone https://github.com/coderuann/landing-page-inove.git
cd landing-page-inove
```

### 2. Criar a planilha no Google Sheets

- Crie uma nova planilha no [Google Sheets](https://sheets.google.com)
- Renomeie a primeira aba para **`Leads`**
- Adicione os cabeçalhos na linha 1 (ex.: `Data`, `Nome`, `Email`, `Telefone`, `Tipo`, `Empresa`, `Segmento`, `Motivo`, `Origem`)

### 3. Abrir o Google Apps Script

Na planilha, vá em **Extensões → Apps Script**.

### 4. Publicar o Apps Script como Web App

- Cole o código do Apps Script (responsável por receber o POST, gravar na planilha e disparar o e-mail)
- Clique em **Implantar → Nova implantação**
- Tipo: **App da Web**
- Configurações:
  - **Executar como:** `Eu`
  - **Quem pode acessar:** `Qualquer pessoa`
- Clique em **Implantar** e autorize os escopos solicitados
- Copie a **URL do Web App** gerada

### 5. Configurar a URL no projeto

Em [script.js](script.js), substitua o valor da constante:

```js
const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/SEU_ID/exec";
```

### 6. Subir para o GitHub e ativar o Pages

```bash
git add .
git commit -m "Configura URL do Apps Script"
git push origin main
```

Depois siga a seção [Deploy](#deploy) abaixo.

## Deploy

O deploy é feito automaticamente pelo GitHub Pages. Para ativar:

1. Acesse o repositório no GitHub
2. Vá em **Settings → Pages**
3. Em **Source**, selecione **Deploy from branch**
4. Branch: **`main`** · Pasta: **`/ (root)`**
5. Salve

A URL pública ficará disponível em:

```
https://<seu-usuario>.github.io/<seu-repositorio>/
```

Qualquer push para `main` republica o site automaticamente.

## Variáveis que precisam ser configuradas

| Variável             | Local        | Descrição                                                       |
|----------------------|--------------|-----------------------------------------------------------------|
| `GOOGLE_SCRIPT_URL`  | `script.js`  | URL do Web App gerada ao publicar o Google Apps Script         |

## Observações técnicas

- **`mode: "no-cors"`** — o `fetch` usa esse modo porque o GitHub Pages (domínio do site) e o Apps Script (domínio do Google) são origens diferentes. Como consequência, a resposta é **opaque** (não legível pelo JavaScript), mas os dados chegam normalmente na planilha. Por isso o feedback de sucesso é exibido de forma otimista logo após o envio.
- **Sem backend próprio** — o Google Apps Script atua como uma camada *serverless* gratuita, sem necessidade de Node, PHP ou qualquer servidor.
- **E-mail de confirmação** — enviado via `MailApp.sendEmail()` usando a conta do proprietário do Apps Script. Não é necessário configurar SMTP externo, SendGrid, Mailgun ou similar.
- **Limites do Google** — o MailApp tem cota diária (~100 e-mails/dia em contas gratuitas e 1500/dia em Workspace). Para volumes maiores, considere migrar para um serviço dedicado.
- **GitHub Pages** — serve apenas conteúdo estático. Qualquer lógica server-side precisa rodar em outro lugar (no nosso caso, no Apps Script).

## Licença

MIT
