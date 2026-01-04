import { useNavigate } from 'react-router-dom';

const ReportCard = ({ report }) => {

  const { id, file_name, clinician_id, clinician_name, s3_url, diagnosis_tags, dept_code, branch_code, dept_logo_url, uploaded_at } = report;
  const navigate = useNavigate();

  return (
   
    <div onClick={() => window.open(s3_url, '_blank')} className='w-full rounded-xl overflow-hidden shadow-md hover:shadow-lg hover:scale-102 duration-300 cursor-pointer bg-white flex flex-col h-full'>

      {/* Image Section */}
      {dept_logo_url ? (
        <img src={dept_logo_url} alt={`${dept_code} department logo`} className='w-full aspect-video object-cover bg-gray-100' />
      ) : (
        <div className='w-full aspect-video bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center'>
          <span className='text-gray-500 font-semibold text-lg'>{dept_code}</span>
        </div>
      )}

      {/* Content Section */}
      <div className='p-4 flex flex-col flex-grow'>

        {/* Department Badge */}
        <div className="flex items-center justify-start mb-3">
          <span className='px-3 py-1.5 bg-blue-100 text-blue-700 border border-blue-200 rounded-full text-xs font-medium'>
            {dept_code}
          </span>
        </div>

        {/* Diagnosis Tags */}
        <div className="flex flex-wrap gap-1.5 mb-3 ">
          {diagnosis_tags && diagnosis_tags.length > 0 ? (
            <>
              {diagnosis_tags.slice(0, 3).map((tag, idx) => (
                <span
                  key={idx}
                  className="px-2 py-0.5 bg-amber-50 text-amber-700 rounded text-xs font-medium border border-amber-200"
                >{tag}</span>
              ))}
              {diagnosis_tags.length > 3 && (
                <span className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded text-xs">
                  +{diagnosis_tags.length - 3} more
                </span>
              )}
            </>
          ) : (
            <span className="px-2 py-0.5 bg-gray-100 text-gray-500 rounded text-xs font-medium border border-gray-200">
              No tags
            </span>
          )}
        </div>

        {/* File Name */}
        <h5 className='mb-3 font-semibold text-gray-900 text-sm leading-tight break-words overflow-hidden'>
          <span className="block">{file_name}</span>
        </h5>

        {/* Clinician Info */}
        <div className="space-y-1 mb-3">
          <p className='text-xs text-gray-700 font-medium'>{clinician_name}</p>
          <p className='text-xs text-gray-500'>ID: {clinician_id}</p>
          <p className='text-xs text-gray-500'>Branch: {branch_code}</p>
        </div>

        {/* Upload Date - Pushed to bottom */}
        <div className='text-xs text-gray-500 border-t border-gray-100 pt-2 mt-auto'>
          {new Date(uploaded_at).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          })}
        </div>

      </div>
    </div>
  )
}

export default ReportCard