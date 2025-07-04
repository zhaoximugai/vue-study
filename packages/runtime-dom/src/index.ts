import {nodeOps} from './nodeOps';
import patchProp from './patchProp';

import {createRenderer} from '@vue/runtime-core';
//将节点属性和操作集合合并到一个对象中
// 这样可以在创建渲染器时使用这些操作和属性
const renderOptions=Object.assign( {patchProp},nodeOps)


export  {renderOptions};

export const render=(vnode,container)=>{
    return createRenderer(renderOptions).render(vnode,container);
}

export * from '@vue/runtime-core';
