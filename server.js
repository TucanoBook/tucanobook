require('dotenv').config();
const express = require('express');
const compression = require('compression');
const helmet = require('helmet');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Security & compression
app.use(compression());
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: [
          "'self'",
          "'unsafe-inline'",
          'https://www.gstatic.com',
          'https://cdn.jsdelivr.net',
        ],
        connectSrc: [
          "'self'",
          'https://*.googleapis.com',
          'https://*.firebaseio.com',
          'https://firestore.googleapis.com',
        ],
        styleSrc: ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com'],
        fontSrc: ["'self'", 'https://fonts.gstatic.com'],
        imgSrc: ["'self'", 'data:'],
      },
    },
  })
);

// Expose Firebase config (safe — Firebase client config is always public)
app.get('/api/config', (req, res) => {
  const config = {
    apiKey:            process.env.FIREBASE_API_KEY,
    authDomain:        process.env.FIREBASE_AUTH_DOMAIN,
    projectId:         process.env.FIREBASE_PROJECT_ID,
    storageBucket:     process.env.FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
    appId:             process.env.FIREBASE_APP_ID,
  };

  const missing = Object.entries(config)
    .filter(([, v]) => !v)
    .map(([k]) => k);

  if (missing.length) {
    console.warn('Firebase config missing:', missing);
    return res.status(500).json({ error: 'Firebase não configurado. Verifique as variáveis de ambiente.', missing });
  }

  res.json(config);
});

// Health check for Railway
app.get('/health', (req, res) => res.json({ status: 'ok', ts: Date.now() }));

// Serve static files
app.use(express.static(path.join(__dirname, 'public'), { maxAge: '1d' }));

// SPA fallback
app.get('*', (req, res) =>
  res.sendFile(path.join(__dirname, 'public', 'index.html'))
);

app.listen(PORT, () => {
  console.log(`✅ LivroGest rodando em http://localhost:${PORT}`);
});
