import React, { useState } from "react";

interface Props {
 isOpen: boolean;
 isLoading: boolean;
 onClose: () => void;
 onCreate: (name: string, description: string) => void;
}

const CreateOrganizationModal: React.FC<Props> = ({
 isOpen,
 isLoading,
 onClose,
 onCreate,
}) => {
 const [name, setName] = useState("");
 const [description, setDescription] = useState("");

 if (!isOpen) return null;

 const handleSubmit = (e: React.FormEvent) => {
  e.preventDefault();
  if (!isLoading) {
   onCreate(name, description);
  }
 };

 return (
  <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center z-50">
   <div className="bg-white rounded-lg p-8 max-w-md w-full">
    <div className="flex justify-between items-center mb-6">
     <h3 className="text-xl font-bold">Create New Organization</h3>
     <button
      onClick={onClose}
      disabled={isLoading}
      className="text-gray-500 hover:text-gray-700"
     >
      ✕
     </button>
    </div>
    <form onSubmit={handleSubmit}>
     <div className="mb-4">
      <label className="block text-gray-700 mb-2">Organization Name</label>
      <input
       type="text"
       className="w-full p-2 border rounded"
       value={name}
       onChange={(e) => setName(e.target.value)}
       disabled={isLoading}
       required
      />
     </div>
     <div className="mb-6">
      <label className="block text-gray-700 mb-2">Description</label>
      <textarea
       className="w-full p-2 border rounded"
       rows={4}
       value={description}
       onChange={(e) => setDescription(e.target.value)}
       disabled={isLoading}
       required
      ></textarea>
     </div>
     <div className="flex justify-end">
      <button
       type="button"
       onClick={onClose}
       disabled={isLoading}
       className="mr-4 text-gray-600 hover:text-gray-800"
      >
       Cancel
      </button>
      <button
       type="submit"
       disabled={isLoading}
       className={`px-4 py-2 rounded text-white ${isLoading
         ? "bg-indigo-400 cursor-not-allowed"
         : "bg-indigo-600 hover:bg-indigo-700"
        }`}
      >
       {isLoading ? (
        <span className="flex items-center">
         <svg
          className="animate-spin h-4 w-4 mr-2 text-white"
          viewBox="0 0 24 24"
          fill="none"
         >
          <circle
           className="opacity-25"
           cx="12"
           cy="12"
           r="10"
           stroke="currentColor"
           strokeWidth="4"
          ></circle>
          <path
           className="opacity-75"
           fill="currentColor"
           d="M4 12a8 8 0 018-8v8H4z"
          ></path>
         </svg>
         Creating...
        </span>
       ) : (
        "Create"
       )}
      </button>
     </div>
    </form>
   </div>
  </div>
 );
};

export default CreateOrganizationModal;
