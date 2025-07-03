import { isFunction, isObject } from "@vue/shared";
import { ReactiveEffect } from "./effect";
import { isReactive } from "./reactive";
import { isRef } from "./ref";

export function watch(source, cb, options = {} as any) {
    return doWatch(source, cb, options);
}

export function watchEffect(effect, options = {} as any) {
    return doWatch(effect, null, options);
}


function traverse(source, depth, currentDepth = 0, set = new Set()) {
    if (!isObject(source)) {
        return source;
    }
    if (depth) {
        if (currentDepth >= depth) {
            return source;
        }
        currentDepth++;//根据deep属性来看是否深度
    }
    if (set.has(source)) {
        return source; //如果已经遍历过了，就不再遍历
    }
    for (let key in source) {
        traverse(source[key], depth, currentDepth, set);
    }
    return source;
}

function doWatch(source, cb, { deep, immediate }) {
    const reactiveGetter = (source) => traverse(source, deep === false ? 1 : undefined)

    //产生了一个getter函数ReactiveEffect使用，这个函数会在effect中执行
    //需要对这个对象进行取值操作，会关联当前的effect
    let getter;
    if (isReactive(source)) {
        getter = () => reactiveGetter(source);
    } else if (isRef(source)) {
        getter = () => source.value;
    } else if (isFunction(source)) {
        getter = source
    }

    let oldValue;

    let clean;
    const onCleanup = (fn) => {
        clean = () => {
            fn()
            clean = undefined
        }
    }

    const job = () => {
        if (cb) {
            if (clean) {
                clean()

            }
            const newValue = effect.run();
            cb(oldValue, newValue, onCleanup);
            oldValue = newValue;
        } else {
            effect.run();
        }

    }

    const effect = new ReactiveEffect(getter, job);

    if (cb) {
        if (immediate) {
            job();
        } else {
            oldValue = effect.run();
        }
    } else {
        //watchEffect
        effect.run();
    }
    const unwatch = () => {
        effect.stop();
    }
    return unwatch;
}