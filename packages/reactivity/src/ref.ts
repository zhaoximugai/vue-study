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
export function trackRefValue(ref) {
    if (activeEffect) {
        trackEffects(activeEffect, (ref.dep = ref.dep || createDep(() => ref.dep = undefined, 'undefined')))
    }
}

export function triggerRefValue(ref) {
    let dep = ref.dep;
    if (dep) {
        triggerEffects(dep)//触发依赖  
    }
}

// toRef 
class ObjectRefImpl {
    public _v_isRef = true//增加ref标识
    constructor(public target, public key) { }

    get value() {
        return this.target[this.key]
    }
    set value(newVal) {
        this.target[this.key] = newVal
    }
}


export function toRef(target, key) {
    return new ObjectRefImpl(target, key);
}

export function toRefs(target) {
    const res = Array.isArray(target) ? new Array(target.length) : {};
    for (const key in target) {
        res[key] = toRef(target, key);
    }
    return res;
}

export function proxyRefs(objectWithRefs) {
    return new Proxy(objectWithRefs, {
        get(target, key, receiver) {
            let res = Reflect.get(target, key, receiver)
            return res._v_isRef ? res.value : res
        },
        set(target, key, value, receiver) {
            const oldValue = target[key];
            if (oldValue._v_isRef) {
                oldValue.value = value
            } else {
                Reflect.set(target, key, value, receiver)
            }
            return true
        }
    })
}

export function isRef(value) {
    return !!(value && value._v_isRef);
}