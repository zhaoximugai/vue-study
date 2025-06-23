import { activeEffect, trackEffects, triggerEffects } from "./effect";

export const createDep = (cleanup, key) => {
    const dep = new Map() as any
    dep.cleanup = cleanup
    dep.name = key
    return dep
}

const targetMap = new WeakMap();//存放依赖收集的关系
export function track(target, key) {
    if (activeEffect) {
        let depMap = targetMap.get(target)

        if (!depMap) {
            targetMap.set(target, (depMap = new Map()))
        }
        let dep = depMap.get(key)
        if (!dep) {
            depMap.set(
                key,
                (dep = createDep(() => {
                    depMap.delete(key)
                }, key))
            )
        }
        //将当前的effect添加到dep(映射表)依赖中,后续可以根据值的变化触发effect重新执行
        trackEffects(activeEffect, dep)

    }

}

//触发依赖
export function trigger(target, key, value, oldValue) {

    const depMap = targetMap.get((target))
    if (!depMap) {
        return
    }
    let dep = depMap.get(key)
    if (dep) {
        //修改属性的对应effect
        triggerEffects(dep)
    }
}
