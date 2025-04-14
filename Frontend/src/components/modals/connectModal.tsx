import { useAuth } from "../../context/AuthContext";

const ConnectModal = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  const { connectWithGoogle, connectWithPasskey } = useAuth();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white rounded-lg p-6 w-full max-w-sm shadow-lg">
        <h2 className="text-xl font-bold mb-4 text-center">Connect Your Wallet</h2>
        <div className="space-y-4">
          <button
            onClick={() => {
              connectWithGoogle();
              onClose();
            }}
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
          >
            Continue with Google
          </button>
          <button
            onClick={() => {
              connectWithPasskey();
              onClose();
            }}
            className="w-full bg-gray-700 text-white py-2 rounded hover:bg-gray-800"
          >
            Continue with Passkey
          </button>
        </div>
        <button
          onClick={onClose}
          className="mt-4 w-full text-gray-500 text-sm hover:text-gray-700"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default ConnectModal;
