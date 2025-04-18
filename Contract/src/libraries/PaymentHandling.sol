// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

library PaymentHandling {
    using SafeERC20 for IERC20;

    function safeTransfer(
        address _token,
        address payable _to,
        uint256 _amount
    ) internal {
        if (_token == address(0)) {
            (bool success, ) = _to.call{value: _amount}("");
            require(success, "ETH transfer failed");
        } else {
            IERC20(_token).safeTransfer(_to, _amount);
        }
    }

    function calculatePlatformFee(
        uint256 _amount,
        uint256 _platformFee
    ) internal pure returns (uint256 fee, uint256 remaining) {
        fee = (_amount * _platformFee) / 10000;
        remaining = _amount - fee;
    }
}