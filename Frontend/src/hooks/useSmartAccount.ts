import { useConnect } from "thirdweb/react";
import { inAppWallet } from "thirdweb/wallets";
import { sepolia } from "thirdweb/chains";
import { client } from "../client"; // assumes you export createThirdwebClient here

type Strategy = "google" | "passkey";

const useSmartAccount = (strategy: Strategy) => {
  const { connect, isConnecting, error } = useConnect({
    client,
    accountAbstraction: {
      factoryAddress: '0x1ab5a786c3a0934742921a9dea0aa0a64d71469c',
      chain: sepolia,
      sponsorGas: true,
    },
  });

  const connectWithStrategy = async () => {
    return connect(async () => {
      const wallet = inAppWallet({
        auth: { options: [strategy] , mode: 'popup'},
        smartAccount: {
          sponsorGas: true,
          chain: sepolia,
        }
      });

      await wallet.connect(
        strategy === 'passkey'
          ? {
              client,
              chain: sepolia,
              strategy: 'passkey',
              type: 'sign-in',
            }
          : {
              client,
              chain: sepolia,
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
