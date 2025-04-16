import React, { useState } from "react";

interface Props {
 isOpen: boolean;
 onClose: () => void;
 onCreate: (job: {
  title: string;
  description: string;
  payment: string;
  milestoneCount: number;
  tokenAddress: string;
 }) => Promise<void> | void;
}

const CreateJobModal: React.FC<Props> = ({
 isOpen,
 onClose,
 onCreate,
}) => {
 const [title, setTitle] = useState("");
 const [description, setDescription] = useState("");
 const [payment, setPayment] = useState("");
 const [milestoneCount, setMilestoneCount] = useState(1);
 const [tokenAddress, setTokenAddress] = useState("");
 const [isSubmitting, setIsSubmitting] = useState(false);

 if (!isOpen) return null;

 const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setIsSubmitting(true);
  try {
   await onCreate({
    title,
    description,
    payment,
    milestoneCount,
    tokenAddress,
   });

   // Reset form and close modal after successful create
   setTitle("");
   setDescription("");
   setPayment("");
   setMilestoneCount(1);
   setTokenAddress("");
   onClose();
  } catch (err) {
   console.error("Create job failed:", err);
  } finally {
   setIsSubmitting(false);
  }
 };

 return (
  <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center z-50">
   <div className="bg-white rounded-lg p-8 max-w-md w-full">
    <div className="flex justify-between items-center mb-6">
     <h3 className="text-xl font-bold">Create New Job</h3>
     <button onClick={onClose} className="text-gray-500 hover:text-gray-700">✕</button>
    </div>
    <form onSubmit={handleSubmit}>
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
     <div className="mb-6">
      <label className="block text-gray-700 mb-2">Worker Address (Token Address)</label>
      <input
       type="text"
       className="w-full p-2 border rounded"
       value={tokenAddress}
       onChange={(e) => setTokenAddress(e.target.value)}
       placeholder="0x..."
       required
      />
     </div>
     <div className="flex justify-end">
      <button
       type="button"
       onClick={onClose}
       disabled={isSubmitting}
       className="mr-4 text-gray-600 hover:text-gray-800"
      >
       Cancel
      </button>
      <button
       type="submit"
       disabled={isSubmitting}
       className={`px-4 py-2 rounded text-white ${isSubmitting ? 'bg-gray-400' : 'bg-indigo-600 hover:bg-indigo-700'}`}
      >
       {isSubmitting ? "Creating..." : "Continue"}
      </button>
     </div>
    </form>
   </div>
  </div>
 );
};

export default CreateJobModal;
