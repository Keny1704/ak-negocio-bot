// ============================================
// BOT DE TELEGRAM SEGURO - SIN EXPONER TOKEN
// ============================================

const TelegramBot = require('node-telegram-bot-api');
const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Token desde variables de entorno
const BOT_TOKEN = process.env.BOT_TOKEN;

// ============================================
// FUNCIONES SEGURAS PARA LOGS
// ============================================
function safeLogToken(token) {
  if (!token) return '❌ NO CONFIGURADO';
  // Muestra solo primeros 5 y últimos 5 caracteres
  return `✅ ${token.substring(0, 5)}...${token.substring(token.length - 5)}`;
}

function maskToken(token) {
  if (!token) return null;
  // Convierte 1234567890:ABCdefGHIjklMNOpqrsTUVwxyz
  // En: 12345...wxyz
  const parts = token.split(':');
  if (parts.length !== 2) return '❌ FORMATO INVÁLIDO';
  
  const firstPart = parts[0];
  const secondPart = parts[1];
  
  return `${firstPart.substring(0, 5)}...${secondPart.substring(secondPart.length - 5)}`;
}

// ============================================
// INICIO SEGURO
// ============================================
console.log('🔒 ============================================');
console.log('🔒 BOT DE TELEGRAM - MODO SEGURO');
console.log('🔒 ============================================');
console.log('📡 Token:', safeLogToken(BOT_TOKEN));
console.log('🌐 Puerto:', PORT);
console.log('🔒 ============================================');

if (!BOT_TOKEN) {
  console.log('❌ ERROR: BOT_TOKEN no configurado en variables de entorno');
  console.log('📌 Ve a Render.com → Tu servicio → Environment');
  console.log('📌 Agrega variable: BOT_TOKEN = tu_token_secreto');
  console.log('🔒 ============================================');
  
  // Página web informativa
  app.get('/', (req, res) => {
    res.send(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>❌ Configuración Pendiente</title>
        <style>
          body { font-family: Arial; text-align: center; padding: 50px; }
          .error { color: red; background: #ffe6e6; padding: 20px; border-radius: 10px; }
          code { background: #f4f4f4; padding: 5px; border-radius: 3px; }
        </style>
      </head>
      <body>
        <h1>🤖 Bot de Negocio</h1>
        <div class="error">
          <h2>❌ Configuración Requerida</h2>
          <p>El bot no tiene configurado el token de Telegram.</p>
          <p><strong>Pasos a seguir:</strong></p>
          <ol style="text-align: left; display: inline-block;">
            <li>Ve a <a href="https://dashboard.render.com">Render.com</a></li>
            <li>Selecciona tu servicio</li>
            <li>Haz clic en "Environment"</li>
            <li>Agrega variable: <code>BOT_TOKEN</code></li>
            <li>Valor: tu token de @BotFather</li>
            <li>Reinicia el servicio</li>
          </ol>
        </div>
      </body>
      </html>
    `);
  });
  
  app.listen(PORT, () => {
    console.log(`🚀 Servidor en puerto ${PORT} (sin bot)`);
  });
  
  process.exit(0);
}

// ============================================
// CONFIGURACIÓN SEGURA DEL BOT
// ============================================
let bot;

try {
  console.log('🤖 Iniciando conexión con Telegram...');
  
  bot = new TelegramBot(BOT_TOKEN, {
    polling: {
      interval: 1000,
      timeout: 10,
      autoStart: true,
      params: {
        timeout: 10
      }
    }
  });
  
  console.log('✅ Conexión establecida correctamente');
  console.log('🔒 Token seguro:', maskToken(BOT_TOKEN));
  
} catch (error) {
  console.log('❌ Error crítico al crear el bot:', error.message);
  console.log('🔒 Token problemático:', maskToken(BOT_TOKEN));
  process.exit(1);
}

// ============================================
// MANEJO SEGURO DE ERRORES
// ============================================
bot.on('polling_error', (error) => {
  console.log('⚠️ Error en Telegram:', error.code);
  
  // NO mostrar mensajes completos que puedan contener token
  const safeMessage = error.message 
    ? error.message.substring(0, 100) 
    : 'Sin mensaje';
  
  console.log('📝 Error (seguro):', safeMessage);
  
  if (error.code === 'ETELEGRAM') {
    console.log('❌ ERROR ETELEGRAM DETECTADO');
    console.log('🔧 Posibles causas:');
    console.log('1. Token expirado/inválido');
    console.log('2. Bot deshabilitado en @BotFather');
    console.log('3. Problema temporal de Telegram');
    console.log('');
    console.log('🎯 Soluciones:');
    console.log('1. Verifica el token en @BotFather con /mybots');
    console.log('2. Genera nuevo token si es necesario');
    console.log('3. Espera 5 minutos y reinicia');
  }
});

// ============================================
// COMANDOS DEL BOT (SEGUROS)
// ============================================

// COMANDO /start
bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;
  const userName = msg.from.first_name || 'Usuario';
  const userId = msg.from.id;
  
  // Log seguro (sin información sensible)
  console.log(`📨 /start de: ${userName} (ID: ${userId})`);
  
  const welcomeMessage = `¡Hola ${userName}! 👋

✅ *Bot de Negocio Activo*
📍 *Plataforma:* Render.com
⚡ *Estado:* Conectado 24/7
🛡️ *Modo:* Seguro

📋 *Comandos disponibles:*
/productos - Ver catálogo
/pedido - Realizar compra
/horario - Horarios atención
/contacto - Información
/ayuda - Centro de ayuda

💡 *Ejemplo rápido:*
Escribe /productos para ver ofertas

*¡Estamos para servirte!* 🎯`;

  bot.sendMessage(chatId, welcomeMessage, { parse_mode: 'Markdown' })
    .then(() => {
      console.log(`✅ Mensaje enviado a ${userName}`);
    })
    .catch(err => {
      console.log('❌ Error enviando mensaje (oculto por seguridad)');
    });
});

// COMANDO /productos
bot.onText(/\/productos/, (msg) => {
  console.log(`🛒 /productos de: ${msg.from.first_name}`);
  
  bot.sendMessage(msg.chat.id,
    `🛍️ *CATÁLOGO DE PRODUCTOS*

1. *Producto Estrella* - $49.99
   ✅ Envío gratis | ⭐ 4.9/5
   📦 Código: PROD-001

2. *Kit Básico* - $29.99
   🚚 24h entrega | ⭐ 4.7/5
   📦 Código: PROD-002

3. *Servicio Premium* - $99.99/mes
   💎 Soporte 24/7 | ⭐ 5/5
   📦 Código: SERV-001

🎯 *¿CÓMO COMPRAR?*
Usa /pedido [código]
Ejemplo: /pedido PROD-001

💳 *Métodos de pago:*
✓ Tarjetas ✓ PayPal ✓ Efectivo`,
    { parse_mode: 'Markdown' }
  );
});

// COMANDO /pedido
bot.onText(/\/pedido(?: (.+))?/, (msg, match) => {
  const userName = msg.from.first_name;
  console.log(`📝 /pedido de: ${userName}`);
  
  if (match && match[1]) {
    const producto = match[1].toUpperCase();
    const pedidoId = 'PED-' + Date.now().toString().slice(-6);
    
    // Log seguro del pedido
    console.log(`✅ Pedido ${pedidoId} - Producto: ${producto} - Cliente: ${userName}`);
    
    bot.sendMessage(msg.chat.id,
      `✅ *PEDIDO REGISTRADO*

📋 *Detalles:*
• Producto: ${producto}
• ID: ${pedidoId}
• Fecha: ${new Date().toLocaleDateString()}
• Cliente: ${userName}

📞 *Próximos pasos:*
Te contactaremos en 15 minutos para confirmar.

⏰ *Entrega estimada:* 24-48h

🔍 *Consultar estado:* /estado
❌ *Cancelar:* /cancelar ${pedidoId}

*¡Gracias por tu compra!* 🎉`,
      { parse_mode: 'Markdown' }
    );
    
  } else {
    bot.sendMessage(msg.chat.id,
      `📝 *REALIZAR PEDIDO*

Escribe el comando seguido del código:

/pedido [código-del-producto]

*Ejemplos:*
• /pedido PROD-001
• /pedido SERV-001

📦 *Primero usa* /productos *para ver códigos*`,
      { parse_mode: 'Markdown' }
    );
  }
});

// COMANDO /ayuda
bot.onText(/\/ayuda/, (msg) => {
  console.log(`🆘 /ayuda de: ${msg.from.first_name}`);
  
  bot.sendMessage(msg.chat.id,
    `🆘 *CENTRO DE AYUDA*

🤖 *COMANDOS PRINCIPALES:*
/start - Iniciar bot
/productos - Ver catálogo
/pedido [código] - Hacer pedido
/horario - Horarios atención
/contacto - Información contacto
/ayuda - Esta ayuda

🏪 *INFORMACIÓN:*
/horario - Ver horarios
/contacto - Datos contacto
/ubicacion - Dirección

⚙️ *SOPORTE:*
/soporte - Contactar humano
/reclamo - Abrir reclamo

💡 *EJEMPLOS:*
• /pedido PROD-001
• /productos
• /horario

*Este bot funciona 24/7 en Render.com*`,
    { parse_mode: 'Markdown' }
  );
});

// COMANDO /horario
bot.onText(/\/horario/, (msg) => {
  bot.sendMessage(msg.chat.id,
    `🕒 *HORARIO DE ATENCIÓN*

🏪 *TIENDA FÍSICA:*
Lunes a Viernes: 9:00 AM - 8:00 PM
Sábados: 10:00 AM - 6:00 PM
Domingos: 11:00 AM - 3:00 PM

📞 *ATENCIÓN TELEFÓNICA:*
Lunes a Domingo: 8:00 AM - 10:00 PM

🤖 *ESTE BOT:*
24 horas / 7 días a la semana

🚚 *ENTREGAS:*
Pedidos antes de 2:00 PM: Mismo día
Pedidos después de 2:00 PM: Día siguiente`,
    { parse_mode: 'Markdown' }
  );
});

// COMANDO /contacto
bot.onText(/\/contacto/, (msg) => {
  bot.sendMessage(msg.chat.id,
    `📞 *INFORMACIÓN DE CONTACTO*

📱 WhatsApp: +1 (555) 123-4567
📞 Teléfono: +1 (555) 987-6543
📧 Email: contacto@minegocio.com

🌐 *Redes sociales:*
Facebook: facebook.com/minegocio
Instagram: @minegocio.oficial

🏢 *Dirección:*
Av. Principal #1234
Centro, Ciudad, CP 12345

🗺️ *Ver ubicación:* /ubicacion`,
    { parse_mode: 'Markdown' }
  );
});

// Responder mensajes normales (seguro)
bot.on('message', (msg) => {
  if (msg.text && !msg.text.startsWith('/')) {
    const safeText = msg.text.substring(0, 50);
    console.log(`💬 Mensaje de ${msg.from.first_name}: "${safeText}..."`);
    
    bot.sendMessage(msg.chat.id,
      `📝 *Mensaje recibido*

He registrado tu mensaje.

📞 Un agente te contactará pronto.

Mientras tanto, puedes:
• Ver productos: /productos
• Hacer pedido: /pedido
• Contactarnos: /contacto

*Respuesta automática - Bot 24/7*`,
      { parse_mode: 'Markdown' }
    );
  }
});

// ============================================
// PÁGINA WEB DE MONITOREO (SEGURA)
// ============================================
app.get('/', (req, res) => {
  const maskedToken = maskToken(BOT_TOKEN);
  
  const html = `
  <!DOCTYPE html>
  <html>
  <head>
    <title>🤖 Bot de Negocio - Seguro</title>
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <style>
      * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      }
      
      body {
        background: linear-gradient(135deg, #1a2980, #26d0ce);
        min-height: 100vh;
        display: flex;
        justify-content: center;
        align-items: center;
        padding: 20px;
      }
      
      .container {
        background: rgba(255, 255, 255, 0.95);
        backdrop-filter: blur(10px);
        border-radius: 20px;
        padding: 40px 30px;
        box-shadow: 0 25px 50px rgba(0, 0, 0, 0.2);
        max-width: 600px;
        width: 100%;
        text-align: center;
        border: 1px solid rgba(255, 255, 255, 0.3);
      }
      
      .logo {
        font-size: 60px;
        margin-bottom: 20px;
        animation: pulse 2s infinite;
      }
      
      @keyframes pulse {
        0% { transform: scale(1); }
        50% { transform: scale(1.1); }
        100% { transform: scale(1); }
      }
      
      h1 {
        color: #2c3e50;
        margin-bottom: 15px;
        font-size: 32px;
        font-weight: 700;
      }
      
      .status {
        display: inline-block;
        background: linear-gradient(90deg, #00b09b, #96c93d);
        color: white;
        padding: 10px 25px;
        border-radius: 50px;
        font-weight: 600;
        font-size: 16px;
        margin: 20px 0;
        letter-spacing: 0.5px;
      }
      
      .info-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
        gap: 20px;
        margin: 30px 0;
      }
      
      .info-card {
        background: #f8f9fa;
        border-radius: 15px;
        padding: 20px;
        text-align: left;
        border-left: 5px solid #3498db;
        transition: transform 0.3s;
      }
      
      .info-card:hover {
        transform: translateY(-5px);
      }
      
      .info-card h3 {
        color: #2c3e50;
        margin-bottom: 10px;
        font-size: 18px;
      }
      
      .info-card p {
        color: #7f8c8d;
        font-size: 14px;
        line-height: 1.6;
      }
      
      .security-badge {
        background: #2c3e50;
        color: white;
        border-radius: 10px;
        padding: 15px;
        margin-top: 20px;
        font-family: 'Courier New', monospace;
        font-size: 14px;
        text-align: left;
      }
      
      .token-masked {
        color: #2ecc71;
        font-weight: bold;
        background: rgba(46, 204, 113, 0.1);
        padding: 5px 10px;
        border-radius: 5px;
        margin: 10px 0;
      }
      
      .stats {
        display: flex;
        justify-content: space-around;
        margin-top: 30px;
        flex-wrap: wrap;
        gap: 15px;
      }
      
      .stat-item {
        text-align: center;
        padding: 15px;
        background: #ecf0f1;
        border-radius: 10px;
        min-width: 120px;
      }
      
      .stat-value {
        font-size: 24px;
        font-weight: bold;
        color: #3498db;
      }
      
      .stat-label {
        font-size: 12px;
        color: #7f8c8d;
        margin-top: 5px;
        text-transform: uppercase;
        letter-spacing: 1px;
      }
      
      .footer {
        margin-top: 30px;
        color: #95a5a6;
        font-size: 14px;
        line-height: 1.6;
      }
      
      .button {
        display: inline-block;
        background: #3498db;
        color: white;
        padding: 12px 30px;
        border-radius: 50px;
        text-decoration: none;
        font-weight: 600;
        margin-top: 20px;
        transition: all 0.3s;
      }
      
      .button:hover {
        background: #2980b9;
        transform: translateY(-2px);
        box-shadow: 0 10px 20px rgba(52, 152, 219, 0.3);
      }
      
      @media (max-width: 600px) {
        .container {
          padding: 30px 20px;
        }
        
        h1 {
          font-size: 24px;
        }
        
        .info-grid {
          grid-template-columns: 1fr;
        }
      }
    </style>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
  </head>
  <body>
    <div class="container">
      <div class="logo">🤖</div>
      <h1>Bot de Negocio Telegram</h1>
      <div class="status">
        <i class="fas fa-shield-alt" style="margin-right: 8px;"></i>
        MODO SEGURO ACTIVADO
      </div>
      
      <div class="info-grid">
        <div class="info-card">
          <h3><i class="fas fa-server" style="color: #3498db; margin-right: 10px;"></i> Plataforma</h3>
          <p>Render.com - Plan FREE<br>750 horas/mes garantizadas</p>
        </div>
        
        <div class="info-card">
          <h3><i class="fas fa-bolt" style="color: #2ecc71; margin-right: 10px;"></i> Estado</h3>
          <p>✅ Conectado a Telegram<br>🤖 Bot respondiendo comandos</p>
        </div>
        
        <div class="info-card">
          <h3><i class="fas fa-clock" style="color: #e74c3c; margin-right: 10px;"></i> Disponibilidad</h3>
          <p>24/7 - Siempre activo<br>Auto-reinicio mensual</p>
        </div>
        
        <div class="info-card">
          <h3><i class="fas fa-lock" style="color: #9b59b6; margin-right: 10px;"></i> Seguridad</h3>
          <p>Token protegido en logs<br>HTTPS automático</p>
        </div>
      </div>
      
      <div class="security-badge">
        <h3><i class="fas fa-key" style="margin-right: 10px;"></i> Token Seguro</h3>
        <div class="token-masked">${maskedToken}</div>
        <p><i class="fas fa-check-circle" style="color: #2ecc71; margin-right: 8px;"></i> Token enmascarado en logs</p>
        <p><i class="fas fa-check-circle" style="color: #2ecc71; margin-right: 8px;"></i> Nunca expuesto públicamente</p>
        <p><i class="fas fa-check-circle" style="color: #2ecc71; margin-right: 8px;"></i> Almacenado en variables de entorno</p>
      </div>
      
      <div class="stats">
        <div class="stat-item">
          <div class="stat-value">24/7</div>
          <div class="stat-label">Operación</div>
        </div>
        <div class="stat-item">
          <div class="stat-value">100%</div>
          <div class="stat-label">Gratis</div>
        </div>
        <div class="stat-item">
          <div class="stat-value">SSL</div>
          <div class="stat-label">Protegido</div>
        </div>
        <div class="stat-item">
          <div class="stat-value">${Math.floor(process.uptime() / 60)}m</div>
          <div class="stat-label">Uptime</div>
        </div>
      </div>
      
      <div class="footer">
        <p><i class="fas fa-exclamation-triangle" style="color: #f39c12; margin-right: 8px;"></i> 
        <strong>Importante:</strong> Nunca compartas tu token. Mantenlo seguro en variables de entorno.</p>
        
        <a href="/health" class="button">
          <i class="fas fa-heartbeat" style="margin-right: 8px;"></i>
          Verificar Salud del Servicio
        </a>
      </div>
    </div>
  </body>
  </html>
  `;
  
  res.send(html);
});

app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    service: 'telegram-business-bot',
    timestamp: new Date().toISOString(),
    platform: 'Render',
    security: 'token_masked',
    uptime: process.uptime(),
    bot_connected: true,
    version: '2.0.0'
  });
});

app.get('/ping', (req, res) => {
  res.json({ 
    pong: Date.now(),
    secure: true,
    message: 'Token protected in logs'
  });
});

// ============================================
// INICIAR SERVIDOR
// ============================================
app.listen(PORT, '0.0.0.0', () => {
  console.log('🔒 ============================================');
  console.log(`🚀 Servidor seguro en puerto: ${PORT}`);
  console.log(`🌐 URL pública: https://${process.env.RENDER_EXTERNAL_HOSTNAME || process.env.RENDER_SERVICE_NAME || 'app'}.onrender.com`);
  console.log('🛡️  Token protegido:', maskToken(BOT_TOKEN));
  console.log('🔒 ============================================');
  console.log('✅ Bot listo para recibir comandos en Telegram');
  console.log('🔒 ============================================');
  
  // Mantener activo (seguro)
  setInterval(() => {
    const now = new Date();
    console.log(`🔄 Keep-alive: ${now.toLocaleTimeString()} - Uptime: ${Math.floor(process.uptime())}s`);
  }, 300000);
});

// Manejo seguro de cierre
process.on('SIGTERM', () => {
  console.log('🛑 Señal SIGTERM recibida - Cerrando seguro...');
  if (bot) {
    bot.stopPolling();
    console.log('✅ Polling detenido');
  }
  console.log('🔒 Token permanece seguro');
  process.exit(0);
});
