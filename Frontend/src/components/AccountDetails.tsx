import {
 AccountProvider,
 AccountAvatar,
 ChainProvider,
 ChainIcon,
 useProfiles,
 useWalletBalance,
} from "thirdweb/react";
import { useAuth } from "../context/AuthContext";
import { client } from "../client";
import { baseSepolia } from "thirdweb/chains";

const AccountDetails = () => {
 const { address, disconnect } = useAuth();
 const { data: profiles } = useProfiles({ client });

 const {
  data: balance,
  isLoading: loadingBalance,
  isError,
 } = useWalletBalance({
  chain: baseSepolia,
  address,
  client,
 });

 if (!address) return null;

 const email = profiles?.[0]?.details?.email;
 const provider = profiles?.[0]?.type;

 return (
  <div className="w-[220px] overflow-hidden">
  <AccountProvider address={address} client={client}>
    <ChainProvider chain={baseSepolia}>
      <div className="flex items-center justify-between bg-gray-50 rounded-md border border-gray-100 px-2 py-1.5">
        <div className="flex items-center gap-1.5 overflow-hidden">
          <div className="flex items-center">
            <ChainIcon client={client} className="w-4 h-4 flex-shrink-0" />
            <AccountAvatar className="w-5 h-5 flex-shrink-0 -ml-1" />
          </div>
          <div className="text-xs font-medium text-gray-700 truncate">
            {address?.slice(0, 4)}...{address?.slice(-4)}
          </div>
        </div>
        <button
          onClick={disconnect}
          className="bg-red-500 text-white text-xs px-1.5 py-0.5 rounded hover:bg-red-600 whitespace-nowrap"
        >
          Logout
        </button>
      </div>
      
      <div className="flex justify-between items-center mt-0.5 px-1 text-xs">
        {/* Optional Social Info - More compact */}
        {provider && email && (
          <div className="text-gray-600 truncate pr-1 max-w-[60%]">
            {provider.toUpperCase()}{email && <span className="opacity-75">·{email.split('@')[0]}</span>}
          </div>
        )}
        
        {/* Wallet Balance - Inline with social info */}
        {!isError && (
          <div className="text-green-700 font-medium ml-auto">
            {loadingBalance ? "Loading..." : `${balance?.displayValue ?? "0"} ${balance?.symbol ?? ""}`}
          </div>
        )}
      </div>
    </ChainProvider>
  </AccountProvider>
</div>
 );
};

export default AccountDetails;
