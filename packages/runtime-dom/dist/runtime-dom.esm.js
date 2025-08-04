// packages/runtime-dom/src/nodeOps.ts
var nodeOps = {
  insert: (el, parent, anchor) => parent.insertBefore(el, anchor || null),
  // 插入节点到父节点中指定位置
  remove: (el) => el.parentNode?.removeChild(el),
  // 从父节点中移除节点
  createElement: (type) => document.createElement(type),
  // 创建元素节点
  createText: (text) => document.createTextNode(text),
  // 创建文本节点
  setText: (node, text) => node.nodeValue = text,
  // 设置节点的文本内容
  setElementText: (el, text) => el.textContent = text,
  // 设置元素的文本内容
  parentNode: (node) => node.parentNode,
  // 获取节点的父节点
  nextSibling: (node) => node.nextSibling
  // 获取节点的下一个兄弟节点
};

// packages/runtime-dom/src/modules/patchAttr.ts
function patchAttr(el, key, value) {
  if (!value) {
    el.removeAttribute(key);
  } else {
    el.setAttribute(key, value);
  }
}

// packages/runtime-dom/src/modules/patchClass.ts
function patchClass(el, value) {
  if (value === null) {
    el.removeAttribute("class");
  } else {
    el.setAttribute("class", value);
  }
}

// packages/runtime-dom/src/modules/patchEvent.ts
function createInvoker(value) {
  const invoker = () => invoker.value();
  invoker.value = value;
  return invoker;
}
function patchEvent(el, name, nextValue) {
  const invokers = el._vei || (el._vei = {});
  const eventName = name.slice(2).toLowerCase();
  const prevInvoker = invokers[name];
  if (prevInvoker && nextValue) {
    return prevInvoker.value = nextValue;
  }
  if (nextValue) {
    const invoker = invokers[name] = createInvoker(nextValue);
    return el.addEventListener(eventName, invoker);
  }
  if (prevInvoker) {
    el.removeEventListener(eventName, prevInvoker);
    invokers[name] = void 0;
  }
}

// packages/runtime-dom/src/modules/patchStyle.ts
function patchStyle(el, prevValue, nextValue) {
  let style = el.style;
  for (let key in nextValue) {
    style[key] = nextValue[key];
  }
  if (prevValue) {
    for (let key in prevValue) {
      if (!nextValue || nextValue[key] === void 0) {
        style[key] = null;
      }
    }
  }
}

// packages/runtime-dom/src/patchProp.ts
function patchProp(el, key, prevValue, nextValue) {
  if (key === "class") {
    return patchClass(el, nextValue);
  } else if (key === "style") {
    return patchStyle(el, prevValue, nextValue);
  } else if (/^on[^a-z]/.test(key)) {
    return patchEvent(el, key, nextValue);
  } else {
    return patchAttr(el, key, nextValue);
  }
}

// packages/shared/src/index.ts
function isObject(value) {
  return typeof value === "object" && value !== null;
}
function isString(value) {
  return typeof value === "string";
}

// packages/runtime-core/src/createVNode.ts
function isVnode(value) {
  return value?.__v_isVnode;
}
function isSameVnode(n1, n2) {
  return n1.type === n2.type && n1.key === n2.key;
}
function createVNode(type, props, children) {
  const shapeFlag = isString(type) ? 1 /* ELEMENT */ : 0;
  const vnode = {
    __v_isVnode: true,
    type,
    props,
    children,
    key: props?.key,
    //diff算法后面需要的key
    el: null,
    //虚拟节点需要对应的真实节点,
    shapeFlag
  };
  if (children) {
    if (Array.isArray(children)) {
      vnode.shapeFlag = vnode.shapeFlag | 16 /* ARRAY_CHILDREN */;
    } else {
      children = String(children);
      vnode.shapeFlag = vnode.shapeFlag | 8 /* TEXT_CHILDREN */;
    }
  }
  return vnode;
}

// packages/runtime-core/src/h.ts
function h(type, propsOrChildren, children) {
  let l = arguments.length;
  if (l === 2) {
    if (isObject(propsOrChildren) && !Array.isArray(propsOrChildren)) {
      if (isVnode(propsOrChildren)) {
        return createVNode(type, null, [propsOrChildren]);
      } else {
        return createVNode(type, propsOrChildren);
      }
    }
    return createVNode(type, null, propsOrChildren);
  } else {
    if (l > 3) {
      children = Array.from(arguments).slice(2);
    }
    if (l === 3 && isVnode(children)) {
      children = [children];
    }
    return createVNode(type, propsOrChildren, children);
  }
}

// packages/runtime-core/src/renderer.ts
function createRenderer(renderOptions2) {
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
  } = renderOptions2;
  const mountChildren = (children, container) => {
    for (let i = 0; i < children.length; i++) {
      patch(null, children[i], container);
    }
  };
  const mountElement = (vnode, container) => {
    const { type, props, children, shapeFlag } = vnode;
    const el = vnode.el = hostCreateElement(type);
    for (const key in props) {
      hostPatchProp(el, key, null, props[key]);
    }
    if (shapeFlag & 8 /* TEXT_CHILDREN */) {
      hostSetElementText(el, children);
    } else if (shapeFlag & 16 /* ARRAY_CHILDREN */) {
      mountChildren(children, el);
    }
    hostInsert(el, container);
    hostInsert(el, container);
  };
  const processElement = (n1, n2, container) => {
    if (n1 == null) {
      mountElement(n2, container);
    } else {
      patchElement(n1, n2, container);
    }
  };
  const parchProps = (oldProps, newProps, el) => {
    for (let key in newProps) {
      hostPatchProp(el, key, oldProps[key], newProps[key]);
    }
    for (let key in oldProps) {
      if (!(key in newProps)) {
        hostPatchProp(el, key, oldProps[key], null);
      }
    }
  };
  const patchChildren = (n1, n2, container) => {
    debugger;
  };
  const patchElement = (n1, n2, container) => {
    let el = n2.el = n1.el;
    let oldProps = n1.props || {};
    let newProps = n2.props || {};
    parchProps(oldProps, newProps, el);
    patchChildren(n1, n2, container);
  };
  const patch = (n1, n2, container) => {
    if (n1 === n2) {
      return;
    }
    if (n1 && !isSameVnode(n1, n2)) {
      unmount(n1);
      n1 = null;
    }
    processElement(n1, n2, container);
  };
  const unmount = (vnode) => {
    hostRemove(vnode.el);
  };
  const render2 = (vnode, container) => {
    if (vnode == null) {
      if (container._vnode) {
        console.log(container._vnode);
        unmount(container._vnode);
      }
    }
    patch(container._vnode || null, vnode, container);
    container._vnode = vnode;
  };
  return {
    render: render2
  };
}

// packages/runtime-dom/src/index.ts
var renderOptions = Object.assign({ patchProp }, nodeOps);
var render = (vnode, container) => {
  return createRenderer(renderOptions).render(vnode, container);
};
export {
  createRenderer,
  createVNode,
  h,
  isSameVnode,
  isVnode,
  render,
  renderOptions
};
//# sourceMappingURL=runtime-dom.esm.js.map
