import { useEffect } from "react";
import {
  useGoogleSmartAccount,
  usePasskeySmartAccount,
} from "../../hooks/useSmartAccount";
import { useAuth } from "../../context/AuthContext";

interface ConnectModalProps {
  open: boolean;
  onClose: () => void;
}

const ConnectModal = ({ open, onClose }: ConnectModalProps) => {
  const { connectWithGoogle, isConnecting: googleLoading, error: googleError } =
    useGoogleSmartAccount();
  const { connectWithPasskey, isConnecting: passkeyLoading, error: passKeyError } =
    usePasskeySmartAccount();
    const { isConnected, address, } = useAuth();
  

  useEffect(() => {
    if (googleError) {
      console.log(googleError)
      alert(googleError)

    }
    if (passKeyError) {
      console.log(passKeyError)
      alert(passKeyError)
    }
  }, [googleError, passKeyError])

  console.log(address, isConnected)

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-sm p-6 space-y-4 relative">
        <h2 className="text-xl font-semibold text-center text-gray-800">
          Login to FairPay
        </h2>

        {/* Google Button */}
        <button
          onClick={connectWithGoogle}
          disabled={googleLoading}
          className="w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium"
        >
          {googleLoading ? "Connecting..." : "Continue with Google"}
        </button>

        {/* Passkey Button */}
        <button
          onClick={connectWithPasskey}
          disabled={passkeyLoading}
          className="w-full py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-medium"
        >
          {passkeyLoading ? "Connecting..." : "Continue with Passkey"}
        </button>

        <button
          onClick={onClose}
          className="text-sm text-gray-500 hover:text-red-600 block mx-auto mt-2"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default ConnectModal;