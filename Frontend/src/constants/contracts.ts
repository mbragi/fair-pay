/**
 * Contract addresses and ABIs centralized in one location
 */

// Import ABIs
import FairPayCoreABI from "../abis/FairPayCore.json";
import JobEscrowABI from "../abis/JobEscrow.json";
import OrganizationManagerABI from "../abis/OrganizationManager.json";
import IERC20ABI from "../abis/IERC20.json";
import WBBTFaucetABI from "../abis/wbbtFaucet.json";

// Re-export addresses from the existing addresses.ts file
import { FairPayCore, OrganizationManager } from "../abis/addresses";

// Faucet address (previously hardcoded in useFaucetContract.ts)
export const WBBT_FAUCET_ADDRESS = "0x038280670Ff7473F0a3956d0303dc4022DCd140e";
export const WBBT_TOKEN_ADDRESS = "0x934e4a5242603d25bB497303ab1b0f2367AA8a85";

// Export contract ABIs
export const ABIS = {
  FairPayCore: FairPayCoreABI.abi,
  JobEscrow: JobEscrowABI.abi,
  OrganizationManager: OrganizationManagerABI.abi,
  IERC20: IERC20ABI.abi,
  WBBTFaucet: WBBTFaucetABI.abi,
};

// Export contract addresses
export const ADDRESSES = {
  FairPayCore,
  OrganizationManager,
  WBBTFaucet: WBBT_FAUCET_ADDRESS,
  WBBTToken: WBBT_TOKEN_ADDRESS,
};

// Export a convenience function to get contract config
export const getContractConfig = (contractName: keyof typeof ADDRESSES) => {
  return {
    address: ADDRESSES[contractName],
    abi: ABIS[contractName as keyof typeof ABIS],
  };
};
