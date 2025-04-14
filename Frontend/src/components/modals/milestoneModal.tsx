/* eslint-disable @typescript-eslint/no-explicit-any */

const MilestoneModal = ({ isOpen, job, onClose, onSave }: any) => {
 if (!isOpen || !job) return null;

 return (
  <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center z-50">
   <div className="bg-white p-8 rounded-lg max-w-lg w-full shadow-xl">
    <h3 className="text-xl font-bold mb-4">Set Milestones for {job.title}</h3>
    {/* Add milestone form fields here */}
    <div className="mt-6 flex justify-end space-x-4">
     <button onClick={onClose} className="px-4 py-2 text-gray-600 hover:text-gray-800">Cancel</button>
     <button onClick={onSave} className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700">Save</button>
    </div>
   </div>
  </div>
 );
};

export default MilestoneModal;
