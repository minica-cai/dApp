const Token = artifacts.require('./Token')

// 引入chai
require('chai')
    .use(require('chai-as-promised'))
    .should()

contract('Token',([deployer,sender,receiver])=>{
    // 声明相关的使用的变量
    let token;
    const name = 'DApp mi' ;// 代码注意规范化
    const symbol = 'DApp';
    const decimals = '18';
    // 这里为什么用字符串而不是数字的原因：如果是数字的话，数据太大js不好验证
    const totalSupply = '1000000000000000000000000';

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
            result.toString().should.equal(totalSupply)
        })

        // 验证代币是否发送给了部署智能合约的人
        it('assigns the total supply to the deployer',async ()=>{
            const result = await token.balanceOf(deployer)
            result.toString().should.equal(totalSupply)
        })

    })
})