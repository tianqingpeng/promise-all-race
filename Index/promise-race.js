/*
 * @Autor: qp.tian
 * @Date: 2021-01-04 14:04:19
 * @LastEditors: qp.tian
 * @LastEditTime: 2021-01-04 14:05:40
 * @Description: 
 * @FilePath: /promise-all-race/Index/promise-race.js
 */

function Index() {
    
}
Index.race = argArr => {
    return new Promise((resolve, reject) => {
        for(let i = 0; i < argArr.length; i++) {
            const value = argArr[i];

            if(value && typeof value.then === 'function') {
                value.then(val => {
                    resolve(val);
                }, reject)
            } else {
                resolve(value);
            }
        }
    })
}

const p1 = new Promise((resolve, reject) => {
    setTimeout(() => {
        resolve('ok p1');
    }, 0);
})

const p2 = new Promise((resolve, reject) => {
    reject('err p2')
    resolve('ok p2');
})

const p3 = new Promise((resolve, reject) => {
    resolve('ok p3');
})


Index.race([p1, p2, p3]).then(res => {
    console.log(res)
}).catch(err => {
    console.log(err)
})