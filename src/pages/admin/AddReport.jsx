import React, { useState, useEffect } from 'react';
import { assets } from '../../assets/assets';
import toast from 'react-hot-toast';
import useReportsStore from '../../stores/ReportsStore';
import axios from '../../utils/axios';

const AddReport = () => {
  const { addReport, isLoading } = useReportsStore();

  const [file, setFile] = useState(null);
  const [clinicianId, setClinicianId] = useState('');
  const [deptCode, setDeptCode] = useState('');
  const [branchCode, setBranchCode] = useState('');
  const [tags, setTags] = useState('');
  const [departments, setDepartments] = useState([]);
  const [loadingDepts, setLoadingDepts] = useState(false);

  // Fetch departments from backend on component mount
  useEffect(() => {
    fetchDepartments();
  }, []);

  const fetchDepartments = async () => {
    setLoadingDepts(true);
    try {
      const { data } = await axios.get('/api/admin/departments');
      if (data.success) {
        setDepartments(data.departments);
      } else {
        // Fallback to default departments if API fails
        setDepartments([
          { code: 'CARDIO', name: 'Cardiology' },
          { code: 'NEURO', name: 'Neurology' },
          { code: 'ORTHO', name: 'Orthopedics' },
          // { code: 'pediatrics', name: 'Pediatrics' },
          // { code: 'radiology', name: 'Radiology' },
          // { code: 'pathology', name: 'Pathology' },
          // { code: 'emergency', name: 'Emergency' },
          { code: 'GNRL', name: 'General Medicine' }
        ]);
      }
    } catch (error) {
      console.error('Failed to fetch departments:', error);
      // Use fallback departments
      setDepartments([
        { code: 'CARDIO', name: 'Cardiology' },
        { code: 'NEURO', name: 'Neurology' },
        { code: 'ORTHO', name: 'Orthopedics' },
        // { code: 'pediatrics', name: 'Pediatrics' },
        // { code: 'radiology', name: 'Radiology' },
        // { code: 'pathology', name: 'Pathology' },
        // { code: 'emergency', name: 'Emergency' },
        { code: 'GNRL', name: 'General Medicine' }
      ]);
    } finally {
      setLoadingDepts(false);
    }
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      // Validate file type (PDF only)
      if (selectedFile.type !== 'application/pdf') {
        toast.error('Only PDF files are allowed');
        return;
      }
      // Validate file size (max 10MB)
      if (selectedFile.size > 10 * 1024 * 1024) {
        toast.error('File size should not exceed 10MB');
        return;
      }
      setFile(selectedFile);
    }
  };

  const onSubmitHandler = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData();

      // Convert comma-separated tags to array
      const tagsArray = tags
        .split(',')
        .map(tag => tag.trim())
        .filter(tag => tag !== '');
      
      formData.append('clinicianId', clinicianId);
      formData.append('deptCode', deptCode);
      formData.append('branchCode', branchCode);
      formData.append('file', file);
      formData.append('tags', JSON.stringify(tagsArray));


      const result = await addReport(formData);

      if (result) {
        // Reset form on success
        setFile(null);
        setClinicianId('');
        setDeptCode('');
        setBranchCode('');
        setTags('');
      }
    } catch (error) {
      console.error('Upload error:', error);
    }
  };

  return (
    <form onSubmit={onSubmitHandler} className='flex-1 bg-blue-50/50 text-gray-600 h-full overflow-scroll'>
      <div className='bg-white w-full max-w-3xl p-5 md:p-10 sm:m-5 shadow rounded'>

        <h2 className='text-2xl font-semibold text-gray-800 mb-6'>Upload Medical Report</h2>

        {/* File Upload */}
        <div className='mb-6'>
          <p className='text-sm font-medium mb-2'>Upload Report (PDF only)</p>
          <label htmlFor="file" className='block'>
            <div className='mt-2 border-2 border-dashed border-gray-300 rounded-lg p-6 hover:border-gray-800 transition-colors cursor-pointer bg-gray-50 w-full max-w-lg'>
              {!file ? (
                <div className='flex flex-col items-center justify-center'>
                  <img src={assets.upload_area} alt="upload" className='h-12 mb-2 opacity-50' />
                  <p className='text-sm text-gray-500'>Click to upload PDF file</p>
                  <p className='text-xs text-gray-400 mt-1'>Maximum file size: 10MB</p>
                </div>
              ) : (
                <div className='flex items-center justify-between'>
                  <div className='flex items-center gap-3'>
                    <svg className="w-10 h-10 text-red-700" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
                    </svg>
                    <div>
                      <p className='font-medium text-gray-700'>{file.name}</p>
                      <p className='text-xs text-gray-500'>{(file.size / 1024).toFixed(2)} KB</p>
                    </div>
                  </div>
                  <button
                    type='button'
                    onClick={(e) => {
                      e.preventDefault();
                      setFile(null);
                    }}
                    className='text-red-500 hover:text-red-700'
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              )}
            </div>
            <input
              onChange={handleFileChange}
              type="file"
              id='file'
              accept='.pdf'
              hidden
              required
            />
          </label>
        </div>

        {/* Clinician ID */}
        <div className='mb-6'>
          <p className='text-sm font-medium mb-2'>Clinician ID</p>
          <input
            type="text"
            placeholder='Enter clinician ID'
            required
            className='w-full max-w-lg p-3 border border-gray-300 outline-none rounded focus:border-primary transition-colors'
            onChange={(e) => setClinicianId(e.target.value)}
            value={clinicianId}
          />
        </div>

        {/* Department Code */}
        <div className='mb-6'>
          <p className='text-sm font-medium mb-2'>Department</p>
          <select
            onChange={(e) => setDeptCode(e.target.value)}
            value={deptCode}
            required
            disabled={loadingDepts}
            className='w-full max-w-lg p-3 border border-gray-300 outline-none rounded focus:border-primary transition-colors bg-white disabled:bg-gray-100 text-gray-700 appearance-none cursor-pointer'
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3E%3Cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3E%3C/svg%3E")`,
              backgroundPosition: 'right 0.5rem center',
              backgroundRepeat: 'no-repeat',
              backgroundSize: '1.5em 1.5em',
              paddingRight: '2.5rem'
            }}
          >
            <option value="" disabled>
              {loadingDepts ? 'Loading departments...' : 'Select department'}
            </option>
            {departments.map((dept, index) => (
              <option key={index} value={dept.code}>
                {dept.code}
              </option>
            ))}
          </select>
        </div>

        {/* Branch Code */}
        <div className='mb-6'>
          <p className='text-sm font-medium mb-2'>Branch Code</p>
          <input
            type="text"
            placeholder='Enter branch code (e.g., BR001)'
            required
            className='w-full max-w-lg p-3 border border-gray-300 outline-none rounded focus:border-primary transition-colors'
            onChange={(e) => setBranchCode(e.target.value)}
            value={branchCode}
          />
        </div>

        {/* Tags */}
        <div className='mb-6'>
          <p className='text-sm font-medium mb-2'>Diagnosis Tags</p>
          <input
            type="text"
            placeholder='Enter tags separated by commas (e.g., cardiac, hypertension)'
            className='w-full max-w-lg p-3 border border-gray-300 outline-none rounded focus:border-primary transition-colors'
            onChange={(e) => setTags(e.target.value)}
            value={tags}
          />
          <p className='text-xs text-gray-500 mt-1'>Separate multiple tags with commas</p>
        </div>

        {/* Submit Button */}
        <div className='flex gap-4 items-center'>
          <button
            disabled={isLoading}
            type="submit"
            className='px-8 py-3 bg-primary text-white rounded cursor-pointer text-sm font-medium hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed'
          >
            {isLoading ? 'Uploading...' : 'Upload Report'}
          </button>

          {isLoading && (
            <div className='flex items-center gap-2 text-sm text-gray-600'>
              <div className='animate-spin rounded-full h-4 w-4 border-b-2 border-primary'></div>
              <span>Processing report...</span>
            </div>
          )}
        </div>
      </div>
    </form>

    
  );
};

export default AddReport;