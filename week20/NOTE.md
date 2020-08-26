# 每周总结可以写在这里

## Headless Browser

> 命令式操作的没有图形界面的浏览器

### 意义

* 测试
  * 站点测试
    * 网站兼容性
    * 页面性能测试
    * 网站代码测试用例执行环境
      * 模拟交互测试
  * JS库测试
* 爬虫

### 常见的三款无头浏览器

||Phantomjs|selenium-webdriver|Puppeteer|
|--|--|--|--|
|author|phantomjs Contributors|Selenium support|google|
|created|Sep 11, 2012|Jan 15, 2013|May 10, 2017|
|updated|Jul 24, 2019|Aug 26, 2020|Aug 25, 2020|
|git star|1,408|18,481|64,330|
|issue|174|383|1200|
|version|v2.1.1|selenium-4.0.0-alpha|v5.2.1|
|JavaScript Support|ES5|ES6|ES6|

[A list of (almost) all headless web browsers in existence](https://github.com/dhamaniasad/HeadlessBrowsers)


## 白名单鉴权发布工具

### 加入鉴权流程

借助 GitHub API 创建应用 并 返回用户信息 实现 白名单鉴权流程

流程调整 （__+__ 为新增流程）

* __+__ 获取当前发布工具使用客户端对应的用户code

* __+__ 发送 发布请求 至 服务端

* __+__ 服务端 根据 请求中的 用户 code 获取token 并通知客户端服务 执行 上传发布动作

* 客户端打包压缩待发布内容

* 客户端 __+__ 「__携带服务端回调信息中的access_token__」 通过 http 传输压缩包至 服务端

* __+__ 服务端携带 access_token 从 Git Hub API 中 确认 客户端 是否为 白名单中的用户

  * Y: 服务端解压压缩包
  * __+__ N: 权限校验失败, 终止解压

* 权限完成，接口请求返回

* __+__ 客户端 接受返回内容 并 关闭当前 服务

### 发布工具实现结果

* 当 client_secret 不存在于 GitHub APPS 中时
  在 access_token 会返回失败
* 当 client_secret 存在于 GitHub APPS 中时
  发布成功

### 发布工具实现过程中遇到的问题

* res.send 不能在 request 的 end 事件中执行，需要调整到流式处理 的 end 事件中去

* NodeJS 请求 https://api.github.com/user 时，除了在header中 要携带 AuthToken 之外，还需要user-agent参数，才能正常请求

### 对当前鉴权流程的思考

客户端携带 access_token 上传的流程是否可以再拆分为两步 ？
  * 单独用access_token先进行鉴权请求
  * 当鉴权请求通过后，再执行上传

这样做的好处

* 当鉴权前，客户端不应具有上传文件流的能力
* 加快服务端获取 access_token 的效率
* 有效利用服务器带宽
