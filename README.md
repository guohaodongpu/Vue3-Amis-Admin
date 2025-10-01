# Vue3-Amis-Admin

## 架构说明

这个版本大大简化了架构，Vue只作为承载容器，所有页面都通过JSON配置来驱动。

### 🎯 核心理念

- **Vue作为承载**: Vue只负责提供运行环境
- **JSON驱动**: 所有页面、路由、功能都通过JSON配置
- **amis渲染**: 使用amis作为JSON渲染引擎
- **极简架构**: 最小化的代码复杂度

### 📁 项目结构

```
src/
├── components/
│   └── SimpleAmisApp.vue    # 唯一的Vue组件，承载amis
├── pages/                   # JSON配置文件目录
│   └── example/            # 示例页面（仅供参考）
│       ├── site.json       # 示例主导航配置
│       ├── crud-*.json     # 示例CRUD页面配置
│       └── *.json          # 其他示例页面配置
├── editor/                  # 可视化编辑器（仅开发环境）
│   └── index.jsx           # 编辑器入口文件
├── editor.html              # 编辑器HTML模板
├── App.vue                  # 根组件
├── main.js                  # 入口文件
└── index.html               # HTML模板

public/                      # 公共资源
└── logo.svg                # Logo图片
```

> ⚠️ **注意**: `editor/` 和 `editor.html` 仅在开发环境使用，**不会参与生产构建和打包**

**说明:**
- `pages/example/` 仅作为示例参考，展示 amis 的各种功能
- 实际项目中可以在 `pages/` 目录下创建自己的配置文件
- 支持按功能模块或权限角色组织不同的 JSON 配置

### 🚀 使用方式

> 本项目使用 **pnpm** 作为包管理器。如果你还没有安装 pnpm，请先运行：`npm install -g pnpm`

1. **安装依赖**
   ```bash
   pnpm install
   ```

2. **启动开发服务器**
   ```bash
   pnpm run dev
   ```

3. **访问应用**
   ```
   主应用: http://localhost:8081
   可视化编辑器: http://localhost:8081/editor
   ```

   > 💡 **编辑器说明**: 可视化编辑器仅在开发环境可用，用于可视化设计页面并导出 JSON Schema。点击"保存"按钮后，Schema 会输出到浏览器控制台（F12）

4. **构建生产版本**
   ```bash
   pnpm run build
   ```
   
   构建完成后，生产文件将输出到 `dist/` 目录，可直接部署到服务器。
   
   > ⚠️ **注意**: 生产构建**不包含**编辑器，仅打包主应用，确保包体积最小化

5. **修改页面**
   - 直接编辑 `src/pages/` 目录下的JSON文件
   - 修改主导航配置文件（如 `pages/example/site.json`）来调整导航菜单
   - 修改各个页面的JSON配置来调整页面内容
   - `example/` 文件夹仅供参考，可以创建自己的配置结构

### 🎨 配置说明

#### 主导航配置 (site.json)
```json
{
  "status": 0,
  "msg": "",
  "data": {
    "pages": [
      {
        "label": "首页",
        "url": "/",
        "redirect": "/index/1"
      },
      {
        "label": "示例",
        "children": [
          {
            "label": "页面A",
            "url": "index",
            "schema": {
              "type": "page",
              "title": "页面A",
              "body": "页面A内容"
            }
          }
        ]
      }
    ]
  }
}
```

#### 页面配置示例
```json
{
  "type": "page",
  "title": "列表页面",
  "body": [
    {
      "type": "crud",
      "api": "/api/data",
      "columns": [
        {
          "name": "id",
          "label": "ID"
        },
        {
          "name": "name",
          "label": "名称"
        }
      ]
    }
  ]
}
```

### ✨ 优势

1. **极简架构**: 只有1个Vue组件
2. **JSON驱动**: 所有功能都通过JSON配置
3. **易于维护**: 修改页面只需要编辑JSON文件
4. **快速开发**: 不需要写Vue代码
5. **amis生态**: 享受amis的所有功能

### 🔧 扩展功能

如果需要添加新功能：

1. **新页面**: 在 `src/pages/` 目录创建新的JSON文件
2. **新路由**: 在主导航配置文件中添加导航配置
3. **新功能**: 通过amis的JSON配置实现

### 🎨 核心实现

**SimpleAmisApp.vue** 完全参考 [amis-admin/index.html](https://github.com/aisuda/amis-admin/blob/master/index.html) 的实现：
- ✅ 完整的 `normalizeLink` 函数处理所有路径情况（相对路径、绝对路径、查询参数、锚点）
- ✅ 完整的 `isCurrentUrl` 函数正确判断当前页面
- ✅ 使用 amis 内置的 fetcher，不自定义数据加载
- ✅ 避免重复导航，优化性能
- ✅ 支持所有 amis 功能：schema、schemaApi、redirect 等

### 📚 参考项目

本项目参考了以下优秀的开源项目：
- [baidu/amis](https://github.com/baidu/amis) - 前端低代码框架
- [aisuda/amis-admin](https://github.com/aisuda/amis-admin) - amis 后台管理模板
- [aisuda/amis-editor-demo](https://github.com/aisuda/amis-editor-demo) - amis 可视化编辑器示例

### 🐛 调试模式

如果需要查看详细的路由和导航日志，可以开启调试模式：

**开启调试:**
在 `src/components/SimpleAmisApp.vue` 中：
```javascript
data() {
  return {
    amisInstance: null,
    debug: true  // 设置为 true 开启调试
  };
}
```

**调试日志包括:**
- 🚀 amis 应用初始化
- 🔄 路由变化
- 📍 位置更新
- 🔗 导航跳转
- ⏭️ 重复导航检测

### 📝 注意事项

- 所有页面都通过amis渲染
- 路由由amis内部管理
- Vue只提供运行环境
- 主题和样式由amis控制
- 默认关闭调试日志，生产环境保持干净

这样的架构让您可以专注于JSON配置，而不需要关心Vue的复杂性！
