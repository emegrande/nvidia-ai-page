const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

// Cargar variables de entorno
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Configurar CORS
const corsOptions = {
  origin: process.env.CORS_ORIGINS ? process.env.CORS_ORIGINS.split(',') : '*',
  credentials: true,
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// Servir archivos estáticos
app.use(express.static(path.join(__dirname, 'public')));

// Rutas
const apiRoutes = require('./routes/api');
const modelRoutes = require('./routes/models');
const healthRoutes = require('./routes/health');

// Usar rutas
app.use('/api', apiRoutes);
app.use('/api/models', modelRoutes);
app.use('/health', healthRoutes);

// Servir index.html para la raíz
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Ruta para SPA (Single Page Application)
app.get('*', (req, res) => {
  if (req.path.startsWith('/api') || req.path.startsWith('/health')) {
    return res.status(404).json({
      success: false,
      message: 'Ruta no encontrada',
      path: req.path
    });
  }
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Manejo de errores global
app.use((err, req, res, next) => {
  console.error('❌ Error:', err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Error interno del servidor',
    error: process.env.NODE_ENV === 'development' ? err : {}
  });
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log('\n' + '='.repeat(50));
  console.log('🚀 NVIDIA AI Page - Backend');
  console.log('='.repeat(50));
  console.log(`📍 Servidor corriendo en puerto ${PORT}`);
  console.log(`🌐 URL: http://localhost:${PORT}`);
  console.log(`🔗 API disponible en http://localhost:${PORT}/api`);
  console.log(`💚 Health check en http://localhost:${PORT}/health`);
  console.log(`📚 Modelos en http://localhost:${PORT}/api/models`);
  console.log('='.repeat(50) + '\n');
});

module.exports = app;
