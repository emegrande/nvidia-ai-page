import process from "node:process";
import express from "express";
import axios from "axios";

const router = express.Router();

/**
 * GET /health
 * Endpoint de salud para verificar que el servidor está activo
 */
router.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    status: 'healthy',
    message: '🟢 Servidor funcionando correctamente',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development'
  });
});

/**
 * GET /health/nvidia
 * Verifica la conectividad con la API de NVIDIA
 */
router.get('/nvidia', async (req, res) => {
  try {
    const response = await axios.post(
      'https://integrate.api.nvidia.com/v1/chat/completions',
      {
        model: 'meta/llama-2-7b-chat',
        messages: [{ role: 'user', content: 'ping' }],
        max_tokens: 1
      },
      {
        headers: {
          'Authorization': `Bearer ${process.env.NVIDIA_API_KEY || 'test'}`,
          'Content-Type': 'application/json'
        },
        timeout: 5000
      }
    );

    return res.status(200).json({
      success: true,
      service: 'NVIDIA API',
      status: 'reachable',
      message: '🟢 API de NVIDIA accesible',
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    return res.status(503).json({
      success: false,
      service: 'NVIDIA API',
      status: 'unreachable',
      message: '🔴 API de NVIDIA no accesible',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
      timestamp: new Date().toISOString()
    });
  }
});

/**
 * GET /health/full
 * Verificación completa del sistema
 */
router.get('/full', async (req, res) => {
  const checks = {
    server: { status: 'healthy', message: '🟢 Servidor activo' },
    memory: {
      status: process.memoryUsage().heapUsed / process.memoryUsage().heapTotal > 0.9 ? 'warning' : 'healthy',
      message: `${Math.round(process.memoryUsage().heapUsed / 1024 / 1024)}MB / ${Math.round(process.memoryUsage().heapTotal / 1024 / 1024)}MB`,
      percentage: Math.round(process.memoryUsage().heapUsed / process.memoryUsage().heapTotal * 100)
    }
  };

  // Verificar NVIDIA API
  try {
    await axios.post(
      'https://integrate.api.nvidia.com/v1/chat/completions',
      {
        model: 'meta/llama-2-7b-chat',
        messages: [{ role: 'user', content: 'test' }],
        max_tokens: 1
      },
      {
        headers: {
          'Authorization': `Bearer ${process.env.NVIDIA_API_KEY || 'test'}`,
          'Content-Type': 'application/json'
        },
        timeout: 5000
      }
    );
    checks.nvidia = { status: 'healthy', message: '🟢 API NVIDIA accesible' };
  } catch (error) {
    checks.nvidia = { status: 'error', message: '🔴 API NVIDIA no accesible' };
  }

  const allHealthy = Object.values(checks).every(c => c.status === 'healthy');

  res.status(allHealthy ? 200 : 503).json({
    success: allHealthy,
    status: allHealthy ? 'healthy' : 'degraded',
    timestamp: new Date().toISOString(),
    checks: checks,
    uptime: process.uptime()
  });
});

export default router;
