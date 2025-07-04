/**
 * 节点操作集合
 */
export const nodeOps = {
    insert: (el, parent, anchor) => parent.insertBefore(el, anchor||null), // 插入节点到父节点中指定位置
    remove: el => el.parentNode?.removeChild(el), // 从父节点中移除节点
    createElement: type => document.createElement(type), // 创建元素节点
    createText: text => document.createTextNode(text), // 创建文本节点
    setText: (node, text) => (node.nodeValue = text), // 设置节点的文本内容
    setElementText: (el, text) => (el.textContent = text), // 设置元素的文本内容
    parentNode: node => node.parentNode, // 获取节点的父节点
    nextSibling: node => node.nextSibling, // 获取节点的下一个兄弟节点
};
