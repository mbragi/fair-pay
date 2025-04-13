// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "forge-std/Script.sol";
import "../src/FairPay.sol";

contract DeployFairPay is Script {
    function run() external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        
        vm.startBroadcast(deployerPrivateKey);
        
        FairPay fairPay = new FairPay();
        
        console.log("FairPay deployed at:", address(fairPay));
        
        vm.stopBroadcast();
    }
}