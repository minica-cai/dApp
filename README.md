## dApp --- 学习

##### 项目相关工具介绍
1. truffle : 部署工具
2. gonache : 本地开发调试工具


##### 文件目录解释
1. migrations : 迁移目录（此处迁移意味状态更改）
2. src/abis : 源码编译后的json文件（需在truffle-config.js中配置build文件目录）
3. src/contracts : 源码文件 （需在truffle-config.js中配置）

##### 项目初始化
1. 通过create-react-app脚手架创建一个react项目
2. 所需要的依赖安装，配置见package.json
3. 配置基础配置
4. 编写sol文件，通过命令truffle compile执行编译
5. 通过命令truffle migrate执行连接测试(如果遇到部署失败，方式修正solidity的版本和solc的配置版本为兼容版本)
6. truffle console 打开truffle的控制台输入(数据的获取都是异步的，所以需要等待数据的回来)

##### 单元测试
1. mocha(https://mochajs.org/)
2. chai(https://www.chaijs.com/)
3. 编写单元测试用例，并进行用例测试truffle test(注意所有的数据获取都是异步函数，所以需要await等待结果)
