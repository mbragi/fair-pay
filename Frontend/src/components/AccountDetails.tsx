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
  <div className="w-[250px] overflow-hidden">
   <AccountProvider address={address} client={client}>
    <ChainProvider chain={baseSepolia}>
     <div className="flex items-center justify-between gap-2">
      <div className="flex items-center gap-2 overflow-hidden">
       <ChainIcon client={client} className="w-5 h-5 flex-shrink-0" />
       <AccountAvatar className="w-6 h-6 flex-shrink-0" />
      </div>
      <button
       onClick={disconnect}
       className="bg-red-500 text-white text-xs px-2 py-1 rounded hover:bg-red-600 whitespace-nowrap"
      >
       Logout
      </button>
     </div>

     {/* Optional Social Info */}
     {provider && email && (
      <div className="mt-1 text-xs text-gray-600 truncate">
       {provider.toUpperCase()} · {email}
      </div>
     )}

     {/* Wallet Balance */}
     {!isError && (
      <div className="mt-1 text-xs text-green-700">
       {loadingBalance
        ? "Loading balance..."
        : `${balance?.displayValue ?? "0"} ${balance?.symbol ?? ""}`}
      </div>
     )}
    </ChainProvider>
   </AccountProvider>
  </div>
 );
};

export default AccountDetails;
