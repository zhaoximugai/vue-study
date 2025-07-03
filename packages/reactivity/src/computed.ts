import { isFunction } from "@vue/shared";
import { effect, ReactiveEffect } from "./effect";
import { trackRefValue, triggerRefValue } from "./ref";

class ComputedRefImpl {
    public _value;
    public effect;
    constructor(getter, public setter) {
        //创建一个effect，来关机计算当前计算属性的dirty属性
        this.effect = new ReactiveEffect(
            () => getter(this._value),
            () =>{ 
            //当依赖的值变化时，重新计算,我们应该触发effect渲染重新执行
            triggerRefValue(this) 
        }
        )
    }
    get value() {
        if (this.effect.dirty) {
            //如果dirty为true，说明依赖的值变化了，需要重新计算
            this._value = this.effect.run() //执行effect，计算当前值
            //如果当前在effect中访问了计算属性，计算属性是可以收集这个effect的
            trackRefValue(this)
        }
        return this._value

    }
    set value(value) {
        this.setter(value) //设置值
    }
}

export function computed(getterOrOptions) {
    let onlyGetter = isFunction(getterOrOptions)
    let getter;
    let setter;
    if (onlyGetter) {
        getter = getterOrOptions
        setter = () => { }
    } else {
        getter = getterOrOptions.get
        setter = getterOrOptions.set
    }
    return new ComputedRefImpl(getter, setter)//计算属性
}