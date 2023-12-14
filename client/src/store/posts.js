import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

const initialState = {
  posts: {},
  postDetails: {},
  postComments: {},
  postCategories: {},
  postsCategory: {},
  postsUser: {},
  fav: {},
  loading: false,
  error: null,
};

const createFetchThunk = (name, url, link) => {
  return createAsyncThunk(`posts/${name}`, async (param) => {
    let response;
    if (link) response = await axios.get(`http://localhost:5000/api/${url}/${param}/${link}`);
    else response = await axios.get(`http://localhost:5000/api/${url}/${param || ''}`);
    return response.data;
  });
};

export const fetchAllPosts = createAsyncThunk('posts/fetchAllPosts', async (params) => {
  if (params == '?undefined') params = '';
  
  const response = await axios.get(`http://localhost:5000/api/posts/${params || '?sortBy=date'}`);
  return response.data;
});

export const fetchPostsByUser = createAsyncThunk('posts/fetchPostsByUser', async ({ id, params }) => {
  if (params == '?undefined') {
    params = '';
  }

  const response = await axios.get(`http://localhost:5000/api/users/${id}/posts/${params || '?sortBy=date'}`);
  return response.data;
});

export const fetchPostsCategory = createAsyncThunk('posts/fetchPostsCategory', async ({ id, params }) => {
  if (params == '?undefined') {
    params = '';
  }

  const response = await axios.get(`http://localhost:5000/api/categories/${id}/posts/${params || '?sortBy=date'}`);
  return response.data;
});

export const fetchPostsFav = createAsyncThunk('posts/fetchPostsFav', async ({ token, params }) => {
  if (params == '?undefined') {
    params = '';
  }
  const response = await axios.get(`http://localhost:5000/api/fav/${params || '?sortBy=date'}`, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  return response.data;
});

export const fetchPostDetails = createFetchThunk('fetchPostDetails', 'posts');
export const fetchPostComments = createFetchThunk('fetchPostComments', 'posts', 'comments');
export const fetchPostCategories = createFetchThunk('fetchPostCategories', 'posts', 'categories');
export const fetchPostLike = createFetchThunk('fetchPostLike', 'posts', 'like');



const addPendingAndFulfilledReducers = (builder, name, stateKey) => {
  builder
    .addCase(name.pending, (state) => {
      state.loading = true;
    })
    .addCase(name.fulfilled, (state, { payload }) => {
      state.loading = false;
      state[stateKey] = payload;
    })
    .addCase(name.rejected, (state, { error }) => {
      state.loading = false;
      state.error = error.message;
    });
};

const postsSlice = createSlice({
  name: 'posts',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    addPendingAndFulfilledReducers(builder, fetchAllPosts, 'posts');
    addPendingAndFulfilledReducers(builder, fetchPostDetails, 'postDetails');
    addPendingAndFulfilledReducers(builder, fetchPostComments, 'postComments');
    addPendingAndFulfilledReducers(builder, fetchPostCategories, 'postCategories');
    addPendingAndFulfilledReducers(builder, fetchPostLike, 'postLikes');
    addPendingAndFulfilledReducers(builder, fetchPostsCategory, 'postsCategory');
    addPendingAndFulfilledReducers(builder, fetchPostsByUser, 'postsUser');
    addPendingAndFulfilledReducers(builder, fetchPostsFav, 'fav');
  },
});

export const { actions } = postsSlice;
export const selectors = (state) => state.posts.posts;
export const isLoadingPosts = (state) => state.posts.loading;

export default postsSlice.reducer;
