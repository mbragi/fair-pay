import { useReadContract, useSendTransaction } from "thirdweb/react";
import { client } from "../../client";
import { getContract, prepareContractCall } from "thirdweb";
import FAUCET_ABI from "@abis/wbbtFaucet.json";
import { WBBT_FAUCET_ADDRESS } from "@constants/contracts";
import { BLOCKCHAIN_CONFIG } from "@constants/config";

export const useFaucetContract = (userAddress?: string) => {
  // Get contract instance
  const faucetContract = getContract({
    client,
    address: WBBT_FAUCET_ADDRESS,
    chain: BLOCKCHAIN_CONFIG.defaultChain,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    abi: FAUCET_ABI.abi as any,
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
