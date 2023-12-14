import express from 'express';
const router = express.Router();

import authRouter from './AuthModule.js';
import usersRouter from './UsersModule.js';
import postsRouter from './PostsModule.js';
import categoriesRouter from './CategoriesModule.js';
import commentsRouter from './CommentsModule.js';
import favRouter from './FavModule.js';

router.use('/auth', authRouter);
router.use('/users', usersRouter);
router.use('/posts', postsRouter);
router.use('/categories', categoriesRouter);
router.use('/fav', favRouter);
router.use('/comments', commentsRouter);


export { router };