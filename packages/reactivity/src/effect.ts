export function effect(fn, options) {
    //创建一个响应式effect,数据变化时会触发
    const _effect = new ReactiveEffect(fn, () => {
        _effect.run()
    });
    _effect.run()
}
export let activeEffect;
const effectStack = []; // 全局栈
class ReactiveEffect {
    public active = true; //表示当前effect是否处于激活状态
    //fn 是用户传入的函数，scheduler是调度器
    //如果fn中的依赖发生变化，会调用run()
    constructor(public fn, public scheduler) {
        this.fn = fn
        this.scheduler = scheduler
    }
    run() {
        //不是激活状态，直接返回
        if (!this.active) {
            return this.fn()
        }
        effectStack.push(this);// 将当前 effect 压入栈中
        activeEffect = this;// 设置当前激活的 effect
        try {
            //执行fn
            return this.fn()
        } finally {
            effectStack.pop();
            activeEffect = effectStack[effectStack.length - 1]; // 恢复为上一层的 effect
        }
    }
}