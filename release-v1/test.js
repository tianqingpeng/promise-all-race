const Promise = require('./promise');

const p1 = new Promise((resolve, reject) => {
    console.log(2121)

    setTimeout(() => {
        resolve('11');
    }, 1000);
    
});

p1.then((data) => {
    console.log('success:', data)
}, (err) => {
    console.log('fail:', err)
})

p1.then((data) => {
    console.log('success:', data)
}, (err) => {
    console.log('fail:', err)
})