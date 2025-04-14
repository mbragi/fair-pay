import React from "react";

interface Props {
 isOpen: boolean;
 onClose: () => void;
 onCreate: () => void;
 title: string;
 description: string;
 payment: string;
 milestoneCount: number;
 setTitle: (val: string) => void;
 setDescription: (val: string) => void;
 setPayment: (val: string) => void;
 setMilestoneCount: (val: number) => void;
}

const CreateJobModal: React.FC<Props> = ({
 isOpen,
 onClose,
 onCreate,
 title,
 description,
 payment,
 milestoneCount,
 setTitle,
 setDescription,
 setPayment,
 setMilestoneCount,
}) => {
 if (!isOpen) return null;

 return (
  <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center z-50">
   <div className="bg-white rounded-lg p-8 max-w-md w-full">
    <div className="flex justify-between items-center mb-6">
     <h3 className="text-xl font-bold">Create New Job</h3>
     <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
      ✕
     </button>
    </div>
    <form
     onSubmit={(e) => {
      e.preventDefault();
      onCreate();
     }}
    >
     <div className="mb-4">
      <label className="block text-gray-700 mb-2">Job Title</label>
      <input
       type="text"
       className="w-full p-2 border rounded"
       value={title}
       onChange={(e) => setTitle(e.target.value)}
       required
      />
     </div>
     <div className="mb-4">
      <label className="block text-gray-700 mb-2">Description</label>
      <textarea
       className="w-full p-2 border rounded"
       rows={3}
       value={description}
       onChange={(e) => setDescription(e.target.value)}
       required
      ></textarea>
     </div>
     <div className="mb-4">
      <label className="block text-gray-700 mb-2">Total Payment (ETH)</label>
      <input
       type="number"
       className="w-full p-2 border rounded"
       value={payment}
       onChange={(e) => setPayment(e.target.value)}
       min="0.01"
       step="0.01"
       required
      />
     </div>
     <div className="mb-4">
      <label className="block text-gray-700 mb-2">Number of Milestones</label>
      <input
       type="number"
       className="w-full p-2 border rounded"
       value={milestoneCount}
       onChange={(e) => setMilestoneCount(parseInt(e.target.value))}
       min="1"
       max="10"
       required
      />
     </div>
     <div className="flex justify-end">
      <button
       type="button"
       onClick={onClose}
       className="mr-4 text-gray-600 hover:text-gray-800"
      >
       Cancel
      </button>
      <button type="submit" className="bg-indigo-600 text-white px-4 py-2 rounded">
       Continue
      </button>
     </div>
    </form>
   </div>
  </div>
 );
};

export default CreateJobModal;
