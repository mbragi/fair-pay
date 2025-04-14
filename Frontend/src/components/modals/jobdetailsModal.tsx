/* eslint-disable @typescript-eslint/no-explicit-any */

const JobDetailsModal = ({ isOpen, job, onClose }: any) => {
 if (!isOpen || !job) return null;

 return (
  <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center z-50">
   <div className="bg-white p-8 rounded-lg max-w-lg w-full shadow-xl">
    <h3 className="text-xl font-bold mb-4">{job.title}</h3>
    <p className="text-gray-700 mb-4">{job.description}</p>
    <p className="text-sm text-gray-500">Total Payment: {job.totalPayment} ETH</p>
    <div className="mt-6 flex justify-end">
     <button onClick={onClose} className="px-4 py-2 text-gray-600 hover:text-gray-800">
      Close
     </button>
    </div>
   </div>
  </div>
 );
};

export default JobDetailsModal;
