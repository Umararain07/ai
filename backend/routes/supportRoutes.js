import express from 'express';
import {
  getSupportTickets,
  getSupportTicket,
  createSupportTicket,
  updateSupportTicket,
  deleteSupportTicket
} from '../controllers/supportController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.use(protect);

router.get('/', authorize('admin', 'support'), getSupportTickets);
router.get('/:id', getSupportTicket);
router.post('/', createSupportTicket);
router.put('/:id', updateSupportTicket);
router.delete('/:id', deleteSupportTicket);

export default router;