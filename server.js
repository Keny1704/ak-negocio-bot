const express = require('express');
const TelegramBot = require('node-telegram-bot-api');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware básico
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Ruta de prueba
app.get('/', (req, res) => {
  res.json({
    status: 'online',
    service: 'Telegram Business Bot',
    uptime: process.uptime(),
    date: new Date()
  });
});

// Health check para Cyclic
app.get('/health', (req, res) => {
  res.status(200).send('OK');
});

// Iniciar servidor web
app.listen(PORT, () => {
  console.log(`✅ Servidor activo en puerto ${PORT}`);
});

// ================= TELEGRAM BOT =================
// Configura tu token aquí
const BOT_TOKEN = process.env.BOT_TOKEN || '8356441967:AAEZ-oO0-AuIEmHw2moLpVUDq95CGEap_j0';
const bot = new TelegramBot(BOT_TOKEN, { polling: true });

console.log('🤖 Bot de Telegram iniciado...');

// Comandos del negocio
const comandos = {
  start: `¡Hola! Bienvenido a *Mi Negocio* 🛍️\n\n` +
         `Soy tu asistente virtual. ¿En qué puedo ayudarte hoy?\n\n` +
         `Usa /menu para ver opciones.`,
  
  menu: `📋 *MENU PRINCIPAL*\n\n` +
        `🛒 /productos - Ver catálogo\n` +
        `⏰ /horario - Horario de atención\n` +
        `📍 /ubicacion - Dónde estamos\n` +
        `📞 /contacto - Contactar\n` +
        `📝 /pedido - Hacer pedido\n` +
        `ℹ️ /info - Información del negocio`,
  
  productos: `🎯 *NUESTROS PRODUCTOS*\n\n` +
             `1️⃣ Producto Premium - $25\n   • Descripción breve\n   • Envío gratis\n\n` +
             `2️⃣ Producto Estándar - $15\n   • Lo más vendido\n   • Disponible ahora\n\n` +
             `3️⃣ Kit Completo - $40\n   • Ahorra 20%\n   • Incluye garantía\n\n` +
             `Para pedir: /pedido [número]`,
  
  horario: `🕒 *HORARIO DE ATENCIÓN*\n\n` +
           `Lunes a Viernes: 9:00 AM - 7:00 PM\n` +
           `Sábados: 10:00 AM - 2:00 PM\n` +
           `Domingos: Cerrado\n\n` +
           `📞 Atención WhatsApp: +1 234 567 890`,
  
  contacto: `📞 *CONTACTO*\n\n` +
            `• 📱 WhatsApp: +1 234 567 890\n` +
            `• 📧 Email: contacto@minegocio.com\n` +
            `• 🌐 Web: www.minegocio.com\n` +
            `• 📍 Dirección: Calle Principal #123`,
  
  ubicacion: `📍 *NUESTRA UBICACIÓN*\n\n` +
             `Calle Comercial #456\n` +
             `Centro, Ciudad, País\n\n` +
             `[Ver en Google Maps](https://maps.app.goo.gl/ejemplo)`,
  
  info: `🏪 *ACERCA DE NOSOTROS*\n\n` +
        `Somos una empresa con 5 años de experiencia en el mercado.\n\n` +
        `⭐ 4.8/5 en reseñas\n` +
        `✅ 1000+ clientes satisfechos\n` +
        `🚚 Envíos a todo el país\n` +
        `💯 Garantía de 30 días`
};

// Manejar comandos
bot.onText(/\/start/, (msg) => {
  bot.sendMessage(msg.chat.id, comandos.start, { parse_mode: 'Markdown' });
});

bot.onText(/\/menu/, (msg) => {
  bot.sendMessage(msg.chat.id, comandos.menu, { parse_mode: 'Markdown' });
});

bot.onText(/\/productos/, (msg) => {
  bot.sendMessage(msg.chat.id, comandos.productos, { parse_mode: 'Markdown' });
});

bot.onText(/\/horario/, (msg) => {
  bot.sendMessage(msg.chat.id, comandos.horario, { parse_mode: 'Markdown' });
});

bot.onText(/\/contacto/, (msg) => {
  bot.sendMessage(msg.chat.id, comandos.contacto, { parse_mode: 'Markdown' });
});

bot.onText(/\/ubicacion/, (msg) => {
  bot.sendMessage(msg.chat.id, comandos.ubicacion, { 
    parse_mode: 'Markdown',
    disable_web_page_preview: true 
  });
});

bot.onText(/\/info/, (msg) => {
  bot.sendMessage(msg.chat.id, comandos.info, { parse_mode: 'Markdown' });
});

// Pedido interactivo
bot.onText(/\/pedido/, (msg) => {
  const chatId = msg.chat.id;
  const options = {
    reply_markup: {
      inline_keyboard: [
        [
          { text: "🛒 Producto 1", callback_data: "pedido_1" },
          { text: "🛍️ Producto 2", callback_data: "pedido_2" }
        ],
        [
          { text: "📦 Producto 3", callback_data: "pedido_3" }
        ],
        [
          { text: "❌ Cancelar", callback_data: "cancelar" }
        ]
      ]
    }
  };
  
  bot.sendMessage(chatId, "Selecciona el producto que deseas:", options);
});

// Manejar botones inline
bot.on('callback_query', (callbackQuery) => {
  const msg = callbackQuery.message;
  const data = callbackQuery.data;
  
  if (data.startsWith('pedido_')) {
    const productoNum = data.split('_')[1];
    const productos = ["Producto Premium", "Producto Estándar", "Kit Completo"];
    
    bot.sendMessage(
      msg.chat.id,
      `✅ *Pedido registrado*\n\n` +
      `Producto: ${productos[productoNum-1]}\n` +
      `Precio: $${[25, 15, 40][productoNum-1]}\n\n` +
      `📞 Te contactaremos en 24 horas para confirmar.\n` +
      `ID de pedido: #${Date.now().toString().slice(-6)}`,
      { parse_mode: 'Markdown' }
    );
    
    bot.answerCallbackQuery(callbackQuery.id, { text: "Pedido registrado!" });
  }
  
  if (data === 'cancelar') {
    bot.sendMessage(msg.chat.id, "❌ Pedido cancelado.");
    bot.answerCallbackQuery(callbackQuery.id, { text: "Cancelado" });
  }
});

// Manejar mensajes normales
bot.on('message', (msg) => {
  if (msg.text && !msg.text.startsWith('/')) {
    // Respuesta automática a mensajes no comandos
    bot.sendMessage(
      msg.chat.id,
      `📝 *Mensaje recibido*\n\n` +
      `Hemos registrado tu mensaje:\n"${msg.text.slice(0, 50)}..."\n\n` +
      `Te responderemos en breve.\n` +
      `Mientras, usa /menu para ver opciones.`,
      { parse_mode: 'Markdown' }
    );
  }
});

// Manejar errores
bot.on('polling_error', (error) => {
  console.log('Error en Telegram:', error.code);
});

// Exportar para Cyclic
module.exports = app;