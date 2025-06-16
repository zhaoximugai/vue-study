//这个文件会帮我们打包packages下的模块，打包出js文件


//node dev.js (需要打包的名字 xxx -f 打包的格式) ===argv

import minimist from "minimist";
import {resolve,dirname} from 'path'
import { fileURLToPath } from "url";
import { createRequire } from "module";

const __filename=fileURLToPath(import.meta.url)//获取文件的绝对路径:D:\qianduan\vue-stydy\scripts\dev.js
const __dirname=dirname(__filename) ////获取文件的目录路径:D:\qianduan\vue-stydy\scripts
const args=minimist(process.argv.slice(2))
const require=createRequire(import.meta.url)

const target=args._[0]||'reactivity' //打包哪个项目
const format=args.f||"life" //打包后的模块化函数

// console.log(args);//{ _: [ 'reactivity' ], f: 'esm' }

// console.log(target,format);

//node中em模块没有__dirname

//入口文件，根据命令行提供的参数路径来设置
const entry=resolve(__dirname,`../packages/${target}/src/index.ts`)

console.log(entry);

