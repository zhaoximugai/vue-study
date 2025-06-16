//严格模式
// 'use strict'

//全局环境下，两个模式this都是指向window
// console.log(this) //window

function func(){
    //函数里，非严格指向window，严格为undefined
    'use strict'
    console.log(this);
}
func()