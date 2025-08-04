import { isString, ShapeFlags } from "@vue/shared"

export function isVnode(value) {
    return value?.__v_isVnode
}
export function isSameVnode(n1,n2){
    return n1.type===n2.type&&n1.key===n2.key
}
export function createVNode(type, props, children?) {
    const shapeFlag = isString(type) ? ShapeFlags.ELEMENT : 0
    const vnode = {
        __v_isVnode: true,
        type,
        props,
        children,
        key: props?.key ,//diff算法后面需要的key
        el: null,//虚拟节点需要对应的真实节点,
        shapeFlag
    }
    if (children) {
        if (Array.isArray(children)) {
            vnode.shapeFlag = vnode.shapeFlag | ShapeFlags.ARRAY_CHILDREN
        } else {
            children = String(children)
            vnode.shapeFlag = vnode.shapeFlag | ShapeFlags.TEXT_CHILDREN
        }
    }
    return vnode

}