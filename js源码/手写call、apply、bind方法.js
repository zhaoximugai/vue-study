Function.prototype.myCall = function (thisArg, ...args) {
    //thusArg 传入的设置为this的对象
    //this 原函数(原函数.myCall)
    //使用Symbol生成一个唯一的临时函数，防止thisArg对象本身可能存在的函数
    const fnKey = Symbol('fn');
    thisArg[fnKey] = this;  // 将原函数（func）赋值给 thisArg.f
    const res = thisArg[fnKey](...args);        // 调用 thisArg.f()，等同于调用 func()，但 this 指向 thisArg
    delete thisArg[fnKey];   // 删除临时属性
    return res
}
Function.prototype.myApply = function (thisArg, array) {
    const args = array || [];// 默认空数组
    //thusArg 传入的设置为this的对象
    //this 原函数(原函数.myCall)
    //使用Symbol生成一个唯一的临时函数，防止thisArg对象本身可能存在的函数
    const fnKey = Symbol('fn');
    thisArg[fnKey] = this;  // 将原函数（func）赋值给 thisArg.f
    const res = thisArg[fnKey](...args);        // 调用 thisArg.f()，等同于调用 func()，但 this 指向 thisArg
    delete thisArg[fnKey];   // 删除临时属性
    return res
}

Function.prototype.myBind = function (thisArg, ...args) {

    //this：原函数(原函数.myBind)
    return (...resArgs) => this.myCall(thisArg, ...args, ...resArgs)
}

let person = { name: 'hjc' }

function func(a, b, c, d) {
    console.log(this.name);
    return a + b + c + d
}
// func()
let bindFn = func.myBind(person, 1, 2)
let res = bindFn(3, 4)
console.log(res);

