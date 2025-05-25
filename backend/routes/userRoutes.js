import express from 'express';
import {
  getUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
  uploadAvatar
} from '../controllers/userController.js';
import { protect, authorize } from '../middleware/auth.js';
import { uploadFile, handleFileUpload } from '../middleware/upload.js';

const router = express.Router();

router.use(protect);

router.get('/', authorize('admin'), getUsers);
router.get('/:id', authorize('admin'), getUser);
router.post('/', authorize('admin'), createUser);
router.put('/:id', authorize('admin'), updateUser);
router.delete('/:id', authorize('admin'), deleteUser);
router.put('/avatar', uploadFile, handleFileUpload, uploadAvatar);

export default router;