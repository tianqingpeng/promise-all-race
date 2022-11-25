const STATUSENUM = {
    PENDING: 'PENDING',  // 等待状态
    FULFILLED: 'FULFILLED', // 成功状态
    REJECTED: 'REJECTED' // 失败状态
}

const resolvePromise = (promise2, x, resolve, reject) => {
    let then;
    let thenCalledOrThrow = false;
  
    if (promise2 === x) {
      return reject(new TypeError('Chaining cycle detected for promise!'));
    }
  
    if (x !== null && (typeof x === 'object' || typeof x === 'function')) {
      try {
        then = x.then; //because x.then could be a getter
        if (typeof then === 'function') {
          then.call(
            x,
            function rs(y) {
              if (thenCalledOrThrow) return;
              thenCalledOrThrow = true;
              return resolvePromise(promise2, y, resolve, reject);
            },
            function rj(r) {
              if (thenCalledOrThrow) return;
              thenCalledOrThrow = true;
              return reject(r);
            }
          );
        } else {
          resolve(x);
        }
      } catch (e) {
        if (thenCalledOrThrow) return;
        thenCalledOrThrow = true;
        return reject(e);
      }
    } else {
      resolve(x);
    }
  }

class Promise {
    static resolve (value) {
        return new Promise((rel, reject) => {
            rel(value);
        })
    }
    static reject (value) {
        return new Promise((resolve, rej) => {
            rej(value);
        })
    }
    constructor(executor) {
        this.status = STATUSENUM.PENDING;
        this.value = undefined; // 成功的值 
        this.reason = undefined; // 失败的原因

        this.onResolvedCallback = []; // 成功时的回调列表
        this.onRejectedCallback = []; // 失败时的回调列表

        const reject = (err) => {
            if(this.status === STATUSENUM.PENDING) {
                this.status = STATUSENUM.REJECTED
                this.reason = err;
                this.onRejectedCallback.forEach(fn => fn()); // 发布过程
            }

        };

        // 保证每个实例都有自己的成功或失败回调
        const resolve = (val) => {
            if(val instanceof Promise) {
                return val.then(resolve, reject);
            }
            if(this.status === STATUSENUM.PENDING) {
                this.status = STATUSENUM.FULFILLED;
                this.value = val;
                this.onResolvedCallback.forEach(fn => fn());  // 发布过程
            }
        };
    
        // 只能捕获同步异常
        try {
            // 用户传入的成功或失败回调
            executor(resolve, reject);
        } catch (error) {
            // 抓取异常
            reject(error);
        }

        
    }
    // 成功的回调和失败的回调都可以返回一个结果
    // 情况1: x是一个promise，那么会让这个promise执行，并且采用它的状态，将成功或失败的结果传递给外层的下一个then中
    // 情况2: x是一个普通值会把这个值作为外层的下一个then的 成功回调中
    // 情况3: 抛出一个异常
    then(onResolved, onRejected) {
        // 可选参数处理, 解决参数穿透
        onResolved = typeof onResolved === 'function' ? onResolved: val => val;
        onRejected = typeof onRejected === 'function' ? onRejected: val => {throw err};

        const promise2 = new Promise((resolve, reject) => {
            if(this.status === STATUSENUM.FULFILLED) {
                // 定时器是为了能拿到promise2实例
                setTimeout(() => {
                    try {
                        const x = onResolved(this.value);
                        resolvePromise(promise2, x, resolve, reject);
                    } catch (error) {
                        reject(error);
                    }
                }, 0);
            }
    
            if(this.status === STATUSENUM.REJECTED) {
                setTimeout(() => {
                    try {
                        const x = onRejected(this.reason);
                        resolvePromise(promise2, x, resolve, reject);
                    } catch (error) {
                        reject(error);
                    }
                }, 0);
            }
    
            // 订阅多个实例的成功或失败回调（同一个promise实例可以then多次）
            if(this.status === STATUSENUM.PENDING) {
                this.onResolvedCallback.push(() => {
                    setTimeout(() => {
                        try {
                            const x = onResolved(this.value);
                            resolvePromise(promise2, x, resolve, reject);
                        } catch (error) {
                            reject(error);
                        }
                    }, 0);
                });
                this.onRejectedCallback.push(() => {
                    setTimeout(() => {
                        try {
                            const x = onRejected(this.reason);
                            resolvePromise(promise2, x, resolve, reject);
                        } catch (error) {
                            reject(error);
                        }
                    }, 0);
                });
            }    
        });

        return promise2;
    }
    catch(errCallback) {
        return this.then(null, errCallback)
    }
}


module.exports = Promise;