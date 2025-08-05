import { isObject, isString, ShapeFlags } from "@vue/shared"
import { createVNode, isVnode } from "./createVNode"

export function h(type, propsOrChildren?, children?) {
    let l = arguments.length
    if (l === 2) {
        //h('div',虚拟节点|属性)
        //如果是对象不是数组
        if (isObject(propsOrChildren) && !Array.isArray(propsOrChildren)) {
            //虚拟节点
            if (isVnode(propsOrChildren)) {
                
                return createVNode(type, null, [propsOrChildren])
            } else {
                //属性
                return createVNode(type, propsOrChildren)
            }
        }
        //儿子 是数组或者文本
        return createVNode(type, null, propsOrChildren)
    } else {
        if (l > 3) {
            children = Array.from(arguments).slice(2)
        }
        if (l === 3 && isVnode(children)) {
            children = [children]
        }
        //==3 | ==1

        return createVNode(type, propsOrChildren, children)
    }
}

