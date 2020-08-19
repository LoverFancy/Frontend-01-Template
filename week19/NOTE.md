# 每周总结可以写在这里

## 工具链

### 工具链的需求

base

* 快速init一个项目模板

improve

* 支持工程名的自定义（可选）

* 支持项目依赖版本的自定义（可选）

* 项目工程借助 npm or yarn 实现 package.json的生成（可选）

### 实现工具链Base需求的方案

* 借助 yeoman 实现自举调用

* 定义 自举流程 与 流程细节

* 软连接至系统环境

### 实现工具链Base需求

方案:

* 全局 安装 yo-generator

* 创建 工具链项目 并 实现基于 generator 的流程

  * 拷贝package.json

  * 拷贝自定义lib

  * 拷贝入口文件

  * 拷贝入口index.html

  * 拷贝webpack配置文件

  * 拷贝babel配置文件

  * 拷贝测试工具配置文件

  * 拷贝测试代码

  * 安装指定依赖

  * 借助 unzipper 实现流内容的压缩

* yarn link or npm link

### 工具链实现结果

* 创建一个空的工程目录

* yo toy-tool-chain

* 生成包含方案中指定文件的工程

* 执行命令
  * yarn start
    * 项目启动成功
  * yarn build
    * 项目构建成功无报错
  * yarn test
    * 测试demo执行通过

### 工具链实现过程中遇到的问题

* 暂无
---


## 发布工具

### 发布工具的需求

base

* 将本地内容同步至线上环境(同步)

improve

* 判断当前发布工具的使用者是否有权限执行发布(鉴权)

* 支持多个发布任务同时进行(并发发布)

### 实现发布工具Base需求的方案

* 客户端打包压缩待发布内容

* 客户端通过 http 传输压缩包至 服务端

* 服务端解压压缩包

* 服务端将解压内容存储至指定位置

### 实现发布工具Base需求

客户端上传工具搭建

方案:

* NodeJS(需要自己实现路由功能)
  * 借助 http 模块的 request 方法, 创建一个上传工具

  * 借助 unzipper 实现流内容的压缩

服务端文件服务应用搭建

服务端代码

* [publish-tool(NodeJS)](./publish/publish-tool/index.js)

方案:

* Express
  * 借助express-generator生成一个不带template engine的基础项目

  * 建立上传文件的接收路由

  * 借助unzipper实现流内容的解压与存储移动

* NodeJS(需要自己实现旅游功能)
  * 借助 http 模块的 createServer 方法, 创建一个基础服务

  * 借助unzipper实现流内容的解压与存储移动

服务端代码

* [publish-server(NodeJS)](./publish/publish-server/index.js)

* [publish-server(Express)](./publish/publish-server/app.js)

### 发布工具实现结果

* 在 server 服务的 public 中 成功被压缩上传前的内容

### 发布工具实现过程中遇到的问题

* express-generator 生成的 基础项目 中的 index.html 会导致 path 为 ___"/"___ 的 router 无法正常工作（即访问 服务器根目录时 会自动定向到 inedx.html 这个 homePage）

* 需要屏蔽 express.json, 因为 这个中间件 会无差别的将请求内容转化为JSON, 会导致 无法正常的使用 otec/stream

* NodeJS version 14.x 中无法使用 unzip,需要升级 至 unzipper

