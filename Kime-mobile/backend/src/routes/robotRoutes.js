import express from 'express';
import mqtt from 'mqtt';
import Inventory from '../models/inventory.js';


const router = express.Router();

const mqttClient = mqtt.connect('mqtt://192.168.10.187:1883');

const ROBOT_MANAGER_TOPIC = 'kime/robot_manager/cmd';
const ORDER_MANAGER_TOPIC = 'kiosk/order_manager/cmd';
const LISTENER_MANAGER_TOPIC = 'kiosk/order_manager/state';
const STATE_TOPIC = 'kime/robot/state'; 
const CMD_TOPIC = 'kiosk/sp_full_right/platform/2/cmd';

const REFILL_TOPICS = {
  leftUp: {
    button: 'kiosk/sp_empty_left_up/platform/3/refill_button',
    state: 'kiosk/sp_empty_left_up/platform/3/state',
    type: 'glass a',
  },
  rightUp: {
    button: 'kiosk/sp_empty_right_up/platform/3/refill_button',
    state: 'kiosk/sp_empty_right_up/platform/3/state',
    type: 'glass a',
  },
  leftDown: {
    button: 'kiosk/sp_empty_left_down/platform/1/refill_button',
    state: 'kiosk/sp_empty_left_down/platform/1/state',
    type: 'glass b',
  },
  rightDown: {
    button: 'kiosk/sp_empty_right_down/platform/1/refill_button',
    state: 'kiosk/sp_empty_right_down/platform/1/state',
    type: 'glass b',
  },
};

const subscribedTopics = [
  ROBOT_MANAGER_TOPIC,
  ORDER_MANAGER_TOPIC,
  LISTENER_MANAGER_TOPIC,
  STATE_TOPIC,
  ...Object.values(REFILL_TOPICS).map((t) => t.state),
  CMD_TOPIC
];

// Estado global para el robot
let isRobotConnected = false;
let enabledButtons = { home: false, startKiosk: false, }; // Estado de los botones

mqttClient.on('connect', () => {
  console.log('✅ Conectado al broker MQTT del robot');

  subscribedTopics.forEach((topic) => {
    mqttClient.subscribe(topic, (err) => {
      if (err) {
        console.error(`❌ Error al suscribirse a ${topic}:`, err);
      } else {
        console.log(`📡 Suscrito a ${topic}`);
      }
    });
  });
});

mqttClient.on('message', (topic, message) => {
  console.log(`📨 Mensaje recibido en '${topic}': ${message.toString()}`);

  // Manejo específico para el STATE_TOPIC
  if (topic === STATE_TOPIC) {
    console.log(`📊 Estado recibido: ${message.toString()}`);
    if (message.toString() === 'CONNECTED') {
      isRobotConnected = true;
      enabledButtons = { home: true, startKiosk: true }; // Activa "Home" y "Start Kiosk"
      console.log('🤖 Robot conectado: Botones habilitados');
    } else if (message.toString() === 'HOME') {
      enabledButtons = { home: false, enable: true }; // Bloquea "Homing" y habilita "Enable"
      console.log('🤖 Comando HOME enviado: Botón "Enable" habilitado');
    } else {
      isRobotConnected = false;
      enabledButtons = { home: false, startKiosk: false, enable: false, stop: false }; // Desactiva todos los botones
      console.log('🤖 Robot desconectado: Botones deshabilitados');
    }
  }

  if (topic === LISTENER_MANAGER_TOPIC) {
    console.log(`📊 Estado recibido: ${message.toString()}`);
    if (message.toString() === 'STOPPED') {
      enabledButtons = {startKiosk: true }; 
      console.log('Start kiosk habilitado');
    }
  }
});

// Endpoint para consultar el estado del robot y los botones
router.get('/status', (req, res) => {
  res.send({ isRobotConnected, enabledButtons });
});

// Endpoint para enviar el comando "Homing"
router.post('/homing', (req, res) => {
  mqttClient.publish(ROBOT_MANAGER_TOPIC, 'HOMING');
  enabledButtons.home = false; // Bloquea el botón "Homing"
  enabledButtons.enable = true; // Habilita el botón "Enable"
  console.log('✅ Comando HOME enviado: Botón "Enable" habilitado');
  res.send({ status: 'ok', message: `Comando HOME enviado a ${ROBOT_MANAGER_TOPIC}` });
});

// Endpoint para enviar el comando "Enable"
router.post('/enable', (req, res) => {
  mqttClient.publish(ROBOT_MANAGER_TOPIC, 'ENABLE'); // Envía el mensaje READY
  enabledButtons.enable = false; // Bloquea el botón "Enable"
  console.log('✅ Comando READY enviado');
  res.send({ status: 'ok', message: `Comando READY enviado a ${ROBOT_MANAGER_TOPIC}` });
});


// Endpoint para enviar el comando "Start Kiosk"
router.post('/start', (req, res) => {
  mqttClient.publish(ORDER_MANAGER_TOPIC, 'START'); // Envía el mensaje START
  enabledButtons.startKiosk = false; // Bloquea el botón "Start Kiosk"
  enabledButtons.stop = true; // Habilita el botón "Stop Kiosk"
  console.log('✅ Comando START enviado: Botón "Stop Kiosk" habilitado');
  res.send({ status: 'ok', message: `Comando START enviado a ${ORDER_MANAGER_TOPIC}` });
});

// Endpoint para enviar el comando "Stop Kiosk"
router.post('/stop', (req, res) => {
  mqttClient.publish(ORDER_MANAGER_TOPIC, 'STOP'); // Envía el mensaje STOP
  enabledButtons.startKiosk = true; // Habilita el botón "Start Kiosk"
  enabledButtons.stop = false; // Bloquea el botón "Stop Kiosk"
  console.log('✅ Comando STOP enviado: Botón "Start Kiosk" habilitado');
  res.send({ status: 'ok', message: `Comando STOP enviado a ${ORDER_MANAGER_TOPIC}` });
});

router.post('/rotate', (req, res) => {
  mqttClient.publish(CMD_TOPIC, '1');
  res.send({ status: 'ok', message: `Comando ROTATE enviado a ${CMD_TOPIC}` });
});


router.post('/refill/:platform', async (req, res) => {
  const { platform } = req.params;
  const config = REFILL_TOPICS[platform];

  if (!config) {
    return res.status(400).json({ status: 'error', message: `Plataforma '${platform}' no válida.` });
  }

  try {
    
    mqttClient.publish(config.button, '1');
    console.log(`🚀 Refill enviado al topic ${config.button}`);

    
    const ingredientName = config.type;
    const ingredient = await Inventory.findOne({ name: ingredientName });

    if (!ingredient) {
      return res.status(404).json({ status: 'error', message: `Ingrediente '${ingredientName}' no encontrado.` });
    }

    ingredient.quantity_available += 1;
    ingredient.last_updated_timestamp = new Date();
    await ingredient.save();

    res.json({ status: 'ok', message: `Refill realizado para plataforma '${platform}'. Inventario actualizado.` });
  } catch (error) {
    console.error(`❌ Error durante el refill de ${platform}:`, error);
    res.status(500).json({ status: 'error', message: 'Error en el servidor al hacer el refill.' });
  }
});

export default router;
