# JavaScript核心概念与响应式系统实现

## 项目概述
这是一个结合JavaScript核心概念实现与简易响应式系统学习的混合项目，主要包含两部分内容：

1. **JavaScript核心概念实现** - 通过手写实现深入理解关键JavaScript特性
2. **响应式系统实现** - 类似Vue3的响应式系统基础实现，学习现代前端框架核心原理

> 项目采用pnpm workspace管理，适合作为学习现代JavaScript和前端框架原理的实践项目

## 功能特点

### JavaScript核心实现
- `this`指向原理与示例
- 函数柯里化实现
- 原生`call`/`apply`/`bind`方法手写实现
- Promise实现（含HTML测试示例）
- 节流(Throttle)与防抖(Debounce)实现（含HTML测试示例）

### Reactivity模块
基于Proxy和Reflect实现的响应式系统，核心功能包括：

- **响应式对象(reactive)** 
  - 通过Proxy代理对象属性访问
  - 自动跟踪属性访问和修改
  - 嵌套对象自动响应式化

- **副作用系统(effect)** 
  - 依赖收集(depend)和触发更新(trigger)
  - 自动重新执行依赖变更的副作用
  - 支持清理无效依赖

- **响应式API** 
  - `reactive()` - 创建深度响应式对象
  - `ref()` - 创建包装原始值的响应式引用
  - `computed()` - 创建计算属性(待实现)

> 实现参考Vue3 reactivity模块，简化了核心逻辑便于学习

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

### 环境准备
1. 安装Node.js (建议v16+)
2. 安装pnpm: `npm install -g pnpm`
3. 安装VS Code (推荐) 或其它代码编辑器

### 项目设置
```bash
# 安装依赖
pnpm install

# 运行JS示例
pnpm dev:js  # 启动所有JS示例的测试服务器

# 开发Reactivity模块
pnpm dev:reactivity  # 启动响应式系统调试环境
```

### 调试建议
1. **JS核心概念调试**
   - 直接在浏览器中打开HTML测试文件
   - 使用Chrome DevTools设置断点调试
   - 修改示例代码观察行为变化

2. **Reactivity模块调试**
   - 在`packages/reactivity/src/__tests__`中添加测试用例
   - 使用`debugger`语句跟踪依赖收集过程
   - 推荐VS Code + JavaScript Debugger进行源码调试

3. **最佳实践**
   - 每次修改后添加对应的测试用例
   - 使用git管理代码变更
   - 参考Vue3源码实现进行比较学习

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