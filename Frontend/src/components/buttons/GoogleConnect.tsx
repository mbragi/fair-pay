import { useGoogleSmartAccount } from "../../hooks/useSmartAccount";
import Button from "../common/Button";

const GoogleConnect = () => {
  const { connectWithGoogle, isConnecting } = useGoogleSmartAccount();

  return (
    <Button
      onClick={connectWithGoogle}
      variant="primary"
      isLoading={isConnecting}
      loadingText="Connecting..."
      disabled={isConnecting}
    >
      Login with Google
    </Button>
  );
};

export default GoogleConnect;
