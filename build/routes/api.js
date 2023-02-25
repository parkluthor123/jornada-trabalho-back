"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const ConfigController_1 = __importDefault(require("../controllers/ConfigController"));
const router = express_1.default.Router();
router.get('/config', ConfigController_1.default.getConfigs);
router.post('/config', ConfigController_1.default.createConfig);
router.put('/config', ConfigController_1.default.updateConfig);
exports.default = router;
