import { tokens,ether,EVM_REVERT,ETHER_ADDRESS } from '../src/utils/help';


const Token = artifacts.require('./Token')
const Exchange = artifacts.require('./Exchange')

// 引入chai
require('chai')
    .use(require('chai-as-promised'))
    .should()

contract('Exchange',([deployer,feeAccount,user1])=>{
    let exchange,token;
    const feePercent = 10;

    beforeEach(async () => {
        // Deploy token谁部署谁拥有代币
        token = await Token.new()
        // transfer some token to user1
        token.transfer(user1,tokens(100),{ from: deployer})
        // Deploy exchange
        exchange = await Exchange.new(feeAccount, feePercent)
        
    })

    describe('deployment', () => {
        it('tracks the fee account', async () => {
            const result = await exchange.feeAccount()
            result.should.equal(feeAccount);
        });
        it('tracks the fee percent', async () => {
            const result = await exchange.feePercent()
            result.toString().should.equal(feePercent.toString());
        });
    });

    //撤销发送事件
    describe('fallback', () => {
        it('reverts when Ether is sent', async() => {
            await exchange.sendTransaction({value:1,from:user1}).should.be.rejectedWith(EVM_REVERT)
        });
    });

    describe('depositing Ether', () => {
        let result;
        let amount;
        beforeEach(async () =>{
            amount =  ether(1)
            result = await exchange.depositEther({ from: user1 , value: amount})
        })
        // 追踪转账
        it('tracks the Ether deposit', async () => {
            let balance;
            balance = await exchange.tokens(ETHER_ADDRESS,user1)
            balance.toString().should.equal(amount.toString())
        });

        // 触发转账事件的单元测试
        it('emits a Deposit event',async ()=>{
            const log = result.logs[0]
            log.event.toString().should.eq('Deposit')
            const event = log.args
            event.token.toString().should.equal(ETHER_ADDRESS,'token address is correct')
            event.user.toString().should.equal(user1,'user address is correct')
            event.amount.toString().should.equal(amount.toString(),'amount is correct')
            event.balance.toString().should.equal(amount.toString(),'balance is correct')
        }) 
        
    });

    describe('depositing tokens',()=>{
        let result;
        let amount;

        describe('success', () => {
            // 需要先进行代币的批准
            beforeEach(async () => {
                amount = tokens(10)
                await token.approve(exchange.address,amount,{ from : user1 })
                result = await exchange.depositToken(token.address,amount,{ from : user1 })
            })
            it('tracks the token deposit', async () => {
                // check exchange token balance
                let balance;
                balance = await token.balanceOf(exchange.address)
                balance.toString().should.equal(amount.toString())
                // check tokens on exchange
                balance = await exchange.tokens(token.address, user1)
                balance.toString().should.equal(amount.toString())
            });
            // 触发转账事件的单元测试
            it('emits a Deposit event',async ()=>{
                const log = result.logs[0]
                log.event.toString().should.eq('Deposit')
                const event = log.args
                event.token.toString().should.equal(token.address,'token address is correct')
                event.user.toString().should.equal(user1,'user address is correct')
                event.amount.toString().should.equal(amount.toString(),'amount is correct')
                event.balance.toString().should.equal(amount.toString(),'balance is correct')
            }) 
        });
        describe('failure', () => {
            //拒绝存入Ether
            it('rejects Ether deposit', async () => {
                await exchange.depositToken(ETHER_ADDRESS,amount,{ from : user1 }).should.be.rejectedWith(EVM_REVERT)
            });

            //  如果并没有任何代币被批准，那么交易所的转账就是失败的
            it('fails there on tokens arr approved', async () => {
                await exchange.depositToken(token.address,amount,{ from : user1 }).should.be.rejectedWith(EVM_REVERT)
            });
        });
    })


})
