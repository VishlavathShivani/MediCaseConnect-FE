import { create } from 'zustand';
import axios from '../utils/axios';
import toast from 'react-hot-toast';

const useUserStore = create((set) => ({
  users: [],
  isLoading: false,
  error: null,
  pagination: {
    page: 1,
    limit: 10,
    totalCount: 0,
    totalPages: 0
  },

  fetchUsers: async (page = 1) => {
    set({ isLoading: true, error: null });
    try {
      const { data } = await axios.get(`/api/admin/users?page=${page}`);
      if (data.success) {
        set({ 
          users: data.users,
          pagination: {
            page: data.page,
            limit: data.limit,
            totalCount: data.totalCount,
            totalPages: data.totalPages
          },
          isLoading: false 
        });
      }
    } catch (error) {
      set({ error: error.message, isLoading: false });
      toast.error('Failed to fetch users');
    }
  },

  addUser: async (userData) => {
    set({ isLoading: true, error: null });
    try {
      const { data } = await axios.post('/api/admin/users', userData);
      
      if (data.success) {
        toast.success(data.message);
        set({ isLoading: false });
        return true;
      }
    } catch (error) {
      set({ error: error.message, isLoading: false });
      toast.error(error.response?.data?.error || 'Failed to add user');
      return false;
    }
  },

  updateUser: async (userId, userData) => {
    set({ isLoading: true, error: null });
    try {
      const { data } = await axios.put(`/api/admin/users/${userId}`, userData);
      
      if (data.success) {
        toast.success(data.message);
        set({ isLoading: false });
        return true;
      }
    } catch (error) {
      set({ error: error.message, isLoading: false });
      toast.error(error.response?.data?.error || 'Failed to update user');
      return false;
    }
  },

  deleteUser: async (userId) => {
    set({ isLoading: true, error: null });
    try {
      const { data } = await axios.delete(`/api/admin/users/${userId}`);
      
      if (data.success) {
        toast.success(data.message);
        set({ isLoading: false });
        return true;
      }
    } catch (error) {
      set({ error: error.message, isLoading: false });
      toast.error(error.response?.data?.error || 'Failed to delete user');
      return false;
    }
  },

  searchUser: async (email) => {
    set({ isLoading: true, error: null });
    try {
      const { data } = await axios.get(`/api/admin/users?email=${email}`);
      if (data.success) {
        set({ users: [data.user], isLoading: false });
      }
    } catch (error) {
      set({ error: error.message, isLoading: false });
      toast.error('User not found');
    }
  }
}));

export default useUserStore;