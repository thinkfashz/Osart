
import { Product } from './types';

export const INITIAL_PRODUCTS: Product[] = [
  { 
    id: 1, 
    name: "Arduino Uno R3 (Compatible)", 
    price: 12500, 
    stock: 15, 
    category: "Microcontroladores", 
    rating: 4.9,
    image: "https://images.unsplash.com/photo-1553406830-ef2513450d76?auto=format&fit=crop&q=80&w=800",
    description: "Placa de desarrollo basada en el microcontrolador ATmega328P. Es el punto de partida perfecto para la robótica y la domótica.",
    guide: "Cerebro para tus proyectos. Controla luces, motores y sensores programándolo desde tu PC vía USB.",
    proTip: "Úsalo con una protoboard para no tener que soldar cables durante las pruebas.",
    specs: { "Micro": "ATmega328P", "Voltaje": "5V", "Flash": "32KB", "Clock": "16MHz" }
  },
  { 
    id: 2, 
    name: "Kit Resistencias 1/4W (500 unids)", 
    price: 8900, 
    stock: 30, 
    category: "Pasivos", 
    rating: 4.7,
    image: "https://images.unsplash.com/photo-1580584126903-c17d41830450?auto=format&fit=crop&q=80&w=800",
    description: "Caja organizadora con surtido completo de resistencias de carbón. Valores desde 10 ohm a 1M ohm.",
    guide: "Limitan el paso de corriente para proteger componentes sensibles como LEDs.",
    proTip: "Aprende el código de colores para identificarlas rápidamente sin multímetro.",
    specs: { "Potencia": "0.25W", "Tolerancia": "5%", "Cantidad": "500 pcs", "Valores": "30 tipos" }
  },
  { 
    id: 3, 
    name: "Multímetro Digital Pro", 
    price: 24990, 
    stock: 8, 
    category: "Herramientas", 
    rating: 4.9,
    image: "https://images.unsplash.com/photo-1581092160562-40aa08e78837?auto=format&fit=crop&q=80&w=800",
    description: "Herramienta de diagnóstico esencial. Mide voltaje, corriente, resistencia, capacitancia y temperatura con precisión.",
    guide: "Tu ojos en la electricidad. Detecta fallas, cables cortados y baterías descargadas.",
    proTip: "Nunca midas resistencia en un circuito energizado, podrías dañar el fusible.",
    specs: { "Cuentas": "6000", "Seguridad": "CAT III 600V", "Pantalla": "LCD Luz" }
  },
  { 
    id: 4, 
    name: "Cautín Cerámico 60W Ajustable", 
    price: 14500, 
    stock: 22, 
    category: "Herramientas", 
    rating: 4.6,
    image: "https://images.unsplash.com/photo-1593106578502-27fa8479d060?auto=format&fit=crop&q=80&w=800",
    description: "Soldador tipo lápiz con temperatura ajustable de 200°C a 450°C. Calentamiento rápido y mango ergonómico.",
    guide: "Derrite estaño para unir componentes electrónicos de forma permanente en placas PCB.",
    proTip: "Mantén la punta siempre estañada (brillante) para que dure más tiempo.",
    specs: { "Potencia": "60W", "Temp": "200-450°C", "Puntas": "Intercambiables" }
  },
  { 
    id: 5, 
    name: "Capacitor Electrolítico 1000uF", 
    price: 1500, 
    stock: 45, 
    category: "Pasivos", 
    rating: 4.8,
    image: "https://plus.unsplash.com/premium_photo-1678837691533-356a68f04c66?auto=format&fit=crop&q=80&w=800",
    description: "Condensador radial de alta calidad. Ideal para filtrado en fuentes de alimentación y audio.",
    guide: "Almacena energía temporalmente y suaviza el voltaje en fuentes de poder.",
    proTip: "¡Cuidado con la polaridad! La franja blanca indica el negativo (-).",
    specs: { "Capacitancia": "1000uF", "Voltaje": "25V", "Temp": "105°C" }
  },
  { 
    id: 6, 
    name: "Transistor NPN 2N2222A (x10)", 
    price: 800, 
    stock: 120, 
    category: "Semiconductores", 
    rating: 5.0,
    image: "https://images.unsplash.com/photo-1616428753232-a5078a514d3a?auto=format&fit=crop&q=80&w=800",
    description: "Pack de transistores de propósito general. Encapsulado metálico TO-18 para mejor disipación.",
    guide: "Funciona como un interruptor electrónico o amplificador de señales pequeñas.",
    proTip: "Revisa el datasheet para identificar las patas E-B-C correctamente.",
    specs: { "Tipo": "NPN", "Vce": "40V", "Ic": "800mA" }
  }
];

export const QUIZ_DATA = [
  {
    question: "¿Cuál es este componente?",
    image: "https://images.unsplash.com/photo-1553406830-ef2513450d76?auto=format&fit=crop&q=80&w=300",
    options: ["Raspberry Pi", "Arduino Uno", "ESP32", "Relé"],
    correct: 1,
    explanation: "¡Correcto! Es un Arduino Uno, fácilmente reconocible por su puerto USB azul y conector de barril negro."
  },
  {
    question: "¿Qué función cumple una resistencia?",
    options: ["Almacena voltaje", "Genera luz", "Limita la corriente", "Amplifica sonido"],
    correct: 2,
    explanation: "Exacto. La resistencia 'se resiste' al paso de los electrones, protegiendo el circuito."
  },
  {
    question: "Si conectas un LED al revés...",
    options: ["Explota", "No enciende", "Cambia de color", "Se calienta mucho"],
    correct: 1,
    explanation: "El LED es un Diodo. Los diodos solo permiten el paso de corriente en una dirección. Si lo inviertes, bloquea la corriente."
  },
  {
    question: "¿Qué significa las siglas PCB?",
    options: ["Power Circuit Board", "Personal Computer Box", "Printed Circuit Board", "Plastic Core Base"],
    correct: 2,
    explanation: "Correcto. Printed Circuit Board o Placa de Circuito Impreso es donde soldamos los componentes."
  }
];
