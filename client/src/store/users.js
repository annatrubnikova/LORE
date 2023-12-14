import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

const initialState = {
  users: [],
  currentUser: {},
  role: null,
  loading: false,
  error: null,
};

export const fetchAllUsers = createAsyncThunk('users/fetchAllUsers', async () => {
  const response = await axios.get('http://localhost:5000/api/users');
  return response.data.users;
});

export const fetchUserById = createAsyncThunk('users/fetchUserById', async (userId) => {
  const response = await axios.get(`http://localhost:5000/api/users/${userId}`);
  return response.data;
});

export const fetchUserRole = createAsyncThunk('users/fetchUserRole', async (token) => {
  const response = await axios.get(`http://localhost:5000/api/users/role/${token}`);
  return response.data;
});

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

const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    addPendingAndFulfilledReducers(builder, fetchAllUsers, 'users');
    addPendingAndFulfilledReducers(builder, fetchUserById, 'currentUser');
    addPendingAndFulfilledReducers(builder, fetchUserRole, 'role');
  },
});

export const { actions } = usersSlice;
export const selectors = (state) => state.users.users;
export const getFetchStatus = (state) => state.users.loading;

export default usersSlice.reducer;
