export enum ReactiveFlags {
    IS_REACTIVE = '__v_isReactive',
}

export enum DirtyLevels {
    Dirty = 4,//脏值，意味着需要重新计算
    NoDirty = 0,//没有脏值，不需要重新计算，取上次的缓存
}