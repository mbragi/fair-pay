import { useConnect } from "../../node_modules/thirdweb/dist/types/exports/react";
import { inAppWallet } from "../../node_modules/thirdweb/dist/types/exports/wallets";
import { sepolia } from "../../node_modules/thirdweb/dist/types/exports/chains";
import { client } from "../client"; // assumes you export createThirdwebClient here

type Strategy = "google" | "passkey";

const useSmartAccount = (strategy: Strategy) => {
  const { connect, isConnecting, error } = useConnect({
    client,
    accountAbstraction: {
      chain: sepolia,
      sponsorGas: true,
    },
  });

  const connectWithStrategy = async () => {
    return connect(async () => {
      const wallet = inAppWallet({
        auth: { options: [strategy] },
      });

      await wallet.connect(
        strategy === "passkey"
          ? {
              client,
              chain: sepolia,
              strategy: "passkey",
              type: "sign-in",
            }
          : {
              client,
              chain: sepolia,
              strategy: "google",
            }
      );

      return wallet;
    });
  };

  return { connectWithStrategy, isConnecting, error };
};

export const useGoogleSmartAccount = () => {
  const { connectWithStrategy, isConnecting, error } =
    useSmartAccount("google");
  return { connectWithGoogle: connectWithStrategy, isConnecting, error };
};

export const usePasskeySmartAccount = () => {
  const { connectWithStrategy, isConnecting, error } =
    useSmartAccount("passkey");
  return { connectWithPasskey: connectWithStrategy, isConnecting, error };
};
