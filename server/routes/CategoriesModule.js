import express from 'express';
const router = express.Router();
import {getAll, getCategoryById, getCategoryPosts, createCategory, changeCategoryById, deleteCategory, getAllFavourites, addFavorites, deletePostByIdFromFavorites} from '../controllers/categController.js';
import authAdm from '../middleware/authenticate.js';

router.get('/', getAll);
router.get('/:id', getCategoryById);
router.get('/:id/posts', getCategoryPosts);
router.post('/', authAdm, createCategory);
router.patch('/:id', authAdm,  changeCategoryById);
router.delete('/:id', authAdm, deleteCategory);


export default router ;