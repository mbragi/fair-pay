import { usePasskeySmartAccount } from "../../hooks/useSmartAccount";
import Button from "../common/Button";

const PasskeyConnect = () => {
  const { connectWithPasskey, isConnecting } = usePasskeySmartAccount();

  return (
    <Button
      onClick={connectWithPasskey}
      variant="success"
      isLoading={isConnecting}
      loadingText="Connecting..."
      disabled={isConnecting}
    >
      Login with Passkey
    </Button>
  );
};

export default PasskeyConnect;
