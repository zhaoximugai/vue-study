export * from '@vue/reactivity';

import {nodeOps} from './nodeOps';
import patchProp from './patchProp';

//将节点属性和操作集合合并到一个对象中
// 这样可以在创建渲染器时使用这些操作和属性
const renderOptions=Object.assign( {patchProp},nodeOps)
function createRenderer(){

}

export  {renderOptions};
export * from '@vue/reactivity'
// createRenderer(renderOptions).render()
