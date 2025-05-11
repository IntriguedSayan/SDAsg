import { Router, RequestHandler } from 'express';
import { BuildingController } from '../controllers/BuildingController';

const router = Router();
const buildingController = new BuildingController();

// Create a new building
router.post('/', buildingController.createBuilding as unknown as RequestHandler);

// Get all buildings
router.get('/', buildingController.getAllBuildings as unknown as RequestHandler);

// Analyze a building
router.post('/analyze', buildingController.analyzeBuilding as unknown as RequestHandler);

export default router; 