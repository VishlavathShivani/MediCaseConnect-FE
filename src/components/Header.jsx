import { useState } from 'react'
import { motion } from 'motion/react'
import { assets } from '../assets/assets'
import {  Upload } from 'lucide-react';
import useReportsStore from '../stores/ReportsStore';

const Header = () => {

    const [selectedFile, setSelectedFile] = useState(null);
    const [searchMode, setSearchMode] = useState('query'); // 'query' or 'file'
    const [query, setQuery] = useState('');
    const searchModes = [
        { label: "Search By Query", value: "query" },
        { label: "Search By File", value: "file" },
    ];


    const { fetchReports, searchByQuery, searchByFile, isLoading } = useReportsStore();

    // Handle query search
    const handleQuerySubmit = () => {
        if (query.trim()) {
            searchByQuery(query);
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleQuerySubmit();
        }
    };

    // Handle file upload - following your existing pattern
    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedFile(file);
        }
    };

    const clearSearch = () => {
        setSelectedFile(null);
        setQuery('');
        // Re-fetch all reports to reset the view 
        fetchReports();
    };



    return (
        <div className='mx-8 sm:mx-16 xl:mx-24 relative'>

            <div className='text-center mt-20 mb-10'>


                <div className='inline-flex items-center justify-center gap-4 px-6 py-1.5 mb-4 border border-primary/40 bg-primary/10 rounded-full text-sm text-primary'>
                    <p>New: AI feature integrated</p>
                    <img src={assets.star_icon} alt="" className="w-2.5" />
                </div>

                <h1 className='text-3xl sm:text-6xl font-semibold sm:leading-16 text-gray-700'>Gateway to <span className='text-primary'>Smarter</span><br /> Clinical Insights</h1>

                <p className='my-6 sm:my-8 max-w-2xl m-auto max-sm:text-xs text-gray-500'>
                    Find similar patient cases by uploading a file or entering a query.
                </p>

                {/* Search Mode Toggle */}
                <div className='flex justify-center gap-4 sm:gap-8 max-w-lg max-sm:scale-75 mx-auto my-8 relative'>

                    {searchModes.map((item) => (
                        <div key={item.value} className="relative">
                            <button onClick={() => setSearchMode(item.value)}
                                className={`cursor-pointer text-gray-500 ${searchMode === item.value && 'text-white px-4 pt-0.5'}`}>
                                {item.label}
                                {searchMode === (item.value) && (
                                    <motion.div layoutId='underline'
                                        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                                        className='absolute left-0 right-0 top-0 h-7 -z-1 bg-primary rounded-full'></motion.div>
                                )}

                            </button>

                        </div>
                    ))}
                </div>

                {/* Search Input Area */}
                <div className="max-w-2xl mx-auto">
                    {searchMode === 'query' ? (
                        
                        <div className='flex justify-between max-w-lg max-sm:scale-75 mx-auto border border-gray-300 bg-white rounded overflow-hidden'>
                            <input value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                onKeyDown={handleKeyPress}
                                placeholder="Describe symptoms, diagnosis, or medical conditions..."
                                required
                                className='w-full pl-4 outline-none'
                            />
                            <button
                                onClick={handleQuerySubmit}
                                disabled={!query.trim() || isLoading}
                                className='bg-primary text-white px-8 py-2 m-1.5 rounded hover:scale-105 transition-all cursor-pointer'
                            >
                                Search
                            </button>
                        </div>
                    ) : (
                        /* File Upload - MUI style with button beside input */
                        
                        <div className="flex justify-between max-w-lg max-sm:scale-75 mx-auto border border-gray-300 bg-white rounded overflow-hidden">

                            <div className="flex-1 flex items-center pl-4">
                                {selectedFile ? (
                                    <div className="flex justify-between gap-2 bg-gray-200 px-3 py-2 rounded-3xl ">
                                        <span className="text-gray-700 text-sm truncate max-w-[180px]">
                                            {selectedFile.name}
                                        </span>
                                        <button
                                            type="button"
                                            onClick={clearSearch}
                                            className="text-red-500 hover:text-red-700 text-sm font-semibold"
                                        >
                                            ✕
                                        </button>
                                    </div>
                                ) : (
                                    <span className="text-gray-500 text-md">No file chosen</span>
                                )}
                            </div>

                            <input
                                type="file"
                                id="file-upload"
                                className="hidden"
                                accept=".pdf"
                                onChange={handleFileChange}
                            />

                            {selectedFile ? (
                                <button
                                    type="button"
                                    onClick={() => searchByFile(selectedFile)}
                                    className="bg-primary text-white px-5 py-2 m-1.5 rounded hover:scale-105 transition-all cursor-pointer flex justify-center items-center gap-1"
                                >

                                    Search
                                </button>
                            ) : (
                                <label
                                    htmlFor="file-upload"
                                    className="bg-primary text-white px-3 py-2 m-1.5 rounded hover:scale-105 transition-all cursor-pointer flex justify-center items-center gap-1"
                                >
                                    <Upload className="w-6 h-4" />
                                    Choose File
                                </label>
                            )}

                        </div>



                    )}

                </div>

                {/* Quick Examples for Query Mode */}
                {searchMode === 'query' && (
                    <div className="mt-8 text-center">
                        <p className="text-sm text-gray-500 mb-3">Try these examples:</p>
                        <div className="flex flex-wrap justify-center gap-2">
                            {[
                                "Chronic back pain with radiating symptoms",
                                "Cardiac arrhythmia in elderly patients",
                                "Neurological symptoms post-stroke"
                            ].map((example, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => setQuery(example)}
                                    className="text-xs bg-white hover:bg-gray-50 text-gray-600 px-3 py-1.5 rounded-full border border-gray-200 transition-colors"
                                >
                                    {example}
                                </button>
                            ))}
                        </div>
                    </div>
                )}

            </div>


            <img src={assets.gradientBackground} alt="" className="absolute -top-50 -z-1 opacity-50" />

        </div>
    )
}

export default Header
