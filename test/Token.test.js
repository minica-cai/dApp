import { tokens,EVM_REVERT } from '../src/utils/help';
const Token = artifacts.require('./Token')

// 引入chai
require('chai')
    .use(require('chai-as-promised'))
    .should()

// 测试文件的描述需要进行合理的嵌套，方便阅读信息
contract('Token',([deployer,receiver,exchange])=>{
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

        // 转移成功的单元测试
        describe('sucess', async () => {
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
        });

        // 转移失败的单元测试
        describe('failure',async ()=>{
            // 当余额不足
            it('rejects insufficient balances',async ()=> {
                let invalidAmount;
                //当转移的数量 > 代币总量的时候 --- 结果是要被拒绝
                invalidAmount = tokens(10000000)
                await token.transfer(receiver,invalidAmount,{from : deployer}).should.be.rejectedWith(EVM_REVERT)

                // 如果接收者没有任何代币也是需要被拒绝的
                invalidAmount = tokens(10)
                await token.transfer(deployer,invalidAmount,{from : receiver}).should.be.rejectedWith(EVM_REVERT)

            })
            // 当地址错误
            it('rejects invalid recipients',async ()=>{
                //  认为最后一个地址是0x0
                await token.transfer(0x0, amount, {from : deployer}).should.be.rejected;
            })
        })
    })

    //允许别人使用token
    describe('approving tokens',async ()=> {
        let result;
        let amount;

        beforeEach(async ()=>{
            amount = tokens(100)
            result = await token.approve(exchange, amount, { from : deployer})
        })

        // 成功
        describe('sucess', async () => {
            // 余额验证
            it('allocates an allowance for delegated token spending on exchange', async ()=> {
                const allowance = await token.allowance(deployer,exchange)
                allowance.toString().should.equal(amount.toString())
            })
            // 事件触发 
            it('emits a Approve event', async () => {
                const log = result.logs[0]
                log.event.toString().should.be.eq('Approve') // 验证事件名
                // 验证提供者，消费者，批准数量
                const event = log.args
                event.owner.toString().should.equal(deployer,'owner is correct')
                event.spender.toString().should.equal(exchange,'spender is correct')
                event.value.toString().should.equal(amount.toString(),'value is correct')
            });

        });
        describe('failure',async () => {
            it('rejects invalid recipients', async () => {
                //  认为最后一个地址是0x0
                await token.transfer(0x0, amount, {from : deployer}).should.be.rejected;
            });
        });
    })

    // 发送代币的单元测试
    describe('delegated token transfers',()=>{
        let result;
        let amount;

        beforeEach(async ()=>{
            amount = tokens(100)
            // 等待执行批准,也就是在代币转移之前，是需要先从发布者那里批准代币到交易所
            await token.approve(exchange, amount, { from : deployer})

        })

        // 转移成功的单元测试
        describe('sucess', async () => {
            beforeEach(async ()=>{
                // 等待执行转移函数
                result = await token.transferFrom(deployer , receiver , amount ,{from : exchange})
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
            // 验证余额
            it('resets the allowance', async ()=> {
                const allowance = await token.allowance(deployer,exchange)
                allowance.toString().should.equal('0')
            })
            // 触发转移事件的单元测试
            it('emits a Transfer event',async ()=>{
                const log = result.logs[0]
                log.event.toString().should.eq('Transfer')
                const event = log.args
                event.from.toString().should.equal(deployer,'from is correct')
                event.to.toString().should.equal(receiver,'to is correct')
                event.value.toString().should.equal(amount.toString(),'value is correct')
            })            
        });

        // 转移失败的单元测试
        describe('failure',async ()=>{
            // 试图转移的代币数量超过批准的数量
            it('rejects insufficient amount',async ()=> {
                let invalidAmount;
                //当转移的数量 > 代币总量的时候 --- 结果是要被拒绝
                invalidAmount = tokens(10000000)
                await token.transferFrom(deployer ,receiver, invalidAmount, {from : deployer}).should.be.rejectedWith(EVM_REVERT)
            })

            // 当地址错误，也就是无效的接受者
            it('rejects invalid recipients',async ()=>{
                //  认为最后一个地址是0x0
                await token.transferFrom(deployer ,0x0, amount, {from : deployer}).should.be.rejected;
            })
        })
    })
})