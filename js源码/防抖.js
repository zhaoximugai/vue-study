
//在一定时间间隔内，无论事件触发多少次，只执行一次回调函数
const fn = function (e) {
    console.log(`实际搜索请求` + this); // 控制台日志
    console.log('e', e.target.value);
}
// 防抖函数
function debounce(fn, wait = 0) {
    let timeId = null
    return function (...args) {
        let _this = this
        if (timeId) {
            clearTimeout(timeId)
        }
        timeId = setTimeout(() => {
            fn.call(_this, ...args)
        }, wait);
    }
}
let searchInput = document.getElementById('search-input')
let deFunc = debounce(fn, 500)
// 绑定输入事件
searchInput.addEventListener('input', deFunc);