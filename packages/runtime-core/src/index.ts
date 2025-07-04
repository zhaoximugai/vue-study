export function createRenderer(renderOptions){
    const {
        inseret: hostInsert,
        remove: hostRemove,
        createElement: hostCreateElement,
        createText: hostCreateText,
        setText: hostSetText,
        parentNode: hostParentNode,
        nextSibling: hostNextSibling,
        patchProp: hostPatchProp
    } = renderOptions;

    const render=(vnode,container)=>{
        //将虚拟节点变成真实节点
        
    }
    return {
        render
    }
}