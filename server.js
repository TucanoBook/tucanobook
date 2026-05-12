require('dotenv').config();
const express = require('express');
const compression = require('compression');
const helmet = require('helmet');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(compression());
// CSP desativado para permitir Firebase SDK via CDN e inline handlers
app.use(helmet({ contentSecurityPolicy: false }));

// Expose Firebase config
app.get('/api/config', (req, res) => {
  const config = {
    apiKey:            process.env.FIREBASE_API_KEY,
    authDomain:        process.env.FIREBASE_AUTH_DOMAIN,
    projectId:         process.env.FIREBASE_PROJECT_ID,
    storageBucket:     process.env.FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
    appId:             process.env.FIREBASE_APP_ID,
  };

  const missing = Object.entries(config).filter(([,v])=>!v).map(([k])=>k);
  if (missing.length) {
    return res.status(500).json({ error: 'Firebase não configurado.', missing });
  }
  res.json(config);
});

// Health check
app.get('/health', (req, res) => res.json({ status: 'ok', ts: Date.now() }));

// Static files
app.use(express.static(path.join(__dirname, 'public'), { maxAge: '1d' }));

// SPA fallback
app.get('*', (req, res) =>
  res.sendFile(path.join(__dirname, 'public', 'index.html'))
);

app.listen(PORT, () => {
  console.log(`✅ LivroGest rodando em http://localhost:${PORT}`);
});
