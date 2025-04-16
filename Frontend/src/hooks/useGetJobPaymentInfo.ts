import { useReadContract } from "thirdweb/react";
import { getContract } from "thirdweb";
import { client } from "../client";
import { baseSepolia } from "thirdweb/chains";
import { FairPayCore } from "../abis/addresses";

export const useGetJobPaymentInfo = (jobAddress: string) => {
  const contract = getContract({
    address: FairPayCore,
    chain: baseSepolia,
    client,
  });

  const { data, isLoading, error } = useReadContract({
    contract,
    method:
      "function getJobPaymentInfo(address) view returns (address,uint256,uint256,uint256)",
    params: [jobAddress],
  });

  return { paymentInfo: data, isLoading, error };
};
