// Deposit & Withdraw Funds
// Manage Orders - Make or Cancel
// Handle Trades - Charge fees

// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

contract Exchange {
    // Variables
    address public feeAccount;
    uint256 public feePercent; // 

    constructor(address _feeAccount,uint256 _feePercent) public {
        feeAccount = _feeAccount;
        feePercent = _feePercent;
    }
}