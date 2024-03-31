const Token = artifacts.require('./Token')

// 引入chai
require('chai')
    .use(require('chai-as-promised'))
    .should()

contract('Token',(accounts)=>{
    describe('deployment',()=>{
        it('tracks the name',async ()=>{
            // 获取代币
            const token = await Token.new()
            const result = await token.name()
            result.should.equal('My Name');
            // read token name
        })
    })
})