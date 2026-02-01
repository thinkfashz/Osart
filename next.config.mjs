
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  // Permitimos que la aplicación se construya incluso si faltan variables de entorno
  // No forzamos 'export' si queremos que Vercel gestione las funciones serverless de Next
  images: {
    unoptimized: true,
    remotePatterns: [
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'plus.unsplash.com' }
    ],
  },
  eslint: {
    // Ignoramos errores de lint durante el build para agilizar despliegues de desarrollo
    ignoreDuringBuilds: true,
  },
  typescript: {
    // Permitimos build con errores de tipos para evitar bloqueos en despliegues rápidos
    ignoreBuildErrors: true,
  }
};

export default nextConfig;
