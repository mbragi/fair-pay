import { useConnect } from "thirdweb/react";
import { inAppWallet } from "thirdweb/wallets";

import { BLOCKCHAIN_CONFIG } from "@constants/config";
import { client } from "../../client";
type Strategy = "google" | "passkey";

const useSmartAccount = (strategy: Strategy) => {
  const { connect, isConnecting, error } = useConnect({
    client,
    accountAbstraction: {
      chain: BLOCKCHAIN_CONFIG.defaultChain,
      sponsorGas: true,
    },
  });

  const connectWithStrategy = async () => {
    return connect(async () => {
      const wallet = inAppWallet({
        auth: { options: [strategy], mode: "popup" },
        smartAccount: {
          sponsorGas: true,
          chain: BLOCKCHAIN_CONFIG.defaultChain,
        },
      });

      await wallet.connect(
        strategy === "passkey"
          ? {
              client,
              chain: BLOCKCHAIN_CONFIG.defaultChain,
              strategy: "passkey",
              type: "sign-in",
            }
          : {
              client,
              chain: BLOCKCHAIN_CONFIG.defaultChain,
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
