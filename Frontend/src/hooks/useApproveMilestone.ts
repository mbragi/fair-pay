import JobEscrowAbi from '../abis/JobEscrow.json';
import { baseSepolia } from 'thirdweb/chains';
import { client } from '../client';
import { useSendTransaction } from 'thirdweb/react';
import { getContract, prepareContractCall } from 'thirdweb';

export const useApproveMilestone = (selectedJob: `0x${string}` | undefined) => {
 const { mutateAsync: sendTx, isPending } = useSendTransaction();

 const approveMilestone = async (index: number) => {
  if (!selectedJob) return;
  
  const ctr = getContract({
   address: selectedJob,
   chain: baseSepolia,
   client,
   // eslint-disable-next-line @typescript-eslint/no-explicit-any
   abi: JobEscrowAbi.abi as any,
  });

  const tx = prepareContractCall({
   contract: ctr,
   method: "approveMilestone",
   params: [BigInt(index)],
  });

  return sendTx(tx);
 };

 return {
  approveMilestone,
  isApproving: isPending
 };
};
