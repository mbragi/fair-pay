import { useState } from "react";
import {utils} from "ethers";
import { useFaucetContract } from "./useFaucetContract";
import { useBalance } from "../../hooks/useNativeBalance";
import { useAuth } from "../../context/AuthContext";

export const useFaucet = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [claimSuccess, setClaimSuccess] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState<string>("");
  const [countdown, setCountdown] = useState<number>(0);
 // user from useAuth
  const {address, isConnected}=useAuth();
  // Get faucet contract data
  const {
    remainingAmount,
    nextClaimTime,
    dailyAmount,
    maxAmount,
    claimTokens,
    refetchRemaining,
    refetchNextClaim,
  } = useFaucetContract(address);

  // Get token contract data using useBalance
 const TOKEN_ADDRESS = "0x934e4a5242603d25bB497303ab1b0f2367AA8a85";
  const { tokenBalance, tokenSymbol, tokenDecimals, refetchBalance } =
    useBalance(TOKEN_ADDRESS);

  // Format token amount with proper decimals
  const formatTokenAmount = (
    amount: bigint | undefined,
    decimals: number | undefined
  ) => {
    if (!amount || decimals === undefined) return "0";
    return utils.formatUnits(amount, decimals);
  };

  // Handle claim button click
  const handleClaim = async () => {
    if (!isConnected || !claimTokens) return;

    try {
      setIsLoading(true);
      // Thirdweb's mutateAsync already waits for the transaction to be mined
      await claimTokens();
      setClaimSuccess(true);

      // Refresh data
      refetchRemaining();
      refetchNextClaim();
      refetchBalance();

      // Reset success message after 5 seconds
      setTimeout(() => setClaimSuccess(false), 5000);
    } catch (error) {
      console.error("Error claiming tokens:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Update time remaining string based on nextClaimTime
  const updateTimeRemaining = () => {
    if (!nextClaimTime) return "Loading...";

    const timeInSeconds = Number(nextClaimTime);
    setCountdown(timeInSeconds);

    if (timeInSeconds === 0) {
      return "Available now";
    }

    if (timeInSeconds === Number.MAX_SAFE_INTEGER) {
      return "Maximum limit reached";
    }

    const hours = Math.floor(countdown / 3600);
    const minutes = Math.floor((countdown % 3600) / 60);
    const seconds = countdown % 60;

    return `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  };

  return {
    // State
    isLoading,
    claimSuccess,
    timeRemaining,
    countdown,
    setCountdown,
    setTimeRemaining,

    // Contract data
    remainingAmount,
    nextClaimTime,
    dailyAmount,
    maxAmount,
    tokenBalance,
    tokenSymbol,
    tokenDecimals,

    // Functions
    handleClaim,
    formatTokenAmount,
    updateTimeRemaining,

    // Refetch functions
    refetchRemaining,
    refetchNextClaim,
    refetchBalance,
  };
};
