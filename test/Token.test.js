import { tokens } from '../src/utils/help';
const Token = artifacts.require('./Token')

// 引入chai
require('chai')
    .use(require('chai-as-promised'))
    .should()

contract('Token',([deployer,receiver])=>{
    // 声明相关的使用的变量
    let token;
    const name = 'DApp mi' ;// 代码注意规范化
    const symbol = 'DApp';
    const decimals = '18';
    // 这里为什么用字符串而不是数字的原因：如果是数字的话，数据太大js不好验证
    const totalSupply = tokens(1000000).toString();

    beforeEach(async ()=>{
        // 获取代币
        token = await Token.new()
    })
    describe('deployment', ()=>{
        it('tracks the name',async ()=>{
            const result = await token.name()
            result.should.equal(name);
            // read token name
        })

        it('tracks the symbol',async ()=>{
            const result = await token.symbol()
            result.should.equal(symbol)
        })

        it('tracks the decimals',async ()=>{
            const result = await token.decimals()
            result.toString().should.equal(decimals)
        })

        it('tracks the total supply',async ()=>{
            const result = await token.totalSupply()
            result.toString().should.equal(totalSupply.toString())
        })

        // 验证代币是否发送给了部署智能合约的人
        it('assigns the total supply to the deployer',async ()=>{
            const result = await token.balanceOf(deployer)
            result.toString().should.equal(totalSupply.toString())
        })

    })

    // 发送代币的单元测试
    describe('sending tokens',()=>{
        let result;
        let amount;
        beforeEach(async ()=>{
            amount = tokens(100)
            // 等待执行转移函数
            result = await token.transfer(receiver,amount,{from : deployer})
        })

        // 发送代币需要注意验证的点，转移前分别的余额，执行转移，转移后分别的余额
        it('transfer token balances',async ()=>{
            let balanceOf;
            // 转移之后
            balanceOf = await token.balanceOf(deployer)
            balanceOf.toString().should.equal(tokens(999900).toString()) // 发送着的余额
            balanceOf = await token.balanceOf(receiver) // 接受者的余额
            balanceOf.toString().should.equal(tokens(100).toString())

        })

        // 触发转移事件的单元测试
        it('emits a transfer event',async ()=>{
            const log = result.logs[0]
            log.event.toString().should.eq('Transfer')
            const event = log.args
            event.from.toString().should.equal(deployer,'from is correct')
            event.to.toString().should.equal(receiver,'to is correct')
            event.value.toString().should.equal(amount.toString(),'value is correct')
        })
    })
})