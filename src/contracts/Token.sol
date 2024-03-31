// SPDX-License-Identifier: MIT 
pragma solidity >=0.4.22 <0.9.0;
import 'openzeppelin-solidity/contracts/math/SafeMath.sol';// 引入openzeppelin-solidity安全计算

// 目的：存储信息和实现行为
contract Token {
    // 使用SafeMath进行计算
    using SafeMath for uint;

    //public 关键字solidity会通过public关键字生成一个与之一样的函数
    // Variables
    string public name = 'DApp mi';
    string public symbol = 'DApp';
    uint256 public decimals = 18; //以太坊的小数位可以被18位
    uint256 public totalSupply;

    // track balances 获取余额
    // mapping 映射关联键值对 address账户地址 uint256余额单位，1字节等于8个比特，而32指的就是32个字节，即8*32=256比特
    mapping(address => uint256) public balanceOf; 
    // send tokens 发送tokens


    // Events
    // 转移事件，
    event Transfer(address indexed from,address indexed to,uint256 value);

    // 总的供应量 = 代币 * (10 ** decimals) 
    constructor() public {
        totalSupply = 1000000 * (10 ** decimals);
        // 余额的发送，sender就是部署智能合约的人
        balanceOf[msg.sender] = totalSupply;
    }

    // 转移函数
    function transfer (address _to, uint256 _value) public returns(bool sucess) {
        // 转移者的余额 = 余额 - _value
        // 接受者的余额 = 余额 + _value
        balanceOf[msg.sender] = balanceOf[msg.sender].sub(_value);
        balanceOf[_to] = balanceOf[_to].add(_value);

        // 触发订阅的事件
        emit Transfer(msg.sender, _to, _value);

        return true;
    }
}