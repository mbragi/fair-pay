import { useReadContract } from "thirdweb/react";
import { client } from "../../client";
import { baseSepolia } from "thirdweb/chains";
import { getContract } from "thirdweb";

// ABI for the WBBT token
const TOKEN_ABI = [
  "function balanceOf(address account) external view returns (uint256)",
  "function symbol() external view returns (string)",
  "function decimals() external view returns (uint8)",
];

const TOKEN_ADDRESS = "0x934e4a5242603d25bB497303ab1b0f2367AA8a85"; // TODO: Replace with actual WBBT token address

export const useTokenContract = (userAddress?: string) => {
  // Get contract instance
  const tokenContract = getContract({
    client,
    address: TOKEN_ADDRESS,
    chain: baseSepolia,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    abi: TOKEN_ABI as any,
  });

  // Get user's token balance
  const { data: tokenBalance, refetch: refetchBalance } = useReadContract({
    contract: tokenContract,
    method: "balanceOf",
    params: [userAddress],
  });

  // Get token symbol
  const { data: tokenSymbol } = useReadContract({
    contract: tokenContract,
    method: "symbol",
  });

  // Get token decimals
  const { data: tokenDecimals } = useReadContract({
    contract: tokenContract,
    method: "decimals",
  });

  return {
    tokenContract,
    tokenBalance,
    tokenSymbol,
    tokenDecimals,
    refetchBalance,
  };
};
