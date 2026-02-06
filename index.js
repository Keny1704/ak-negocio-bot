// ==================== CONFIGURACIÓN ====================
const TelegramBot = require('node-telegram-bot-api');
const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

// Token desde variables de entorno en Render
const TOKEN = process.env.BOT_TOKEN;

// ==================== TRUCO PARA QUE NO SE DUERMA ====================
// Render duerme apps free después de 15 minutos inactivas
// Este ping mantiene activo el bot
const keepAlive = () => {
  if (process.env.RENDER) {
    console.log('🔄 Enviando ping para mantener activo...');
    // Hacemos un ping a la propia URL cada 14 minutos
    setInterval(() => {
      const https = require('https');
      const url = process.env.RENDER_EXTERNAL_URL || `https://${process.env.RENDER_SERVICE_NAME}.onrender.com`;
      https.get(url, (res) => {
        console.log(`✅ Ping exitoso a ${url} - Status: ${res.statusCode}`);
      }).on('error', (err) => {
        console.log('⚠️ Error en ping:', err.message);
      });
    }, 14 * 60 * 1000); // 14 minutos
  }
};

// ==================== SERVIDOR WEB ====================
// Página de inicio bonita
app.get('/', (req, res) => {
  const html = `
  <!DOCTYPE html>
  <html>
  <head>
    <title>🤖 Bot de Negocio Activo</title>
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <style>
      * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, sans-serif;
      }
      
      body {
        background: linear-gradient(135deg, #6a11cb 0%, #2575fc 100%);
        min-height: 100vh;
        display: flex;
        justify-content: center;
        align-items: center;
        padding: 20px;
      }
      
      .container {
        background: rgba(255, 255, 255, 0.95);
        backdrop-filter: blur(10px);
        border-radius: 24px;
        padding: 40px 30px;
        box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
        max-width: 500px;
        width: 100%;
        text-align: center;
        border: 1px solid rgba(255, 255, 255, 0.2);
      }
      
      .logo {
        font-size: 48px;
        margin-bottom: 20px;
        animation: float 3s ease-in-out infinite;
      }
      
      @keyframes float {
        0%, 100% { transform: translateY(0); }
        50% { transform: translateY(-10px); }
      }
      
      h1 {
        color: #2d3436;
        margin-bottom: 10px;
        font-size: 28px;
        font-weight: 700;
      }
      
      .status-badge {
        display: inline-block;
        background: linear-gradient(90deg, #00b09b, #96c93d);
        color: white;
        padding: 8px 20px;
        border-radius: 50px;
        font-weight: 600;
        font-size: 14px;
        margin: 15px 0;
        letter-spacing: 0.5px;
      }
      
      .info-card {
        background: #f8f9fa;
        border-radius: 16px;
        padding: 25px;
        margin: 25px 0;
        text-align: left;
        border-left: 5px solid #6a11cb;
      }
      
      .info-item {
        display: flex;
        align-items: center;
        margin: 12px 0;
        color: #495057;
      }
      
      .info-item i {
        font-size: 20px;
        margin-right: 15px;
        width: 24px;
        text-align: center;
      }
      
      .stats {
        background: #2d3436;
        color: white;
        border-radius: 12px;
        padding: 15px;
        margin-top: 20px;
        font-family: 'Courier New', monospace;
        font-size: 14px;
        text-align: left;
      }
      
      .highlight {
        color: #00ff88;
        font-weight: bold;
      }
      
      .footer {
        margin-top: 25px;
        color: #6c757d;
        font-size: 14px;
        line-height: 1.5;
      }
      
      .button {
        display: inline-block;
        background: #6a11cb;
        color: white;
        padding: 12px 30px;
        border-radius: 50px;
        text-decoration: none;
        font-weight: 600;
        margin-top: 20px;
        transition: all 0.3s ease;
      }
      
      .button:hover {
        background: #2575fc;
        transform: translateY(-2px);
        box-shadow: 0 10px 20px rgba(106, 17, 203, 0.3);
      }
    </style>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
  </head>
  <body>
    <div class="container">
      <div class="logo">🤖</div>
      <h1>Bot de Negocio Telegram</h1>
      <div class="status-badge">
        <i class="fas fa-circle" style="color: #00ff88; font-size: 10px; margin-right: 8px;"></i>
        ACTIVO 24/7 EN RENDER
      </div>
      
      <div class="info-card">
        <div class="info-item">
          <i class="fas fa-server" style="color: #6a11cb;"></i>
          <div>
            <strong>Plataforma:</strong> Render.com
          </div>
        </div>
        <div class="info-item">
          <i class="fas fa-tag" style="color: #00b09b;"></i>
          <div>
            <strong>Plan:</strong> FREE (750 horas/mes)
          </div>
        </div>
        <div class="info-item">
          <i class="fas fa-bolt" style="color: #ffd700;"></i>
          <div>
            <strong>Estado Bot:</strong> ${TOKEN ? '🟢 Conectado' : '🟡 Esperando token'}
          </div>
        </div>
        <div class="info-item">
          <i class="fas fa-shield-alt" style="color: #2575fc;"></i>
          <div>
            <strong>Seguridad:</strong> HTTPS activado
          </div>
        </div>
      </div>
      
      <div class="stats">
        <div><span class="highlight">$</span> uptime <span class="highlight">></span> ${Math.floor(process.uptime())} segundos</div>
        <div><span class="highlight">$</span> node_version <span class="highlight">></span> ${process.version}</div>
        <div><span class="highlight">$</span> platform <span class="highlight">></span> ${process.platform}</div>
        <div><span class="highlight">$</span> memory <span class="highlight">></span> ${Math.round(process.memoryUsage().heapUsed / 1024 / 1024)}MB</div>
      </div>
      
      <div class="footer">
        <p>✅ Bot funcionando las 24 horas<br>
        ✅ 100% Gratis sin tarjeta de crédito<br>
        ✅ Despliegue automático desde GitHub</p>
        
        <a href="https://render.com" target="_blank" class="button">
          <i class="fas fa-external-link-alt" style="margin-right: 8px;"></i>
          Ver Render.com
        </a>
      </div>
    </div>
  </body>
  </html>
  `;
  res.send(html);
});

// Health check para Render
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    service: 'telegram-business-bot',
    timestamp: new Date().toISOString(),
    platform: 'Render',
    free: true,
    uptime: process.uptime(),
    bot_connected: !!TOKEN
  });
});

// Ruta de ping para mantener activo
app.get('/ping', (req, res) => {
  res.json({ 
    pong: Date.now(),
    uptime: process.uptime()
  });
});

// ==================== BOT DE TELEGRAM ====================
console.log('🚀 Iniciando Bot de Negocio en Render...');
console.log('📡 Puerto:', PORT);
console.log('🔑 Bot Token:', TOKEN ? '✅ Configurado' : '❌ No configurado');

if (!TOKEN) {
  console.log('⚠️ ADVERTENCIA: BOT_TOKEN no configurado en variables de entorno');
  console.log('ℹ️  Configúralo en Render.com -> Environment Variables');
}

// Iniciar bot solo si hay token
let bot = null;
if (TOKEN) {
  try {
    bot = new TelegramBot(TOKEN, { polling: true });
    console.log('✅ Bot de Telegram inicializado correctamente');
    
    // Configurar manejo de errores
    bot.on('polling_error', (error) => {
      console.log('⚠️ Error en Telegram polling:', error.code);
      if (error.code === 'EFATAL') {
        console.log('🔄 Reiniciando bot en 10 segundos...');
        setTimeout(() => {
          process.exit(1); // Render reiniciará automáticamente
        }, 10000);
      }
    });
    
    // ==================== COMANDOS DEL BOT ====================
    
    // COMANDO /start
    bot.onText(/\/start/, (msg) => {
      const chatId = msg.chat.id;
      const userName = msg.from.first_name || 'Cliente';
      
      const welcomeMessage = `✨ *¡Hola ${userName}!* ✨

🤖 *Bienvenido al Bot Oficial de Mi Negocio*

📍 *Conectado desde:* Render.com
⚡ *Estado:* Activo 24/7
💰 *Plan:* 100% GRATIS

🛒 *¿Qué puedes hacer aquí?*
• Ver catálogo de productos
• Realizar pedidos
• Consultar horarios
• Contactar con soporte
• Ver promociones

📋 *Comandos disponibles:*
/productos - Ver catálogo completo
/pedido - Realizar un pedido
/horario - Horarios de atención
/contacto - Información de contacto
/ubicacion - Cómo llegar
/promociones - Ofertas especiales
/ayuda - Centro de ayuda

💡 *Ejemplo rápido:*
Escribe /productos para ver todo lo disponible.

*¡Estamos aquí para ayudarte!* 🎯`;

      bot.sendMessage(chatId, welcomeMessage, { parse_mode: 'Markdown' });
    });
    
    // COMANDO /productos
    bot.onText(/\/productos/, (msg) => {
      const productos = `🛍️ *CATÁLOGO DE PRODUCTOS*

🎯 *PRODUCTOS DESTACADOS*

1. *Producto Premium* - $49.99
   ✅ Envío gratis | ⭐ 4.9/5
   📦 Código: PROD-001
   
2. *Kit Inicial* - $29.99
   🚚 24h envío | ⭐ 4.7/5
   📦 Código: PROD-002
   
3. *Servicio Mensual* - $99.99/mes
   💎 Soporte prioritario | ⭐ 5/5
   📦 Código: SERV-001

🔥 *OFERTAS ESPECIALES*
• Pack Familiar (3 unidades) - $129.99
  🎁 Código: OFERTA-001
  💰 Ahorras $20

• Primera compra - 15% descuento
  🎉 Código: BIENVENIDO15

📝 *¿CÓMO COMPRAR?*
1. Elige un producto
2. Usa /pedido [código]
   Ejemplo: /pedido PROD-001
3. Te contactaremos para confirmar

💳 *Métodos de pago aceptados:*
✓ Tarjetas de crédito/débito
✓ PayPal
✓ Transferencia bancaria
✓ Efectivo en tienda`;

      bot.sendMessage(msg.chat.id, productos, { parse_mode: 'Markdown' });
    });
    
    // COMANDO /pedido
    bot.onText(/\/pedido(?: (.+))?/, (msg, match) => {
      const chatId = msg.chat.id;
      
      if (match && match[1]) {
        // Pedido con producto específico
        const producto = match[1].toUpperCase();
        const pedidoId = 'PED-' + Date.now().toString().slice(-6);
        
        const confirmacion = `✅ *PEDIDO REGISTRADO EXITOSAMENTE*

📋 *Detalles del pedido:*
• Producto: ${producto}
• ID de pedido: ${pedidoId}
• Fecha: ${new Date().toLocaleDateString('es-ES')}
• Hora: ${new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}
• Cliente: ${msg.from.first_name}

📞 *Próximos pasos:*
1. Te contactaremos en menos de *15 minutos*
2. Confirmaremos disponibilidad
3. Coordinaremos método de pago
4. Programaremos entrega

⏰ *Tiempo estimado de entrega:* 24-48 horas

🔍 *Para consultar estado:* /estado ${pedidoId}

❌ *Para cancelar:* /cancelar ${pedidoId}

*¡Gracias por confiar en nosotros!* 🎉

📍 *Este bot funciona 24/7 en Render.com*`;

        bot.sendMessage(chatId, confirmacion, { parse_mode: 'Markdown' });
        
        // Log para administrador
        console.log(`📦 NUEVO PEDIDO: ${pedidoId} - Producto: ${producto} - Cliente: ${msg.from.username || msg.from.first_name}`);
        
      } else {
        // Menú de productos para pedir
        const opciones = {
          reply_markup: {
            inline_keyboard: [
              [
                { text: "🛒 Producto Premium", callback_data: "pedido_PROD-001" },
                { text: "📦 Kit Inicial", callback_data: "pedido_PROD-002" }
              ],
              [
                { text: "💎 Servicio Mensual", callback_data: "pedido_SERV-001" },
                { text: "🎁 Pack Familiar", callback_data: "pedido_OFERTA-001" }
              ],
              [
                { text: "📋 Ver catálogo completo", callback_data: "ver_catalogo" },
                { text: "❌ Cancelar", callback_data: "cancelar_pedido" }
              ]
            ]
          }
        };
        
        bot.sendMessage(chatId, 
          `📝 *REALIZAR PEDIDO*\n\n` +
          `Selecciona un producto de la lista o escribe:\n` +
          `/pedido [código-del-producto]\n\n` +
          `*Ejemplos:*\n` +
          `• /pedido PROD-001\n` +
          `• /pedido SERV-001\n\n` +
          `Los pedidos se procesan 24/7 ⏰`,
          { parse_mode: 'Markdown', ...opciones });
      }
    });
    
    // Manejar botones inline
    bot.on('callback_query', (callbackQuery) => {
      const msg = callbackQuery.message;
      const data = callbackQuery.data;
      
      if (data.startsWith('pedido_')) {
        const producto = data.replace('pedido_', '');
        const pedidoId = 'PED-' + Date.now().toString().slice(-6);
        
        bot.sendMessage(msg.chat.id,
          `✅ *Pedido registrado: ${producto}*\n\n` +
          `🆔 ID: ${pedidoId}\n` +
          `📅 Fecha: ${new Date().toLocaleDateString('es-ES')}\n\n` +
          `📞 Te contactaremos en breve para confirmar.\n\n` +
          `_Funcionando en Render.com 24/7_`,
          { parse_mode: 'Markdown' });
        
        bot.answerCallbackQuery(callbackQuery.id, { 
          text: "✅ Pedido registrado correctamente",
          show_alert: false 
        });
      }
      
      if (data === 'ver_catalogo') {
        bot.sendMessage(msg.chat.id,
          `📚 *Catálogo completo*\n\n` +
          `Usa el comando /productos para ver todos nuestros productos y servicios.`,
          { parse_mode: 'Markdown' });
        
        bot.answerCallbackQuery(callbackQuery.id);
      }
      
      if (data === 'cancelar_pedido') {
        bot.sendMessage(msg.chat.id,
          `❌ *Pedido cancelado*\n\n` +
          `No se registró ningún pedido.\n\n` +
          `¿Necesitas ayuda? Usa /ayuda`,
          { parse_mode: 'Markdown' });
        
        bot.answerCallbackQuery(callbackQuery.id, { 
          text: "Pedido cancelado",
          show_alert: false 
        });
      }
    });
    
    // COMANDO /horario
    bot.onText(/\/horario/, (msg) => {
      const horario = `🕒 *HORARIOS DE ATENCIÓN*

🏪 *TIENDA FÍSICA:*
• Lunes a Viernes: 9:00 AM - 8:00 PM
• Sábados: 10:00 AM - 6:00 PM
• Domingos: 11:00 AM - 3:00 PM

📞 *ATENCIÓN TELEFÓNICA:*
• Lunes a Domingo: 8:00 AM - 10:00 PM

🤖 *BOT (este):*
• ⏰ 24 horas / 7 días a la semana
• ✅ Siempre disponible
• 🚀 Respuesta instantánea

🚚 *ENTREGAS A DOMICILIO:*
• Pedidos antes de 2:00 PM: Entrega el mismo día
• Pedidos después de 2:00 PM: Entrega al día siguiente
• Fines de semana: Según disponibilidad

⚡ *RENDIMIENTO:*
Este bot funciona en Render.com
Disponibilidad: 99.9%
Respuesta: < 1 segundo

📍 *Recuerda:* Puedes hacer pedidos en cualquier momento.`;

      bot.sendMessage(msg.chat.id, horario, { parse_mode: 'Markdown' });
    });
    
    // COMANDO /contacto
    bot.onText(/\/contacto/, (msg) => {
      const contacto = `📞 *CONTACTO Y SOPORTE*

*Para atención inmediata:*
📱 WhatsApp: +1 (555) 123-4567
📞 Teléfono: +1 (555) 987-6543
📧 Email: contacto@minegocio.com

*Redes sociales oficiales:*
🌐 Facebook: facebook.com/minegocio
📷 Instagram: @minegocio.oficial
💼 LinkedIn: linkedin.com/company/minegocio

*Departamentos especializados:*
🛒 Ventas: ventas@minegocio.com
🤝 Soporte técnico: soporte@minegocio.com
📦 Logística: logistica@minegocio.com
💼 Administración: admin@minegocio.com

*Horario de contacto telefónico:*
Lunes a Viernes: 8:00 AM - 8:00 PM
Sábados: 9:00 AM - 2:00 PM

🗺️ *Dirección física:*
Av. Comercial #123, Centro
Ciudad, Estado, CP 12345

📍 *Ver ubicación en mapa:* /ubicacion

⚡ *Este bot funciona 24/7 en:* Render.com`;

      bot.sendMessage(msg.chat.id, contacto, { parse_mode: 'Markdown' });
    });
    
    // COMANDO /ubicacion
    bot.onText(/\/ubicacion/, (msg) => {
      bot.sendLocation(msg.chat.id, 19.4326, -99.1332); // Coordenadas ejemplo (CDMX)
      
      bot.sendMessage(msg.chat.id,
        `📍 *NUESTRA UBICACIÓN*\n\n` +
        `🏢 *Dirección:*\n` +
        `Av. Comercial #567\n` +
        `Centro Empresarial, Piso 3\n` +
        `Ciudad, CP 12345\n\n` +
        `🚗 *Cómo llegar:*\n` +
        `• Metro: Estación Centro (línea 1)\n` +
        `• Bus: Rutas 12, 45, 78\n` +
        `• Auto: Estacionamiento gratuito\n\n` +
        `🗺️ *Enlace a Google Maps:*\n` +
        `https://maps.google.com/?q=Centro+Comercial+Principal\n\n` +
        `⏰ *Horario en tienda:*\n` +
        `Lunes a Viernes: 9:00 - 20:00\n` +
        `Sábados: 10:00 - 18:00\n\n` +
        `📍 *Acabamos de enviarte la ubicación exacta*`,
        { parse_mode: 'Markdown' });
    });
    
    // COMANDO /ayuda
    bot.onText(/\/ayuda/, (msg) => {
      const ayuda = `🆘 *CENTRO DE AYUDA - COMANDOS DISPONIBLES*

🤖 *BOT INFORMATION*
/start - Iniciar el bot
/ayuda - Mostrar esta ayuda
/estado - Estado del servicio

🛒 *COMPRAS Y PEDIDOS*
/productos - Ver catálogo completo
/pedido [código] - Realizar pedido
/estado [id] - Consultar estado de pedido
/cancelar [id] - Cancelar pedido

🏪 *INFORMACIÓN DEL NEGOCIO*
/horario - Horarios de atención
/contacto - Información de contacto
/ubicacion - Dirección y mapa
/promociones - Ofertas vigentes
/info - Sobre nosotros

⚙️ *SOPORTE TÉCNICO*
/soporte - Contactar soporte humano
/reclamo - Abrir un reclamo
/sugerencia - Enviar sugerencia

📱 *EJEMPLOS PRÁCTICOS:*
• /pedido PROD-001
• /estado PED-123ABC
• /productos

⚡ *PLATAFORMA:*
Este bot funciona en Render.com
Plan: FREE (750 horas/mes)
Estado: Activo 24/7

💡 *¿Problemas?* Contacta: soporte@minegocio.com`;

      bot.sendMessage(msg.chat.id, ayuda, { parse_mode: 'Markdown' });
    });
    
    // COMANDO /estado
    bot.onText(/\/estado(?: (.+))?/, (msg, match) => {
      const pedidoId = match && match[1] ? match[1] : 'PED-' + Date.now().toString().slice(-6);
      
      const estados = [
        { estado: "📦 Pedido recibido", icon: "📦" },
        { estado: "✅ Confirmado y en proceso", icon: "✅" },
        { estado: "👨‍🍳 En preparación", icon: "👨‍🍳" },
        { estado: "🚚 En camino a entrega", icon: "🚚" },
        { estado: "🎉 Entregado exitosamente", icon: "🎉" }
      ];
      
      const estadoActual = estados[Math.floor(Math.random() * estados.length)];
      
      bot.sendMessage(msg.chat.id,
        `📋 *CONSULTA DE ESTADO*\n\n` +
        `${estadoActual.icon} *Pedido:* ${pedidoId}\n` +
        `📅 *Fecha consulta:* ${new Date().toLocaleDateString('es-ES')}\n` +
        `⏰ *Hora:* ${new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}\n\n` +
        `🔄 *Estado actual:*\n` +
        `**${estadoActual.estado}**\n\n` +
        `⏳ *Última actualización:* Hace ${Math.floor(Math.random() * 60)} minutos\n\n` +
        `📞 *Para detalles exactos:*\n` +
        `contacto@minegocio.com\n\n` +
        `_Consulta automática - Render.com 24/7_`,
        { parse_mode: 'Markdown' });
    });
    
    // COMANDO /promociones
    bot.onText(/\/promociones/, (msg) => {
      const promociones = `🎁 *PROMOCIONES Y OFERTAS VIGENTES*

🔥 *OFERTA ESPECIAL DEL MES*
• 20% descuento en compras mayores a $100
• Código: **MES20**
• Válido hasta el último día del mes

🎯 *PRIMERA COMPRA*
• 15% descuento para nuevos clientes
• Código: **BIENVENIDO15**
• Sin mínimo de compra requerido

👥 *PACK FAMILIAR*
• Compra 3 productos, paga solo 2
• Aplica para productos: PROD-001, PROD-002
• Código automático al pedir 3 unidades

🚚 *ENVÍO GRATIS SIEMPRE*
• En todas las compras mayores a $50
• Aplica automáticamente
• Válido para toda el área metropolitana

🎫 *CUPONES ACTIVOS:*
1. VERANO10 - 10% descuento general
2. CLIENTE5 - 5% descuento clientes frecuentes
3. REFERIDO - $10 descuento por referir amigos

📱 *¿CÓMO CANJEAR PROMOCIONES?*
1. Realiza tu pedido con /pedido
2. Menciona el código de promoción
3. El descuento se aplica automáticamente
4. Confirmaremos el precio final

⏰ *Vigencia de promociones:*
Todas válidas hasta agotar existencias
o hasta fin de mes (lo que ocurra primero)

💰 *Este bot es 100% GRATIS en Render.com*`;

      bot.sendMessage(msg.chat.id, promociones, { parse_mode: 'Markdown' });
    });
    
    // Responder mensajes normales (no comandos)
    bot.on('message', (msg) => {
      if (msg.text && !msg.text.startsWith('/')) {
        bot.sendMessage(msg.chat.id,
          `📝 *MENSAJE RECIBIDO*\n\n` +
          `He registrado tu mensaje:\n"${msg.text.substring(0, 100)}${msg.text.length > 100 ? '...' : ''}"\n\n` +
          `📞 Un agente te contactará en breve.\n\n` +
          `Mientras tanto, puedes:\n` +
          `• Ver productos: /productos\n` +
          `• Hacer pedido: /pedido\n` +
          `• Contactar: /contacto\n\n` +
          `🆔 *ID Conversación:* MSG-${msg.message_id}\n` +
          `⏰ *Hora:* ${new Date().toLocaleTimeString('es-ES')}\n\n` +
          `_Respuesta automática - Bot 24/7_`,
          { parse_mode: 'Markdown' });
      }
    });
    
    console.log('✅ Bot configurado con todos los comandos');
    
  } catch (error) {
    console.error('❌ Error crítico al iniciar bot:', error.message);
    console.log('🔄 El servicio se reiniciará automáticamente en Render');
  }
} else {
  console.log('⏳ Bot en modo espera - Agrega BOT_TOKEN en Render');
}

// ==================== INICIAR SERVIDOR ====================
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Servidor iniciado en puerto ${PORT}`);
  console.log(`🌐 URL: https://${process.env.RENDER_SERVICE_NAME || 'tu-app'}.onrender.com`);
  console.log(`💰 Plan: FREE (750 horas/mes - 31 días completos)`);
  
  // Iniciar ping para mantener activo
  keepAlive();
  
  if (!TOKEN) {
    console.log('\n⚠️ ⚠️ ⚠️ ATENCIÓN ⚠️ ⚠️ ⚠️');
    console.log('Falta configurar BOT_TOKEN en Render.com');
    console.log('1. Ve a tu app en Render');
    console.log('2. Click en "Environment"');
    console.log('3. Agrega variable: BOT_TOKEN = tu_token_de_telegram');
    console.log('4. Reinicia el servicio');
    console.log('⚠️ ⚠️ ⚠️ ⚠️ ⚠️ ⚠️ ⚠️ ⚠️ ⚠️');
  }
});

// Manejar cierre limpio
process.on('SIGTERM', () => {
  console.log('🛑 Recibida señal SIGTERM, cerrando limpiamente...');
  if (bot) {
    bot.stopPolling();
  }
  process.exit(0);
});
