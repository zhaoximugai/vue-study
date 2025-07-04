// packages/reactivity/src/effect.ts
function effect(fn, options) {
  const _effect = new ReactiveEffect(fn, () => {
    _effect.run();
  });
  _effect.run();
  if (options) {
    Object.assign(_effect, options);
  }
  const runner = _effect.run.bind(_effect);
  runner.effect = _effect;
  return runner;
}
function preClearEffect(effect3) {
  effect3._depLength = 0;
  effect3._trackId++;
}
function postClearEffect(effect3) {
  if (effect3.deps.length > effect3._depsLength) {
    for (let i = effect3._depLength; i < effect3.deps.length; i++) {
      cleanDepEffect(effect3.deps[i], effect3);
    }
    effect3.deps.length = effect3._depLength;
  }
}
var activeEffect;
var effectStack = [];
var ReactiveEffect = class {
  //表示当前effect是否处于激活状态
  //fn 是用户传入的函数，scheduler是调度器
  //如果fn中的依赖发生变化，会调用run()
  constructor(fn, scheduler) {
    this.fn = fn;
    this.scheduler = scheduler;
    this._trackId = 0;
    // 用于跟踪依赖的唯一标识符
    this.deps = [];
    // 存储依赖的集合
    this._depLength = 0;
    // 用于跟踪依赖的长度
    this._running = 0;
    this._dirtyLevel = 4 /* Dirty */;
    // 用于跟踪脏值的级别，默认为0,用于计算属性
    this.active = true;
    this.fn = fn;
    this.scheduler = scheduler;
  }
  get dirty() {
    return this._dirtyLevel === 4 /* Dirty */;
  }
  set dirty(value) {
    this._dirtyLevel = value ? 4 /* Dirty */ : 0 /* NoDirty */;
  }
  run() {
    this._dirtyLevel = 0 /* NoDirty */;
    if (!this.active) {
      return this.fn();
    }
    effectStack.push(this);
    activeEffect = this;
    try {
      preClearEffect(this);
      this._running++;
      return this.fn();
    } finally {
      this._running--;
      postClearEffect(this);
      effectStack.pop();
      activeEffect = effectStack[effectStack.length - 1];
    }
  }
  stop() {
    if (this.active) {
      this.active = false;
      preClearEffect(this);
      postClearEffect(this);
    }
  }
};
function cleanDepEffect(dep, effect3) {
  dep.delete(effect3);
  if (dep.size === 0) {
    dep.cleanup();
  }
}
function trackEffects(effect3, dep) {
  if (dep.get(effect3) !== effect3._trackId) {
    dep.set(effect3, effect3._trackId);
    let oldDeps = effect3.deps[effect3._depLength];
    if (oldDeps !== dep) {
      if (oldDeps) {
        cleanDepEffect(oldDeps, effect3);
      }
      effect3.deps[effect3._depLength++] = dep;
    } else {
      effect3._depLength++;
    }
  }
}
function triggerEffects(dep) {
  for (const effect3 of dep.keys()) {
    if (effect3._dirtyLevel < 4 /* Dirty */) {
      effect3._dirtyLevel = 4 /* Dirty */;
    }
    if (effect3.active) {
      if (effect3._running === 0) {
        if (effect3.scheduler) {
          effect3.scheduler();
        }
      }
    }
  }
}

// packages/shared/src/index.ts
function isObject(value) {
  return typeof value === "object" && value !== null;
}
function isFunction(value) {
  return typeof value === "function";
}

// packages/reactivity/src/reactiveEffect.ts
var createDep = (cleanup, key) => {
  const dep = /* @__PURE__ */ new Map();
  dep.cleanup = cleanup;
  dep.name = key;
  return dep;
};
var targetMap = /* @__PURE__ */ new WeakMap();
function track(target, key) {
  if (activeEffect) {
    let depMap = targetMap.get(target);
    if (!depMap) {
      targetMap.set(target, depMap = /* @__PURE__ */ new Map());
    }
    let dep = depMap.get(key);
    if (!dep) {
      depMap.set(
        key,
        dep = createDep(() => {
          depMap.delete(key);
        }, key)
      );
    }
    trackEffects(activeEffect, dep);
  }
}
function trigger(target, key, value, oldValue) {
  const depMap = targetMap.get(target);
  if (!depMap) {
    return;
  }
  let dep = depMap.get(key);
  if (dep) {
    triggerEffects(dep);
  }
}

// packages/reactivity/src/baseHandler.ts
var mutableHandlers = {
  //这里的receiver是代理对象本身
  get(target, key, receiver) {
    if (key === "__v_isReactive" /* IS_REACTIVE */) {
      return true;
    }
    track(target, key);
    let res = Reflect.get(target, key, receiver);
    if (isObject(res)) {
      return reactive(res);
    }
    return Reflect.get(target, key, receiver);
  },
  set(target, key, value, receiver) {
    let oldValue = target[key];
    Reflect.set(target, key, value, receiver);
    if (oldValue !== value) {
      trigger(target, key, value, oldValue);
    }
    return true;
  }
};

// packages/reactivity/src/reactive.ts
var reactiveMap = /* @__PURE__ */ new WeakMap();
function createReactiveObject(target) {
  if (!isObject(target)) {
    return target;
  }
  if (target["__v_isReactive" /* IS_REACTIVE */]) {
    return target;
  }
  const existProxy = reactiveMap.get(target);
  if (existProxy) {
    return existProxy;
  }
  let proxy = new Proxy(target, mutableHandlers);
  reactiveMap.set(target, proxy);
  return proxy;
}
function reactive(target) {
  return createReactiveObject(target);
}
function toReactive(value) {
  if (isObject(value)) {
    reactive(value);
  }
  return value;
}
function isReactive(value) {
  return !!(value && value["__v_isReactive" /* IS_REACTIVE */]);
}

// packages/reactivity/src/ref.ts
function ref(value) {
  return createRef(value);
}
function createRef(value) {
  return new RefImpl(value);
}
var RefImpl = class {
  constructor(_rawValue) {
    this._rawValue = _rawValue;
    this._v_isRef = true;
    this._value = toReactive(_rawValue);
  }
  get value() {
    trackRefValue(this);
    return this._value;
  }
  set value(newVal) {
    if (this._rawValue !== newVal) {
      this._rawValue = newVal;
      this._value = newVal;
      triggerRefValue(this);
    }
  }
};
function trackRefValue(ref2) {
  if (activeEffect) {
    trackEffects(activeEffect, ref2.dep = ref2.dep || createDep(() => ref2.dep = void 0, "undefined"));
  }
}
function triggerRefValue(ref2) {
  let dep = ref2.dep;
  if (dep) {
    triggerEffects(dep);
  }
}
var ObjectRefImpl = class {
  //增加ref标识
  constructor(target, key) {
    this.target = target;
    this.key = key;
    this._v_isRef = true;
  }
  get value() {
    return this.target[this.key];
  }
  set value(newVal) {
    this.target[this.key] = newVal;
  }
};
function toRef(target, key) {
  return new ObjectRefImpl(target, key);
}
function toRefs(target) {
  const res = Array.isArray(target) ? new Array(target.length) : {};
  for (const key in target) {
    res[key] = toRef(target, key);
  }
  return res;
}
function proxyRefs(objectWithRefs) {
  return new Proxy(objectWithRefs, {
    get(target, key, receiver) {
      let res = Reflect.get(target, key, receiver);
      return res._v_isRef ? res.value : res;
    },
    set(target, key, value, receiver) {
      const oldValue = target[key];
      if (oldValue._v_isRef) {
        oldValue.value = value;
      } else {
        Reflect.set(target, key, value, receiver);
      }
      return true;
    }
  });
}
function isRef(value) {
  return !!(value && value._v_isRef);
}

// packages/reactivity/src/computed.ts
var ComputedRefImpl = class {
  constructor(getter, setter) {
    this.setter = setter;
    this.effect = new ReactiveEffect(
      () => getter(this._value),
      () => {
        triggerRefValue(this);
      }
    );
  }
  get value() {
    if (this.effect.dirty) {
      this._value = this.effect.run();
      trackRefValue(this);
    }
    return this._value;
  }
  set value(value) {
    this.setter(value);
  }
};
function computed(getterOrOptions) {
  let onlyGetter = isFunction(getterOrOptions);
  let getter;
  let setter;
  if (onlyGetter) {
    getter = getterOrOptions;
    setter = () => {
    };
  } else {
    getter = getterOrOptions.get;
    setter = getterOrOptions.set;
  }
  return new ComputedRefImpl(getter, setter);
}

// packages/reactivity/src/watch.ts
function watch(source, cb, options = {}) {
  return doWatch(source, cb, options);
}
function watchEffect(effect3, options = {}) {
  return doWatch(effect3, null, options);
}
function traverse(source, depth, currentDepth = 0, set = /* @__PURE__ */ new Set()) {
  if (!isObject(source)) {
    return source;
  }
  if (depth) {
    if (currentDepth >= depth) {
      return source;
    }
    currentDepth++;
  }
  if (set.has(source)) {
    return source;
  }
  for (let key in source) {
    traverse(source[key], depth, currentDepth, set);
  }
  return source;
}
function doWatch(source, cb, { deep, immediate }) {
  const reactiveGetter = (source2) => traverse(source2, deep === false ? 1 : void 0);
  let getter;
  if (isReactive(source)) {
    getter = () => reactiveGetter(source);
  } else if (isRef(source)) {
    getter = () => source.value;
  } else if (isFunction(source)) {
    getter = source;
  }
  let oldValue;
  let clean;
  const onCleanup = (fn) => {
    clean = () => {
      fn();
      clean = void 0;
    };
  };
  const job = () => {
    if (cb) {
      if (clean) {
        clean();
      }
      const newValue = effect3.run();
      cb(oldValue, newValue, onCleanup);
      oldValue = newValue;
    } else {
      effect3.run();
    }
  };
  const effect3 = new ReactiveEffect(getter, job);
  if (cb) {
    if (immediate) {
      job();
    } else {
      oldValue = effect3.run();
    }
  } else {
    effect3.run();
  }
  const unwatch = () => {
    effect3.stop();
  };
  return unwatch;
}

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

// packages/runtime-dom/src/index.ts
var renderOptions = Object.assign({ patchProp }, nodeOps);
export {
  ReactiveEffect,
  activeEffect,
  computed,
  effect,
  isReactive,
  isRef,
  proxyRefs,
  reactive,
  ref,
  renderOptions,
  toReactive,
  toRef,
  toRefs,
  trackEffects,
  trackRefValue,
  triggerEffects,
  triggerRefValue,
  watch,
  watchEffect
};
//# sourceMappingURL=runtime-dom.esm.js.map
