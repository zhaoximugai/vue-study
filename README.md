# JavaScript核心概念与响应式系统实现

## 项目概述
这是一个结合JavaScript核心概念实现与简易响应式系统学习的混合项目，包含两部分主要内容：
1. JavaScript重要概念的手写实现
2. 类似Vue3的响应式系统基础实现

## 功能特点

### JavaScript核心实现
- `this`指向原理与示例
- 函数柯里化实现
- 原生`call`/`apply`/`bind`方法手写实现
- Promise实现（含HTML测试示例）
- 节流(Throttle)与防抖(Debounce)实现（含HTML测试示例）

### Reactivity模块
- 响应式系统基础实现
- 核心功能：
  - reactive响应式对象
  - effect副作用函数
  - 依赖收集与触发

## 目录结构
```
.
├── js源码/            # JavaScript核心概念实现
│   ├── this指向.js
│   ├── 函数柯里化.js
│   ├── 手写call、apply、bind方法.js
│   ├── 手写Promise.js
│   ├── 节流.js
│   ├── 防抖.js
│   └── ... (配套HTML测试文件)
│
├── packages/          # Reactivity模块
│   ├── reactivity/    # 响应式系统实现
│   └── shared/        # 共享工具
│
└── scripts/           # 开发脚本
    └── dev.js         # 开发启动脚本
```

## 使用说明

### 安装依赖
```bash
pnpm install
```

### 运行JS示例
1. 直接通过浏览器打开对应的HTML文件（如`手写Promise.html`）
2. 或通过Node.js运行JS文件：
```bash
node js源码/文件名.js
```

### 开发Reactivity模块
```bash
pnpm dev
```

## 实现内容清单

### js源码目录
| 文件名 | 实现内容 |
|--------|----------|
| this指向.js | `this`绑定规则与示例 |
| 函数柯里化.js | 函数柯里化实现与应用 |
| 手写call、apply、bind方法.js | 原生方法的polyfill实现 |
| 手写Promise.js | Promise/A+规范实现 |
| 节流.js | 节流函数实现 |
| 防抖.js | 防抖函数实现 |

### packages/reactivity
| 文件 | 功能 |
|------|------|
| baseHandler.ts | Proxy处理器实现 |
| effect.ts | 副作用函数实现 |
| reactive.ts | reactive核心实现 |
| index.ts | 模块入口 |

## 开发建议
1. 阅读代码时结合对应概念的原理理解
2. 通过修改示例代码观察效果变化
3. 逐步扩展实现更多功能