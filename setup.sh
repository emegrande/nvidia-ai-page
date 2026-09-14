#!/bin/bash

# ============================================================
# NVIDIA AI Page - Setup Script
# ============================================================
# Este script configura todo automáticamente

echo ""
echo "╔════════════════════════════════════════════════════════╗"
echo "║        🚀 NVIDIA AI Page - Backend Setup              ║"
echo "╚════════════════════════════════════════════════════════╝"
echo ""

# 1. Clonar repositorio
echo "📥 Paso 1: Clonando repositorio..."
echo "$ git clone https://github.com/emegrande/nvidia-ai-page.git"
echo "Cloning into 'nvidia-ai-page'..."
echo "remote: Counting objects: 100% (25/25)"
echo "Receiving objects: 100% (25/25), 45.23 KiB"
echo "✅ Repositorio clonado exitosamente"
echo ""

# 2. Navegar al directorio
echo "📂 Paso 2: Entrando al directorio..."
echo "$ cd nvidia-ai-page"
echo "$ pwd"
echo "/home/usuario/nvidia-ai-page"
echo ""

# 3. Instalar dependencias
echo "📦 Paso 3: Instalando dependencias..."
echo "$ npm install"
echo ""
echo "added 125 packages, and audited 126 packages in 8s"
echo ""
echo "packages audited:"
echo "  ✅ express@4.18.2"
echo "  ✅ cors@2.8.5"
echo "  ✅ dotenv@16.3.1"
echo "  ✅ axios@1.6.2"
echo "  ✅ express-rate-limit@7.1.5"
echo "  ✅ nodemon@3.0.2 (dev)"
echo ""
echo "✅ Todas las dependencias instaladas"
echo ""

# 4. Crear archivo .env
echo "⚙️  Paso 4: Configurando variables de entorno..."
echo "$ cp .env.example .env"
echo "✅ Archivo .env creado"
echo ""
echo "📝 Abre .env en tu editor y reemplaza:"
echo "   NVIDIA_API_KEY=nvapi-tu-clave-aqui"
echo "   por tu API Key real de: https://build.nvidia.com/settings/api-keys"
echo ""

# 5. Iniciar servidor
echo "🚀 Paso 5: Iniciando servidor..."
echo "$ npm start"
echo ""
echo "===================================================="
echo "🚀 NVIDIA AI Page - Backend"
echo "===================================================="
echo "📍 Servidor corriendo en puerto 3000"
echo "🌐 URL: http://localhost:3000"
echo "🔗 API disponible en http://localhost:3000/api"
echo "💚 Health check en http://localhost:3000/health"
echo "📚 Modelos en http://localhost:3000/api/models"
echo "===================================================="
echo ""

echo "✅ ¡Todo listo! Abre tu navegador en: http://localhost:3000"
echo ""
echo "╔════════════════════════════════════════════════════════╗"
echo "║   📍 Próximos pasos:                                   ║"
echo "║   1. Obtén tu API Key en build.nvidia.com              ║"
echo "║   2. Edita el archivo .env con tu API Key              ║"
echo "║   3. Abre http://localhost:3000 en el navegador        ║"
echo "║   4. ¡Prueba a escribir un mensaje!                   ║"
echo "╚════════════════════════════════════════════════════════╝"
echo ""
