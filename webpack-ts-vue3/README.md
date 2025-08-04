# Webpack + TypeScript + Vue3 项目构建指南

## 🚀 快速开始

### 环境要求

- Node.js >= 14.0.0
- npm >= 6.0.0

### 一键启动

```bash
# 克隆项目（如果是新项目）
git clone <your-repo-url>
cd webpack-ts-vue3

# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 构建生产版本
npm run build
```

### 项目验证

```bash
# 检查 TypeScript 配置
npx tsc --noEmit

# 检查构建是否成功
npm run build

# 检查开发服务器
npm run dev
```

## 📁 项目结构

```
webpack-ts-vue3/
├── src/
│   ├── main.ts          # 入口文件
│   ├── App.vue          # 根组件
│   └── shim.d.ts        # Vue类型声明文件
├── webpack.config.js     # Webpack配置文件
├── index.html           # HTML模板
├── package.json         # 项目依赖配置
└── tsconfig.json       # TypeScript配置
```

## 1. 基础项目搭建

### 1.1 创建项目目录结构

```bash
mkdir webpack-ts-vue3
cd webpack-ts-vue3
mkdir src
```

### 1.2 初始化 package.json

```bash
npm init -y
```

### 1.3 安装 Webpack 基础依赖

```bash
npm install webpack -D
npm install webpack-dev-server -D
npm install webpack-cli -D
```

### 1.4 配置 package.json 脚本

```json
{
  "scripts": {
    "build": "webpack",
    "dev": "webpack-dev-server"
  }
}
```

### 1.5 创建基础 webpack 配置

```javascript
// webpack.config.js
const { Configuration } = require("webpack");
const path = require("path");

/**
 * @type {Configuration}
 */
const config = {
  mode: "development", // 开发模式
  entry: "./src/main.ts", // 入口文件
  output: {
    path: path.resolve(__dirname, "dist"), // 输出目录
    filename: "main.js", // 输出文件名
  },
};

module.exports = config;
```

### 1.6 创建 HTML 模板

```html
<!-- index.html -->
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Webpack + TS + Vue3</title>
  </head>
  <body>
    <div id="app"></div>
  </body>
</html>
```

**运行测试**: `npm run build` - 此时应该能成功打包

## 2. 集成 TypeScript 支持

### 2.1 安装 TypeScript 相关依赖

```bash
npm install ts-loader -D
npm install typescript -D
```

### 2.2 创建 tsconfig.json 配置

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "ESNext",
    "moduleResolution": "node",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "outDir": "./dist",
    "rootDir": "./src"
  },
  "include": ["src/**/*"]
}
```

### 2.3 更新 webpack 配置支持 TypeScript

```javascript
const { Configuration } = require("webpack");
const path = require("path");

/**
 * @type {Configuration}
 */
const config = {
  mode: "development",
  entry: "./src/main.ts",
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "main.js",
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: "ts-loader", // 支持解析ts文件
      },
    ],
  },
};

module.exports = config;
```

## 3. 集成 Vue3 支持

### 3.1 安装 Vue 相关依赖

```bash
npm install vue@next
npm install vue-loader@next -D
npm install html-webpack-plugin -D
```

### 3.2 创建 Vue 类型声明文件

```typescript
// src/shim.d.ts
declare module "*.vue" {
  import { DefineComponent } from "vue";
  const component: DefineComponent<{}, {}, any>;
  export default component;
}
```

### 3.3 创建 Vue 入口文件

```typescript
// src/main.ts
import { createApp } from "vue";
import App from "./App.vue";

createApp(App).mount("#app");
```

### 3.4 创建根组件

```vue
<!-- src/App.vue -->
<template>
  <div>
    <h1>Hello Webpack + TypeScript + Vue3!</h1>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "App",
});
</script>

<style scoped>
h1 {
  color: #42b883;
}
</style>
```

### 3.5 更新 webpack 配置支持 Vue

```javascript
const { Configuration } = require("webpack");
const { VueLoaderPlugin } = require("vue-loader");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const path = require("path");

/**
 * @type {Configuration}
 */
const config = {
  mode: "development",
  entry: "./src/main.ts",
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "main.js",
  },
  plugins: [
    new VueLoaderPlugin(),
    new HtmlWebpackPlugin({
      template: "./index.html",
    }),
  ],
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: {
          loader: "ts-loader",
          options: {
            appendTsSuffixTo: [/\.vue$/], // 让ts-loader处理.vue文件
          },
        },
      },
      {
        test: /\.vue$/,
        use: "vue-loader",
      },
    ],
  },
};

module.exports = config;
```

## 4. 支持 CSS 和 Less

### 4.1 安装样式相关依赖

```bash
npm install css-loader style-loader -D
npm install less less-loader -D
```

### 4.2 更新 webpack 配置支持样式

```javascript
// 在module.rules中添加
{
  test: /\.css$/,
  use: ['style-loader', 'css-loader'] // 从右向左解析
},
{
  test: /\.less$/,
  use: ['style-loader', 'css-loader', 'less-loader']
}
```

## 5. 代码分包优化

### 5.1 配置 splitChunks

```javascript
// 在webpack配置中添加optimization
optimization: {
  splitChunks: {
    cacheGroups: {
      // 第三方库分包
      vendor: {
        name: 'vendor',
        test: /[\\/]node_modules[\\/]/,
        chunks: 'all',
        priority: 10
      },
      // 公共代码分包
      common: {
        name: 'common',
        chunks: 'all',
        minChunks: 2,
        priority: 5
      }
    }
  }
}
```

### 5.2 使用 chunkhash 优化缓存

```javascript
output: {
  path: path.resolve(__dirname, 'dist'),
  filename: '[chunkhash].js', // 使用chunkhash
  clean: true // 清理旧文件
}
```

## 6. 提取 CSS 文件

### 6.1 安装 CSS 提取插件

```bash
npm install mini-css-extract-plugin -D
```

### 6.2 配置 CSS 提取

```javascript
const MiniCssExtractPlugin = require('mini-css-extract-plugin')

// 在plugins中添加
new MiniCssExtractPlugin()

// 在module.rules中替换style-loader
{
  test: /\.css$/,
  use: [MiniCssExtractPlugin.loader, 'css-loader']
},
{
  test: /\.less$/,
  use: [MiniCssExtractPlugin.loader, 'css-loader', 'less-loader']
}
```

## 7. 开发服务器配置

### 7.1 配置开发服务器

```javascript
// 在webpack配置中添加
devServer: {
  static: {
    directory: path.join(__dirname, 'dist'),
  },
  compress: true,
  port: 9000,
  hot: true,
  open: true
}
```

### 7.2 优化构建输出

```javascript
// 在webpack配置中添加
stats: 'errors-only', // 只显示错误信息
```

## 8. 完整的 webpack 配置示例

```javascript
const { Configuration } = require("webpack");
const { VueLoaderPlugin } = require("vue-loader");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const path = require("path");

/**
 * @type {Configuration}
 */
const config = {
  mode: "development",
  entry: "./src/main.ts",
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "[chunkhash].js",
    clean: true,
  },
  stats: "errors-only",
  devServer: {
    static: {
      directory: path.join(__dirname, "dist"),
    },
    compress: true,
    port: 9000,
    hot: true,
    open: true,
  },
  plugins: [
    new VueLoaderPlugin(),
    new HtmlWebpackPlugin({
      template: "./index.html",
    }),
    new MiniCssExtractPlugin(),
  ],
  optimization: {
    splitChunks: {
      cacheGroups: {
        vendor: {
          name: "vendor",
          test: /[\\/]node_modules[\\/]/,
          chunks: "all",
          priority: 10,
        },
        common: {
          name: "common",
          chunks: "all",
          minChunks: 2,
          priority: 5,
        },
      },
    },
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: {
          loader: "ts-loader",
          options: {
            appendTsSuffixTo: [/\.vue$/],
          },
        },
      },
      {
        test: /\.vue$/,
        use: "vue-loader",
      },
      {
        test: /\.css$/,
        use: [MiniCssExtractPlugin.loader, "css-loader"],
      },
      {
        test: /\.less$/,
        use: [MiniCssExtractPlugin.loader, "css-loader", "less-loader"],
      },
    ],
  },
};

module.exports = config;
```

## 9. 常用命令

```bash
# 开发模式
npm run dev

# 生产构建
npm run build

# 启动开发服务器
npm run dev

# 清理构建缓存
npm run clean

# 类型检查
npx tsc --noEmit
```

## 9.1 稳定性检查清单

在开始开发前，请确保以下项目都已正确配置：

- [ ] **依赖安装**: `npm install` 执行成功
- [ ] **TypeScript 配置**: `tsconfig.json` 配置正确（注意不要设置 `noEmit: true`）
- [ ] **TypeScript 编译**: `npx tsc --noEmit` 类型检查通过
- [ ] **Webpack 配置**: `webpack.config.js` 语法正确
- [ ] **Vue 组件**: `App.vue` 包含必要的 template 和 script 标签
- [ ] **类型声明**: `shim.d.ts` 文件存在且配置正确
- [ ] **构建测试**: `npm run build` 执行成功
- [ ] **开发服务器**: `npm run dev` 能正常启动
- [ ] **热重载**: 修改文件后页面能自动刷新
- [ ] **样式加载**: CSS/Less 文件能正确加载
- [ ] **代码分包**: 构建后的文件大小合理

## 10. 项目特点总结

- ✅ **TypeScript 支持**: 完整的 TS 类型检查和编译
- ✅ **Vue3 支持**: 最新的 Vue3 Composition API
- ✅ **热重载**: 开发时自动刷新
- ✅ **代码分包**: 优化打包体积
- ✅ **CSS 提取**: 独立的 CSS 文件
- ✅ **Less 支持**: 预处理器支持
- ✅ **开发服务器**: 本地开发环境

## 11. 稳定性优化和最佳实践

### 11.1 错误处理和调试

```javascript
// webpack.config.js 中添加
stats: 'errors-only', // 只显示错误信息，减少控制台提示
devtool: 'source-map', // 开发环境启用源码映射
```

### 11.2 依赖版本锁定

```json
// package.json 中使用精确版本号
{
  "devDependencies": {
    "webpack": "5.101.0",
    "vue-loader": "17.4.2",
    "typescript": "5.9.2"
  }
}
```

### 11.3 TypeScript 严格配置

```json
// tsconfig.json 增强配置
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "ESNext",
    "moduleResolution": "node",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "allowSyntheticDefaultImports": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "outDir": "./dist",
    "rootDir": "./src"
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist"]
}
```

**重要说明**: 在 Webpack 项目中，不要设置`noEmit: true`，因为 ts-loader 需要 TypeScript 输出编译结果。如果设置了`noEmit: true`，会导致"TypeScript emitted no output"错误。

### 11.4 开发服务器稳定性配置

```javascript
// webpack.config.js 中的 devServer 配置
devServer: {
  static: {
    directory: path.join(__dirname, 'dist'),
  },
  compress: true,
  port: 9000,
  hot: true,
  open: true,
  historyApiFallback: true, // 支持 SPA 路由
  client: {
    overlay: {
      errors: true,
      warnings: false,
    },
  },
  watchFiles: {
    paths: ['src/**/*'],
    options: {
      usePolling: false,
    },
  },
}
```

### 11.5 构建优化配置

```javascript
// webpack.config.js 中的优化配置
optimization: {
  splitChunks: {
    chunks: 'all',
    cacheGroups: {
      vendor: {
        name: 'vendor',
        test: /[\\/]node_modules[\\/]/,
        chunks: 'all',
        priority: 10,
      },
      common: {
        name: 'common',
        chunks: 'all',
        minChunks: 2,
        priority: 5,
      },
    },
  },
  runtimeChunk: 'single', // 提取运行时代码
}
```

## 12. 常见问题解决

### 12.1 Vue 组件解析问题

```javascript
// 确保 vue-loader 配置正确
{
  test: /\.vue$/,
  use: 'vue-loader'
}
```

### 12.2 TypeScript 类型声明

```typescript
// src/shim.d.ts - 确保 Vue 组件类型声明正确
declare module "*.vue" {
  import { DefineComponent } from "vue";
  const component: DefineComponent<{}, {}, any>;
  export default component;
}
```

### 12.3 TypeScript 编译错误

**问题**: "TypeScript emitted no output" 错误

**解决方案**:

1. 确保 tsconfig.json 中没有设置 `"noEmit": true`
2. 检查 tsconfig.json 配置是否正确
3. 确保 outDir 和 rootDir 设置正确

```json
// 正确的 tsconfig.json 配置
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "ESNext",
    "moduleResolution": "node",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "allowSyntheticDefaultImports": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "outDir": "./dist",
    "rootDir": "./src"
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist"]
}
```

### 12.4 样式加载问题

```javascript
// 确保样式加载器顺序正确
{
  test: /\.css$/,
  use: [MiniCssExtractPlugin.loader, 'css-loader']
}
```

### 12.5 开发环境热重载

```javascript
// 确保热重载配置正确
devServer: {
  hot: true,
  liveReload: true
}
```

## 13. 性能优化建议

### 13.1 构建性能

- 使用 `thread-loader` 进行多线程构建
- 启用 `cache-loader` 缓存编译结果
- 合理配置 `exclude` 排除不必要的文件

### 13.2 运行时性能

- 使用 `tree-shaking` 移除未使用代码
- 合理配置 `splitChunks` 进行代码分包
- 启用 `compression` 进行资源压缩

### 13.3 开发体验

- 配置 `source-map` 便于调试
- 使用 `webpack-dev-server` 提供热重载
- 合理配置 `stats` 减少控制台提示

## 14. 注意事项

1. **Vue 版本**: 确保使用 Vue3，对应的 vue-loader 版本也要匹配
2. **TypeScript 配置**: 注意 tsconfig.json 中的 include 配置
3. **模块解析**: 确保 webpack 能正确解析.vue 文件
4. **依赖版本**: 注意各依赖包版本的兼容性
5. **开发环境**: 建议使用 Node.js 14+版本
6. **文件命名**: 确保文件名大小写正确，避免跨平台问题
7. **路径配置**: 使用绝对路径避免相对路径问题
8. **缓存清理**: 定期清理 node_modules 和 dist 目录
