"""
🤖 BOT DE TELEGRAM PARA NEGOCIOS
Autor: Tú
Despliegue: Koyeb
Versión: 1.0.0
"""

import os
import logging
from dotenv import load_dotenv
from telegram import Update
from telegram.ext import Application, CommandHandler, MessageHandler, filters, ContextTypes
from flask import Flask
from threading import Thread
import asyncio

# ============================================================================
# CONFIGURACIÓN INICIAL
# ============================================================================

# Cargar variables del archivo .env
load_dotenv()

# Configurar sistema de logging (para ver qué pasa)
logging.basicConfig(
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    level=logging.INFO
)
logger = logging.getLogger(__name__)

# Obtener token desde variables de entorno
TOKEN = os.getenv("TELEGRAM_BOT_TOKEN")

# Verificar que tenemos token
if not TOKEN:
    logger.error("❌ ERROR CRÍTICO: No se encontró TELEGRAM_BOT_TOKEN")
    logger.error("   Crea un archivo .env en la misma carpeta con:")
    logger.error("   TELEGRAM_BOT_TOKEN=tu_token_aqui")
    exit(1)  # Salir si no hay token

# ============================================================================
# HANDLERS - Funciones que responden a comandos
# ============================================================================

async def comando_inicio(update: Update, context: ContextTypes.DEFAULT_TYPE):
    """Responde al comando /start"""
    usuario = update.effective_user
    
    mensaje = f"""
¡Hola {usuario.first_name}! 👋

🤖 *Soy tu asistente de negocios*
Desplegado en ☁️ **Koyeb** (siempre activo)

*Comandos disponibles:*
/start - Mensaje de bienvenida
/help - Ver todos los comandos
/info - Información técnica
/productos - Ver productos
/contacto - Información de contacto
/precio [producto] - Consultar precio

*Ejemplos útiles:*
• Escribe 'hola' para saludar
• Pregunta por 'servicios'
• Consulta 'horarios'

*¿Necesitas ayuda?* Usa /help
"""
    await update.message.reply_text(mensaje, parse_mode='Markdown')

async def comando_ayuda(update: Update, context: ContextTypes.DEFAULT_TYPE):
    """Responde al comando /help"""
    ayuda_texto = """
📋 *AYUDA - COMANDOS DISPONIBLES*

*🎯 Comandos básicos:*
/start - Iniciar conversación
/help - Esta ayuda
/info - Detalles técnicos
/echo [texto] - Repetir texto

*🛍️ Para negocios:*
/productos - Catálogo de productos
/servicios - Nuestros servicios
/precio [producto] - Consultar precio
/pedido - Realizar pedido
/contacto - Información de contacto

*⚙️ Utilidades:*
/horario - Horarios de atención
/ubicacion - Dónde encontrarnos
/promociones - Ofertas vigentes

*💬 También puedes:*
• Saludar (hola, buenos días)
• Preguntar por servicios
• Consultar disponibilidad
"""
    await update.message.reply_text(ayuda_texto, parse_mode='Markdown')

async def comando_info(update: Update, context: ContextTypes.DEFAULT_TYPE):
    """Responde al comando /info"""
    info_texto = """
⚙️ *INFORMACIÓN TÉCNICA*

*🔧 Stack tecnológico:*
• Lenguaje: Python 3.11+
• Librería: python-telegram-bot v20.7
• Hosting: Koyeb (Free Tier)
• Servidor: Siempre activo 24/7

*📊 Características:*
✅ Respuesta inmediata
✅ Sin tiempos de espera
✅ Escalable automáticamente
✅ Health checks incorporados
✅ Logging para diagnóstico

*🔍 Endpoints:*
• https://tu-app.koyeb.app/ - Página status
• https://tu-app.koyeb.app/health - Health check
• https://tu-app.koyeb.app/status - API status

*📈 Próximas funciones:*
• Base de datos para pedidos
• Sistema de notificaciones
• Integración con WhatsApp
"""
    await update.message.reply_text(info_texto, parse_mode='Markdown')

async def comando_productos(update: Update, context: ContextTypes.DEFAULT_TYPE):
    """Responde al comando /productos"""
    productos = """
🛍️ *NUESTROS PRODUCTOS*

*📦 Categoría A - Básicos:*
1️⃣ Producto Alpha - $50
   • Descripción breve
   • Disponible en stock

2️⃣ Producto Beta - $75
   • Con garantía 1 año
   • Envío gratis

*🚀 Categoría B - Premium:*
3️⃣ Producto Gamma - $120
   • Incluye soporte premium
   • Entrega en 24h

4️⃣ Producto Delta - $200
   • Personalizable
   • Pago en cuotas

*🎯 Para consultar precios:*
Usa /precio [nombre_producto]
Ejemplo: /precio Alpha
"""
    await update.message.reply_text(productos, parse_mode='Markdown')

async def comando_precio(update: Update, context: ContextTypes.DEFAULT_TYPE):
    """Responde al comando /precio [producto]"""
    if not context.args:
        await update.message.reply_text(
            "❌ *Uso correcto:*\n`/precio [nombre_producto]`\n\n"
            "Ejemplo: `/precio Alpha`\n"
            "Ver productos: `/productos`",
            parse_mode='Markdown'
        )
        return
    
    producto = ' '.join(context.args).lower()
    
    precios = {
        'alpha': '$50 (IVA incluido)',
        'beta': '$75 + envío gratis',
        'gamma': '$120 con soporte premium',
        'delta': '$200 - pago en 3 cuotas'
    }
    
    precio = precios.get(producto, "Producto no encontrado")
    await update.message.reply_text(
        f"💰 *Precio de {producto.title()}*\n\n"
        f"• **Valor:** {precio}\n"
        f"• **Stock:** Disponible\n"
        f"• **Envío:** 2-3 días hábiles\n\n"
        f"¿Deseas hacer un pedido? Usa /pedido",
        parse_mode='Markdown'
    )

async def comando_contacto(update: Update, context: ContextTypes.DEFAULT_TYPE):
    """Responde al comando /contacto"""
    contacto = """
📞 *INFORMACIÓN DE CONTACTO*

*📍 Dirección:*
Calle Principal 123
Ciudad, País

*🕒 Horarios:*
Lunes a Viernes: 9:00 - 18:00
Sábados: 10:00 - 14:00
Domingos: Cerrado

*📱 Contacto directo:*
• Teléfono: +1 234 567 890
• Email: contacto@negocio.com
• WhatsApp: +1 234 567 891

*🌐 Redes sociales:*
• Instagram: @tu_negocio
• Facebook: /tu_negocio
• Twitter: @tu_negocio

*🗺️ Cómo llegar:*
[Ver en Google Maps](https://maps.google.com)
"""
    await update.message.reply_text(contacto, parse_mode='Markdown', disable_web_page_preview=True)

async def comando_echo(update: Update, context: ContextTypes.DEFAULT_TYPE):
    """Responde al comando /echo [texto] - Para pruebas"""
    if context.args:
        texto = ' '.join(context.args)
        await update.message.reply_text(f"📢 *Echo:* {texto}", parse_mode='Markdown')
    else:
        await update.message.reply_text(
            "❌ *Uso:* `/echo [tu mensaje]`\nEjemplo: `/echo Hola mundo`",
            parse_mode='Markdown'
        )

async def manejar_mensajes(update: Update, context: ContextTypes.DEFAULT_TYPE):
    """Maneja mensajes de texto normales (no comandos)"""
    texto_usuario = update.message.text.lower()
    
    # Respuestas inteligentes
    respuestas = {
        'hola': '¡Hola! ¿En qué puedo ayudarte hoy? 😊',
        'buenos días': '¡Buenos días! ☀️ ¿Cómo estás?',
        'buenas tardes': '¡Buenas tardes! 🌇',
        'buenas noches': '¡Buenas noches! 🌙',
        'gracias': '¡De nada! 😊 ¿Algo más en lo que pueda ayudarte?',
        'adiós': '¡Hasta luego! 👋 Espero verte pronto.',
        'servicios': '📋 *Nuestros servicios:*\n• Consultoría\n• Desarrollo\n• Soporte técnico\n• Mantenimiento\n\nUsa /servicios para más detalles.',
        'horario': '🕒 *Horarios:*\nLun-Vie: 9:00-18:00\nSáb: 10:00-14:00\nDom: Cerrado\n\nUsa /contacto para más info.',
        'precio': '💰 Para consultar precios usa:\n`/precio [nombre_producto]`\n\nEjemplo: `/precio Alpha`',
        'producto': '🛍️ *Productos disponibles:*\n• Alpha\n• Beta\n• Gamma\n• Delta\n\nUsa /productos para ver detalles.',
        'pedido': '🛒 Para hacer un pedido:\n1. Usa /productos para ver catálogo\n2. Usa /precio para consultar\n3. Contáctanos via /contacto',
        'koyeb': '☁️ *Koyeb* es mi hosting.\n✅ Siempre activo\n✅ Gratis para empezar\n✅ Fácil de usar\n¡Lo recomiendo!',
        'python': '🐍 *Python* es el lenguaje con el que estoy construido.\nRápido, confiable y con muchas librerías. ¡Me encanta!',
    }
    
    # Buscar respuesta
    respuesta = respuestas.get(texto_usuario)
    
    if respuesta:
        await update.message.reply_text(respuesta, parse_mode='Markdown')
    else:
        # Respuesta por defecto
        await update.message.reply_text(
            f"✅ Recibí tu mensaje: *{update.message.text}*\n\n"
            f"💡 *Sugerencias:*\n"
            f"• Usa /help para ver comandos\n"
            f"• Usa /productos para ver catálogo\n"
            f"• Usa /contacto para información",
            parse_mode='Markdown'
        )

async def manejar_errores(update: Update, context: ContextTypes.DEFAULT_TYPE):
    """Maneja errores del bot"""
    logger.error(f"Error: {context.error}")
    try:
        await update.message.reply_text(
            "❌ *Ups, algo salió mal*\n\n"
            "El error ha sido registrado. Por favor, intenta nuevamente.\n"
            "Si el problema persiste, contacta al administrador.",
            parse_mode='Markdown'
        )
    except:
        pass  # Silenciar errores en el manejo de errores

# ============================================================================
# SERVIDOR WEB PARA HEALTH CHECKS (Koyeb requiere esto)
# ============================================================================

app_flask = Flask(__name__)

@app_flask.route('/')
def pagina_inicio():
    return """
    <!DOCTYPE html>
    <html lang="es">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>🤖 Bot de Negocios</title>
        <style>
            body {
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
                margin: 0;
                padding: 0;
                display: flex;
                justify-content: center;
                align-items: center;
                min-height: 100vh;
            }
            .container {
                background: rgba(255, 255, 255, 0.1);
                backdrop-filter: blur(10px);
                border-radius: 20px;
                padding: 40px;
                max-width: 800px;
                text-align: center;
                box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
                border: 1px solid rgba(255, 255, 255, 0.2);
            }
            h1 {
                font-size: 3em;
                margin-bottom: 20px;
            }
            .status {
                font-size: 1.5em;
                background: rgba(0, 255, 0, 0.2);
                padding: 10px 20px;
                border-radius: 50px;
                display: inline-block;
                margin: 20px 0;
            }
            .endpoints {
                margin-top: 30px;
                text-align: left;
                display: inline-block;
            }
            a {
                color: #fff;
                text-decoration: none;
                background: rgba(255, 255, 255, 0.2);
                padding: 10px 20px;
                border-radius: 10px;
                margin: 5px;
                display: inline-block;
                transition: all 0.3s;
            }
            a:hover {
                background: rgba(255, 255, 255, 0.3);
                transform: translateY(-2px);
            }
        </style>
    </head>
    <body>
        <div class="container">
            <h1>🤖 Bot de Negocios</h1>
            <p>Asistente automatizado para Telegram</p>
            <div class="status">✅ EN LÍNEA Y OPERATIVO</div>
            <p>Este bot está desplegado en <strong>Koyeb</strong> y funcionando las 24/7.</p>
            <div class="endpoints">
                <h3>📊 Endpoints:</h3>
                <a href="/health">/health</a>
                <a href="/status">/status</a>
                <a href="https://t.me/mi_bot_de_negocios_bot" target="_blank">💬 Chat con el bot</a>
            </div>
        </div>
    </body>
    </html>
    """

@app_flask.route('/health')
def health_check():
    """Endpoint para verificar que el bot está vivo"""
    return {"status": "healthy", "service": "telegram-bot", "timestamp": "2024"}, 200

@app_flask.route('/status')
def status_api():
    """API de status"""
    return {
        "status": "operational",
        "service": "telegram-bot-for-business",
        "version": "1.0.0",
        "uptime": "24/7",
        "hosting": "koyeb",
        "endpoints": ["/", "/health", "/status"]
    }, 200

def ejecutar_servidor_web():
    """Ejecuta Flask en un thread separado"""
    app_flask.run(host='0.0.0.0', port=8080, debug=False, use_reloader=False)

# ============================================================================
# CONFIGURACIÓN PRINCIPAL DEL BOT
# ============================================================================

def configurar_bot():
    """Configura y retorna la aplicación del bot"""
    # Crear la aplicación con el token
    aplicacion = Application.builder().token(TOKEN).build()
    
    # Añadir handlers de comandos
    aplicacion.add_handler(CommandHandler("start", comando_inicio))
    aplicacion.add_handler(CommandHandler("help", comando_ayuda))
    aplicacion.add_handler(CommandHandler("info", comando_info))
    aplicacion.add_handler(CommandHandler("productos", comando_productos))
    aplicacion.add_handler(CommandHandler("precio", comando_precio))
    aplicacion.add_handler(CommandHandler("contacto", comando_contacto))
    aplicacion.add_handler(CommandHandler("echo", comando_echo))
    
    # Añadir handler para mensajes de texto normales
    aplicacion.add_handler(MessageHandler(
        filters.TEXT & ~filters.COMMAND,
        manejar_mensajes
    ))
    
    # Añadir handler de errores
    aplicacion.add_error_handler(manejar_errores)
    
    return aplicacion

async def main_asincrono():
    """Función principal asincrónica"""
    # Iniciar servidor web en thread separado
    logger.info("🌐 Iniciando servidor web en puerto 8080...")
    thread_web = Thread(target=ejecutar_servidor_web, daemon=True)
    thread_web.start()
    
    # Configurar el bot
    logger.info("🤖 Configurando bot de Telegram...")
    aplicacion = configurar_bot()
    
    # Iniciar el bot
    logger.info("🚀 Iniciando bot...")
    await aplicacion.initialize()
    await aplicacion.start()
    await aplicacion.updater.start_polling()
    
    logger.info("✅ Bot iniciado correctamente!")
    logger.info("📱 Busca tu bot en Telegram y envía /start")
    logger.info("🌐 Health checks en: http://localhost:8080/health")
    
    # Mantener el bot corriendo indefinidamente
    await asyncio.Event().wait()

def main():
    """Punto de entrada principal"""
    try:
        asyncio.run(main_asincrono())
    except KeyboardInterrupt:
        logger.info("👋 Bot detenido por el usuario")
    except Exception as e:
        logger.error(f"💥 Error crítico: {e}")
        logger.error("Revisa tu token y conexión a internet")

# ============================================================================
# EJECUCIÓN
# ============================================================================

if __name__ == '__main__':
    print("\n" + "="*50)
    print("🤖 BOT DE TELEGRAM - INICIANDO")
    print("="*50)
    
    # Verificar token antes de empezar
    if TOKEN and len(TOKEN) > 30 and ":" in TOKEN:
        print(f"✅ Token cargado correctamente")
        print(f"✅ Python {os.sys.version.split()[0]}")
        print(f"✅ Puerto web: 8080")
        print(f"✅ Modo: Polling")
        print("="*50 + "\n")
        main()
    else:
        print("❌ ERROR: Token inválido o no encontrado")
        print("   Verifica que el archivo .env exista y contenga:")
        print("   TELEGRAM_BOT_TOKEN=tu_token_de_telegram")
        print("   El token debe tener formato: 1234567890:ABCdefGhIJK...")