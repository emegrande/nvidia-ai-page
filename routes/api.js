const express = require('express');
const axios = require('axios');
const rateLimit = require('express-rate-limit');
const router = express.Router();

// Rate limiting para proteger la API
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 30, // límite de 30 requests por ventana
  message: 'Demasiadas solicitudes desde esta IP, intenta más tarde.'
});

// Verificar que la API Key esté disponible
if (!process.env.NVIDIA_API_KEY) {
  console.warn('⚠️  NVIDIA_API_KEY no está configurada en las variables de entorno');
}

/**
 * POST /api/chat
 * Envía un mensaje a la API de NVIDIA
 */
router.post('/chat', limiter, async (req, res) => {
  try {
    const { message, model, temperature = 0.7, maxTokens = 1024 } = req.body;

    // Validar entrada
    if (!message || !model) {
      return res.status(400).json({
        success: false,
        message: 'El mensaje y el modelo son requeridos'
      });
    }

    if (message.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: 'El mensaje no puede estar vacío'
      });
    }

    // Obtener API Key (puede venir del cliente o del servidor)
    const apiKey = req.body.apiKey || process.env.NVIDIA_API_KEY;

    if (!apiKey) {
      return res.status(401).json({
        success: false,
        message: 'API Key de NVIDIA no disponible'
      });
    }

    // Log de la solicitud
    console.log(`📨 Solicitud: ${model} | Usuario: ${req.ip}`);

    // Hacer solicitud a NVIDIA API
    const response = await axios.post(
      'https://integrate.api.nvidia.com/v1/chat/completions',
      {
        model: model,
        messages: [
          {
            role: 'user',
            content: message
          }
        ],
        temperature: Math.min(Math.max(temperature, 0), 2), // Validar rango
        max_tokens: Math.min(maxTokens, 4096) // Limitar tokens máximos
      },
      {
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        },
        timeout: 30000 // Timeout de 30 segundos
      }
    );

    // Procesar respuesta
    if (response.data.choices && response.data.choices[0].message) {
      console.log('✅ Respuesta exitosa de NVIDIA API');
      return res.status(200).json({
        success: true,
        message: response.data.choices[0].message.content,
        model: model,
        usage: response.data.usage
      });
    }

    throw new Error('Respuesta inesperada de la API de NVIDIA');

  } catch (error) {
    console.error('❌ Error:', error.message);

    // Manejar errores específicos de NVIDIA API
    if (error.response) {
      const status = error.response.status;
      const data = error.response.data;

      if (status === 401) {
        return res.status(401).json({
          success: false,
          message: 'API Key de NVIDIA inválida o expirada'
        });
      }

      if (status === 429) {
        return res.status(429).json({
          success: false,
          message: 'Límite de solicitudes alcanzado. Intenta más tarde.'
        });
      }

      if (status === 400) {
        return res.status(400).json({
          success: false,
          message: data.message || 'Solicitud inválida'
        });
      }

      return res.status(status).json({
        success: false,
        message: data.message || 'Error en la API de NVIDIA'
      });
    }

    // Errores de conexión
    if (error.code === 'ECONNABORTED') {
      return res.status(504).json({
        success: false,
        message: 'Tiempo de espera agotado. La API tardó demasiado en responder.'
      });
    }

    // Error genérico
    res.status(500).json({
      success: false,
      message: 'Error al procesar la solicitud',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

/**
 * POST /api/validate-key
 * Valida una API Key sin hacer una solicitud completa
 */
router.post('/validate-key', async (req, res) => {
  try {
    const { apiKey } = req.body;

    if (!apiKey) {
      return res.status(400).json({
        success: false,
        message: 'API Key requerida'
      });
    }

    // Hacer una solicitud mínima para validar la clave
    const response = await axios.post(
      'https://integrate.api.nvidia.com/v1/chat/completions',
      {
        model: 'meta/llama-2-7b-chat',
        messages: [{ role: 'user', content: 'test' }],
        max_tokens: 1
      },
      {
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        },
        timeout: 10000
      }
    );

    return res.status(200).json({
      success: true,
      message: 'API Key válida'
    });

  } catch (error) {
    if (error.response?.status === 401) {
      return res.status(401).json({
        success: false,
        message: 'API Key inválida'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Error al validar API Key'
    });
  }
});

module.exports = router;
