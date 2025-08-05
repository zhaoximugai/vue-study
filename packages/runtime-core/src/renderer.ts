import { ShapeFlags } from "@vue/shared";
import { isSameVnode } from "./createVNode";

export function createRenderer(renderOptions) {
    const {
        insert: hostInsert,
        remove: hostRemove,
        createElement: hostCreateElement,
        createText: hostCreateText,
        setText: hostSetText,
        setElementText: hostSetElementText,
        parentNode: hostParentNode,
        nextSibling: hostNextSibling,
        patchProp: hostPatchProp
    } = renderOptions;

    const mountChildren = (children, container) => {
        for (let i = 0; i < children.length; i++) {
            patch(null, children[i], container);
        }
    }

    //挂载元素
    const mountElement = (vnode, container) => {
        const { type, props, children, shapeFlag } = vnode;
        //创建元素
        //第一层渲染时让虚拟节点和真实的dom创建关联 vnode.el=真实dom
        const el = (vnode.el = hostCreateElement(type))
        //设置属性
        for (const key in props) {
            hostPatchProp(el, key, null, props[key]);
        }
        if (shapeFlag & ShapeFlags.TEXT_CHILDREN) {
            hostSetElementText(el, children);
        } else if (shapeFlag & ShapeFlags.ARRAY_CHILDREN) {
            //如果是数组类型的子元素
            mountChildren(children, el);
        }
        //将元素插入到容器中
        hostInsert(el, container);
    }
    const processElement = (n1, n2, container) => {
        if (n1 == null) {
            //如果n1是空的，说明是初次渲染
            mountElement(n2, container);
        } else {
            patchElement(n1, n2, container)
        }
    }
    const parchProps = (oldProps, newProps, el) => {
        // 新的要全部生效
        for (let key in newProps) {
            hostPatchProp(el, key, oldProps[key], newProps[key])
        }

        for (let key in oldProps) {
            if (!(key in newProps)) {
                hostPatchProp(el, key, oldProps[key], null)
            }
        }
    }
    //子节点对比
    const unmountChildren = (children) => {
        for (let i = 0; i < children.length; i++) {
            let child = children[i]

            unmount(child)
        }
    }
    const patchChildren = (n1, n2, el) => {
        const c1 = n1.children
        const c2 = n2.children

        const prevShapeFlag = n1.shapeFlag
        const shapeFlag = n2.shapeFlag

        //新的是文本，老的是数组
        if (shapeFlag & ShapeFlags.TEXT_CHILDREN) {
            if (prevShapeFlag & ShapeFlags.ARRAY_CHILDREN) {

                unmountChildren(c1)
            }
            if (c1 !== c2) {
                hostSetElementText(el, c2)
            }
        } else {
            if (prevShapeFlag & ShapeFlags.ARRAY_CHILDREN) {
                //新的老的都是数组
                if (shapeFlag & ShapeFlags.ARRAY_CHILDREN) {
                    //全量diff算法
                } else {
                    //老的是数组，新的不是数组，直接移除
                    unmountChildren(c1)
                }
            } else {
                if (prevShapeFlag & ShapeFlags.TEXT_CHILDREN) {
                    hostSetElementText(el, '')
                }
                if (shapeFlag & ShapeFlags.ARRAY_CHILDREN) {
                    mountChildren(c2, el)
                }
            }
        }

    }
    const patchElement = (n1, n2, container) => {
        //1.比较元素的差异，需要复用dom元素
        //2.比较属性和元素的子节点
        let el = n2.el = n1.el//对dom元素的复用 
        let oldProps = n1.props || {}
        let newProps = n2.props || {}

        //hostPatchProp 只针对某一个属性处理
        parchProps(oldProps, newProps, el)

        patchChildren(n1, n2, el)

    }
    //渲染和更新元素
    const patch = (n1, n2, container) => {
        if (n1 === n2) {
            return;
        }
        //直接移除老的dom元素，初始化新的
        if (n1 && !isSameVnode(n1, n2)) {
            unmount(n1)
            n1 = null
        }
        processElement(n1, n2, container)//对元素处理 
    }
    const unmount = (vnode) => {
        hostRemove(vnode.el)
    }
    const render = (vnode, container) => {
        if (vnode == null) {
            if (container._vnode) {
                console.log(container._vnode);
                unmount(container._vnode)
            }

        }
        //将虚拟节点变成真实节点
        patch(container._vnode || null, vnode, container);
        container._vnode = vnode;
    }
    return {
        render
    }
}