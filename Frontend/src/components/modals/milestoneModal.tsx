import { useState } from "react";
import { useSetMilestones } from "../../hooks/useSetMilestone";
import { toast } from "sonner";
import { useGetMilestones } from "../../hooks/useGetMilestones";

interface Job {
  address: string;
  title: string;
  milestoneCount: number;
}

interface MilestoneModalProps {
  isOpen: boolean;
  job: Job;
  onClose: () => void;
}

const MilestoneModal = ({ isOpen, job, onClose }: MilestoneModalProps) => {
  console.log("Job in MilestoneModal:", job);
  const [milestones, setMilestones] = useState([
    { title: "", description: "", amount: "", deadline: "" },
  ]);
  const { setMilestones: submitMilestones, error, isPending } = useSetMilestones(job?.address ?? "0x");
  const { refetch } = useGetMilestones(job?.address ?? "0x", job?.milestoneCount ?? 0)
  if (!isOpen || !job) return null;


  const handleMilestoneChange = (index: number, field: 'title' | 'description' | 'amount' | 'deadline', value: string) => {
    const updated = [...milestones];
    updated[index][field] = value;
    setMilestones(updated);
  };

  const addMilestone = () => {
    if (milestones.length >= job.milestoneCount) {
      toast.error("You can only add up to " + job.milestoneCount + " milestones.");
      return;
    }
    setMilestones([...milestones, { title: "", description: "", amount: "", deadline: "" }]);
  };

  const removeMilestone = (index: number) => {
    setMilestones(milestones.filter((_, i) => i !== index));
  };

  if (error) {
    console.error("Error setting milestones:", error);
    toast.error("Error setting milestones: " + error.message);
  }

  const handleSubmit = async () => {
    const titles = milestones.map((m) => m.title);
    const descriptions = milestones.map((m) => m.description);
    const amounts = milestones.map((m) => m.amount);
    const deadlines = milestones.map((m) => m.deadline);
    await submitMilestones(titles, descriptions, amounts, deadlines);
    await refetch();
    onClose();
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg max-w-xl w-full shadow-xl overflow-y-auto max-h-[90vh]">
        <h3 className="text-xl font-bold mb-4">Set Milestones for {job?.title}</h3>

        {milestones.map((milestone, index) => (
          <div key={index} className="mb-4 border p-4 rounded bg-gray-50">
            <div className="flex justify-between items-center mb-2">
              <h4 className="font-semibold">Milestone {index + 1}</h4>
              {index > 0 && (
                <button onClick={() => removeMilestone(index)} className="text-red-500 text-sm">
                  ✕ Remove
                </button>
              )}
            </div>
            <input
              className="w-full p-2 border rounded mb-2"
              placeholder="Title"
              value={milestone.title}
              onChange={(e) => handleMilestoneChange(index, "title", e.target.value)}
              required
            />
            <textarea
              className="w-full p-2 border rounded mb-2"
              placeholder="Description"
              value={milestone.description}
              onChange={(e) => handleMilestoneChange(index, "description", e.target.value)}
              required
            />
            <input
              className="w-full p-2 border rounded mb-2"
              placeholder="Amount in ETH"
              type="number"
              min="0.01"
              step="0.01"
              value={milestone.amount}
              onChange={(e) => handleMilestoneChange(index, "amount", e.target.value)}
              required
            />
            <input
              className="w-full p-2 border rounded"
              placeholder="Deadline (YYYY-MM-DD)"
              type="date"
              value={milestone.deadline}
              onChange={(e) => handleMilestoneChange(index, "deadline", e.target.value)}
              required
            />
          </div>
        ))}

        <button
          onClick={addMilestone}
          className="mb-4 text-indigo-600 hover:underline text-sm"
        >
          + Add another milestone
        </button>

        <div className="flex justify-end gap-4 mt-4">
          <button onClick={onClose} className="text-gray-600 hover:text-gray-800">
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={isPending}
            className={`px-4 py-2 rounded text-white ${isPending ? "bg-indigo-400" : "bg-indigo-600 hover:bg-indigo-700"
              }`}
          >
            {isPending ? "Submitting..." : "Save Milestones"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default MilestoneModal;
