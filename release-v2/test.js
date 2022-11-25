const fs = require('fs');
const Promise = require('./promise');


function read(...args) {
    console.log(...args)
    return new Promise((resolve, reject) => {
        fs.readFile(...args, (err, data) => {
            if(err) {
                reject(err);
            }

            resolve(data);
        })
    })
}

// 成功的回调和失败的回调都可以返回一个结果
// 情况1: 如果返回的是一个promise，那么会让这个promise执行，并且采用它的状态，将成功或失败的结果传递给外层的下一个then中
// 情况2: 如果返回的是一个普通值会把这个值作为外层的下一个then的 成功回调中
// 情况3: 抛出一个异常
read('name.txt', 'utf8').then((data) => {
    return read(data+'1', 'utf8');
}).catch(() => {
    return 100
})
// .then((data2) => {
//     console.log(data2)
// }, err => {
//     return 100;
// })
.then(data => {
    console.log(data)
    throw new Error('error');
}).then(null, (e) => {
    console.log(e)
}).catch(e => {
    console.log('只要上面then中没有捕获异常，就会执行这个catch')
})

Promise.resolve = function (value) {
    return new Promise((resolve, reject) => {
        resolve(value);
    })
}

Promise.reject = function (value) {
    return new Promise((resolve, reject) => {
        reject(value);
    })
}
