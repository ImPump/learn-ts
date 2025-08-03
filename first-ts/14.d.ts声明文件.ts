/*
TypeScript 声明文件学习笔记
声明文件用于为 JavaScript 代码提供类型信息，让 TypeScript 能够进行类型检查
*/

// ==================== 1. 声明文件基础 ====================
// 声明文件使用 .d.ts 扩展名，包含类型声明但不包含实现

// 1.1 全局变量声明
declare var globalConfig: {
  apiUrl: string
  timeout: number
  debug: boolean
}

// 1.2 全局函数声明
declare function formatDate(date: Date): string
declare function calculateTax(amount: number, rate: number): number

// 1.3 全局类声明
declare class GlobalLogger {
  static log(message: string): void
  static error(message: string): void
  static warn(message: string): void
}

// 1.4 全局枚举声明
declare enum LogLevel {
  DEBUG = 0,
  INFO = 1,
  WARN = 2,
  ERROR = 3
}

// 1.5 全局命名空间声明
declare namespace Utils {
  function debounce<T extends (...args: any[]) => any>(
    func: T,
    wait: number
  ): (...args: Parameters<T>) => void
  
  function throttle<T extends (...args: any[]) => any>(
    func: T,
    limit: number
  ): (...args: Parameters<T>) => void
}

// ==================== 2. 模块声明 ====================
// 为第三方库或模块提供类型定义

// 2.1 模块声明基础
declare module 'my-library' {
  export interface User {
    id: number
    name: string
    email: string
  }
  
  export function createUser(data: Omit<User, 'id'>): User
  export function getUser(id: number): Promise<User>
  export function updateUser(id: number, data: Partial<User>): Promise<User>
  export function deleteUser(id: number): Promise<boolean>
}

// 2.2 默认导出声明
declare module 'simple-utils' {
  const utils: {
    formatCurrency(amount: number): string
    formatDate(date: Date): string
    generateId(): string
  }
  
  export default utils
}

// 2.3 命名空间模块声明
declare module 'complex-library' {
  namespace API {
    interface RequestConfig {
      url: string
      method: 'GET' | 'POST' | 'PUT' | 'DELETE'
      headers?: Record<string, string>
      data?: any
    }
    
    interface Response<T = any> {
      success: boolean
      data: T
      message: string
      status: number
    }
    
    function request<T>(config: RequestConfig): Promise<Response<T>>
  }
  
  export = API
}

// ==================== 3. 全局类型声明 ====================
// 使用 interface 和 type 声明全局类型

// 3.1 全局接口声明
declare global {
  interface Window {
    myApp: {
      version: string
      config: any
      init(): void
    }
  }
  
  interface Document {
    myCustomProperty: string
  }
  
  interface Array<T> {
    customMap<U>(callback: (item: T, index: number) => U): U[]
    customFilter(callback: (item: T, index: number) => boolean): T[]
  }
}

// 3.2 全局类型别名
declare global {
  type ApiResponse<T = any> = {
    success: boolean
    data: T
    message: string
    timestamp: number
  }
  
  type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH'
  
  type EventHandler<T = Event> = (event: T) => void
}

// ==================== 4. 三斜线指令 ====================
// 用于引用其他声明文件

// 4.1 引用类型声明
/// <reference types="node" />
/// <reference types="express" />

// 4.2 引用路径声明
/// <reference path="./types/global.d.ts" />
/// <reference path="./types/utils.d.ts" />

// ==================== 5. 实际应用示例 ====================
// 综合运用声明文件的实际例子

// 5.1 Express 应用声明文件
declare module 'express' {
  interface Request {
    body: any
    params: Record<string, string>
    query: Record<string, string>
    headers: Record<string, string>
    method: string
    url: string
    path: string
  }
  
  interface Response {
    status(code: number): Response
    json(data: any): Response
    send(data: any): Response
    end(): Response
    setHeader(name: string, value: string): Response
  }
  
  interface Router {
    get(path: string, handler: (req: Request, res: Response) => void): void
    post(path: string, handler: (req: Request, res: Response) => void): void
    put(path: string, handler: (req: Request, res: Response) => void): void
    delete(path: string, handler: (req: Request, res: Response) => void): void
    use(path: string, router: Router): void
    use(handler: (req: Request, res: Response, next: Function) => void): void
  }
  
  interface App {
    use(path: string, router: Router): void
    use(handler: (req: Request, res: Response, next: Function) => void): void
    listen(port: number, callback?: () => void): void
    get(path: string, handler: (req: Request, res: Response) => void): void
    post(path: string, handler: (req: Request, res: Response) => void): void
  }
  
  interface Express {
    (): App
    Router(): Router
  }
  
  const express: Express
  export default express
}

// 5.2 自定义工具库声明文件
declare module 'my-utils' {
  // 字符串工具
  export namespace String {
    function capitalize(str: string): string
    function truncate(str: string, length: number): string
    function slugify(str: string): string
  }
  
  // 数组工具
  export namespace Array {
    function chunk<T>(arr: T[], size: number): T[][]
    function unique<T>(arr: T[]): T[]
    function groupBy<T, K extends keyof any>(
      arr: T[],
      key: (item: T) => K
    ): Record<K, T[]>
  }
  
  // 日期工具
  export namespace Date {
    function format(date: Date, format: string): string
    function addDays(date: Date, days: number): Date
    function isToday(date: Date): boolean
  }
  
  // 验证工具
  export namespace Validation {
    function isEmail(email: string): boolean
    function isPhone(phone: string): boolean
    function isUrl(url: string): boolean
    function isStrongPassword(password: string): boolean
  }
}

// 5.3 第三方 API 客户端声明文件
declare module 'api-client' {
  interface ApiConfig {
    baseUrl: string
    timeout: number
    headers: Record<string, string>
  }
  
  interface ApiRequest<T = any> {
    url: string
    method: 'GET' | 'POST' | 'PUT' | 'DELETE'
    data?: T
    headers?: Record<string, string>
  }
  
  interface ApiResponse<T = any> {
    success: boolean
    data: T
    message: string
    status: number
  }
  
  class ApiClient {
    constructor(config: Partial<ApiConfig>)
    
    request<TRequest = any, TResponse = any>(
      config: ApiRequest<TRequest>
    ): Promise<ApiResponse<TResponse>>
    
    get<T>(url: string): Promise<ApiResponse<T>>
    post<TRequest, TResponse>(
      url: string,
      data: TRequest
    ): Promise<ApiResponse<TResponse>>
    put<TRequest, TResponse>(
      url: string,
      data: TRequest
    ): Promise<ApiResponse<TResponse>>
    delete<T>(url: string): Promise<ApiResponse<T>>
  }
  
  export default ApiClient
  export { ApiConfig, ApiRequest, ApiResponse }
}

// 5.4 状态管理库声明文件
declare module 'state-manager' {
  interface Store<T> {
    getState(): T
    setState(newState: Partial<T>): void
    subscribe(listener: (state: T) => void): () => void
  }
  
  interface Action<T = any> {
    type: string
    payload?: T
  }
  
  type Reducer<T> = (state: T, action: Action) => T
  
  class StoreManager<T> implements Store<T> {
    constructor(initialState: T, reducer?: Reducer<T>)
    
    getState(): T
    setState(newState: Partial<T>): void
    subscribe(listener: (state: T) => void): () => void
    dispatch(action: Action): void
  }
  
  export default StoreManager
  export { Store, Action, Reducer }
}

// ==================== 6. 使用示例 ====================
// 展示如何使用声明文件

// 6.1 Express 应用示例
/*
// index.ts
import express from 'express'

const app = express()
const router = express.Router()

app.use('/api', router)

router.get('/users', (req, res) => {
  res.json({
    success: true,
    data: [
      { id: 1, name: '张三' },
      { id: 2, name: '李四' }
    ],
    message: '获取用户列表成功'
  })
})

router.post('/users', (req, res) => {
  const userData = req.body
  res.json({
    success: true,
    data: { id: Math.floor(Math.random() * 1000), ...userData },
    message: '创建用户成功'
  })
})

app.listen(3000, () => {
  console.log('服务器运行在端口 3000')
})
*/

// 6.2 自定义工具库使用示例
/*
// utils-usage.ts
import { String, Array, Date, Validation } from 'my-utils'

// 字符串处理
const capitalized = String.capitalize('hello world') // 'Hello World'
const truncated = String.truncate('这是一个很长的字符串', 10) // '这是一个很长的...'
const slug = String.slugify('Hello World!') // 'hello-world'

// 数组处理
const chunks = Array.chunk([1, 2, 3, 4, 5, 6], 2) // [[1, 2], [3, 4], [5, 6]]
const uniqueItems = Array.unique([1, 2, 2, 3, 3, 4]) // [1, 2, 3, 4]
const grouped = Array.groupBy(
  [
    { name: '张三', age: 25 },
    { name: '李四', age: 30 },
    { name: '王五', age: 25 }
  ],
  item => item.age
) // { 25: [...], 30: [...] }

// 日期处理
const formatted = Date.format(new Date(), 'YYYY-MM-DD') // '2024-01-01'
const tomorrow = Date.addDays(new Date(), 1)
const isToday = Date.isToday(new Date()) // true

// 验证
const isValidEmail = Validation.isEmail('test@example.com') // true
const isValidPhone = Validation.isPhone('13800138000') // true
const isStrong = Validation.isStrongPassword('MyPass123!') // true
*/

// 6.3 API 客户端使用示例
/*
// api-usage.ts
import ApiClient from 'api-client'

const apiClient = new ApiClient({
  baseUrl: 'https://api.example.com',
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json'
  }
})

// 获取用户列表
const users = await apiClient.get('/users')

// 创建用户
const newUser = await apiClient.post('/users', {
  name: '张三',
  email: 'zhangsan@example.com'
})

// 更新用户
const updatedUser = await apiClient.put('/users/1', {
  name: '李四'
})

// 删除用户
const deleted = await apiClient.delete('/users/1')
*/

// 6.4 状态管理使用示例
/*
// store-usage.ts
import StoreManager from 'state-manager'

interface AppState {
  user: {
    id: number
    name: string
    email: string
  } | null
  theme: 'light' | 'dark'
  loading: boolean
}

const initialState: AppState = {
  user: null,
  theme: 'light',
  loading: false
}

const store = new StoreManager(initialState)

// 订阅状态变化
const unsubscribe = store.subscribe((state) => {
  console.log('状态变化：', state)
})

// 更新状态
store.setState({ user: { id: 1, name: '张三', email: 'zhangsan@example.com' } })
store.setState({ theme: 'dark' })
store.setState({ loading: true })

// 取消订阅
unsubscribe()
*/

// ==================== 7. 声明文件最佳实践 ====================
/*
📚 声明文件使用最佳实践：

1. 文件组织
   ✅ 使用 .d.ts 扩展名
   ✅ 按模块或功能组织声明文件
   ✅ 使用清晰的命名约定

2. 类型定义
   ✅ 提供完整的类型定义
   ✅ 使用泛型提高复用性
   ✅ 保持类型一致性

3. 模块声明
   ✅ 使用 declare module 声明模块
   ✅ 提供默认导出和命名导出
   ✅ 处理复杂的模块结构

4. 全局声明
   ✅ 谨慎使用全局声明
   ✅ 使用 declare global 包装
   ✅ 避免命名冲突

5. 实际应用
   ✅ 为第三方库提供类型
   ✅ 为内部工具库定义接口
   ✅ 为 API 客户端提供类型

🎯 重点掌握：
- 理解声明文件的作用和语法
- 掌握各种声明方式的用法
- 学会为第三方库编写类型定义
- 理解模块声明和全局声明的区别
*/