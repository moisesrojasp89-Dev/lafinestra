/**
 * config.js — Constantes globales de configuración.
 *
 * Fuente única de verdad para URLs y valores que cambian según el entorno.
 * Cuando se integre Supabase Storage, solo hay que cambiar ASSETS_BASE_URL aquí.
 *
 * Hoy:    ASSETS_BASE_URL = 'assets/'
 * Mañana: ASSETS_BASE_URL = 'https://xxx.supabase.co/storage/v1/object/public/menu-images/'
 */

export const WA_NUMBER      = '584247827899';
export const ASSETS_BASE_URL = 'assets/';  // sin ../  porque index.html está en la raíz