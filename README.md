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
