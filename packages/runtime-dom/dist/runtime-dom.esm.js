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
  if (value) {
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

// packages/runtime-core/src/index.ts
function createRenderer(renderOptions2) {
  const {
    inseret: hostInsert,
    remove: hostRemove,
    createElement: hostCreateElement,
    createText: hostCreateText,
    setText: hostSetText,
    parentNode: hostParentNode,
    nextSibling: hostNextSibling,
    patchProp: hostPatchProp
  } = renderOptions2;
  const render2 = (vnode, container) => {
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
  render,
  renderOptions
};
//# sourceMappingURL=runtime-dom.esm.js.map
