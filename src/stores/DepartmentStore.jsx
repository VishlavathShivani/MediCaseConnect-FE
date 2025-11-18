import { create } from 'zustand';
import axios from '../utils/axios';
import toast from 'react-hot-toast';

const useDepartmentStore = create((set) => ({
  departments: [],
  isLoading: false,
  error: null,

  fetchDepartments: async () => {
    set({ isLoading: true, error: null });
    try {
      const { data } = await axios.get('/api/admin/departments');
      if (data.success) {
        set({ departments: data.departments, isLoading: false });
      } else {
        set({ error: data.error, isLoading: false });
        toast.error(data.error);
      }
    } catch (error) {
      set({ error: error.message, isLoading: false });
      toast.error('Failed to fetch departments');
    }
  },

  addDepartment: async (deptData) => {
    set({ isLoading: true, error: null });
    try {
      const { data } = await axios.post('/api/admin/departments', deptData);
      
      if (data.success) {
        toast.success(data.message);
        set({ isLoading: false });
        return true;
      }
    } catch (error) {
      set({ error: error.message, isLoading: false });
      toast.error(error.response?.data?.error || 'Failed to add department');
      return false;
    }
  },

  updateDepartment: async (code, deptData) => {
    set({ isLoading: true, error: null });
    try {
      const { data } = await axios.put(`/api/admin/departments/${code}`, deptData);
      
      if (data.success) {
        toast.success(data.message);
        set({ isLoading: false });
        return true;
      }
    } catch (error) {
      set({ error: error.message, isLoading: false });
      toast.error(error.response?.data?.error || 'Failed to update department');
      return false;
    }
  },

  deleteDepartment: async (code) => {
    set({ isLoading: true, error: null });
    try {
      const { data } = await axios.delete(`/api/admin/departments/${code}`);
      
      if (data.success) {
        toast.success(data.message);
        set({ isLoading: false });
        return true;
      }
    } catch (error) {
      set({ error: error.message, isLoading: false });
      toast.error(error.response?.data?.error || 'Failed to delete department');
      return false;
    }
  },

  searchDepartment: async (code) => {
    set({ isLoading: true, error: null });
    try {
      const { data } = await axios.get(`/api/admin/departments?code=${code}`);
      if (data.success) {
        set({ departments: [data.department], isLoading: false });
      }
    } catch (error) {
      set({ error: error.message, isLoading: false });
      toast.error('Department not found');
    }
  }
}));

export default useDepartmentStore;