
import { Product } from './types';

export const INITIAL_PRODUCTS: Product[] = [
  { 
    id: 1, 
    name: "Atsg® 12mp Dual Lente Ptz Cámara De Seguridad 5G", 
    price: 28846, 
    stock: 24, 
    category: "Seguridad", 
    rating: 4.8,
    image: "https://images.unsplash.com/photo-1557597774-9d273605dfa9?auto=format&fit=crop&q=80&w=800",
    description: "Cámara de seguridad dual lente con visión nocturna a color y conexión 5G/2.4G.",
    guide: "Instalación plug & play. Soporta MicroSD de hasta 128GB.",
    proTip: "Ubícala a una altura de 2.5m para optimizar el ángulo de detección humana.",
    specs: { "Resolución": "12MP", "Wifi": "Dual Band", "Visión": "360° PTZ" },
    installments: 6,
    isFull: true,
    deliveryDays: "Llega mañana"
  },
  { 
    id: 2, 
    name: "Herramienta Manual Codo Manual Cobre Y Aluminio 1/4", 
    price: 11976, 
    stock: 12, 
    category: "Herramientas", 
    rating: 4.5,
    image: "https://images.unsplash.com/photo-1530124560676-44bc9141f0c6?auto=format&fit=crop&q=80&w=800",
    description: "Curvadora manual de tubos para refrigeración y aire acondicionado.",
    guide: "Escala graduada de 0 a 180 grados para curvas precisas.",
    proTip: "Usa lubricante en el tubo para evitar deformaciones en curvas cerradas.",
    specs: { "Material": "Acero Forjado", "Medidas": "1/4, 5/16, 3/8" },
    installments: 3,
    isFull: true,
    deliveryDays: "Llega el lunes"
  },
  { 
    id: 3, 
    name: "Router Hikvision N300 4G Lte Antenas High Gain", 
    price: 46815, 
    stock: 8, 
    category: "Seguridad", 
    rating: 4.6,
    image: "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&q=80&w=800",
    description: "Router inalámbrico con ranura SIM para internet 4G LTE de alta velocidad.",
    guide: "Ideal para zonas rurales o vigilancia remota sin banda ancha cableada.",
    proTip: "Coloca las antenas en ángulo de 45° para mejorar la cobertura horizontal.",
    specs: { "Velocidad": "300Mbps", "Puertos": "4x LAN", "SIM": "Micro-SIM" },
    installments: 12,
    isFull: false,
    deliveryDays: "Llega en 3 días"
  },
  { 
    id: 4, 
    name: "Arduino Uno R3 Original System", 
    price: 12500, 
    stock: 45, 
    category: "Microcontroladores", 
    rating: 4.9,
    image: "https://images.unsplash.com/photo-1553406830-ef2513450d76?auto=format&fit=crop&q=80&w=800",
    description: "El estándar de oro para prototipado electrónico.",
    guide: "Conecta vía USB y programa en C++.",
    proTip: "Siempre usa una resistencia de 220 ohm para proteger tus LEDs.",
    specs: { "Micro": "ATmega328P", "IO": "14 Digital", "V": "5V" },
    installments: 6,
    isFull: true,
    deliveryDays: "Llega mañana"
  },
  {
    id: 5,
    name: "Raspberry Pi 4 Model B 4GB RAM",
    price: 54990,
    stock: 15,
    category: "Microcontroladores",
    rating: 4.9,
    image: "https://images.unsplash.com/photo-1580584126903-c17d41830450?auto=format&fit=crop&q=80&w=800",
    description: "Mini computadora de alto rendimiento para proyectos IoT, IA y domótica.",
    guide: "Requiere fuente USB-C de 3A y tarjeta microSD con Raspberry Pi OS.",
    proTip: "Añade un disipador y ventilador para mantenerla bajo los 70°C en carga total.",
    specs: { "CPU": "Cortex-A72 64-bit", "RAM": "4GB LPDDR4", "GPIO": "40 pines" },
    installments: 12,
    isFull: true,
    deliveryDays: "Llega mañana",
    discountPercentage: 10
  },
  {
    id: 6,
    name: "ESP32 DevKit V1 Wifi + Bluetooth Dual Core",
    price: 5990,
    stock: 60,
    category: "Microcontroladores",
    rating: 4.8,
    image: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=800",
    description: "Microcontrolador con WiFi y Bluetooth integrados, ideal para proyectos IoT.",
    guide: "Programable con Arduino IDE o MicroPython.",
    proTip: "Usa el modo deep sleep para proyectos con batería: consume solo 10µA.",
    specs: { "CPU": "Xtensa LX6 Dual-Core", "Flash": "4MB", "WiFi": "802.11 b/g/n" },
    installments: 3,
    isFull: true,
    deliveryDays: "Llega mañana"
  },
  {
    id: 7,
    name: "Sensor Ultrasónico HC-SR04 Pack x5",
    price: 4990,
    stock: 100,
    category: "Sensores",
    rating: 4.6,
    image: "https://images.unsplash.com/photo-1582719471384-894fbb16e074?auto=format&fit=crop&q=80&w=800",
    description: "Sensores de distancia por ultrasonido para robótica y proyectos de detección.",
    guide: "Rango de detección: 2cm a 400cm. Compatible con Arduino y Raspberry Pi.",
    proTip: "Añade un filtro promedio de 5 lecturas para eliminar falsos positivos.",
    specs: { "Rango": "2-400cm", "Frecuencia": "40kHz", "Voltaje": "5V DC" },
    installments: 3,
    isFull: true,
    deliveryDays: "Llega en 2 días"
  },
  {
    id: 8,
    name: "Cámara IP Hikvision DS-2CD2143G2 4MP AcuSense",
    price: 38900,
    stock: 7,
    category: "Seguridad",
    rating: 4.7,
    image: "https://images.unsplash.com/photo-1563203369-26f2e4a5ccf7?auto=format&fit=crop&q=80&w=800",
    description: "Cámara IP domo con IA para detección humana y vehicular, resistente a vandalismo.",
    guide: "Requiere switch PoE 802.3af. Configuración desde iVMS-4200.",
    proTip: "Activa la detección de línea cruzada para alertas instantáneas.",
    specs: { "Resolución": "4MP", "IR": "30m", "Protección": "IK10/IP67" },
    installments: 6,
    isFull: false,
    deliveryDays: "Llega en 3 días",
    lowStockThreshold: 10
  },
  {
    id: 9,
    name: "Kit Robótica Arduino 4WD Todopoderoso",
    price: 24990,
    stock: 18,
    category: "Robótica",
    rating: 4.7,
    image: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&q=80&w=800",
    description: "Kit completo para construir un robot 4 ruedas con control remoto y sensores.",
    guide: "Incluye chasis metálico, motores, driver L298N, sensor ultrasonido y Arduino Uno.",
    proTip: "Calibra los encoders de rueda para lograr movimiento recto sin desviación.",
    specs: { "Ruedas": "4WD", "Motor": "DC 6V", "Control": "Bluetooth / IR" },
    installments: 6,
    isFull: true,
    deliveryDays: "Llega en 2 días"
  },
  {
    id: 10,
    name: "Multímetro Digital Profesional Fluke 117",
    price: 89900,
    stock: 5,
    category: "Herramientas",
    rating: 4.9,
    image: "https://images.unsplash.com/photo-1581092160562-40aa08e78837?auto=format&fit=crop&q=80&w=800",
    description: "Multímetro de verdadero valor eficaz con detección sin contacto de voltaje AC.",
    guide: "Ideal para electricistas: rango hasta 600V AC/DC, 10A, 40MΩ.",
    proTip: "Usa las puntas de prueba TL75 para acceder a espacios reducidos en PCB.",
    specs: { "VDC": "600V", "VAC": "600V", "Frecuencia": "100Hz-1kHz" },
    installments: 12,
    isFull: false,
    deliveryDays: "Llega en 2 días",
    lowStockThreshold: 5,
    discountPercentage: 5
  },
  {
    id: 11,
    name: "Módulo Relé 4 Canales 5V para Arduino",
    price: 3990,
    stock: 80,
    category: "Sensores",
    rating: 4.5,
    image: "https://images.unsplash.com/photo-1601132359864-c974e79890ac?auto=format&fit=crop&q=80&w=800",
    description: "Módulo de 4 relés para controlar cargas de 220V desde microcontroladores.",
    guide: "Cada canal soporta hasta 10A/250VAC. Señal de activación: LOW activo.",
    proTip: "Añade un optoacoplador externo si el microcontrolador es 3.3V para protegerlo.",
    specs: { "Canales": "4", "Carga": "10A 250VAC", "Señal": "5V TTL" },
    installments: 3,
    isFull: true,
    deliveryDays: "Llega mañana"
  },
  {
    id: 12,
    name: "Panel Solar 100W Monocristalino 12V",
    price: 42500,
    stock: 9,
    category: "Herramientas",
    rating: 4.6,
    image: "https://images.unsplash.com/photo-1509391366360-2e959784a276?auto=format&fit=crop&q=80&w=800",
    description: "Panel solar de alta eficiencia para sistemas off-grid, cabañas y proyectos IoT.",
    guide: "Conectar con regulador PWM o MPPT 12/24V. Incluye diodo bypass anti-sombreado.",
    proTip: "Inclínalo 30° mirando al norte para maximizar captación solar en Chile.",
    specs: { "Potencia": "100W", "Voltaje Vmp": "18V", "Eficiencia": "21%" },
    installments: 6,
    isFull: true,
    deliveryDays: "Llega en 3 días",
    lowStockThreshold: 10
  }
];

/**
 * QuizItem interface defining the structure for the ElectroGame quiz.
 */
export interface QuizItem {
  question: string;
  options: string[];
  correct: number;
  explanation: string;
  image?: string;
}

// Fixed: Added explicit typing to QUIZ_DATA and included an image property to fix the 'property does not exist' error in ElectroGame.tsx
export const QUIZ_DATA: QuizItem[] = [
  {
    question: "¿Qué componente se usa para medir voltaje?",
    options: ["Osciloscopio", "Multímetro", "Amperímetro", "Capacímetro"],
    correct: 1,
    explanation: "El multímetro es la herramienta versátil por excelencia para medir tensión, corriente y resistencia.",
    image: "https://images.unsplash.com/photo-1581092160562-40aa08e78837?auto=format&fit=crop&q=80&w=800"
  },
  {
    question: "¿Cuál es la ley fundamental de los circuitos eléctricos?",
    options: ["Ley de Faraday", "Ley de Ohm", "Ley de Coulomb", "Ley de Gauss"],
    correct: 1,
    explanation: "La Ley de Ohm establece que V = I × R. Es la base del análisis de circuitos.",
    image: "https://images.unsplash.com/photo-1620283085439-39620a1e21c4?auto=format&fit=crop&q=80&w=800"
  },
  {
    question: "¿Qué microcontrolador tiene WiFi y Bluetooth integrados?",
    options: ["Arduino Uno", "ATmega328P", "ESP32", "PIC16F877"],
    correct: 2,
    explanation: "El ESP32 de Espressif incluye WiFi 802.11 b/g/n y Bluetooth 4.2 en un solo chip.",
    image: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=800"
  }
];

