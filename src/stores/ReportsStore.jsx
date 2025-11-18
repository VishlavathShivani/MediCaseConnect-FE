// stores/reportsStore.js
import { create } from 'zustand';
import axios from '../utils/axios';
import toast from 'react-hot-toast';


const useReportsStore = create((set, get) => ({
  // State
  reports: [],
  searchResults: [],
  isLoading: false,
  error: null,
  pagination: {
    page: 1,
    limit: 10,
    totalCount: 0,
    totalPages: 0
  },

  // Actions
  setLoading: (loading) => set({ isLoading: loading }),

  setError: (error) => set({ error }),

  clearError: () => set({ error: null }),



  // Search with filters
  fetchReports: async (filters={}, page = 1) => {
    set({ isLoading: true, error: null });
    try {
      // Convert filters to query params
      const queryParams = new URLSearchParams({ page });

    // Add filters to query params
    Object.entries(filters).forEach(([key, value]) => {
      if (value && value !== "" && !(Array.isArray(value) && value.length === 0)) {
        if (Array.isArray(value)) {
          queryParams.append(key, JSON.stringify(value));
        } else {
          queryParams.append(key, value);
        }
      }
    });

    const { data } = await axios.get(`/api/reports?${queryParams.toString()}`);
    
      
      if (data.success) {
        set({
          reports: data.reports,
          pagination: {
            page: data.page || 1,
            limit: data.limit || 10,
            totalCount: data.totalCount,
            totalPages: data.totalPages
          },
          isLoading: false
        });
        toast.success(`Found ${data.reports.length} reports`);

      } else {
        set({ error: data.error, reports: [], isLoading: false });
        toast.error(data.error);
      }
    } catch (error) {
      set({ error: error.message, reports: [], isLoading: false });
      toast.error('Search failed');
    }
  },

  // Search by text query (Pinecone semantic search)
  searchByQuery: async (query) => {
    set({ isLoading: true, error: null });
    try {
      const { data } = await axios.post('/api/reports/search/by-query', { query });
      

      if (data.success) {
        set({
          reports: data.reports,
          isLoading: false
        });
        toast.success(`Found ${data.reports.length > 0 ? data.reports.length : 'no'} similar reports`);
      } else {
        set({ error: data.error, reports: [], isLoading: false });
        toast.error(data.error);
      }
    } catch (error) {
      set({ error: error.message, reports: [], isLoading: false });
      toast.error('Query search failed');
    }
  },

  // Search by file upload
  searchByFile: async (file) => {
    set({ isLoading: true, error: null });
    try {
      const formData = new FormData();
      formData.append('file', file);

      const { data } = await axios.post('/api/reports/search/by-file', formData);
      

      if (data.success) {
        set({
          reports: data.reports,
          isLoading: false
        });
        toast.success(`Found ${data.reports.length > 0 ? data.reports.length : 'no'} similar reports`);
      } else {
        set({ error: data.error, reports: [], isLoading: false });
        toast.error(data.error);
      }
    } catch (error) {
      set({ error: error.message, reports: [], isLoading: false });
      toast.error('File search failed');
    }
  },

  // Clear search results
  clearSearchResults: () => set({ searchResults: [] }),

  // Add new report (for admin)
  addReport: async (reportData) => {
    set({ isLoading: true, error: null });
    try {
      
      const { data } = await axios.post('/api/admin/reports/upload', reportData);

      if (data.success) {
        set(state => ({
          isLoading: false
        }));
        toast.success('Report uploaded successfully');
        return data.success;
      } else {
        set({ error: data.error, isLoading: false });
        toast.error(data.error || 'Upload failed');
        return null;
      }
    } catch (error) {
      console.error('=== Upload Error ===');
      console.error('Full error:', error);
      console.error('Response:', error.response);
      console.error('Request:', error.request);

      set({ error: error.message, isLoading: false });
      toast.error(error.response?.data?.message || 'Failed to upload report');
      return null;
    }
  },

  // Delete report (for admin)
  deleteReport: async (reportId) => {
    set({ isLoading: true, error: null });
    try {
      const { data } = await axios.delete(`/api/admin/reports/${reportId}`);

      if (data.success) {
        toast.success('Report deleted successfully');
        set(state => ({
          // reports: state.reports.filter(report => report.id !== reportId),
          // searchResults: state.searchResults.filter(report => report.id !== reportId),
          isLoading: false
        }));
        return true;
      } else {
        set({ error: data.error, isLoading: false });
        toast.error(data.error);
      }
    } catch (error) {
      set({ error: error.message, isLoading: false });
      toast.error('Failed to delete report');
    }
  },

  // Update pagination
  setPage: (page) => {
    set(state => ({
      pagination: { ...state.pagination, page }
    }));

    // If showing search results, don't refetch
    if (get().searchResults.length > 0) return;

    // Otherwise fetch reports for new page
    get().fetchReports(page);
  },



  // Reset store
  reset: () => set({
    reports: [],
    searchResults: [],
    isLoading: false,
    error: null,
    pagination: {
      page: 1,
      limit: 10,
      totalCount: 0,
      totalPages: 0
    }
  })
}))

export default useReportsStore