
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
  }
];
