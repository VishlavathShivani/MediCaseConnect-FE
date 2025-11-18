import React, { useState, useEffect } from 'react';
import { Listbox, ListboxButton, ListboxOption, ListboxOptions } from '@headlessui/react';
import useUserStore from '../../stores/UserStore';
import { Pencil, Trash2 } from 'lucide-react';

const Users = () => {
  const { users, isLoading, pagination, fetchUsers, addUser, updateUser, deleteUser, searchUser } = useUserStore();

  const [showForm, setShowForm] = useState(false);
  const [searchEmail, setSearchEmail] = useState('');
  const [page, setPage] = useState(1);
  const [editingUser, setEditingUser] = useState(null);
  const [formData, setFormData] = useState({
    email: '',
    name: '',
    role: 'clinician',
    branchCode: '',
    deptCode: ''
  });

  useEffect(() => {
    fetchUsers(page);
  }, [page]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchEmail.trim()) {
      searchUser(searchEmail);
      setPage(1);
    } else {
      fetchUsers(1);
      setPage(1);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let success;
    
    if (editingUser) {
      success = await updateUser(editingUser.id, formData);
    } else {
      success = await addUser(formData);
    }
    
    if (success) {
      setShowForm(false);
      setEditingUser(null);
      setFormData({ email: '', name: '', role: 'clinician', branchCode: '', deptCode: '' });
      fetchUsers(page);
    }
  };

  const handleEdit = (user) => {
    setEditingUser(user);
    setFormData({
      email: user.email,
      name: user.name,
      role: user.role,
      branchCode: user.branch_code || '',
      deptCode: user.dept_code || ''
    });
    setShowForm(true);
  };

  const handleDelete = async (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      const success = await deleteUser(userId);
      if (success) {
        fetchUsers(page);
      }
    }
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingUser(null);
    setFormData({ email: '', name: '', role: 'clinician', branchCode: '', deptCode: '' });
  };

  return (
    <div className='flex-1 bg-blue-50/50 overflow-auto'>
      <div className='pt-5 px-5 sm:pt-12 sm:px-16'>
        {/* Header */}
        <div className='flex justify-between items-center mb-6'>
          <h1 className='text-2xl font-semibold'>Users</h1>
          <button
            onClick={() => setShowForm(true)}
            className='group relative px-4 py-1 text-2xl border border-primary text-primary rounded cursor-pointer hover:border-primary hover:bg-primary hover:text-white hover:shadow-md hover:scale-105 transition-all duration-200'
            title='Add User'
          >
            +
          </button>
        </div>

        {/* Search */}
        <div className='mb-6'>
          <form onSubmit={handleSearch} className='flex flex-col sm:flex-row gap-2 max-w-md'>
            <input
              type='email'
              placeholder='Search by Email'
              value={searchEmail}
              onChange={(e) => setSearchEmail(e.target.value)}
              className='flex-1 px-4 py-2 border rounded outline-none focus:border-primary'
            />
            <div className='flex gap-2'>
              <button
                type='submit'
                className='flex-1 sm:flex-none px-4 py-2 bg-gray-800 text-white rounded hover:bg-gray-700'
              >
                Search
              </button>
              <button
                type='button'
                onClick={() => { setSearchEmail(''); setPage(1); fetchUsers(1); }}
                className='flex-1 sm:flex-none px-4 py-2 border rounded hover:bg-gray-200'
              >
                Clear
              </button>
            </div>
          </form>
        </div>

        {/* Table */}
        <div className='bg-white rounded shadow overflow-x-auto'>
          <table className='w-full text-sm text-gray-600'>
            <thead className='text-xs text-gray-600 text-left uppercase bg-gray-100 border-b-2 border-gray-400'>
              <tr>
                <th scope='col' className='px-4 py-4'>#</th>
                <th scope='col' className='px-4 py-4'>Name</th>
                <th scope='col' className='px-4 py-4'>Email</th>
                <th scope='col' className='px-4 py-4 max-md:hidden'>Role</th>
                <th scope='col' className='px-4 py-4 max-sm:hidden'>Branch</th>
                <th scope='col' className='px-4 py-4 max-sm:hidden'>Department</th>
                <th scope='col' className='px-4 py-4'>Actions</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan='7' className='px-4 py-8 text-center'>
                    <div className='flex items-center justify-center gap-2'>
                      <div className='animate-spin rounded-full h-5 w-5 border-b-2 border-primary'></div>
                    </div>
                  </td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan='7' className='px-4 py-8 text-center text-gray-500'>
                    No users found
                  </td>
                </tr>
              ) : (
                users.map((user, index) => (
                  <tr key={user.id} className='border-b border-gray-200 hover:bg-gray-50'>
                    <td className='px-4 py-2'>{(page - 1) * pagination.limit + index + 1}</td>
                    <td className='px-4 py-2 font-medium'>{user.name}</td>
                    <td className='px-4 py-2'>{user.email}</td>
                    <td className='px-4 py-2 max-md:hidden'>
                      <span className='px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded'>
                        {user.role}
                      </span>
                    </td>
                    <td className='px-4 py-2 max-sm:hidden'>{user.branch_code || '-'}</td>
                    <td className='px-4 py-2 max-sm:hidden'>{user.dept_code || '-'}</td>
                    <td className='px-4 py-1'>
                      <div className='flex gap-2'>
                        <button
                          onClick={() => handleEdit(user)}
                          className='p-2 text-primary border border-primary rounded cursor-pointer hover:bg-primary hover:text-white transition-colors duration-200'
                          title='Edit'
                        >
                          <Pencil size={16} strokeWidth={2} />
                        </button>
                        <button
                          onClick={() => handleDelete(user.id)}
                          className='p-2 text-red-700 border border-red-700 rounded cursor-pointer hover:bg-red-700 hover:text-white transition-colors duration-200'
                          title='Delete'
                        >
                          <Trash2 size={16} strokeWidth={2} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex justify-center items-center gap-4 sm:gap-6 mt-8 mb-5">
          <button
            disabled={page === 1}
            onClick={() => setPage(page - 1)}
            className={`px-5 py-2 border rounded font-medium transition-colors ${page === 1
              ? 'text-gray-400 border-gray-200 cursor-not-allowed'
              : 'hover:bg-gray-100 hover:border-gray-300 cursor-pointer'
              }`}
          >
            Previous
          </button>

          <span className="text-sm text-gray-600 font-medium">
            Page {page} of {pagination.totalPages || 1}
          </span>

          <button
            disabled={page === pagination.totalPages || pagination.totalPages === 0}
            onClick={() => setPage(page + 1)}
            className={`px-5 py-2 border rounded font-medium transition-colors ${page === pagination.totalPages || pagination.totalPages === 0
              ? 'text-gray-400 border-gray-200 cursor-not-allowed'
              : 'hover:bg-gray-100 hover:border-gray-300 cursor-pointer'
              }`}
          >
            Next
          </button>
        </div>
      </div>

      {/* Add/Edit Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white w-[90%] max-w-md rounded shadow-lg p-6 text-gray-700 relative mx-auto">

            {/* Header */}
            <h2 className="text-2xl font-semibold text-gray-800 mb-6 border-b pb-3 border-gray-400">
              {editingUser ? 'Edit User' : 'Add New User'}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-5">

              {/* Name */}
              <div>
                <p className="text-sm font-medium mb-2">Name</p>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Enter Full Name"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded outline-none focus:border-primary transition-colors bg-gray-50"
                />
              </div>

              {/* Email */}
              <div>
                <p className="text-sm font-medium mb-2">Email Address</p>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="Enter email (e.g., user@domain.com)"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded outline-none focus:border-primary transition-colors bg-gray-50"
                  disabled={editingUser !== null}
                />
              </div>

              {/* Role */}
              <div>
                <p className="text-sm font-medium mb-2">Role</p>
                <Listbox value={formData.role} onChange={(value) => setFormData({ ...formData, role: value })}>
                  <div className="relative">
                    <ListboxButton className="w-full max-w-lg p-3 border border-gray-300 rounded bg-white text-gray-700 focus:border-primary cursor-pointer flex justify-between items-center">
                      {formData.role.charAt(0).toUpperCase() + formData.role.slice(1)}
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 9l6 6 6-6" />
                      </svg>
                    </ListboxButton>
                    <ListboxOptions className="absolute mt-1 w-full max-w-lg bg-white border border-gray-200 rounded shadow-md z-10">
                      {['clinician', 'admin'].map((role) => (
                        <ListboxOption key={role} value={role} className="cursor-pointer p-2 hover:bg-blue-50 text-gray-700">
                          {role.charAt(0).toUpperCase() + role.slice(1)}
                        </ListboxOption>
                      ))}
                    </ListboxOptions>
                  </div>
                </Listbox>
              </div>

              {/* Branch Code */}
              <div>
                <p className="text-sm font-medium mb-2">Branch Code</p>
                <input
                  type="text"
                  required
                  placeholder="Enter branch code (e.g., HYD001)"
                  value={formData.branchCode}
                  onChange={(e) => setFormData({ ...formData, branchCode: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded outline-none focus:border-primary transition-colors bg-gray-50"
                />
              </div>

              {/* Department Code */}
              <div>
                <p className="text-sm font-medium mb-2">Department Code</p>
                <input
                  type="text"
                  required
                  placeholder="Enter department code (e.g., NEURO)"
                  value={formData.deptCode}
                  onChange={(e) => setFormData({ ...formData, deptCode: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded outline-none focus:border-primary transition-colors bg-gray-50"
                />
              </div>

              {/* Buttons */}
              <div className="flex items-center justify-end gap-4 pt-4 border-t border-gray-400">
                <button
                  type="button"
                  onClick={handleCloseForm}
                  className="px-5 py-2 border border-gray-300 rounded hover:bg-gray-100 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="px-6 py-2 bg-primary text-white rounded font-medium hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                >
                  {isLoading ? (editingUser ? 'Updating...' : 'Adding...') : (editingUser ? 'Update User' : 'Add User')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default Users;