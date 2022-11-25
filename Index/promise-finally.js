// 无论成功失败都执行
Promise.prototype.finally = (callback) => {
    return this.then((value) => {
        return Promise.resolve(callback()).then(() => value);
    }, (err) => {
        return Promise.reject(callback()).then(() => { throw err });
    })
}