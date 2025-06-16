//定义执行异步任务的函数
function runAsynctask(callback) {
    if (typeof queueMicrotask === 'function') {
        queueMicrotask(callback)
    } else if (typeof MutationObserver === 'function') {
        const obs = new MutationObserver(callback)
        const node = document.createElement('div')
        obs.observe(node, { childList: true })
        node.innerText = 'async'
    } else {
        setTimeout(callback, 0);
    }
}
//抽取函数.处理异常和重复引用
function resolvePromise(p2, x, resolve, reject) {
    if (x === p2) {
        throw new TypeError('Chaning')
    }
    //处理返回Promise
    if (x instanceof MyPromise) {
        x.then(res => {
            resolve(res)
        }, err => {
            reject(err)
        })
    } else {
        resolve(x)
    }
}
const PENDING = 'pending'; // 初始状态
const FULFILLED = 'fulfilled'; // 成功状态
const REJECTED = 'rejected'; // 失败状态
class MyPromise {
    //状态
    state = PENDING
    //原因
    result = undefined
    //异步的回调函数
    #handlers = []
    constructor(executor) {
        //改变状态:pending->fulfilled
        const resolve = (result) => {
            if (this.state !== PENDING) return
            this.state = FULFILLED
            this.result = result
            this.#handlers.forEach(({ onFulfilled }) => {
                onFulfilled(this.result)
            })
        }
        //改变状态:pending->rejected
        const reject = (result) => {
            if (this.state !== PENDING) return
            this.state = REJECTED
            this.result = result
            this.#handlers.forEach(({ onRejected }) => {
                onRejected(this.result)
            })
        }

        try {
            executor(resolve, reject)
        } catch (error) {
            reject(error)
        }
    }

    //then方法
    then(onFulfilled, onRejected) {
        onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : (x) => x
        onRejected = typeof onRejected === 'function' ? onRejected : (x) => { throw x }

        //创建一个新的promise实例，用于返回
        const p2 = new MyPromise((resolve, reject) => {
            if (this.state === FULFILLED) {
                runAsynctask(() => {
                    try {
                        const x = onFulfilled(this.result)
                        resolvePromise(p2, x, resolve, reject)
                    } catch (error) {
                        reject(error)
                    }
                })
            } else if (this.state === REJECTED) {
                runAsynctask(() => {
                    try {
                        const x = onRejected(this.result)
                        resolvePromise(p2, x, resolve, reject)
                    } catch (error) {
                        reject(error)
                    }
                })
            } else if (this.state = PENDING) {
                this.#handlers.push({
                    onFulfilled: () => {
                        runAsynctask(() => {
                            try {
                                const x = onFulfilled(this.result)
                                resolvePromise(p2, x, resolve, reject)
                            } catch (error) {
                                reject(error)
                            }
                        })
                    },
                    onRejected: () => {
                        runAsynctask(() => {
                            try {
                                const x = onRejected(this.result)
                                resolvePromise(p2, x, resolve, reject)
                            } catch (error) {
                                reject(error)
                            }
                        })
                    }
                })
            }
        })
        return p2
    }
    catch(onRejected) {
        return this.then(undefined, onRejected)
    }
    finally(onFindlly) {
        return this.then(onFindlly, onFindlly)
    }

    static resolve(value) {
        //如果是promise，直接返回
        if (value instanceof MyPromise) {
            return value
        }
        //否则转为promise再返回
        return new MyPromise((resolve, reject) => {
            resolve(value)
        })
    }

    static rejected(value) {
        return MyPromise((undefined, reject) => {
            reject(value)
        })
    }
    //返回第一个执行完的promise
    static race(promise) {
        return new MyPromise((resolve, reject) => {
            //判断是否为数组
            if (!Array.isArray(promise)) {
                return reject(new TypeError('Argument must be an array'));
            }
            promise.forEach(p => {
                MyPromise.resolve(p).then(res => resolve(res), err => reject(err))
            })

        })
    }
    //如果有一个promise被拒绝，则返回该promise，否则返回全部promise
    static all(promise) {
        let results = []
        let conut = 0
        return new MyPromise((resolve, reject) => {
            if (!Array.isArray(promise)) {
                return reject(new TypeError('Argument must be an array'));
            }
            if (promise.length === 0) {
                resolve(promise)
            }

            promise.forEach((p, index) => {
                MyPromise.resolve(p).then(res => {
                    results[index] = res
                    conut++
                    if (promise.length === conut) {
                        resolve(results)
                    }
                }, err => {
                    reject(err)
                })
            })
        })
    }
    //返回全部执行完的promise
    static allSettled(promise) {
        let results = []
        let conut = 0
        return new MyPromise((resolve, reject) => {
            if (!Array.isArray(promise)) {
                return reject(new TypeError('Argument must be an array'));
            }
            if (promise.length === 0) {
                resolve(promise)
            }

            promise.forEach((p, index) => {
                MyPromise.resolve(p).then(res => {
                    results[index] = { state: FULFILLED, value: res }
                    conut++
                }, err => {
                    results[index] = { state: REJECTED, reason: err }
                    conut++
                })
                resolve(results)
            })

        })
    }

    static any(promise) {
        //将一个 Promise 可迭代对象作为输入，并返回一个 Promise。
        // 当输入的任何一个 Promise 兑现时，这个返回的 Promise 将会兑现，并返回第一个兑现的值。
        // 当所有输入 Promise 都被拒绝（包括传递了空的可迭代对象）时，
        // 它会以一个包含拒绝原因数组的 AggregateError 拒绝。
        let results = []
        let conut = 0
        return new MyPromise((resolve, reject) => {
            if (!Array.isArray(promise)) {
                return reject(new TypeError('Argument must be an array'));
            }
            if (promise.length === 0) {
                reject(new AggregateError(promise, 'All promise were rejected'))
            }
            let errors = []
            promise.forEach((p, index) => {
                MyPromise.resolve(p).then(res => {
                    resolve(res)
                }, err => {
                    errors[index] = err
                    conut++
                    conut === promise.length && reject(new AggregateError(errors, 'All promise were rejected'))
                })
            })
        })
    }
}
// const p = new MyPromise((resolve, reject) => {
//     // resolve(1)
//     // reject('error')
//     // throw 'error'
//     setTimeout(() => {
//         resolve(2)
//     }, 2000);
// })

// p.then(res => {
//     console.log('res', res);
// }).catch(err => {
//     console.log('err', err);
// }).finally(() => {
//     console.log('finally');
// })

// MyPromise.resolve(new MyPromise((resolve, rejectd) => {
//     resolve(2)
// }).then(res => {
//     console.log('res', res);
// }, err => {
//     console.log('err', err);
// }))

let p1 = new MyPromise((resolve, reject) => {
    setTimeout(() => {
        reject(1)
    }, 2000);
})
let p2 = new MyPromise((resolve, reject) => {
    setTimeout(() => {
        reject(2)
    }, 1000);
})


// MyPromise.race([p1, p2, 'hjc']).then(res => {
//     console.log(res);
// }, err => {
//     console.log(err);
// })

// MyPromise.all([p1, p2, 'hjc']).then(res => {
//     console.log('res',res);
// }, err => {
//     console.log('err',err);
// })

// MyPromise.allSettled([p1, p2, 'hjc']).then(res => {
//     console.log('res', res);
// }, err => {
//     console.log('err', err);
// })


MyPromise.any([p1, p2]).then(res => {
    console.log('res', res);
}, err => {
    console.dir(err);
})




