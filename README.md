# mini-vue

一个手写实现的简化版Vue.js核心，用于学习和理解Vue的工作原理，用于本人学习vue

## ✨ 特性

- 响应式数据系统
- 虚拟DOM实现
- 模板编译
- 组件系统（基础实现）
- 指令系统（v-model, v-bind等基础指令）

## 🚀 安装与使用

```bash
# 克隆仓库
git clone https://github.com/your-username/mini-vue.git
cd mini-vue

# 安装依赖
npm install

# 运行示例
npm run dev
```

## 📝 示例代码

```javascript
import { createApp, reactive } from 'mini-vue'

const app = createApp({
  setup() {
    const state = reactive({ count: 0 })
    
    const increment = () => {
      state.count++
    }

    return { state, increment }
  }
})

app.mount('#app')
```

## 🛠️ 开发指南

### 项目结构
```
src/
  ├── reactivity/    # 响应式系统实现
  ├── vdom/          # 虚拟DOM实现
  ├── compiler/      # 模板编译器
  └── index.js       # 主入口文件
```

### 添加新功能
1. 在对应目录下创建新模块
2. 编写单元测试
3. 更新文档

### 贡献规范
- 遵循现有代码风格
- 提交前运行测试
- 保持提交信息清晰

## 📜 许可证

MIT License