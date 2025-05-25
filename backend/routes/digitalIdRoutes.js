import express from 'express';
import {
  getDigitalIds,
  getDigitalId,
  getMyDigitalId,
  createDigitalId,
  updateDigitalId,
  deleteDigitalId,
  generateDigitalIdQR,
  downloadDigitalId
} from '../controllers/digitalIdController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.use(protect);

router.get('/', authorize('admin'), getDigitalIds);
router.get('/me', getMyDigitalId);
router.get('/:id', getDigitalId);
router.post('/', authorize('admin'), createDigitalId);
router.put('/:id', updateDigitalId);
router.delete('/:id', deleteDigitalId);
router.get('/:id/qrcode', generateDigitalIdQR);
router.get('/:id/download', downloadDigitalId);

export default router;