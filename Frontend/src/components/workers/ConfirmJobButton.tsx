// components/ConfirmJobButton.tsx
import { useConfirmJob } from "../../hooks/useConfirmJob";
import { motion } from "framer-motion";
import { CheckCircle } from "lucide-react";

interface ConfirmJobButtonProps {
  jobAddress: string;
  onSuccess?: () => void;
}

const ConfirmJobButton: React.FC<ConfirmJobButtonProps> = ({ jobAddress, onSuccess }) => {
  const { confirmJob, isPending } = useConfirmJob();

  const handleConfirm = async () => {
    try {
      await confirmJob(jobAddress);
      if (onSuccess) onSuccess();
    } catch (error) {
      console.error("Failed to confirm job:", error);
    }
  };

  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={handleConfirm}
      disabled={isPending}
      className="w-full py-2 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-medium rounded-lg transition-all shadow-md flex items-center justify-center text-sm"
    >
      {isPending ? (
        <>
          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Processing...
        </>
      ) : (
        <>
          <CheckCircle className="w-4 h-4 mr-2" />
          Accept Job
        </>
      )}
    </motion.button>
  );
};

export default ConfirmJobButton;