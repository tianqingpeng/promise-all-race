/*
 * @Autor: qp.tian
 * @Date: 2021-01-04 13:59:30
 * @LastEditors: qp.tian
 * @LastEditTime: 2021-01-04 14:05:30
 * @Description: 
 * @FilePath: /promise-all-race/Index/promise-all.js
 */

function Index() {
    
}
Index.all = argArr => {
    return new Promise((resolve, reject) => {
        
        let index = 0;
        let resArr = [];
        const processFn = (value, idx) => {
            console.log(value, idx)
            resArr[idx] = value;
            if(++index === argArr.length) {
                resolve(resArr);
            }
        }

        for(let i = 0; i < argArr.length; i++) {
            const value = argArr[i];

            if(value && typeof value.then === 'function') {
                value.then(val => {
                    processFn(val, i);
                }, reject)
            } else {
                processFn(value, i);
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

Index.all([p1, p2, p3].map(p => p.catch(err => err)))
    .then(res => {
        console.log(res)
    }).catch(err => {
        console.log(err)
    })