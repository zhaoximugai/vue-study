export default function patchClass(el,value) {
    if(value === null){
        //移除class
        el.removeAttribute('class')
    }else{
        //添加class
        el.setAttribute('class',value)
    }
}