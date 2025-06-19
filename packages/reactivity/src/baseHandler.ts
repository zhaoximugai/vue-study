import { isObject } from "@vue/shared";
import { track, trigger } from "./reactiveEffect";
import { reactive } from "./reactive";

export enum ReactiveFlags {
    IS_REACTIVE = '__v_isReactive',
}
export const mutableHandlers: ProxyHandler<any> = {
    //这里的receiver是代理对象本身
    get(target, key, receiver) {
        if (key === ReactiveFlags.IS_REACTIVE) {
            return true
        }
        
        track(target, key) // 收集依赖  
        let res=Reflect.get(target, key, receiver) // 取值
        if(isObject(res)){
            return reactive(res) // 如果是对象，则返回代理对象
        }
        
        //取值的时候，让响应式属性和effect关联起来
        return Reflect.get(target, key, receiver)
    },
    set(target, key, value, receiver) {
        //找到属性，让对应的effect重新执行
        let oldValue = target[key]
        Reflect.set(target, key, value, receiver)
        if (oldValue !== value) {
            //触发依赖
            trigger(target, key, value, oldValue)

        }
        return true

    }
}