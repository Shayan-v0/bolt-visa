import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import Cookies from 'js-cookie';
import axios from 'axios';
import { railwayBaseUrl } from '../utils';

// Async thunk for registering a new user
export const registerUser = createAsyncThunk(
  'users/registerUser',
  async (userData, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${railwayBaseUrl}/admin/register`, userData);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// Async thunk for editing a user
export const editUser = createAsyncThunk(
  'users/editUser',
  async (userData, { rejectWithValue }) => {
    try {
      const token = Cookies.get('bolt_visa_token');
      const response = await axios.post(`${railwayBaseUrl}/admin/updateprofile`, userData, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// Async thunk for fetching all users
export const fetchAllUsers = createAsyncThunk(
  'users/fetchAllUsers',
  async ({ page = 1, limit = 20 } = {}, { rejectWithValue }) => {
    try {
      const token = Cookies.get('bolt_visa_token');
      const response = await axios.get(`${railwayBaseUrl}/admin/users`, {
        params: { page, limit },
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// Async thunk for deleting a user
export const deleteUser = createAsyncThunk(
  'users/deleteUser',
  async (userId, { rejectWithValue }) => {
    try {
      const token = Cookies.get('bolt_visa_token');
      const response = await axios.delete(`${railwayBaseUrl}/admin/users/${userId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

const userSlice = createSlice({
  name: 'users',
  initialState: {
    users: [],
    total: 0,
    page: 1,
    limit: 20,
    loading: false,
    error: null,
    loginHistory: [],
  },
  reducers: {
    setPage(state, action) {
      state.page = action.payload;
    },
    setLimit(state, action) {
      state.limit = action.payload;
    },
    clearError(state) {
      state.error = null;
    },
    setLoginHistory(state, action) {
      state.loginHistory = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Register user cases
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Registration failed';
      })
      // Edit user cases
      .addCase(editUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(editUser.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(editUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Edit user failed';
      })
      // Fetch all users cases
      .addCase(fetchAllUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllUsers.fulfilled, (state, action) => {
        state.loading = false;
        console.log('API Response:', action.payload);
        console.log('Users:', action.payload.data?.users);
        console.log('Pagination:', action.payload.data?.pagination);
        state.users = action.payload.data?.users || [];
        // Get pagination data from the correct nested structure
        state.total = action.payload.data?.pagination?.total || 0;
        state.page = action.payload.data?.pagination?.page || action.meta.arg?.page || state.page;
        state.limit = action.payload.data?.pagination?.limit || action.meta.arg?.limit || state.limit;
        console.log('Updated state - total:', state.total, 'page:', state.page, 'limit:', state.limit);
      })
      .addCase(fetchAllUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch users';
      })
      // Delete user cases
      .addCase(deleteUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteUser.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(deleteUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to delete user';
      });
  },
});

export const { setPage, setLimit, clearError, setLoginHistory } = userSlice.actions;
export default userSlice.reducer; 