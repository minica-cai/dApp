// Deposit & Withdraw Funds
// Manage Orders - Make or Cancel
// Handle Trades - Charge fees

// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;
import 'openzeppelin-solidity/contracts/math/SafeMath.sol';// 引入openzeppelin-solidity安全计算
import './Token.sol';

contract Exchange {
    // 使用SafeMath进行计算
    using SafeMath for uint;
    // Variables
    address public feeAccount;
    uint256 public feePercent; // 
    address constant Ether = address(0);// 以太坊的代币是没有地址的
    mapping(address => mapping(address => uint256)) public tokens;

    constructor(address _feeAccount,uint256 _feePercent) public {
        feeAccount = _feeAccount;
        feePercent = _feePercent;
    }

    // events
    // 存款事件，token代币 ， user地址 ，amount数量，balance余额
    event Deposit(address token,address user,uint256 amount,uint256 balance);

    // payable 能够接受元数据（Ether）的函数
    function depositEther() payable public {
        tokens[Ether][msg.sender] = tokens[Ether][msg.sender].add(msg.value);
        emit Deposit(Ether,msg.sender,msg.value,tokens[Ether][msg.sender]);
    }

    function depositToken(address _token,uint256 _amount) public {
        // transferFrom 允许交易所将代币转移到自己身上 
        // 普通的存款任务不能存入Ether，那么就需要做一个条件判定
        require(_token != Ether);
        require(Token(_token).transferFrom(msg.sender, address(this), _amount));
        tokens[_token][msg.sender] = tokens[_token][msg.sender].add(_amount);
        emit Deposit(_token,msg.sender,_amount,tokens[_token][msg.sender]);
    }

    fallback()  external {
        revert();
    }

}