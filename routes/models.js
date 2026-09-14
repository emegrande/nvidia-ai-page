const express = require('express');
const router = express.Router();

/**
 * GET /api/models
 * Retorna la lista de modelos disponibles
 */
router.get('/', (req, res) => {
  const models = [
    {
      id: 'meta/llama-2-7b-chat',
      name: 'Llama 2 7B Chat',
      description: 'Modelo versátil de Meta para conversaciones',
      provider: 'Meta',
      maxTokens: 4096,
      recommended: true,
      tags: ['chat', 'general', 'rápido']
    },
    {
      id: 'mistralai/mistral-7b-instruct-v0.1',
      name: 'Mistral 7B Instruct',
      description: 'Modelo eficiente con instrucciones de Mistral AI',
      provider: 'Mistral AI',
      maxTokens: 8192,
      recommended: true,
      tags: ['chat', 'instrucciones', 'eficiente']
    },
    {
      id: 'google/flan-t5-xl',
      name: 'Flan T5 XL',
      description: 'Modelo versátil de Google para diversas tareas',
      provider: 'Google',
      maxTokens: 512,
      recommended: false,
      tags: ['tareas', 'clasificación', 'análisis']
    },
    {
      id: 'deepseek-ai/deepseek-coder-6.7b-instruct',
      name: 'DeepSeek Coder 6.7B',
      description: 'Especializado en generación de código',
      provider: 'DeepSeek',
      maxTokens: 4096,
      recommended: true,
      tags: ['código', 'programación', 'técnico']
    },
    {
      id: 'nv-embedqa-e5-v5',
      name: 'Embeddings E5',
      description: 'Modelo para generar embeddings de texto',
      provider: 'NVIDIA',
      maxTokens: 512,
      recommended: false,
      tags: ['embeddings', 'búsqueda', 'similitud']
    },
    {
      id: 'qwen/qwen2-7b-instruct',
      name: 'Qwen2 7B Instruct',
      description: 'Modelo multilingüe de Alibaba Qwen',
      provider: 'Qwen',
      maxTokens: 32768,
      recommended: true,
      tags: ['multilingüe', 'chat', 'largo contexto']
    }
  ];

  res.status(200).json({
    success: true,
    count: models.length,
    models: models
  });
});

/**
 * GET /api/models/:id
 * Retorna detalles de un modelo específico
 */
router.get('/:id', (req, res) => {
  const { id } = req.params;

  // Buscar modelo
  const models = {
    'meta/llama-2-7b-chat': {
      id: 'meta/llama-2-7b-chat',
      name: 'Llama 2 7B Chat',
      description: 'Modelo versátil de Meta para conversaciones',
      provider: 'Meta',
      maxTokens: 4096,
      recommended: true,
      tags: ['chat', 'general', 'rápido'],
      details: {
        parameters: 7_000_000_000,
        released: '2023-07-18',
        license: 'Llama 2 Community License',
        website: 'https://www.llama.com/',
        bestFor: 'Conversaciones generales, preguntas y respuestas'
      }
    },
    'mistralai/mistral-7b-instruct-v0.1': {
      id: 'mistralai/mistral-7b-instruct-v0.1',
      name: 'Mistral 7B Instruct',
      description: 'Modelo eficiente con instrucciones de Mistral AI',
      provider: 'Mistral AI',
      maxTokens: 8192,
      recommended: true,
      tags: ['chat', 'instrucciones', 'eficiente'],
      details: {
        parameters: 7_000_000_000,
        released: '2023-09-27',
        license: 'Apache 2.0',
        website: 'https://mistral.ai/',
        bestFor: 'Tareas con instrucciones específicas, seguimiento de prompts'
      }
    }
  };

  const model = models[id];

  if (!model) {
    return res.status(404).json({
      success: false,
      message: `Modelo '${id}' no encontrado`
    });
  }

  res.status(200).json({
    success: true,
    model: model
  });
});

/**
 * GET /api/models/search
 * Busca modelos por tags o características
 */
router.get('/search', (req, res) => {
  const { query, tag } = req.query;

  const allModels = [
    {
      id: 'meta/llama-2-7b-chat',
      name: 'Llama 2 7B Chat',
      tags: ['chat', 'general', 'rápido']
    },
    {
      id: 'deepseek-ai/deepseek-coder-6.7b-instruct',
      name: 'DeepSeek Coder 6.7B',
      tags: ['código', 'programación', 'técnico']
    },
    {
      id: 'qwen/qwen2-7b-instruct',
      name: 'Qwen2 7B Instruct',
      tags: ['multilingüe', 'chat', 'largo contexto']
    }
  ];

  let filtered = allModels;

  if (tag) {
    filtered = filtered.filter(m => m.tags.includes(tag.toLowerCase()));
  }

  if (query) {
    const q = query.toLowerCase();
    filtered = filtered.filter(m => 
      m.name.toLowerCase().includes(q) || 
      m.id.toLowerCase().includes(q)
    );
  }

  res.status(200).json({
    success: true,
    query: { tag, query },
    count: filtered.length,
    models: filtered
  });
});

module.exports = router;
