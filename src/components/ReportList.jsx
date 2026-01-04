import React, { useState, useEffect } from 'react'
import { motion } from 'motion/react'
import { Listbox, ListboxButton, ListboxOptions, ListboxOption } from '@headlessui/react'
import ReportCard from './ReportCard'
import Loader from './Loader'
import useReportsStore from '../stores/ReportsStore'
import axios from '../utils/axios'

const ReportList = () => {

    const {
        reports,
        isLoading,
        fetchReports,
        pagination,
        setPage
    } = useReportsStore();

    const [showFilters, setShowFilters] = useState(false);
    const [departments, setDepartments] = useState([]);
    const [loadingDepts, setLoadingDepts] = useState(false);

    const { page, totalPages } = pagination;
    const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

    const [filters, setFilters] = useState({
        // extraction_status: "",
        // indexing_status: "",
        dept_code: "",
        branch_code: "",
        clinician_id: "",
        uploaded_from: "",
        uploaded_to: "",
        tags: []
    });

  

    // Fetch departments from backend
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

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("Filters applied:", filters);
        // Reset to page 1 when applying filters
        fetchReports(filters, 1);
    };

    const clearFilters = () => {
        const clearedFilters = {
            dept_code: "",
            branch_code: "",
            clinician_id: "",
            tags: [],
            uploaded_from: "",
            uploaded_to: ""
        };

        setFilters(clearedFilters);
        // Reset to page 1 when clearing filters
        fetchReports({}, 1);
    };

    useEffect(() => {
        fetchReports() // This will load initial reports
    }, [])

    return (
        <div>

            <div className="mx-4 sm:mx-8 lg:mx-16 mb-10">
                <button
                    onClick={() => setShowFilters(!showFilters)}
                    className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 hover:bg-gray-50 rounded-md text-gray-600 transition-colors shadow-sm"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                            d={showFilters ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
                    </svg>
                    <span className="text-sm font-medium">
                        {showFilters ? 'Hide Filters' : 'Show Filters'}
                    </span>
                </button>
            </div>

            {showFilters && (
                <form onSubmit={handleSubmit} className="bg-gray-50 p-6 rounded-md shadow-lg mb-15 mx-8 sm:mx-16 xl:mx-40">

                    {/* First Row - Clinician Id (2 cols) + Dept, Branch (2 cols)  */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-6">

                        {/* Clinician ID */}
                        <div className='md:col-span-2'>
                            <label className="block text-sm font-medium text-gray-600 mb-2">Clinician ID</label>
                            <input
                                type="text"
                                value={filters.clinician_id}
                                onChange={(e) => setFilters({ ...filters, clinician_id: e.target.value })}
                                placeholder="Enter ID"
                                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-primary"
                            />
                        </div>

                        {/* Department - Updated with Listbox */}
                        <div>
                            <label className='block text-sm font-medium mb-2 text-gray-700'>Department</label>
                            <Listbox 
                                value={filters.dept_code} 
                                onChange={(value) => setFilters({ ...filters, dept_code: value })}
                                disabled={loadingDepts}
                            >
                                <div className="relative">
                                    <ListboxButton className="w-full px-4 py-2.5 border border-gray-300 rounded bg-gray-50 text-gray-700 focus:border-primary cursor-pointer flex justify-between items-center disabled:bg-gray-100 disabled:cursor-not-allowed">
                                        {loadingDepts ? 'Loading...' : (filters.dept_code || 'All Departments')}
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 9l6 6 6-6" />
                                        </svg>
                                    </ListboxButton>
                                    <ListboxOptions className="absolute mt-1 w-full bg-white border border-gray-200 rounded shadow-md z-10 max-h-60 overflow-auto">
                                        <ListboxOption value='' className="cursor-pointer p-2 hover:bg-blue-50 text-gray-700">
                                            All Departments
                                        </ListboxOption>
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
                        <div>
                            <label className="block text-sm font-medium text-gray-600 mb-2">Branch Code</label>
                            <input
                                type="text"
                                value={filters.branch_code}
                                onChange={(e) => setFilters({ ...filters, branch_code: e.target.value })}
                                placeholder="Enter ID"
                                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-primary"
                            />
                        </div>
                    </div>

                    {/* Second Row - Tags (2 cols) + Date filters (2 cols) */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-6">

                        {/* Tags - spans 2 columns */}
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-600 mb-2">Tags</label>
                            <input
                                type="text"
                                placeholder="Add tag and press Enter"
                                onKeyPress={(e) => {
                                    if (e.key === 'Enter' && e.target.value.trim()) {
                                        e.preventDefault();
                                        setFilters({ ...filters, tags: [...filters.tags, e.target.value.trim()] });
                                        e.target.value = '';
                                    }
                                }}
                                className="w-full px-3 py-2 mb-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-primary"
                            />
                            <div className="flex flex-wrap gap-2 ">
                                {filters.tags.map((tag, index) => (
                                    <span key={index} className="bg-rose-50 text-rose-700 border border-rose-300 px-3 py-0.5 rounded-full text-sm flex items-center gap-2">
                                        {tag}
                                        <button
                                            type="button"
                                            onClick={() => setFilters({ ...filters, tags: filters.tags.filter((_, i) => i !== index) })}
                                            className="text-rose-600 hover:text-rose-800 cursor-pointer"
                                        >
                                            ×
                                        </button>
                                    </span>
                                ))}
                            </div>
                        </div>

                        {/* Date From */}
                        <div>
                            <label className="block text-sm font-medium text-gray-600 mb-2">Uploaded From</label>
                            <input
                                type="date"
                                value={filters.uploaded_from}
                                onChange={(e) => setFilters({ ...filters, uploaded_from: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-primary"
                            />
                        </div>

                        {/* Date To */}
                        <div>
                            <label className="block text-sm font-medium text-gray-600 mb-2">Uploaded To</label>
                            <input
                                type="date"
                                value={filters.uploaded_to}
                                onChange={(e) => setFilters({ ...filters, uploaded_to: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-primary"
                            />
                        </div>
                    </div>

                    {/* Submit Buttons */}
                    <div className="flex gap-4 mt-6">
                        <button type="submit" className="px-6 py-2 bg-primary text-white rounded hover:bg-primary/90">
                            Apply Filters
                        </button>
                        <button type="button" onClick={clearFilters}
                            className="px-6 py-2 border border-gray-300 text-gray-700 rounded hover:bg-gray-50">
                            Clear All
                        </button>
                    </div>
                </form>
            )}

            {isLoading ? (
                <Loader />
            ) : reports.length > 0 ? (
                <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-8 mb-24 mx-8 sm:mx-16 xl:mx-40'>
                    {reports.map(report => <ReportCard key={report.id} report={report} />)}
                </div>

            ) : (
                <p className="text-center text-gray-500 py-12">No reports found</p>
            )}

            <div className="flex justify-center items-center gap-4 sm:gap-6 mt-8 mb-5">
                <button
                    disabled={page === 1}
                    onClick={() => setPage(page - 1)}
                    className={`px-3 py-2 border rounded font-medium transition-colors ${page === 1
                            ? 'text-gray-400 border-gray-200 cursor-not-allowed'
                            : 'hover:bg-gray-100 hover:border-gray-300 cursor-pointer'
                        }`}
                >
                    Previous
                </button>

                {/* Page indicator */}
                <span className="text-sm text-gray-600 font-medium">
                    Page {page} of {totalPages || 1}
                </span>

                <button
                    disabled={page === totalPages || totalPages === 0}
                    onClick={() => setPage(page + 1)}
                    className={`px-3 py-2 border rounded font-medium transition-colors ${page === totalPages || totalPages === 0
                            ? 'text-gray-400 border-gray-200 cursor-not-allowed'
                            : 'hover:bg-gray-100 hover:border-gray-300 cursor-pointer'
                        }`}
                >
                    Next
                </button>
            </div>

        </div>

    )
}

export default ReportList