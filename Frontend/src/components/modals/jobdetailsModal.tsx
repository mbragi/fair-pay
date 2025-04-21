import React from "react";
import { ethers } from "ethers";
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Job } from "../../types/generated";
import { formatEth } from "../../utils/contractUtils";

interface Props {
  isOpen: boolean;
  job: Job;
  onClose: () => void;
}



const JobDetailsModal: React.FC<Props> = ({ isOpen, job, onClose }) => {
  if (!isOpen) return null;

  const { title, description, totalPayment, worker } = job;
  const formattedPayment = formatEth(totalPayment);
  const workerDisplay =
    worker?.toLowerCase() === ethers.constants.AddressZero.toLowerCase()
      ? "Unassigned"
      : worker;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg max-w-md w-full shadow-xl">
        <header className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold">{title}</h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
            aria-label="Close modal"
          >
            ✕
          </button>
        </header>

        <section className="space-y-4">
          <p className="text-gray-700">{description}</p>
          <p className="text-sm text-gray-500">
            <span className="font-medium">Total Payment:</span> {formattedPayment}
          </p>
          <p className="text-sm text-gray-500">
            <span className="font-medium">Worker:</span> {workerDisplay}
          </p>
        </section>

        <footer className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
          >
            Close
          </button>
        </footer>
      </div>
    </div>
  );
};

export default JobDetailsModal;
