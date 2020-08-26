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

||Phantomjs|Selenium|Puppeteer|
|--|--|--|--|
|作者|phantomjs Contributors|Selenium support|google|
|更新、维护状态|暂停更新、维护|更新、维护中|更新、维护中|
|版本状态|v2.1.1|selenium-4.0.0-alpha|v5.2.1|
|JavaScript标准|ES5|ES6|ES6|

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

* NodeJS 请求 https://api.github.com/user 时，除了在header中 要携带 AuthToken 之外，还需要user-agent 参数，才能正常请求