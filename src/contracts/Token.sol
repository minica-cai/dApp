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
    mapping(address => mapping (address => uint256)) public allowance; //双重映射 allowance交易所批准的金额，转移的金额数量
    // send tokens 发送tokens


    // Events
    // 转移事件，
    event Transfer(address indexed from,address indexed to, uint256 value);
    event Approve(address indexed owner, address indexed spender, uint256 value);

    // 总的供应量 = 代币 * (10 ** decimals) 
    constructor() public {
        totalSupply = 1000000 * (10 ** decimals);
        // 余额的发送，sender就是部署智能合约的人
        balanceOf[msg.sender] = totalSupply;
    }

    // 转移函数
    function transfer (address _to, uint256 _value) public returns(bool success) {
        require(balanceOf[msg.sender] >= _value); // 判断是否有足够的余额进行转移
        _transfer(msg.sender , _to , _value);
        return true;
    }

    //_开头的内部函数 internal 关键字为内部函数的关键字，
    function _transfer(address _from,address _to, uint256 _value ) internal {
        // solidity 中require(true)向下执行代码，require(false)停止执行
        require(_to != address(0));
        // 转移者的余额 = 余额 - _value
        // 接受者的余额 = 余额 + _value
        balanceOf[_from] = balanceOf[_from].sub(_value);
        balanceOf[_to] = balanceOf[_to].add(_value);
         // 触发订阅的事件
        emit Transfer(_from, _to, _value);
    }

    // 批准函数
    function approve(address _spender, uint256 _value) public returns (bool success){
        require(_spender != address(0)); // 无效地址
        allowance[msg.sender][_spender] = _value;
        emit Approve(msg.sender, _spender, _value);
        return true;
    }

    // `transfer` 用于直接的地址间转移，
    // 而 `transferFrom` 用于授权操作者代表拥有者进行转移。在调用 `transferFrom` 之前，通常需要拥有者通过调用 `approve` 函数提前授权。
    function transferFrom(address _from, address _to, uint256 _value) public returns(bool success){
        // 添加函数限制条件
        require(_value <= balanceOf[_from]); // 批准的数量 <= 来源者的资金
        require(_value <= allowance[_from][msg.sender]); // 批准的数量 <= 交易所的余额
        // 余额 = 余额 - _value
        allowance[_from][msg.sender] =  allowance[_from][msg.sender].sub(_value);
        _transfer(_from , _to , _value);
        return true;
    }
}