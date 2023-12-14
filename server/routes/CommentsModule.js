import express from 'express';
const router = express.Router();
import {getCommentById, getCommentLikes, createCommentLike, changeCommentById, deleteCommentById, deleteCommentLike} from '../controllers/comController.js';
import authUser from '../middleware/authenticateus.js';

router.get('/:id', getCommentById);
router.get('/:id/like', getCommentLikes);
router.post('/:id/like',authUser , createCommentLike);
router.patch('/:id', authUser, changeCommentById);
router.delete('/:id', authUser, deleteCommentById);
router.delete('/:id/like', authUser, deleteCommentLike);

export default router ;