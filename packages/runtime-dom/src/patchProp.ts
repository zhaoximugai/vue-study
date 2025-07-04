import patchAttr from "./modules/patchAttr";
import patchClass from "./modules/patchClass";
import patchEvent from "./modules/patchEvent";
import patchStyle from "./modules/patchStyle";


//主要是对节点元素的操作 class style event 普通属性


//diff
export default function patchProp(el, key, prevValue, nextValue) {
    if (key = 'class') {
        return patchClass(el, nextValue)
    } else if (key === 'style') {
        //处理style
        return patchStyle(el, prevValue, nextValue)
    } else if (/^on[a-z]/.test(key)) {
        //处理事件
        return patchEvent(el, key, nextValue)
    }else{
        return patchAttr(el, key, nextValue)
    }
}
