import { usePasskeySmartAccount } from "../../hooks/useSmartAccount";

const PasskeyConnect = () => {
  const { connectWithPasskey, isConnecting } = usePasskeySmartAccount();

  return (
    <button
      onClick={connectWithPasskey}
      className="bg-green-600 text-white px-4 py-2 rounded"
      disabled={isConnecting}
    >
      {isConnecting ? "Connecting..." : "Login with Passkey"}
    </button>
  );
};

export default PasskeyConnect;
