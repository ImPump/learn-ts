/*
TypeScript 模块解析学习笔记
模块解析是指 TypeScript 如何查找和解析模块的过程
*/

// ==================== 1. 模块化规范概述 ====================
// 前端模块化规范的发展历程

/*
模块化规范发展历程：

1. CommonJS (Node.js)
   - 同步加载
   - require() 导入
   - module.exports 导出

2. AMD (RequireJS)
   - 异步加载
   - define() 定义模块
   - require() 加载模块

3. CMD (SeaJS)
   - 按需加载
   - define() 定义模块
   - require() 加载依赖

4. UMD (Universal Module Definition)
   - 通用模块定义
   - 兼容 AMD 和 CommonJS

5. ES6 Modules (ESM)
   - 标准模块系统
   - import/export 语法
   - 静态分析
*/

// ==================== 2. ES6 模块基础 ====================
// 现代 JavaScript 的标准模块系统

// 2.1 默认导出和导入
// 默认导出：一个模块只能有一个默认导出
export default {
  name: 'MyModule',
  version: '1.0.0',
  author: '张三'
}

// 在其他文件中导入默认导出
// import myModule from './myModule'

// 2.2 命名导出和导入
export const API_BASE_URL = 'https://api.example.com'
export const DEFAULT_TIMEOUT = 5000

export function formatDate(date: Date): string {
  return date.toLocaleDateString('zh-CN')
}

export class UserService {
  static getUsers() {
    return Promise.resolve([])
  }
}

// 在其他文件中导入命名导出
// import { API_BASE_URL, formatDate, UserService } from './myModule'

// 2.3 混合导出
export default class App {
  constructor() {
    console.log('App initialized')
  }
}

export const config = {
  debug: true,
  apiUrl: 'https://api.example.com'
}

export function helper() {
  return 'helper function'
}

// 在其他文件中混合导入
// import App, { config, helper } from './myModule'

// ==================== 3. 导入导出语法详解 ====================
// 各种导入导出方式的使用

// 3.1 重命名导入
// import { formatDate as format, UserService as UserAPI } from './myModule'

// 3.2 导入所有内容
// import * as Utils from './myModule'

// 3.3 重新导出
// export { formatDate, UserService } from './myModule'
// export { default } from './myModule'

// 3.4 条件导出
const isDevelopment = process.env.NODE_ENV === 'development'

export const logger = isDevelopment 
  ? console.log 
  : () => {}

// ==================== 4. 动态导入 ====================
// 运行时动态加载模块

// 4.1 基础动态导入
async function loadModule() {
  try {
    const module = await import('./dynamicModule')
    console.log('动态加载的模块：', module)
  } catch (error) {
    console.error('加载模块失败：', error)
  }
}

// 4.2 条件动态导入
async function loadModuleConditionally(condition: boolean) {
  if (condition) {
    const heavyModule = await import('./heavyModule')
    return heavyModule.default
  } else {
    const lightModule = await import('./lightModule')
    return lightModule.default
  }
}

// 4.3 动态导入的实际应用
class ModuleLoader {
  private cache = new Map<string, any>()

  async loadModule<T>(modulePath: string): Promise<T> {
    if (this.cache.has(modulePath)) {
      return this.cache.get(modulePath)
    }

    try {
      const module = await import(modulePath)
      this.cache.set(modulePath, module)
      return module
    } catch (error) {
      console.error(`加载模块 ${modulePath} 失败：`, error)
      throw error
    }
  }

  async loadPlugin(pluginName: string) {
    const plugin = await this.loadModule(`./plugins/${pluginName}`)
    return plugin.default || plugin
  }
}

// ==================== 5. 模块解析策略 ====================
// TypeScript 如何解析模块路径

/*
模块解析策略：

1. 相对路径解析
   - ./ 当前目录
   - ../ 上级目录
   - 直接解析文件

2. 绝对路径解析
   - 从根目录开始
   - 基于 tsconfig.json 的 baseUrl

3. 模块名称解析
   - node_modules 查找
   - package.json 的 main 字段
   - 类型定义文件 (.d.ts)
*/

// ==================== 6. 实际应用示例 ====================
// 综合运用模块系统的实际例子

// 6.1 工具函数模块
export namespace Utils {
  export function debounce<T extends (...args: any[]) => any>(
    func: T,
    wait: number
  ): (...args: Parameters<T>) => void {
    let timeout: NodeJS.Timeout
    return (...args: Parameters<T>) => {
      clearTimeout(timeout)
      timeout = setTimeout(() => func(...args), wait)
    }
  }

  export function throttle<T extends (...args: any[]) => any>(
    func: T,
    limit: number
  ): (...args: Parameters<T>) => void {
    let inThrottle: boolean
    return (...args: Parameters<T>) => {
      if (!inThrottle) {
        func(...args)
        inThrottle = true
        setTimeout(() => inThrottle = false, limit)
      }
    }
  }

  export function deepClone<T>(obj: T): T {
    if (obj === null || typeof obj !== 'object') {
      return obj
    }
    
    if (obj instanceof Date) {
      return new Date(obj.getTime()) as T
    }
    
    if (obj instanceof Array) {
      return obj.map(item => deepClone(item)) as T
    }
    
    if (typeof obj === 'object') {
      const cloned = {} as T
      for (const key in obj) {
        if (obj.hasOwnProperty(key)) {
          cloned[key] = deepClone(obj[key])
        }
      }
      return cloned
    }
    
    return obj
  }
}

// 6.2 API 服务模块
export interface ApiConfig {
  baseUrl: string
  timeout: number
  headers: Record<string, string>
}

export interface ApiResponse<T = any> {
  success: boolean
  data: T
  message: string
  status: number
}

export class ApiService {
  private config: ApiConfig

  constructor(config: Partial<ApiConfig> = {}) {
    this.config = {
      baseUrl: 'https://api.example.com',
      timeout: 5000,
      headers: {
        'Content-Type': 'application/json'
      },
      ...config
    }
  }

  async request<T>(
    url: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const fullUrl = `${this.config.baseUrl}${url}`
    const requestOptions: RequestInit = {
      headers: { ...this.config.headers, ...options.headers },
      ...options
    }

    try {
      const response = await fetch(fullUrl, requestOptions)
      const data = await response.json()
      
      return {
        success: response.ok,
        data,
        message: response.ok ? 'Success' : 'Request failed',
        status: response.status
      }
    } catch (error) {
      return {
        success: false,
        data: null as T,
        message: error instanceof Error ? error.message : 'Unknown error',
        status: 0
      }
    }
  }

  async get<T>(url: string): Promise<ApiResponse<T>> {
    return this.request<T>(url, { method: 'GET' })
  }

  async post<T>(url: string, data: any): Promise<ApiResponse<T>> {
    return this.request<T>(url, {
      method: 'POST',
      body: JSON.stringify(data)
    })
  }
}

// 6.3 状态管理模块
export interface Store<T> {
  getState(): T
  setState(newState: Partial<T>): void
  subscribe(listener: (state: T) => void): () => void
}

export class SimpleStore<T> implements Store<T> {
  private state: T
  private listeners: ((state: T) => void)[] = []

  constructor(initialState: T) {
    this.state = initialState
  }

  getState(): T {
    return this.state
  }

  setState(newState: Partial<T>): void {
    this.state = { ...this.state, ...newState }
    this.listeners.forEach(listener => listener(this.state))
  }

  subscribe(listener: (state: T) => void): () => void {
    this.listeners.push(listener)
    return () => {
      const index = this.listeners.indexOf(listener)
      if (index > -1) {
        this.listeners.splice(index, 1)
      }
    }
  }
}

// 6.4 插件系统模块
export interface Plugin {
  name: string
  version: string
  install(app: any): void
}

export class PluginManager {
  private plugins = new Map<string, Plugin>()

  register(plugin: Plugin): void {
    if (this.plugins.has(plugin.name)) {
      console.warn(`插件 ${plugin.name} 已经注册`)
      return
    }
    this.plugins.set(plugin.name, plugin)
  }

  async loadPlugin(pluginPath: string): Promise<void> {
    try {
      const module = await import(pluginPath)
      const plugin = module.default || module
      this.register(plugin)
    } catch (error) {
      console.error(`加载插件失败：${pluginPath}`, error)
    }
  }

  installAll(app: any): void {
    this.plugins.forEach(plugin => {
      try {
        plugin.install(app)
        console.log(`插件 ${plugin.name} 安装成功`)
      } catch (error) {
        console.error(`插件 ${plugin.name} 安装失败：`, error)
      }
    })
  }
}

// ==================== 7. 模块最佳实践 ====================
/*
📚 模块使用最佳实践：

1. 文件组织
   ✅ 一个文件一个模块
   ✅ 使用清晰的目录结构
   ✅ 遵循命名约定

2. 导入导出
   ✅ 优先使用命名导出
   ✅ 合理使用默认导出
   ✅ 避免循环依赖

3. 动态导入
   ✅ 用于代码分割
   ✅ 条件加载
   ✅ 错误处理

4. 类型定义
   ✅ 导出类型定义
   ✅ 使用类型别名
   ✅ 保持类型一致性

5. 实际应用
   ✅ 工具函数库
   ✅ API 服务层
   ✅ 状态管理
   ✅ 插件系统

🎯 重点掌握：
- 理解 ES6 模块的语法和特性
- 掌握动态导入的使用场景
- 学会合理组织模块结构
- 理解模块解析的机制
*/