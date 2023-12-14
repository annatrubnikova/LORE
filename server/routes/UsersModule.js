import express from 'express';
const router = express.Router();
import {getAll, getUser, createUser, changeAvatar, changeUser, deleteUser, userPosts, userRole} from '../controllers/usersController.js';
import authAdm from '../middleware/authenticate.js';
import authUser from '../middleware/authenticateus.js';
import uploadAv from '../middleware/avatarSave.js';

router.get('/',  getAll);
router.get('/:id',  getUser);
router.post('/', authAdm,  createUser);
router.patch('/avatar', authUser, uploadAv.single('avatar'), changeAvatar);
router.patch('/:id', authUser,  changeUser);
router.delete('/:id', authUser,  deleteUser);
router.get('/:id/posts', userPosts);
router.get('/role/:token', userRole);

export default router ;

