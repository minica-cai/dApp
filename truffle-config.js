require('babel-register')
require('babel-polyfill')
require('dotenv').config()


module.exports = {
  networks: {
    // 配置本地的区块链开发，用的gonache工具
    development:{
      host:'127.0.0.1',
      port:'7545',
      network_id:'*'
    }
  },

  // 声明合约的地址存放的目录
  contracts_directory:'./src/contracts/',
  contracts_build_directory:'./src/abis/',

  // Configure your compilers
  compilers: {
    // 将.sol的源码文件编译成以太坊虚拟机上可以执行的字节码
    solc: {
      version: "0.6.1",      // Fetch exact version from solc-bin (default: truffle's version)
      // docker: true,        // Use "0.5.1" you've installed locally with docker (default: false)
      // settings: {          // See the solidity docs for advice about optimization and evmVersion
       optimizer: {
         enabled: false,
         runs: 200
       },
      //  evmVersion: "byzantium"
      // }
    }
  },

  // Truffle DB is currently disabled by default; to enable it, change enabled:
  // false to enabled: true. The default storage location can also be
  // overridden by specifying the adapter settings, as shown in the commented code below.
  //
  // NOTE: It is not possible to migrate your contracts to truffle DB and you should
  // make a backup of your artifacts to a safe location before enabling this feature.
  //
  // After you backed up your artifacts you can utilize db by running migrate as follows:
  // $ truffle migrate --reset --compile-all
  //
  // db: {
  //   enabled: false,
  //   host: "127.0.0.1",
  //   adapter: {
  //     name: "indexeddb",
  //     settings: {
  //       directory: ".db"
  //     }
  //   }
  // }
};
