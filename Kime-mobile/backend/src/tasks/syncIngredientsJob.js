import cron from 'node-cron';
import { syncAllRestaurantsIngredients } from '../services/ingredientsSyncService.js';

// Ejecutar cada hora (:00)
export const startIngredientSyncJob = () => {
  cron.schedule('0 * * * *', async () => {
    console.log('🕒 Iniciando sincronización automática de ingredientes...');
    try {
      await syncAllRestaurantsIngredients();
      console.log('✅ Sincronización de ingredientes completada.');
    } catch (err) {
      console.error('❌ Error durante la sincronización de ingredientes:', err);
    }
  });
};
