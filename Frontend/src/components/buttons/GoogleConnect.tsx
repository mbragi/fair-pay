import { useGoogleSmartAccount } from "../../hooks/useSmartAccount";

const GoogleConnect = () => {
  const { connectWithGoogle, isConnecting } = useGoogleSmartAccount();

  return (
    <button
      onClick={connectWithGoogle}
      className="bg-blue-600 text-white px-4 py-2 rounded"
      disabled={isConnecting}
    >
      {isConnecting ? "Connecting..." : "Login with Google"}
    </button>
  );
};

export default GoogleConnect;
