import React from "react";

interface Props {
 isOpen: boolean;
 onClose: () => void;
 onCreate: (name: string, description: string) => void;
 name: string;
 description: string;
 setName: (val: string) => void;
 setDescription: (val: string) => void;
}

const CreateOrganizationModal: React.FC<Props> = ({
 isOpen,
 onClose,
 onCreate,
 name,
 description,
 setName,
 setDescription,
}) => {
 if (!isOpen) return null;

 return (
  <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center z-50">
   <div className="bg-white rounded-lg p-8 max-w-md w-full">
    <div className="flex justify-between items-center mb-6">
     <h3 className="text-xl font-bold">Create New Organization</h3>
     <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
      ✕
     </button>
    </div>
    <form
     onSubmit={(e) => {
      e.preventDefault();
      onCreate(name, description);
     }}
    >
     <div className="mb-4">
      <label className="block text-gray-700 mb-2">Organization Name</label>
      <input
       type="text"
       className="w-full p-2 border rounded"
       value={name}
       onChange={(e) => setName(e.target.value)}
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
       required
      ></textarea>
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
       Create
      </button>
     </div>
    </form>
   </div>
  </div>
 );
};

export default CreateOrganizationModal;
