import express from 'express';
const router = express.Router();
import {getAll, getById, getPostComments, createPostComment, getPostCategories, getPostLikes, createPost, createPostLike, changePostById, deletePostById, deletePostLike, createPostImage} from '../controllers/postsController.js';
import authUser from '../middleware/authenticateus.js';
import uploadPost from '../middleware/postSave.js';

router.get('/', getAll);
router.get('/:id', getById);
router.get('/:id/comments', getPostComments);
router.post('/:id/comments', authUser, createPostComment);
router.get('/:id/categories', getPostCategories);
router.get('/:id/like', getPostLikes);
router.post('/', authUser, createPost);
router.patch('/image', authUser, uploadPost.single('image'), createPostImage);
router.post('/:id/like', authUser, createPostLike);
router.patch('/:id', authUser, changePostById);
router.delete('/:id', authUser, deletePostById);
router.delete('/:id/like', authUser, deletePostLike);


export default router ;