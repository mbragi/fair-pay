import { useWalletBalance, useActiveAccount } from "thirdweb/react";
import { client } from "../client";
import { baseSepolia } from "thirdweb/chains";
const chain = baseSepolia;
export function useNativeBalance() {
  const address = useActiveAccount()?.address;

  const { data, isLoading, isError } = useWalletBalance({
    address,
    chain,
    client,
    // no tokenAddress → native balance :contentReference[oaicite:0]{index=0}
  });

  return {
    balance: data?.displayValue || "0.0",
    symbol: data?.symbol || "",
    isLoading,
    isError,
  };
}

export function useBalance(tokenAddress?: string) {
  const address = useActiveAccount()?.address;

  const { data, isLoading, isError, refetch } = useWalletBalance({
    address,
    chain,
    client,
    tokenAddress,
  });

  // Default decimals for most ERC20 tokens
  const tokenDecimals = data?.decimals || 18;

  // Raw balance value (can be used with formatUnits if needed)
  const tokenBalance = data?.value;

  return {
    balance: data?.displayValue || "0.0",
    symbol: data?.symbol || "",
    isLoading,
    isError,
    // For compatibility with useTokenContract
    tokenBalance,
    tokenSymbol: data?.symbol || "",
    tokenDecimals,
    refetchBalance: refetch,
  };
}
