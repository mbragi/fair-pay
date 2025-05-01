// AccountDetails.tsx
import {
  AccountProvider,
  AccountAvatar,
  AccountAddress,
  ChainProvider,
  ChainIcon,
} from "thirdweb/react";
import { useAuth } from "@context/AuthContext";
import { client } from "@utils/client";
import { baseSepolia } from "thirdweb/chains";
import { useBalance } from "@hooks/finance/useNativeBalance";
import { WBBT_TOKEN_ADDRESS } from "@constants/contracts";

export default function AccountDetails() {
  const { address, disconnect } = useAuth();
  const { balance: nativeBal, symbol: nativeSym, isLoading: loadingN } = useBalance();
  const { balance: wbbtBal, symbol: wbbtSym, isLoading: loadingW } = useBalance(WBBT_TOKEN_ADDRESS);

  if (!address) return null;

  return (
    <div className="relative">
      {/* invisible anchor to position dropdown */}
      <div className="absolute right-0 mt-2 w-56">
        <div className="absolute top-0 right-3 transform -translate-y-1/2">
          {/* little arrow */}
          <div className="w-3 h-3 bg-white rotate-45 border-l border-t border-gray-200" />
        </div>
        <AccountProvider address={address} client={client}>
          <ChainProvider chain={baseSepolia}>
            <div className="mt-2 bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden">
              <div className="px-4 py-3 flex items-center justify-between border-b border-gray-100">
                <div className="flex items-center gap-2 overflow-hidden">
                  <ChainIcon client={client} className="w-5 h-5 flex-shrink-0" />
                  <AccountAvatar className="w-6 h-6 flex-shrink-0" />
                  <AccountAddress className="font-mono text-sm text-gray-800 truncate max-w-[110px]" />
                </div>
                <button
                  onClick={() => {
                    disconnect();
                    window.location.replace("/");
                  }}
                  className="text-xs text-red-600 hover:text-red-700"
                >
                  Logout
                </button>
              </div>

              <div className="px-4 py-2 space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="font-medium text-gray-600">Native</span>
                  <span className="font-mono">
                    {loadingN ? "…" : `${parseFloat(nativeBal).toFixed(4)} ${nativeSym}`}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium text-gray-600">WBBT</span>
                  <span className="font-mono">
                    {loadingW ? "…" : `${parseFloat(wbbtBal).toFixed(2)} ${wbbtSym}`}
                  </span>
                </div>
              </div>
            </div>
          </ChainProvider>
        </AccountProvider>
      </div>
    </div>
  );
}
