# 📖 LivroGest

Sistema de gestão completo para livrarias — controle de estoque, clientes, kits, gastos e relatórios.

## Funcionalidades

- 📊 **Dashboard** — visão geral com métricas, gráficos e alertas de estoque
- 📚 **Catálogo** — cadastro de livros com preço, custo e margem automática
- 🔄 **Entradas / Saídas** — controle de movimentações de estoque
- 🎁 **Kits** — monte e venda kits de livros com cálculo de margem
- 👥 **Clientes** — cadastro e histórico de compras
- 💸 **Gastos** — controle de marketing e embalagens
- 📈 **Relatórios** — gráficos de receita, lucro e top vendidos
- 📱 **PWA** — instalável no celular e desktop (funciona offline)

---

## Como rodar localmente

### 1. Clone o repositório
```bash
git clone https://github.com/seu-usuario/livrogest.git
cd livrogest
```

### 2. Instale as dependências
```bash
npm install
```

### 3. Configure o Firebase

1. Acesse [console.firebase.google.com](https://console.firebase.google.com)
2. Crie um novo projeto (ou use um existente)
3. Vá em **Firestore Database** → crie o banco no modo **produção** ou **teste**
4. Vá em **Configurações do projeto** → **Seus apps** → adicione um app Web
5. Copie as credenciais

### 4. Crie o arquivo `.env`
```bash
cp .env.example .env
```
Preencha com suas credenciais do Firebase:
```env
FIREBASE_API_KEY=...
FIREBASE_AUTH_DOMAIN=...
FIREBASE_PROJECT_ID=...
FIREBASE_STORAGE_BUCKET=...
FIREBASE_MESSAGING_SENDER_ID=...
FIREBASE_APP_ID=...
```

### 5. Rode o servidor
```bash
npm run dev     # desenvolvimento (com nodemon)
npm start       # produção
```

Acesse: http://localhost:3000

---

## Deploy no Railway

### Método 1 — Via GitHub (recomendado)

1. Suba o código para o GitHub
2. Acesse [railway.app](https://railway.app) → **New Project** → **Deploy from GitHub**
3. Selecione o repositório
4. Vá em **Variables** e adicione todas as variáveis do `.env.example`
5. Railway detecta o `railway.toml` e faz o deploy automaticamente ✅

### Método 2 — Via CLI do Railway

```bash
npm install -g @railway/cli
railway login
railway init
railway up

# Adicione as variáveis de ambiente
railway variables set FIREBASE_API_KEY=...
railway variables set FIREBASE_AUTH_DOMAIN=...
# (repita para todas as variáveis)
```

---

## Regras de segurança do Firestore

Adicione estas regras no console do Firebase (**Firestore → Regras**):

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Para uso pessoal (sem autenticação):
    match /livrogest/{document} {
      allow read, write: if true;
    }

    // Se quiser adicionar autenticação no futuro:
    // match /livrogest/{document} {
    //   allow read, write: if request.auth != null;
    // }
  }
}
```

---

## Estrutura do projeto

```
livrogest/
├── public/
│   ├── index.html      ← App completo (HTML + CSS + JS)
│   ├── manifest.json   ← Configuração PWA
│   └── sw.js           ← Service Worker (cache offline)
├── server.js           ← Express: serve estáticos + injeta config Firebase
├── package.json
├── railway.toml        ← Configuração de deploy
├── Dockerfile          ← Container alternativo
├── .env.example        ← Template de variáveis
└── README.md
```

---

## Stack

| Tecnologia | Uso |
|------------|-----|
| Node.js + Express | Servidor HTTP, injeção de config |
| Firebase Firestore | Banco de dados em tempo real |
| Chart.js | Gráficos no dashboard e relatórios |
| Google Fonts (Sora) | Tipografia |
| PWA (manifest + SW) | Instalável offline |
| Railway | Hospedagem em nuvem |

---

## Licença

MIT — use à vontade!
