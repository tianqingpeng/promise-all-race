const STATUSENUM = {
    PENDING: 'PENDING',  // 等待状态
    FULFILLED: 'FULFILLED', // 成功状态
    REJECTED: 'REJECTED' // 失败状态
}

class Promise {
    constructor(executor) {
        this.status = STATUSENUM.PENDING;
        this.value = undefined; // 成功的值 
        this.reason = undefined; // 失败的原因

        this.onResolvedCallback = []; // 成功时的回调列表
        this.onRejectedCallback = []; // 失败时的回调列表

        // 保证每个实例都有自己的成功或失败回调
        const resolve = (val) => {
            if(this.status === STATUSENUM.PENDING) {
                this.status = STATUSENUM.FULFILLED;
                this.value = val;
                this.onResolvedCallback.forEach(fn => fn());  // 发布过程
            }
        };
        const reject = (err) => {
            if(this.status === STATUSENUM.PENDING) {
                this.status = STATUSENUM.REJECTED
                this.reason = err;
                this.onRejectedCallback.forEach(fn => fn()); // 发布过程
            }

        };

        try {
            // 用户传入的成功或失败回调
            executor(resolve, reject);
        } catch (error) {
            // 抓取异常
            reject(error);
        }

        
    }
    then(onResolved, onRejected) {
        if(this.status === STATUSENUM.FULFILLED) {
            onResolved(this.value);
        }

        if(this.status === STATUSENUM.REJECTED) {
            onRejected(this.reason);
        }

        // 订阅多个实例的成功或失败回调（同一个promise实例可以then多次）
        if(this.status === STATUSENUM.PENDING) {
            this.onResolvedCallback.push(() => {
                onResolved(this.value);
            });
            this.onRejectedCallback.push(() => {
                onRejected(this.reason);
            });
        }
    }
}


module.exports = Promise;