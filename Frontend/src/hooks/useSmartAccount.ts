import { useConnect } from "thirdweb/react";
import { inAppWallet } from "thirdweb/wallets";

import { baseSepolia } from "thirdweb/chains";
import { client } from "../client"; // assumes you export createThirdwebClient here
type Strategy = "google" | "passkey";

const useSmartAccount = (strategy: Strategy) => {
  const { connect, isConnecting, error } = useConnect({
    client,
    accountAbstraction: {
      chain: baseSepolia,
      sponsorGas: true,
    },
  });

  const connectWithStrategy = async () => {
    return connect(async () => {
      const wallet = inAppWallet({
        auth: { options: [strategy] , mode: 'popup'},
        smartAccount: {
          sponsorGas: true,
          chain: baseSepolia,
        }
      });

      await wallet.connect(
        strategy === 'passkey'
          ? {
              client,
              chain: baseSepolia,
              strategy: 'passkey',
              type: 'sign-in',
            }
          : {
              client,
              chain: baseSepolia,
              strategy: 'google',
            }
      );

      return wallet;
    });
  };

  return { connectWithStrategy, isConnecting, error };
};

export const useGoogleSmartAccount = () => {
  const { connectWithStrategy, isConnecting, error,} =
    useSmartAccount("google");
  return { connectWithGoogle: connectWithStrategy, isConnecting, error };
};

export const usePasskeySmartAccount = () => {
  const { connectWithStrategy, isConnecting, error } =
    useSmartAccount("passkey");
  return { connectWithPasskey: connectWithStrategy, isConnecting, error };
};
