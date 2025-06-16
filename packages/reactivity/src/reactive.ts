import { isObject } from "@vue/shared";

//reactiveMap 用于存储已经创建的代理对象
//用于记录代理的对象，可以复用
const reactiveMap = new WeakMap();

enum ReactiveFlags {
    IS_REACTIVE = '__v_isReactive',
}
const mutableHandlers: ProxyHandler<any> = {
    get(target, key, receiver) {
        if (key === ReactiveFlags.IS_REACTIVE) {
            return true
        }

    },
    set(target, key, value, receiver) {
        return true

    }
}

//reactive / shallowReactive
export function reactive(target) {
    return createReactiveObject(target);

}

function createReactiveObject(target) {
    //判断是否是对象
    if (!isObject(target)) {
        return target
    }

    if (target[ReactiveFlags.IS_REACTIVE]) {
        return target
    }

    const existProxy = reactiveMap.get(target);
    //如果已经存在代理对象，则直接返回
    if (existProxy) {
        return existProxy
    }
    let proxy = new Proxy(target, mutableHandlers);
    //根据对象缓存代理后的结果
    reactiveMap.set(target, proxy)
    return proxy
}