## promise-all-race

```
 解决异步问题
1) 多个异步请求并发（希望同步最终的结果） Promise.all()
2) 链式异步请求问题 上一个的输出是下一个的输入
3) 回调嵌套

Promise 是一个类  需要new 这个类型，也有些静态方法 promise.all、promise.race、promise.resolve、promise.reject
1.executor 执行器 默认会立即执行
2.默认promise的状态是等待态  （三个状态 等待 成功  失败）
3.当调用resolve 时 会变成成功态 调用reject 会变成失败态
4.返回的实例上有一个then方法,then中需要提供两个参数 ，分别是成功对应的函数和失败对应的函数
5.如果同时调用成功和失败 默认会采取第一次调用的结果
6.抛出异常就走失败逻辑
7.成功时可以传入成功的值，失败时可以传入失败的原因

Promise链式调用 (上一次的输出是下一次的输入)
then 的使用方式  普通值意味着不是promise
1.then中的回调有两个方法 成功或者失败，他们的返回结果 （普通值） 会传递给外层的下一个then中
2.可以在成功和失败中抛出异常 , 会走到下一次then的失败中 
3.返回的是一个promise ，那么会用这个promise的状态来作为结果 ,会用promise的结果向下传递
4.错误处理 是默认先找离自己最近的错误处理，找不到向下查找，找到后就执行

Promise.finally()
1. 无论如何都会执行(没有参数)
2、如果返回一个promise会等待这个promise也执行完毕，（如果是失败的promise，会用他失败原因传给下一个）


es2020新特性  promise.settleAll 可了解
```
