import React, { useState, useEffect } from 'react';
import { Listbox, ListboxButton, ListboxOptions, ListboxOption } from '@headlessui/react';
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
          { code: 'ENDO', name: 'Endocrinology' },
          { code: 'OBGYN', name: 'Obstetrics and Gynecology' },
          { code: 'PULMO', name: 'Pulmonology' }
        ]);
      }
    } catch (error) {
      console.error('Failed to fetch departments:', error);
      // Use fallback departments
     setDepartments([
          { code: 'CARDIO', name: 'Cardiology' },
          { code: 'NEURO', name: 'Neurology' },
          { code: 'ORTHO', name: 'Orthopedics' },
          { code: 'ENDO', name: 'Endocrinology' },
          { code: 'OBGYN', name: 'Obstetrics and Gynecology' },
          { code: 'PULMO', name: 'Pulmonology' }
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

        {/* Department Code - Updated with Listbox */}
        <div className='mb-6'>
          <p className='text-sm font-medium mb-2 text-gray-700'>Department</p>
          <Listbox 
            value={deptCode} 
            onChange={setDeptCode}
            disabled={loadingDepts}
          >
            <div className="relative w-full max-w-lg">
              <ListboxButton className="w-full px-4 py-2.5 border border-gray-300 rounded bg-gray-50 text-gray-700 focus:border-primary cursor-pointer flex justify-between items-center disabled:bg-gray-100 disabled:cursor-not-allowed">
                {loadingDepts ? 'Loading departments...' : (deptCode || 'Select department')}
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 9l6 6 6-6" />
                </svg>
              </ListboxButton>
              <ListboxOptions className="absolute mt-1 w-full bg-white border border-gray-200 rounded shadow-md z-10 max-h-60 overflow-auto">
                {departments.map((dept) => (
                  <ListboxOption 
                    key={dept.code} 
                    value={dept.code} 
                    className="cursor-pointer p-2 hover:bg-blue-50 text-gray-700"
                  >
                    {dept.code}
                  </ListboxOption>
                ))}
              </ListboxOptions>
            </div>
          </Listbox>
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