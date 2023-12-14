import { configureStore } from '@reduxjs/toolkit';
import postsReducer from './posts';
import usersReducer from './users';

const store = configureStore({
  reducer: {
    posts: postsReducer,
    users: usersReducer
  },
});

export default store;
