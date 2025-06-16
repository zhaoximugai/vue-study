//这个文件会帮我们打包packages下的模块，打包出js文件


//node dev.js (需要打包的名字 -f 打包的格式) ===argv

import minimist from "minimist";

const args=minimist(process.argv.slice(2))
console.log(args);
