import {
  AccountProvider,
  AccountAvatar,
  AccountAddress,
  ChainProvider,
  ChainIcon,
} from "thirdweb/react";
import { useAuth } from "../context/AuthContext";
import { client } from "../client";
import { baseSepolia } from "thirdweb/chains";

const AccountDetails = () => {

  const { address, disconnect } = useAuth();

  if (!address) return null;

  return (
    <div className="w-[190px] overflow-hidden">
      <AccountProvider address={address} client={client}>
        <ChainProvider chain={baseSepolia}>
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 overflow-hidden">
              <ChainIcon client={client} className="w-5 h-5 flex-shrink-0" />
              <AccountAvatar className="w-6 h-6 flex-shrink-0" />
              <AccountAddress className="font-mono text-sm text-gray-800 truncate max-w-[100px]" />
            </div>
            <button
              onClick={() => {
                disconnect();
                window.location.pathname = "/";
              }}
              className="bg-red-500 text-white text-xs px-2 py-1 rounded hover:bg-red-600 whitespace-nowrap"
            >
              Logout
            </button>
          </div>
        </ChainProvider>
      </AccountProvider>
    </div>
  );
};

export default AccountDetails;
