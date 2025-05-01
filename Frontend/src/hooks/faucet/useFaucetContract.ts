import { useReadContract, useSendTransaction } from "thirdweb/react";
import { client } from "../../client";
import { baseSepolia } from "thirdweb/chains";
import { getContract, prepareContractCall } from "thirdweb";

// ABI for the faucet contract
const FAUCET_ABI = [
  "function claimTokens() external",
  "function timeUntilNextClaim(address user) external view returns (uint256)",
  "function remainingClaimableAmount(address user) external view returns (uint256)",
  "function totalClaimed(address) public view returns (uint256)",
  "function DAILY_CLAIM_AMOUNT() public view returns (uint256)",
  "function MAX_CLAIM_AMOUNT() public view returns (uint256)",
];

const FAUCET_ADDRESS = ""; // TODO: Replace with actual faucet contract address after deployment

export const useFaucetContract = (userAddress?: string) => {
  // Get contract instance
  const faucetContract = getContract({
    client,
    address: FAUCET_ADDRESS,
    chain: baseSepolia,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    abi: FAUCET_ABI as any,
  });

  // Get remaining claimable amount
  const { data: remainingAmount, refetch: refetchRemaining } = useReadContract({
    contract: faucetContract,
    method: "remainingClaimableAmount",
    params: [userAddress],
  });

  // Get time until next claim
  const { data: nextClaimTime, refetch: refetchNextClaim } = useReadContract({
    contract: faucetContract,
    method: "timeUntilNextClaim",
    params: [userAddress],
  });

  // Get daily claim amount
  const { data: dailyAmount } = useReadContract({
    contract: faucetContract,
    method: "DAILY_CLAIM_AMOUNT",
  });

  // Get max claim amount
  const { data: maxAmount } = useReadContract({
    contract: faucetContract,
    method: "MAX_CLAIM_AMOUNT",
  });

  // Claim tokens function
  const { mutate: claimTokens } = useSendTransaction();

  // Prepare claim tokens transaction
  const prepareClaimTokens = async () => {
    if (!userAddress) return;

    const transaction = await prepareContractCall({
      contract: faucetContract,
      method: "claimTokens",
      params: [],
    });

    return claimTokens(transaction);
  };

  return {
    faucetContract,
    remainingAmount,
    nextClaimTime,
    dailyAmount,
    maxAmount,
    claimTokens: prepareClaimTokens,
    refetchRemaining,
    refetchNextClaim,
  };
};
