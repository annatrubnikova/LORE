import express from 'express';
const router = express.Router();
import {getAllFavourites, addFavorites, deletePostByIdFromFavorites} from '../controllers/categController.js';
import authUser from '../middleware/authenticateus.js';

router.get('/', authUser, getAllFavourites);
router.post('/', authUser, addFavorites);
router.delete('/:id', authUser, deletePostByIdFromFavorites);

export default router ;