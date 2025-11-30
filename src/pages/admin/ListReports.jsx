import React, { useEffect, useState } from 'react';
import { Listbox, ListboxButton, ListboxOption, ListboxOptions } from '@headlessui/react';
import useReportsStore from '../../stores/ReportsStore';
import toast from 'react-hot-toast';
import { Trash2, Filter } from 'lucide-react';

const ListReports = () => {
  const { reports, isLoading, fetchReports, deleteReport, pagination } = useReportsStore();

  const [showFilters, setShowFilters] = useState(false);
  const [activeFilters, setActiveFilters] = useState(null);
  const [filters, setFilters] = useState({
    indexing_status: "",
    dept_code: "",
    branch_code: "",
    clinician_id: "",
    uploaded_from: "",
    uploaded_to: "",
    tags: ""
  });

  const [page, setPage] = useState(1);

  useEffect(() => {
    if (activeFilters) {
      fetchReports(activeFilters, page);
    } else {
      fetchReports({}, page);
    }
  }, [page]);

  const handleFilterChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value
    });
  };

  const handleApplyFilters = async () => {
    const filterData = {
      ...filters,
      tags: filters.tags ? filters.tags.split(',').map(t => t.trim()) : []
    };

    Object.keys(filterData).forEach(key => {
      if (!filterData[key] || (Array.isArray(filterData[key]) && filterData[key].length === 0)) {
        delete filterData[key];
      }
    });

    console.log('Applying filters:', filterData);

    setActiveFilters(filterData); // Save active filters
    await fetchReports(filterData, 1); // Pass page 1
    setPage(1);
  };

  const handleClearFilters = () => {
    setFilters({
      indexing_status: "",
      dept_code: "",
      branch_code: "",
      clinician_id: "",
      uploaded_from: "",
      uploaded_to: "",
      tags: ""
    });
    setActiveFilters(null); // Clear active filters
    setPage(1);
    fetchReports({},1);
  };

  const handleDelete = async (reportId) => {
    if (window.confirm('Are you sure you want to delete this report?')) {
      const success = await deleteReport(reportId);
      if (success) {
        fetchReports(activeFilters || {}, page);
      }
    }
  };

  return (
    <div className='flex-1 bg-blue-50/50 overflow-auto'>
      <div className='pt-5 px-5 sm:pt-12 sm:px-16'>
        <h1 className='text-2xl font-semibold mb-6 text-gray-800'>All Reports</h1>

        {/* Filters */}
        <div className='bg-white rounded shadow mb-6'>
          {/* Filter Header with Toggle */}
          <div className='flex items-center justify-between p-4 border-b border-gray-200'>
            <h2 className='text-sm font-medium text-gray-700'>Filters</h2>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className='lg:hidden p-2 hover:bg-gray-100 rounded transition-colors'
              aria-label='Toggle Filters'
            >
              <Filter size={20} className='text-gray-600' />
            </button>
          </div>

          {/* Filter Content */}
          <div className={`p-4 pt-0 mt-4 ${showFilters ? 'block' : 'hidden lg:block'}`}>
            {/* First row - 4 fields */}
            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4'>

              {/* Clinician ID */}
              <div>
                <label className='block text-sm font-medium mb-2 text-gray-700'>Clinician ID</label>
                <input
                  type='text'
                  name='clinician_id'
                  placeholder='Enter Clinician ID'
                  value={filters.clinician_id}
                  onChange={handleFilterChange}
                  className='w-full px-4 py-2.5 border border-gray-300 rounded outline-none focus:border-primary transition-colors bg-gray-50 text-gray-700'
                />
              </div>

              {/* Department Code */}
              <div>
                <label className='block text-sm font-medium mb-2 text-gray-700'>Department Code</label>
                <input
                  type='text'
                  name='dept_code'
                  placeholder='Enter Department Code'
                  value={filters.dept_code}
                  onChange={handleFilterChange}
                  className='w-full px-4 py-2.5 border border-gray-300 rounded outline-none focus:border-primary transition-colors bg-gray-50 text-gray-700'
                />
              </div>

              {/* Branch Code */}
              <div>
                <label className='block text-sm font-medium mb-2 text-gray-700'>Branch Code</label>
                <input
                  type='text'
                  name='branch_code'
                  placeholder='Enter Branch Code'
                  value={filters.branch_code}
                  onChange={handleFilterChange}
                  className='w-full px-4 py-2.5 border border-gray-300 rounded outline-none focus:border-primary transition-colors bg-gray-50 text-gray-700'
                />
              </div>

              {/* Tags */}
              <div>
                <label className='block text-sm font-medium mb-2 text-gray-700'>Tags</label>
                <input
                  type='text'
                  name='tags'
                  placeholder='Enter tags (comma separated)'
                  value={filters.tags}
                  onChange={handleFilterChange}
                  className='w-full px-4 py-2.5 border border-gray-300 rounded outline-none focus:border-primary transition-colors bg-gray-50 text-gray-700'
                />
              </div>
            </div>

            {/* Second row - 3 fields */}
            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'>

              {/* Indexing Status */}
              <div>
                <label className='block text-sm font-medium mb-2 text-gray-700'>Indexing Status</label>
                <Listbox value={filters.indexing_status} onChange={(value) => setFilters({ ...filters, indexing_status: value })}>
                  <div className="relative">
                    <ListboxButton className="w-full px-4 py-2.5 border border-gray-300 rounded bg-gray-50 text-gray-700 focus:border-primary cursor-pointer flex justify-between items-center">
                      {filters.indexing_status || 'All Statuses'}
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 9l6 6 6-6" />
                      </svg>
                    </ListboxButton>
                    <ListboxOptions className="absolute mt-1 w-full bg-white border border-gray-200 rounded shadow-md z-10">
                      <ListboxOption value='' className="cursor-pointer p-2 hover:bg-blue-50 text-gray-700">
                        All Statuses
                      </ListboxOption>
                      <ListboxOption value='pending' className="cursor-pointer p-2 hover:bg-blue-50 text-gray-700">
                        Pending
                      </ListboxOption>
                      <ListboxOption value='completed' className="cursor-pointer p-2 hover:bg-blue-50 text-gray-700">
                        Completed
                      </ListboxOption>
                      <ListboxOption value='failed' className="cursor-pointer p-2 hover:bg-blue-50 text-gray-700">
                        Failed
                      </ListboxOption>
                    </ListboxOptions>
                  </div>
                </Listbox>
              </div>

              {/* Uploaded From */}
              <div>
                <label className='block text-sm font-medium mb-2 text-gray-700'>Uploaded From</label>
                <input
                  type='date'
                  name='uploaded_from'
                  value={filters.uploaded_from}
                  onChange={handleFilterChange}
                  className='w-full px-4 py-2.5 border border-gray-300 rounded outline-none focus:border-primary transition-colors bg-gray-50 text-gray-700 cursor-pointer'
                />
              </div>

              {/* Uploaded To */}
              <div>
                <label className='block text-sm font-medium mb-2 text-gray-700'>Uploaded To</label>
                <input
                  type='date'
                  name='uploaded_to'
                  value={filters.uploaded_to}
                  onChange={handleFilterChange}
                  className='w-full px-4 py-2.5 border border-gray-300 rounded outline-none focus:border-primary transition-colors bg-gray-50 text-gray-700 cursor-pointer'
                />
              </div>
            </div>

            <div className='flex gap-2 mt-5 pt-4 '>
              <button
                onClick={handleApplyFilters}
                disabled={isLoading}
                className='px-5 py-2 bg-gray-800 text-white rounded hover:bg-gray-700 disabled:opacity-50 cursor-pointer font-medium transition-colors'
              >
                Search
              </button>
              <button
                onClick={handleClearFilters}
                className='px-5 py-2 border border-gray-300 rounded hover:bg-gray-100 cursor-pointer transition-colors'
              >
                Clear
              </button>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className='bg-white rounded shadow overflow-x-auto'>
          <table className='w-full text-sm text-gray-600'>
            <thead className='text-xs text-gray-600 text-left uppercase bg-gray-100 border-b-2 border-gray-400'>
              <tr>
                <th scope='col' className='px-4 py-4'>#</th>
                <th scope='col' className='px-4 py-4 w-35'>File Name</th>
                <th scope='col' className='px-4 py-4'>Clinician</th>
                <th scope='col' className='px-4 py-4'>Department</th>
                <th scope='col' className='px-4 py-4'>Branch</th>
                <th scope='col' className='px-4 py-4'>Tags</th>
                <th scope='col' className='px-4 py-4'>Uploaded</th>
                <th scope='col' className='px-4 py-4'>Indexing Status</th>
                <th scope='col' className='px-4 py-4'>Actions</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan='9' className='px-4 py-8 text-center'>
                    <div className='flex items-center justify-center gap-2'>
                      <div className='animate-spin rounded-full h-5 w-5 border-b-2 border-primary'></div>
                    </div>
                  </td>
                </tr>
              ) : reports.length === 0 ? (
                <tr>
                  <td colSpan='9' className='px-4 py-8 text-center text-gray-500'>
                    No reports found
                  </td>
                </tr>
              ) : (
                reports.map((report, index) => (
                  <tr key={report.id} className='border-b border-gray-200 hover:bg-gray-50'>
                    <td className='px-4 py-2'>{(page - 1) * pagination.limit + index + 1}</td>
                    <td className='px-4 py-2 w-48'>
                      <a
                        href={report.s3_url}
                        target='_blank'
                        rel='noopener noreferrer'
                        className='text-primary hover:underline break-words'
                      >
                        {report.file_name}
                      </a>
                    </td>
                    <td className='px-4 py-2'>
                      <div>
                        <p className='font-medium'>{report.clinician_name || 'N/A'}</p>
                        <p className='text-xs text-gray-400'>{report.clinician_id}</p>
                      </div>
                    </td>
                    <td className='px-4 py-2'>{report.dept_code}</td>
                    <td className='px-4 py-2'>{report.branch_code}</td>
                    <td className='px-4 py-2'>
                      <div className='flex flex-wrap gap-1'>
                        {report.diagnosis_tags && report.diagnosis_tags.length > 0 ? (
                          report.diagnosis_tags.slice(0, 2).map((tag, i) => (
                            <span
                              key={i}
                              className='px-2 py-0.5 text-xs bg-amber-50 text-amber-700 rounded border border-amber-300'
                            >
                              {tag}
                            </span>
                          ))
                        ) : (
                          <span className='text-gray-400 text-xs'>No tags</span>
                        )}
                        {report.diagnosis_tags && report.diagnosis_tags.length > 2 && (
                          <span className='text-xs text-gray-500'>
                            +{report.diagnosis_tags.length - 2}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className='px-4 py-2 text-xs'>
                      {new Date(report.uploaded_at).toLocaleDateString()}
                    </td>
                    <td className='px-4 py-2'>
                      <span className={`px-2 py-1 text-xs rounded ${report.indexing_status === 'completed' ? 'bg-green-100 text-green-700' :
                            report.indexing_status === 'failed' ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-700'
                        }`}>
                        {report.indexing_status || 'pending'}
                      </span>
                    </td>
                    <td className='px-4 py-1'>
                      <button
                        onClick={() => handleDelete(report.id)}
                        className='p-2 text-red-700 border border-red-700 rounded cursor-pointer hover:bg-red-700 hover:text-white transition-colors duration-200'
                        title='Delete'
                      >
                        <Trash2 size={16} strokeWidth={2} />
                      </button>
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
    </div>
  );
};

export default ListReports;