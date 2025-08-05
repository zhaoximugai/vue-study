export default function patchStyle(el, prevValue, nextValue) {
    if (!nextValue) {
        // 如果 nextValue 是 null/undefined，直接移除整个 style 属性
        el.removeAttribute('style');
    } else {
        // 否则，更新 style 属性
        for (let styleName in nextValue) {
            el.style[styleName] = nextValue[styleName];
        }
        // 清除旧 style 中不存在的属性
        if (prevValue) {
            for (let styleName in prevValue) {
                if (!nextValue || nextValue[styleName] === undefined) {
                    el.style[styleName] = '';
                }
            }
        }
    }
}