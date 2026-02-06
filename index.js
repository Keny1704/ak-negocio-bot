// ===================== CONFIGURACIÓN =====================
const TelegramBot = require('node-telegram-bot-api');
const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

// Tu token de Telegram (se configura en Northflank)
const TOKEN = process.env.BOT_TOKEN || '8356441967:AAEZ-oO0-AuIEmHw2moLpVUDq95CGEap_j0';

// ===================== SERVIDOR WEB =====================
// Ruta principal para verificar que está vivo
app.get('/', (req, res) => {
  const html = `
  <!DOCTYPE html>
  <html>
  <head>
    <title>🤖 Bot de Negocio Activo</title>
    <style>
      * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      }
      
      body {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        min-height: 100vh;
        display: flex;
        justify-content: center;
        align-items: center;
        padding: 20px;
      }
      
      .container {
        background: white;
        border-radius: 20px;
        padding: 40px;
        box-shadow: 0 20px 60px rgba(0,0,0,0.3);
        max-width: 500px;
        width: 100%;
        text-align: center;
      }
      
      h1 {
        color: #333;
        margin-bottom: 20px;
        font-size: 28px;
      }
      
      .status {
        background: #4CAF50;
        color: white;
        padding: 10px 20px;
        border-radius: 50px;
        display: inline-block;
        margin: 15px 0;
        font-weight: bold;
      }
      
      .info-box {
        background: #f8f9fa;
        border-radius: 10px;
        padding: 20px;
        margin: 20px 0;
        text-align: left;
      }
      
      .info-item {
        margin: 10px 0;
        display: flex;
        align-items: center;
      }
      
      .info-item i {
        margin-right: 10px;
        color: #667eea;
      }
      
      .uptime {
        font-family: monospace;
        background: #333;
        color: #00ff00;
        padding: 10px;
        border-radius: 5px;
        margin-top: 10px;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <h1>🤖 Bot de Negocio Telegram</h1>
      <div class="status">✅ ACTIVO 24/7</div>
      
      <div class="info-box">
        <div class="info-item">
          <i>📡</i> <strong>Plataforma:</strong> Northflank
        </div>
        <div class="info-item">
          <i>💰</i> <strong>Precio:</strong> 100% GRATIS
        </div>
        <div class="info-item">
          <i>⚡</i> <strong>Estado:</strong> Funcionando correctamente
        </div>
        <div class="info-item">
          <i>🤖</i> <strong>Bot:</strong> ${TOKEN ? 'Conectado a Telegram' : 'Esperando token'}
        </div>
      </div>
      
      <div class="uptime">
        UPTIME: ${Math.floor(process.uptime())} segundos
      </div>
      
      <p style="margin-top: 20px; color: #666;">
        Este bot está funcionando las 24 horas<br>
        completamente GRATIS en Northflank
      </p>
    </div>
  </body>
  </html>
  `;
  res.send(html);
});

// Health check para Northflank
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    platform: 'Northflank',
    free: true
  });
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`🚀 Servidor iniciado en puerto ${PORT}`);
  console.log(`🌐 Visita: https://tu-app.on-northflank.app`);
  console.log(`🔧 Modo: ${process.env.NODE_ENV || 'development'}`);
});

// ===================== BOT DE TELEGRAM =====================
console.log('🤖 Iniciando bot de Telegram...');

try {
  const bot = new TelegramBot(TOKEN, { polling: true });
  
  console.log('✅ Bot de Telegram conectado exitosamente!');
  
  // Cuando el bot está listo
  bot.on('polling_error', (error) => {
    console.log('⚠️ Error en polling:', error.code);
  });
  
  // ===================== COMANDOS DEL BOT =====================
  
  // COMANDO /start
  bot.onText(/\/start/, (msg) => {
    const chatId = msg.chat.id;
    const userName = msg.from.first_name;
    
    const mensaje = `✨ *¡Hola ${userName}!* ✨

Bienvenido al *Bot Oficial de Mi Negocio* 🤖

🏆 *¿Qué puedo hacer por ti?*

📦 *Productos y Servicios*
• Ver catálogo completo
• Consultar precios
• Realizar pedidos
• Seguimiento de compras

📋 *Comandos disponibles:*
/productos - Ver todo nuestro catálogo
/pedido - Hacer un nuevo pedido
/estado - Consultar estado de pedido
/horario - Nuestros horarios de atención
/contacto - Información de contacto
/ubicacion - Cómo llegar
/promociones - Ofertas especiales
/ayuda - Mostrar esta ayuda

💡 *Consejo rápido:* Usa /pedido seguido del producto que deseas.

📍 *Ejemplo:* /pedido producto-1`;

    bot.sendMessage(chatId, mensaje, { parse_mode: 'Markdown' });
  });
  
  // COMANDO /ayuda
  bot.onText(/\/ayuda/, (msg) => {
    const ayuda = `🆘 *CENTRO DE AYUDA*

📋 *LISTA DE COMANDOS:*

🛒 *COMPRAS*
/productos - Ver catálogo completo
/pedido [código] - Realizar pedido
/estado [id] - Estado de tu pedido
/cancelar [id] - Cancelar pedido

🏪 *INFORMACIÓN*
/horario - Horarios de atención
/contacto - Teléfono, email, WhatsApp
/ubicacion - Dirección y mapa
/promociones - Ofertas vigentes

⚙️ *SOPORTE*
/ayuda - Muestra este mensaje
/soporte - Contactar con soporte humano
/reclamo - Abrir un reclamo

📱 *Ejemplos prácticos:*
• /pedido PROD-001
• /estado PED-12345
• /productos`;

    bot.sendMessage(msg.chat.id, ayuda, { parse_mode: 'Markdown' });
  });
  
  // COMANDO /productos
  bot.onText(/\/productos/, (msg) => {
    const productos = `🛍️ *CATÁLOGO DE PRODUCTOS*

🔥 *PRODUCTOS DESTACADOS*
1. *Producto Premium* - $49.99
   📦 Envío gratis | ⭐ 4.9/5
   Código: PROD-001

2. *Kit Básico* - $29.99
   🚚 24h envío | ⭐ 4.7/5
   Código: PROD-002

3. *Servicio Premium* - $99.99/mes
   💎 Soporte 24/7 | ⭐ 5/5
   Código: SERV-001

🎯 *OFERTAS ESPECIALES*
• Pack Familiar (3 unidades) - $129.99
  Código: OFERTA-001
  🔥 Ahorras $20

• Primera compra - 15% descuento
  Usa código: BIENVENIDO15

📦 *¿CÓMO COMPRAR?*
1. Elige un producto
2. Usa /pedido [código]
3. Te contactaremos para confirmar

💳 *Métodos de pago:*
✓ Tarjetas crédito/débito
✓ PayPal
✓ Transferencia bancaria
✓ Efectivo al recoger`;

    bot.sendMessage(msg.chat.id, productos, { parse_mode: 'Markdown' });
  });
  
  // COMANDO /pedido
  bot.onText(/\/pedido(?: (.+))?/, (msg, match) => {
    const chatId = msg.chat.id;
    
    if (match[1]) {
      // Si especificó producto
      const producto = match[1].toUpperCase();
      const pedidoId = 'PED-' + Date.now().toString().slice(-8);
      
      const confirmacion = `✅ *PEDIDO REGISTRADO*

📋 *Detalles del pedido:*
• Código: ${producto}
• ID de pedido: ${pedidoId}
• Fecha: ${new Date().toLocaleDateString('es-ES')}
• Hora: ${new Date().toLocaleTimeString('es-ES')}
• Cliente: ${msg.from.first_name}

📞 *Próximos pasos:*
1. Te contactaremos en menos de *30 minutos*
2. Confirmaremos disponibilidad
3. Acordaremos método de pago
4. Coordinaremos entrega

⏰ *Tiempo estimado de entrega:* 24-48 horas

🔄 *Para consultar estado:* /estado ${pedidoId}

❌ *Para cancelar:* /cancelar ${pedidoId}

*¡Gracias por tu compra!* 🎉`;

      bot.sendMessage(chatId, confirmacion, { parse_mode: 'Markdown' });
      
      // También enviar a administrador (opcional)
      console.log(`📦 Nuevo pedido: ${pedidoId} - Producto: ${producto} - Cliente: ${msg.from.username || msg.from.first_name}`);
      
    } else {
      // Si no especificó producto
      const opciones = {
        reply_markup: {
          inline_keyboard: [
            [
              { text: "🛒 Producto Premium", callback_data: "pedir_PROD-001" },
              { text: "📦 Kit Básico", callback_data: "pedir_PROD-002" }
            ],
            [
              { text: "💎 Servicio Premium", callback_data: "pedir_SERV-001" },
              { text: "🎁 Pack Familiar", callback_data: "pedir_OFERTA-001" }
            ],
            [
              { text: "📋 Ver catálogo", callback_data: "ver_catalogo" }
            ]
          ]
        }
      };
      
      bot.sendMessage(chatId, 
        `📝 *REALIZAR PEDIDO*\n\n` +
        `Por favor, selecciona un producto o escribe:\n` +
        `/pedido [código-del-producto]\n\n` +
        `*Ejemplo:* /pedido PROD-001`,
        { parse_mode: 'Markdown', ...opciones });
    }
  });
  
  // Manejar botones inline
  bot.on('callback_query', (callbackQuery) => {
    const msg = callbackQuery.message;
    const data = callbackQuery.data;
    
    if (data.startsWith('pedir_')) {
      const producto = data.replace('pedir_', '');
      const pedidoId = 'PED-' + Date.now().toString().slice(-8);
      
      bot.sendMessage(msg.chat.id,
        `✅ *Pedido registrado: ${producto}*\n\n` +
        `ID: ${pedidoId}\n` +
        `Te contactaremos pronto para confirmar detalles.`,
        { parse_mode: 'Markdown' });
      
      bot.answerCallbackQuery(callbackQuery.id, { text: "✅ Pedido registrado!" });
    }
    
    if (data === 'ver_catalogo') {
      bot.sendMessage(msg.chat.id,
        `📚 *Catálogo completo*\n\n` +
        `Usa el comando /productos para ver todos los productos disponibles.`,
        { parse_mode: 'Markdown' });
      
      bot.answerCallbackQuery(callbackQuery.id);
    }
  });
  
  // COMANDO /horario
  bot.onText(/\/horario/, (msg) => {
    const horario = `🕒 *HORARIO DE ATENCIÓN*

🏪 *TIENDA FÍSICA:*
• Lunes a Viernes: 9:00 AM - 8:00 PM
• Sábados: 10:00 AM - 6:00 PM
• Domingos: 11:00 AM - 3:00 PM

📞 *ATENCIÓN TELEFÓNICA:*
• Lunes a Domingo: 8:00 AM - 10:00 PM

🤖 *BOT (este):*
• 24 horas / 7 días a la semana
• Siempre disponible

🚚 *ENTREGAS:*
• Pedidos antes de 2:00 PM: Entrega el mismo día
• Pedidos después de 2:00 PM: Entrega al día siguiente
• Fines de semana: Entregas según disponibilidad

🎯 *HORARIOS ESPECIALES:*
• Feriados: Consultar /contacto
• Días festivos: Horario reducido

📍 *Recuerda:* Puedes hacer pedidos en cualquier momento a través de este bot.`;

    bot.sendMessage(msg.chat.id, horario, { parse_mode: 'Markdown' });
  });
  
  // COMANDO /contacto
  bot.onText(/\/contacto/, (msg) => {
    const contacto = `📞 *INFORMACIÓN DE CONTACTO*

*Para contacto inmediato:*
📱 WhatsApp: +1 (555) 123-4567
📞 Teléfono: +1 (555) 987-6543
📧 Email: contacto@minegocio.com

*Redes sociales:*
🌐 Facebook: facebook.com/minegocio
📷 Instagram: @minegocio.oficial
🐦 Twitter: @minegocio_tw
💼 LinkedIn: linkedin.com/company/minegocio

*Departamentos:*
🛒 Ventas: ventas@minegocio.com
🤝 Soporte: soporte@minegocio.com
📦 Logística: logistica@minegocio.com
💼 Administración: admin@minegocio.com

*Horario de contacto telefónico:*
Lunes a Viernes: 8:00 AM - 8:00 PM
Sábados: 9:00 AM - 2:00 PM

📍 *Dirección física:*
Av. Principal #1234
Col. Centro, Ciudad, CP 12345
País

🗺️ *Ver en mapa:* /ubicacion`;

    bot.sendMessage(msg.chat.id, contacto, { parse_mode: 'Markdown' });
  });
  
  // COMANDO /ubicacion
  bot.onText(/\/ubicacion/, (msg) => {
    bot.sendMessage(msg.chat.id,
      `📍 *NUESTRA UBICACIÓN*\n\n` +
      `🏢 *Dirección:*\n` +
      `Av. Comercial #567\n` +
      `Centro Empresarial, Piso 3\n` +
      `Ciudad, Estado, CP 67890\n\n` +
      `🚗 *Cómo llegar:*\n` +
      `• Metro: Estación Centro (línea 1)\n` +
      `• Bus: Rutas 12, 45, 78\n` +
      `• Auto: Estacionamiento gratuito\n\n` +
      `📱 *Abrir en Google Maps:*\n` +
      `https://maps.google.com/?q=Centro+Comercial+Principal\n\n` +
      `⏰ *Horario de atención en tienda:*\n` +
      `Lunes a Viernes: 9:00 - 20:00\n` +
      `Sábados: 10:00 - 18:00`,
      { parse_mode: 'Markdown' });
  });
  
  // COMANDO /estado
  bot.onText(/\/estado(?: (.+))?/, (msg, match) => {
    const pedidoId = match[1] || 'PED-' + Date.now().toString().slice(-8);
    
    const estados = [
      "📦 Pedido recibido",
      "✅ Confirmado",
      "👨‍🍳 En preparación",
      "🚚 En camino",
      "🎉 Entregado"
    ];
    
    const estadoAleatorio = estados[Math.floor(Math.random() * estados.length)];
    
    bot.sendMessage(msg.chat.id,
      `📋 *ESTADO DEL PEDIDO*\n\n` +
      `🆔 *ID:* ${pedidoId}\n` +
      `📅 *Fecha:* ${new Date().toLocaleDateString('es-ES')}\n` +
      `⏰ *Hora consulta:* ${new Date().toLocaleTimeString('es-ES')}\n\n` +
      `🔄 *Estado actual:*\n` +
      `**${estadoAleatorio}**\n\n` +
      `📞 *Para más detalles:* Contacta a soporte@minegocio.com`,
      { parse_mode: 'Markdown' });
  });
  
  // COMANDO /promociones
  bot.onText(/\/promociones/, (msg) => {
    const promociones = `🎁 *PROMOCIONES VIGENTES*

🔥 *OFERTA DEL MES*
• 20% descuento en compras mayores a $100
• Código: **MES20**
• Válido hasta fin de mes

🎯 *PRIMERA COMPRA*
• 15% descuento para nuevos clientes
• Código: **BIENVENIDO15**
• Sin mínimo de compra

👥 *PACK FAMILIAR*
• Compra 3 productos, paga 2
• Aplica para: PROD-001, PROD-002
• Código: **FAMILIA3X2**

🚚 *ENVÍO GRATIS*
• En todas las compras mayores a $50
• Automático en el checkout
• Válido para toda la ciudad

🎫 *CUPONES ACTIVOS:*
1. VERANO10 - 10% descuento
2. CLIENTE5 - 5% descuento recurrente
3. REFERIDO - $10 descuento por referir

📱 *¿CÓMO CANJEAR?*
1. Realiza tu pedido con /pedido
2. Menciona el código de promoción
3. El descuento se aplicará automáticamente

⏰ *Vigencia:* Todas las promociones son válidas hasta agotar existencias.`;

    bot.sendMessage(msg.chat.id, promociones, { parse_mode: 'Markdown' });
  });
  
  // Responder a mensajes no comandos
  bot.on('message', (msg) => {
    if (msg.text && !msg.text.startsWith('/')) {
      bot.sendMessage(msg.chat.id,
        `📝 *Mensaje recibido*\n\n` +
        `He registrado tu mensaje. Un agente te contactará pronto.\n\n` +
        `Mientras tanto, puedes:\n` +
        `• Ver productos: /productos\n` +
        `• Hacer pedido: /pedido\n` +
        `• Contactarnos: /contacto\n\n` +
        `*ID de conversación:* ${msg.message_id}`,
        { parse_mode: 'Markdown' });
    }
  });
  
  console.log('✅ Bot configurado y listo para recibir mensajes!');
  
} catch (error) {
  console.error('❌ Error al iniciar el bot:', error.message);
  console.log('ℹ️  Esto es normal si aún no has configurado el token en Northflank');
}
