import express from 'express';
import ConfigController from '../controllers/ConfigController';
const router = express.Router();

router.get('/config', ConfigController.getConfigs);

router.post('/config', ConfigController.createConfig);

router.put('/config',  ConfigController.updateConfig);

export default router;