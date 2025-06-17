import { activeEffect } from "./effect";
import { track } from "./reactiveEffect";

export enum ReactiveFlags {
    IS_REACTIVE = '__v_isReactive',
}
export const mutableHandlers: ProxyHandler<any> = {
    //这里的receiver是代理对象本身
    get(target, key, receiver) {
        if (key === ReactiveFlags.IS_REACTIVE) {
            return true
        }
        track(target,key) // 收集依赖  
        //取值的时候，让响应式属性和effect关联起来
        return Reflect.get(target, key, receiver)
    },
    set(target, key, value, receiver) {
        //找到属性，让对应的effect重新执行
        Reflect.set(target, key, value, receiver)
        return true
        

    }
}