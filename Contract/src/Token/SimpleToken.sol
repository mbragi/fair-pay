// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

/**
 * @title SimpleERC20
 * @dev A simple ERC20 token implementation for testing purposes
 */

contract SimpleERC20 is ERC20 {
    constructor(string memory name, string memory symbol, uint256 initialSupply) 
        ERC20(name, symbol) {
        _mint(msg.sender, initialSupply);
    }
    
    function mint(address to, uint256 amount) public {
        _mint(to, amount);
    }
}