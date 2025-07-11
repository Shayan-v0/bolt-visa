import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import Cookies from 'js-cookie';
import axios from 'axios';
import { railwayBaseUrl } from '../utils';

// Async thunk for fetching applications with pagination
export const fetchApplications = createAsyncThunk(
  'applications/fetchApplications',
  async ({ page = 1, limit = 10 }, { rejectWithValue }) => {
    try {
      const token = Cookies.get('bolt_visa_token');
      const response = await axios.get(`${railwayBaseUrl}/application`, {
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

// Async thunk for deleting an application
export const deleteApplication = createAsyncThunk(
  'applications/deleteApplication',
  async (id, { rejectWithValue }) => {
    try {
      const token = Cookies.get('bolt_visa_token');
      const response = await axios.delete(`${railwayBaseUrl}/applications/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      return { id, data: response.data };
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// Async thunk for adding a new application
export const addApplication = createAsyncThunk(
  'applications/addApplication',
  async (applicationData, { rejectWithValue }) => {
    try {
      const token = Cookies.get('bolt_visa_token');
      const response = await axios.post(`${railwayBaseUrl}/application/create-applicaiton`, applicationData, {
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

// Async thunk for updating application status
export const updateApplicationStatus = createAsyncThunk(
  'applications/updateApplicationStatus',
  async (statusData, { rejectWithValue }) => {
    try {
      const token = Cookies.get('bolt_visa_token');
      const response = await axios.post(`${railwayBaseUrl}/application/update-application-status`, statusData, {
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

// Async thunk for editing an application
export const editApplication = createAsyncThunk(
  'applications/editApplication',
  async ({ id, updates }, { rejectWithValue }) => {
    try {
      const token = Cookies.get('bolt_visa_token');
      const response = await axios.post(`${railwayBaseUrl}/application/update-application?id=${id}`, updates, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      return { id, data: response.data };
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

const applicationsSlice = createSlice({
  name: 'applications',
  initialState: {
    data: [],
    total: 0,
    page: 1,
    limit: 10,
    pages: 0,
    loading: false,
    error: null,
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
  },
  extraReducers: (builder) => {
    builder
      // Fetch applications cases
      .addCase(fetchApplications.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchApplications.fulfilled, (state, action) => {
        state.loading = false;
        // Handle the API response structure
        let applicationsData = [];
        let paginationData = {};
        
        if (action.payload && typeof action.payload === 'object') {
          // Check for the new API response structure
          if (action.payload.data && action.payload.data.applications) {
            applicationsData = action.payload.data.applications;
            paginationData = action.payload.data.pagination || {};
          } else if (action.payload.data && Array.isArray(action.payload.data)) {
            applicationsData = action.payload.data;
          } else if (action.payload.data && action.payload.data.data && Array.isArray(action.payload.data.data)) {
            applicationsData = action.payload.data.data;
          } else if (action.payload.data && action.payload.data.applications && Array.isArray(action.payload.data.applications)) {
            applicationsData = action.payload.data.applications;
          } else if (action.payload.applications && Array.isArray(action.payload.applications)) {
            applicationsData = action.payload.applications;
          } else if (Array.isArray(action.payload)) {
            applicationsData = action.payload;
          }
        }
        
        state.data = applicationsData;
        state.total = paginationData.total || action.payload?.total || action.payload?.data?.total || applicationsData.length || 0;
        state.page = paginationData.page || state.page;
        state.pages = paginationData.pages || Math.ceil(state.total / state.limit);
      })
      .addCase(fetchApplications.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch applications';
        // Keep existing data on error
        if (!state.data || state.data.length === 0) {
          state.data = [];
        }
      })
      // Delete application cases
      .addCase(deleteApplication.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteApplication.fulfilled, (state, action) => {
        state.loading = false;
        state.data = state.data.filter(app => app.id !== action.payload.id);
      })
      .addCase(deleteApplication.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to delete application';
      })
      // Add application cases
      .addCase(addApplication.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addApplication.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload.data) {
          state.data.unshift(action.payload.data);
        }
      })
      .addCase(addApplication.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to add application';
      })
      // Update application status cases
      .addCase(updateApplicationStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateApplicationStatus.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(updateApplicationStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to update application status';
      })
      // Edit application cases
      .addCase(editApplication.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(editApplication.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.data.findIndex(app => app.id === action.payload.id);
        if (index !== -1 && action.payload.data) {
          state.data[index] = { ...state.data[index], ...action.payload.data };
        }
      })
      .addCase(editApplication.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to edit application';
      });
  },
});

export const { setPage, setLimit, clearError } = applicationsSlice.actions;
export default applicationsSlice.reducer; 