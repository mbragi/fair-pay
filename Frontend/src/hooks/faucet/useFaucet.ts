import { useState, useEffect } from "react";
import { utils } from "ethers";
import { useFaucetContract } from "./useFaucetContract";
import { useBalance } from "../../hooks/useNativeBalance";
import { useAuth } from "../../context/AuthContext";
import { useContractEvents } from "thirdweb/react";
import { prepareEvent } from "thirdweb";

// Prepare event definitions
const tokenClaimedEvent = prepareEvent({
  signature: "event TokensClaimed(address indexed user, uint256 amount)",
});

const faucetFundedEvent = prepareEvent({
  signature: "event FaucetFunded(address indexed funder, uint256 amount)",
});

export const useFaucet = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [claimSuccess, setClaimSuccess] = useState(false);
  const [claimError, setClaimError] = useState<string | null>(null);
  const [timeRemaining, setTimeRemaining] = useState<string>("");
  const [countdown, setCountdown] = useState<number>(0);
  const [claimRequestSent, setClaimRequestSent] = useState(false);
  const [fundingReceived, setFundingReceived] = useState(false);
  const [processedEventIds, setProcessedEventIds] = useState<string[]>(() => {
    // Initialize from localStorage if available
    const saved = localStorage.getItem('processedFaucetEvents');
    return saved ? JSON.parse(saved) : [];
  });

  // user from useAuth
  const { address, isConnected } = useAuth();
  // Get faucet contract data
  const {
    remainingAmount,
    nextClaimTime,
    dailyAmount,
    maxAmount,
    claimTokens,
    refetchRemaining,
    refetchNextClaim,
    faucetContract,
  } = useFaucetContract(address);

  // Get token contract data using useBalance
  const TOKEN_ADDRESS = "0x934e4a5242603d25bB497303ab1b0f2367AA8a85";
  const { tokenBalance, tokenSymbol, tokenDecimals, refetchBalance } =
    useBalance(TOKEN_ADDRESS);

  // Listen for contract events using useContractEvents
  const { data: claimEvents } = useContractEvents({
    contract: faucetContract,
    events: [tokenClaimedEvent],
  });

  const { data: fundEvents } = useContractEvents({
    contract: faucetContract,
    events: [faucetFundedEvent],
  });

  // Handle claim events
  useEffect(() => {
    if (claimEvents && claimEvents.length > 0) {
      // Get the latest event
      const latestEvent = claimEvents[claimEvents.length - 1];

      if (latestEvent) {
        // Create a unique ID for this event using transaction hash and log index
        const eventId = `${latestEvent.transactionHash}-${latestEvent.logIndex}`;

        // Only process this event if we haven't seen it before
        if (!processedEventIds.includes(eventId)) {
          setProcessedEventIds((prev) => [...prev, eventId]);
          setClaimSuccess(true);
          setClaimRequestSent(false);
          // Hide notification after 5 seconds
          setTimeout(() => setClaimSuccess(false), 5000);
          // Refresh data
          refetchRemaining();
          refetchNextClaim();
          refetchBalance();
        }
      }
    }
  }, [
    claimEvents,
    refetchBalance,
    refetchRemaining,
    refetchNextClaim,
    processedEventIds,
  ]);

  // Handle fund events
  useEffect(() => {
    if (fundEvents && fundEvents.length > 0) {
      // Get the latest event
      const latestEvent = fundEvents[fundEvents.length - 1];

      if (latestEvent) {
        // Create a unique ID for this event using transaction hash and log index
        const eventId = `${latestEvent.transactionHash}-${latestEvent.logIndex}`;

        // Only process this event if we haven't seen it before
        if (!processedEventIds.includes(eventId)) {
          setProcessedEventIds((prev) => [...prev, eventId]);
          setFundingReceived(true);
          // Hide notification after 5 seconds
          setTimeout(() => setFundingReceived(false), 5000);
          // Refresh balances
          refetchBalance();
        }
      }
    }
  }, [fundEvents, refetchBalance, processedEventIds]);

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
      setClaimError(null);
      setClaimRequestSent(true);

      // Call the claim function - success will be handled by the event listener
      await claimTokens();
      // Don't set success here as it's handled by the event listener
    } catch (error) {
      console.error("Error claiming tokens:", error);
      setClaimError(
        error instanceof Error ? error.message : "Failed to claim tokens"
      );
      setClaimRequestSent(false);

      // Reset error message after 5 seconds
      setTimeout(() => setClaimError(null), 5000);
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

  // Save processedEventIds to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('processedFaucetEvents', JSON.stringify(processedEventIds));
  }, [processedEventIds]);

  return {
    // State
    isLoading,
    claimSuccess,
    claimError,
    timeRemaining,
    countdown,
    setCountdown,
    setTimeRemaining,
    claimRequestSent,
    fundingReceived,

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
