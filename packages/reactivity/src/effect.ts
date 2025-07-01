import { DirtyLevels } from "./constants";

export function effect(fn, options) {
    //创建一个响应式effect,数据变化时会触发
    const _effect = new ReactiveEffect(fn, () => {
        _effect.run()
    });
    _effect.run()

    if (options) {
        //如果有options，设置一些属性
        Object.assign(_effect, options);
    }
    const runner = _effect.run.bind(_effect); // 创建一个绑定了 effect 的 run 方法的函数
    runner.effect = _effect; // 将 effect 实例绑定到 runner 上
    return runner; //外界可以人自己重新执行run方法
}
function preClearEffect(effect) {
    effect._depLength = 0; // 清空依赖长度
    effect._trackId++; // 递增标识符
}
function postClearEffect(effect) {
    if (effect.deps.length > effect._depsLength) {
        //如果依赖长度大于当前的长度，说明有多余的依赖
        for (let i = effect._depLength; i < effect.deps.length; i++) {
            cleanDepEffect(effect.deps[i], effect)
        }
        effect.deps.length = effect._depLength;
    }
}
export let activeEffect;
const effectStack = []; // 全局栈
export class ReactiveEffect {
    _trackId = 0// 用于跟踪依赖的唯一标识符
    deps = []; // 存储依赖的集合
    _depLength = 0; // 用于跟踪依赖的长度
    _running = 0
    _dirtyLevel = DirtyLevels.Dirty; // 用于跟踪脏值的级别，默认为0,用于计算属性
    public active = true; //表示当前effect是否处于激活状态
    //fn 是用户传入的函数，scheduler是调度器
    //如果fn中的依赖发生变化，会调用run()
    constructor(public fn, public scheduler) {
        this.fn = fn
        this.scheduler = scheduler
    }

    public get dirty() {
        return this._dirtyLevel === DirtyLevels.Dirty; // 判断当前 effect 是否为脏值
    }

    public set dirty(value) {
        this._dirtyLevel = value ? DirtyLevels.Dirty : DirtyLevels.NoDirty;
    }



    run() {
        this._dirtyLevel = DirtyLevels.NoDirty; // 重置脏值级别
        //不是激活状态，直接返回
        if (!this.active) {
            return this.fn()
        }
        effectStack.push(this);// 将当前 effect 压入栈中
        activeEffect = this;// 设置当前激活的 effect
        try {

            //effcet重新执行前，需要将上一次的依赖清空
            preClearEffect(this);
            this._running++
            //执行fn
            return this.fn()
        } finally {
            this._running--;
            postClearEffect(this);
            effectStack.pop();
            activeEffect = effectStack[effectStack.length - 1]; // 恢复为上一层的 effect
        }
    }
}
function cleanDepEffect(dep, effect) {
    dep.delete(effect); // 从依赖中删除当前 effect
    if (dep.size === 0) {
        //如果依赖为空，清除依赖
        dep.cleanup();
    }
}
export function trackEffects(effect, dep) {
    if (dep.get(effect) !== effect._trackId) {
        dep.set(effect, effect._trackId);
        let oldDeps = effect.deps[effect._depLength]
        //如果没有dep存过在，说明是第一次添加
        if (oldDeps !== dep) {
            if (oldDeps) {
                //删除老的依赖
                cleanDepEffect(oldDeps, effect);
            }
            effect.deps[effect._depLength++] = dep; // 将依赖添加到 effect 的 deps 中
        } else {
            effect._depLength++
        }
    }
}

export function
    triggerEffects(dep) {
    for (const effect of dep.keys()) {
        if (effect._dirtyLevel < DirtyLevels.Dirty) {
            effect._dirtyLevel = DirtyLevels.Dirty; // 设置为脏值
        }
        if (effect.active) {
            if (effect._running === 0) {
                if (effect.scheduler) {
                    //如果不是正在运行，直接执行调度器

                    effect.scheduler();
                }

            }
        }
    }
}