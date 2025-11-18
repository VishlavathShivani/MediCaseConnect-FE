import React, { useState, useEffect } from 'react';
import useDepartmentStore from '../../stores/DepartmentStore';
import { Pencil, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';

const Departments = () => {
  const { departments, isLoading, fetchDepartments, addDepartment, updateDepartment, deleteDepartment, searchDepartment } = useDepartmentStore();

  const [showForm, setShowForm] = useState(false);
  const [searchCode, setSearchCode] = useState('');
  const [editingDept, setEditingDept] = useState(null);
  const [deptData, setDeptData] = useState({
    code: '',
    name: '',
    description: '',
    logo: null
  });

  useEffect(() => {
    fetchDepartments();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchCode.trim()) {
      searchDepartment(searchCode);
    } else {
      fetchDepartments();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    
    if (editingDept) {
      formData.append('name', deptData.name);
      formData.append('description', deptData.description);
      if (deptData.logo) {
        formData.append('file', deptData.logo);
      }
      
      const success = await updateDepartment(editingDept.code, formData);
      if (success) {
        setShowForm(false);
        setEditingDept(null);
        setDeptData({ code: '', name: '', description: '', logo: null });
        fetchDepartments();
      }
    } else {
      formData.append('code', deptData.code);
      formData.append('name', deptData.name);
      formData.append('description', deptData.description);
      formData.append('file', deptData.logo);

      const success = await addDepartment(formData);
      if (success) {
        setShowForm(false);
        setDeptData({ code: '', name: '', description: '', logo: null });
        fetchDepartments();
      }
    }
  };

  const handleEdit = (dept) => {
    setEditingDept(dept);
    setDeptData({
      code: dept.code,
      name: dept.name,
      description: dept.description || '',
      logo: null
    });
    setShowForm(true);
  };

  const handleDelete = async (code) => {
    if (window.confirm('Are you sure you want to delete this department?')) {
      const success = await deleteDepartment(code);
      if (success) {
        fetchDepartments();
      }
    }
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingDept(null);
    setDeptData({ code: '', name: '', description: '', logo: null });
  };

  return (
    <div className='flex-1 bg-blue-50/50 overflow-auto'>
      <div className='pt-5 px-5 sm:pt-12 sm:px-16'>

        {/* Header */}
        <div className='flex justify-between items-center mb-6'>
          <h1 className='text-2xl font-semibold'>Departments</h1>
          <button
            onClick={() => setShowForm(true)}
            className='group relative px-4 py-1 text-2xl border border-primary text-primary rounded cursor-pointer hover:border-primary hover:bg-primary hover:text-white hover:shadow-md hover:scale-105 transition-all duration-200'
            title='Add Department'
          >
            +
          </button>
        </div>

        {/* Search */}
        <div className='mb-6'>
          <form onSubmit={handleSearch} className='flex flex-col sm:flex-row gap-2 max-w-md'>
            <input
              type='text'
              placeholder='Search by Code'
              value={searchCode}
              onChange={(e) => setSearchCode(e.target.value)}
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
                onClick={() => { setSearchCode(''); fetchDepartments(); }}
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
                <th scope='col' className='px-4 py-4'>Code</th>
                <th scope='col' className='px-4 py-4'>Name</th>
                <th scope='col' className='px-4 py-4 max-md:hidden'>Description</th>
                <th scope='col' className='px-4 py-4 max-sm:hidden'>Logo</th>
                <th scope='col' className='px-4 py-4'>Actions</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan='6' className='px-4 py-8 text-center'>
                    <div className='flex items-center justify-center gap-2'>
                      <div className='animate-spin rounded-full h-5 w-5 border-b-2 border-primary'></div>
                    </div>
                  </td>
                </tr>
              ) : departments.length === 0 ? (
                <tr>
                  <td colSpan='6' className='px-4 py-8 text-center text-gray-500'>
                    No departments found
                  </td>
                </tr>
              ) : (
                departments.map((dept, index) => (
                  <tr key={dept.code} className='border-b border-gray-200 hover:bg-gray-50'>
                    <td className='px-4 py-2'>{index + 1}</td>
                    <td className='px-4 py-2 font-medium'>{dept.code}</td>
                    <td className='px-4 py-2 font-medium'>{dept.name}</td>
                    <td className='px-4 py-2 max-md:hidden'>{dept.description || '-'}</td>
                    <td className='px-4 py-2 max-sm:hidden'>
                      {dept.logo_url ? (
                        <img src={dept.logo_url} alt={dept.name} className='w-10 h-10 object-cover rounded' />
                      ) : (
                        <span className='text-gray-400 text-xs'>No logo</span>
                      )}
                    </td>
                    <td className='px-4 py-1'>
                      <div className='flex gap-2'>
                        <button
                          onClick={() => handleEdit(dept)}
                          className='p-2 text-primary border border-primary rounded cursor-pointer hover:bg-primary hover:text-white transition-colors duration-200'
                          title='Edit'
                        >
                          <Pencil size={16} strokeWidth={2} />
                        </button>
                        <button
                          onClick={() => handleDelete(dept.code)}
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

        {/* Bottom Spacing */}
        <div className='mb-5 mt-8'></div>
      </div>

      {/* Add/Edit Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white w-[90%] max-w-md rounded shadow-lg p-6 text-gray-700 relative mx-auto">

            {/* Header */}
            <h2 className="text-2xl font-semibold text-gray-800 mb-6 border-b pb-3 border-gray-400">
              {editingDept ? 'Edit Department' : 'Add New Department'}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-5">

              {/* Code */}
              <div>
                <p className="text-sm font-medium mb-2">Code</p>
                <input
                  type='text'
                  required
                  value={deptData.code}
                  onChange={(e) => setDeptData({ ...deptData, code: e.target.value })}
                  placeholder="Enter department code (e.g., NEURO)"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded outline-none focus:border-primary transition-colors bg-gray-50"
                  disabled={editingDept !== null}
                />
              </div>

              {/* Name */}
              <div>
                <p className="text-sm font-medium mb-2">Name</p>
                <input
                  type='text'
                  required
                  value={deptData.name}
                  onChange={(e) => setDeptData({ ...deptData, name: e.target.value })}
                  placeholder="Enter department name"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded outline-none focus:border-primary transition-colors bg-gray-50"
                />
              </div>

              {/* Description */}
              <div>
                <p className="text-sm font-medium mb-2">Description</p>
                <textarea
                  value={deptData.description}
                  onChange={(e) => setDeptData({ ...deptData, description: e.target.value })}
                  placeholder="Enter department description (optional)"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded outline-none focus:border-primary transition-colors bg-gray-50"
                  rows='3'
                />
              </div>

              {/* Logo Upload */}
              <div>
                <p className="text-sm font-medium mb-2">
                  Logo {editingDept && '(Leave empty to keep current logo)'}
                </p>
                <input
                  type='file'
                  accept='image/*'
                  required={!editingDept}
                  onChange={(e) => setDeptData({ ...deptData, logo: e.target.files[0] })}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded outline-none focus:border-primary transition-colors bg-gray-50 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:bg-primary file:text-white file:cursor-pointer hover:file:bg-primary/90"
                />
                {editingDept && editingDept.logo_url && (
                  <div className="mt-2">
                    <p className="text-xs text-gray-500 mb-1">Current logo:</p>
                    <img src={editingDept.logo_url} alt="Current logo" className="w-16 h-16 object-cover rounded border" />
                  </div>
                )}
              </div>

              {/* Buttons */}
              <div className="flex items-center justify-end gap-4 pt-4 border-t border-gray-400">
                <button
                  type='button'
                  onClick={handleCloseForm}
                  className="px-5 py-2 border border-gray-300 rounded hover:bg-gray-100 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type='submit'
                  disabled={isLoading}
                  className="px-6 py-2 bg-primary text-white rounded font-medium hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                >
                  {isLoading ? (editingDept ? 'Updating...' : 'Adding...') : (editingDept ? 'Update Department' : 'Add Department')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Departments;