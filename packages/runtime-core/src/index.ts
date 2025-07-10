import { ShapeFlags } from "@vue/shared";

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
        const el = hostCreateElement(type);
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
        //插入元素
        hostInsert(el, container);

    }

    //渲染和更新元素
    const patch = (n1, n2, container) => {
        if (n1 === n2) {
            return;
        }
        if (n1 == null) {
            //如果n1是空的，说明是初次渲染
            mountElement(n2, container);
        }
    }

    const render = (vnode, container) => {
        //将虚拟节点变成真实节点
        patch(container._vnode || null, vnode, container);
        container._vnode = vnode;
    }
    return {
        render
    }
}