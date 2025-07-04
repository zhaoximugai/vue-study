export default function patchStyle(el, prevValue, nextValue) {
    let style=el.style;
    //应用新样式
    for(let key in nextValue){
        style[key]=nextValue[key]
    }
    //移除旧样式
    if(prevValue){
        for(let key in prevValue){
            if(!nextValue || nextValue[key]===undefined){
                style[key]=null
            }
        }
    }
    
}