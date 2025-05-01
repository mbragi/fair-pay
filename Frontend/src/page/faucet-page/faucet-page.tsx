import React, { useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { AlertCircle, Droplet, Clock, CheckCircle, XCircle, Send, Coins } from 'lucide-react';
import { useFaucet } from '../../hooks/faucet';

const FaucetPage: React.FC = () => {
 const { address, isConnected } = useAuth();
 const {
  // State
  isLoading,
  claimSuccess,
  claimError,
  timeRemaining,
  setTimeRemaining,
  setCountdown,
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
  refetchNextClaim
 } = useFaucet();

 // Format time remaining until next claim
 useEffect(() => {
  if (!nextClaimTime) return;

  const timeInSeconds = Number(nextClaimTime);
  setCountdown(timeInSeconds);

  if (timeInSeconds === 0) {
   setTimeRemaining('Available now');
   return;
  }

  if (timeInSeconds === Number.MAX_SAFE_INTEGER) {
   setTimeRemaining('Maximum limit reached');
   return;
  }

  const formatTime = (count: number) => {
   const hours = Math.floor(count / 3600);
   const minutes = Math.floor((count % 3600) / 60);
   const seconds = count % 60;

   return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  // Initial formatting
  setTimeRemaining(formatTime(timeInSeconds));

  // Set up countdown timer
  const timer = setInterval(() => {
   setCountdown(prev => {
    const newCount = prev <= 1 ? 0 : prev - 1;

    // Update the displayed time whenever countdown changes
    if (newCount === 0) {
     clearInterval(timer);
     setTimeRemaining('Available now');
     refetchNextClaim();
    } else {
     setTimeRemaining(formatTime(newCount));
    }

    return newCount;
   });
  }, 1000);

  return () => clearInterval(timer);
  // eslint-disable-next-line react-hooks/exhaustive-deps
 }, [nextClaimTime, refetchNextClaim]);

 // If not connected, show connect wallet message
 if (!isConnected || !address) {
  return (
   <div className="flex flex-col items-center justify-center h-screen bg-white px-4">
    <div className="bg-gray-300 shadow-xl rounded-xl p-10 max-w-md text-center transform transition-all hover:scale-105">
     <div className="mb-6">
      <AlertCircle className="mx-auto h-16 w-16 text-indigo-600" />
     </div>
     <h2 className="text-3xl font-bold text-indigo-800 mb-4">
      Connect Your Wallet
     </h2>
     <p className="text-gray-600 mb-8 text-lg">
      To claim WBBT tokens from the faucet, please connect your wallet first.
     </p>
    </div>
   </div>
  );
 }

 return (
  <div className="bg-gradient-to-br from-indigo-50 to-blue-100 min-h-screen py-8 px-4">
   <div className="max-w-3xl mx-auto">
    {/* Header Section */}
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 bg-white p-6 rounded-xl shadow-md">
     <div>
      <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-700 to-purple-700 bg-clip-text text-transparent">
       WBBT Token Faucet
      </h1>
      <p className="text-gray-600 mt-1">Claim your daily WBBT tokens for testing</p>
     </div>

     <div className="mt-4 md:mt-0 bg-indigo-50 rounded-lg p-3 flex items-center gap-2">
      <Droplet className="text-indigo-600" size={20} />
      <div>
       <p className="text-xs text-gray-500">Your Balance</p>
       <p className="font-bold text-indigo-700">
        {formatTokenAmount(tokenBalance as bigint, Number(tokenDecimals))} {tokenSymbol}
       </p>
      </div>
     </div>
    </div>

    {/* Toast Notifications */}
    <div className="fixed top-4 right-4 z-50 flex flex-col gap-2">
     {claimSuccess && (
      <div className="bg-green-50 text-green-700 p-3 rounded-lg flex items-center shadow-md animate-fade-in-down">
       <CheckCircle className="mr-2" size={20} />
       <span>Tokens claimed successfully!</span>
      </div>
     )}

     {claimRequestSent && (
      <div className="bg-blue-50 text-blue-700 p-3 rounded-lg flex items-center shadow-md animate-fade-in-down">
       <Send className="mr-2" size={20} />
       <span>Claim request sent! Waiting for confirmation...</span>
      </div>
     )}

     {claimError && (
      <div className="bg-red-50 text-red-700 p-3 rounded-lg flex items-center shadow-md animate-fade-in-down">
       <XCircle className="mr-2" size={20} />
       <span>Error: {claimError}</span>
      </div>
     )}

     {fundingReceived && (
      <div className="bg-purple-50 text-purple-700 p-3 rounded-lg flex items-center shadow-md animate-fade-in-down">
       <Coins className="mr-2" size={20} />
       <span>Faucet funded successfully!</span>
      </div>
     )}
    </div>

    {/* Main Content */}
    <div className="bg-white rounded-xl shadow-md overflow-hidden">
     {/* Faucet Info */}
     <div className="p-6 border-b border-gray-200">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Faucet Information</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
       <div className="bg-gray-50 p-4 rounded-lg">
        <p className="text-sm text-gray-500">Daily Claim Amount</p>
        <p className="font-medium text-gray-800">
         {formatTokenAmount(dailyAmount as bigint, Number(tokenDecimals))} {tokenSymbol}
        </p>
       </div>

       <div className="bg-gray-50 p-4 rounded-lg">
        <p className="text-sm text-gray-500">Maximum Claimable</p>
        <p className="font-medium text-gray-800">
         {formatTokenAmount(maxAmount as bigint, Number(tokenDecimals))} {tokenSymbol}
        </p>
       </div>

       <div className="bg-gray-50 p-4 rounded-lg">
        <p className="text-sm text-gray-500">Remaining Claimable</p>
        <p className="font-medium text-gray-800">
         {formatTokenAmount(remainingAmount as bigint, Number(tokenDecimals))} {tokenSymbol}
        </p>
       </div>

       <div className="bg-gray-50 p-4 rounded-lg flex items-center">
        <div className="flex-grow">
         <p className="text-sm text-gray-500">Next Claim</p>
         <div className="flex items-center">
          <Clock className="text-indigo-600 mr-2" size={16} />
          <p className="font-medium text-gray-800">{timeRemaining}</p>
         </div>
        </div>
       </div>
      </div>
     </div>

     {/* Claim Section */}
     <div className="p-6">
      <div className="flex flex-col items-center">
       <button
        onClick={handleClaim}
        disabled={isLoading || Number(nextClaimTime) > 0 || Number(remainingAmount) === 0}
        className={`w-full md:w-auto px-8 py-3 rounded-lg font-medium transition-all ${isLoading || Number(nextClaimTime) > 0 || Number(remainingAmount) === 0
         ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
         : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-md hover:shadow-lg'}`}
       >
        {isLoading ? (
         <span className="flex items-center justify-center">
          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
           <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
           <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Claiming...
         </span>
        ) : Number(nextClaimTime) > 0 ? (
         'Wait for next claim period'
        ) : Number(remainingAmount) === 0 ? (
         'Maximum limit reached'
        ) : (
         'Claim Tokens'
        )}
       </button>

       <p className="mt-4 text-sm text-gray-500 text-center">
        The faucet allows you to claim {formatTokenAmount(dailyAmount as bigint, Number(tokenDecimals))} {tokenSymbol} tokens per day,
        up to a maximum of {formatTokenAmount(maxAmount as bigint, Number(tokenDecimals))} {tokenSymbol} tokens in total.
       </p>
      </div>
     </div>
    </div>
   </div>
  </div>
 );
};

export default FaucetPage;