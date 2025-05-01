import { useEffect } from "react";
import { useGoogleSmartAccount, usePasskeySmartAccount } from "../../hooks/useSmartAccount";
import { useAuth } from "../../context/AuthContext";
import Button from "../common/Button";

interface ConnectModalProps {
  open: boolean;
  onClose: () => void;
}

const ConnectModal = ({ open, onClose }: ConnectModalProps) => {
  const { 
    connectWithGoogle, 
    isConnecting: googleLoading, 
    error: googleError 
  } = useGoogleSmartAccount();
  
  const { 
    connectWithPasskey, 
    isConnecting: passkeyLoading, 
    error: passKeyError 
  } = usePasskeySmartAccount();
  
  const { isConnected } = useAuth();

  const handleGoogleConnect = async () => {
    try {
      await connectWithGoogle();
      onClose();
    } catch (error) {
      console.error("Google connection failed:", error);
    }
  };

  const handlePasskeyConnect = async () => {
    try {
      await connectWithPasskey();
      onClose();
    } catch (error) {
      console.error("Passkey connection failed:", error);
    }
  };

  useEffect(() => {
    if (isConnected) {
      onClose();
    }
  }, [isConnected, onClose]);

  useEffect(() => {
    if (googleError) {
      console.error("Google auth error:", googleError);
      // Consider using a toast notification instead of alert
    }
    
    if (passKeyError) {
      console.error("Passkey auth error:", passKeyError);
      // Consider using a toast notification instead of alert
    }
  }, [googleError, passKeyError]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-sm p-6 space-y-4 relative">
        <h2 className="text-xl font-semibold text-center text-gray-800">
          Login to FairPay
        </h2>

        {/* Google Button */}
        <Button
          onClick={handleGoogleConnect}
          disabled={googleLoading}
          isLoading={googleLoading}
          loadingText="Connecting..."
          variant="primary"
          fullWidth
        >
          Continue with Google
        </Button>

        {/* Passkey Button */}
        <Button
          onClick={handlePasskeyConnect}
          disabled={passkeyLoading}
          isLoading={passkeyLoading}
          loadingText="Connecting..."
          variant="success"
          fullWidth
        >
          Continue with Passkey
        </Button>

        <Button
          onClick={onClose}
          variant="ghost"
          className="mx-auto"
        >
          Cancel
        </Button>
      </div>
    </div>
  );
};

export default ConnectModal;