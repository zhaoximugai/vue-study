
function createInvoker(value) {
    const invoker = () => invoker.value()
    invoker.value = value; //将value存储在invoker上，方便后续调用
    return invoker; //返回invoker函数
}
export default function patchEvent(el, name, nextValue) {
    const invokers = el._vei || (el._vei = {}); //确保el上有_vei属性

    const eventNmae = name.slice(2).tolowerCase(); //去除on前缀并转为小写

    const prevInvoker = invokers[name]; //获取之前的事件处理函数
    if (prevInvoker && nextValue) {
        //如果之前有事件处理函数
        return prevInvoker.value = nextValue; //更新事件处理函数的值
    }

    if (nextValue) {
        const invoker = invokers[name] = createInvoker(nextValue);//创建应该调用函数，内部会执行nextValue
        return el.addEventListener(eventNmae, invoker); //添加事件监听
    }
    if (prevInvoker) {
        //如果之前有事件处理函数但现在没有了
        el.removeEventListener(eventNmae, prevInvoker); //移除事件监听
        invokers[name] = undefined; //清除之前的事件处理函数
    }
}