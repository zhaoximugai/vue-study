import { activeEffect, trackEffects, triggerEffects } from "./effect";
import { toReactive } from "./reactive";
import { createDep, trigger } from "./reactiveEffect";

export function ref(value: any) {
    return createRef(value)
}

function createRef(value: any) {
    return new RefImpl(value)
}

class RefImpl {
    public _v_isRef = true//增加ref标识
    public _value;//用来保存ref的值
    public dep;
    constructor(public _rawValue: any) {
        this._value = toReactive(_rawValue) //将原始值转换为响应式对象
    }
    get value() {
        trackRefValue(this)
        return this._value
    }
    set value(newVal) {
        if (this._rawValue !== newVal) {
            this._rawValue = newVal
            this._value = newVal
            triggerRefValue(this)
        }
    }
}
function trackRefValue(ref) {
    if (activeEffect) {
        trackEffects(activeEffect, (ref.dep = createDep(() => ref.dep = undefined, 'undefined')))
    }
}

function triggerRefValue(ref) {
    let dep = ref.dep;
    if (dep) {
        triggerEffects(dep)//触发依赖  
    }
}