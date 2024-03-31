// SPDX-License-Identifier: MIT 
pragma solidity >=0.4.22 <0.9.0;
contract Token {
    string public name = 'DApp mi';
    string public symbol = 'DApp';
    uint256 public decimals = 18; //以太坊的小数位可以被18位
    uint256 public totalSupply;

    // 总的供应量 = 代币 * decimals
    constructor() public {
        totalSupply = 1000000 * (10 ** decimals) ;
    }
}