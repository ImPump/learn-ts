/*
TypeScript 命名空间学习笔记
命名空间是一种组织代码的方式，用于避免全局变量污染和命名冲突
*/

// ==================== 1. 基础命名空间 ====================
// 使用 namespace 关键字定义命名空间

namespace Utils {
  export const VERSION = '1.0.0'
  
  export function formatDate(date: Date): string {
    return date.toLocaleDateString('zh-CN')
  }
  
  export function formatCurrency(amount: number): string {
    return `¥${amount.toFixed(2)}`
  }
  
  export class Calculator {
    static add(a: number, b: number): number {
      return a + b
    }
    
    static multiply(a: number, b: number): number {
      return a * b
    }
  }
}

// 使用命名空间中的内容
console.log('命名空间版本：', Utils.VERSION)
console.log('格式化日期：', Utils.formatDate(new Date()))
console.log('格式化货币：', Utils.formatCurrency(123.456))
console.log('计算器：', Utils.Calculator.add(5, 3))

// ==================== 2. 嵌套命名空间 ====================
// 命名空间可以嵌套定义

namespace Database {
  export namespace Connection {
    export interface Config {
      host: string
      port: number
      username: string
      password: string
    }
    
    export function connect(config: Config): Promise<boolean> {
      return Promise.resolve(true)
    }
    
    export function disconnect(): Promise<void> {
      return Promise.resolve()
    }
  }
  
  export namespace Query {
    export function select(table: string, columns: string[] = ['*']): string {
      return `SELECT ${columns.join(', ')} FROM ${table}`
    }
    
    export function insert(table: string, data: Record<string, any>): string {
      const columns = Object.keys(data)
      const values = Object.values(data).map(v => `'${v}'`)
      return `INSERT INTO ${table} (${columns.join(', ')}) VALUES (${values.join(', ')})`
    }
  }
}

// 使用嵌套命名空间
const dbConfig: Database.Connection.Config = {
  host: 'localhost',
  port: 3306,
  username: 'root',
  password: 'password'
}

console.log('数据库连接：', Database.Connection.connect(dbConfig))
console.log('查询语句：', Database.Query.select('users', ['id', 'name']))
console.log('插入语句：', Database.Query.insert('users', { name: '张三', age: 25 }))

// ==================== 3. 命名空间合并 ====================
// 同名命名空间会自动合并

namespace UserService {
  export interface User {
    id: number
    name: string
    email: string
  }
  
  export function createUser(user: Omit<User, 'id'>): User {
    return {
      id: Math.floor(Math.random() * 1000),
      ...user
    }
  }
}

namespace UserService {
  export function updateUser(id: number, updates: Partial<User>): User | null {
    // 模拟更新用户
    return { id, name: 'Updated User', email: 'updated@example.com' }
  }
  
  export function deleteUser(id: number): boolean {
    // 模拟删除用户
    return true
  }
}

// 使用合并后的命名空间
const newUser = UserService.createUser({ name: '李四', email: 'lisi@example.com' })
const updatedUser = UserService.updateUser(newUser.id, { name: '王五' })
const deleted = UserService.deleteUser(newUser.id)

console.log('用户服务：', newUser, updatedUser, deleted)

// ==================== 4. 命名空间导入导出 ====================
// 使用 import 和 export 管理命名空间

// 4.1 导出命名空间
export namespace MathUtils {
  export const PI = 3.14159
  
  export function round(value: number, decimals: number = 0): number {
    return Math.round(value * Math.pow(10, decimals)) / Math.pow(10, decimals)
  }
  
  export function random(min: number, max: number): number {
    return Math.random() * (max - min) + min
  }
}

// 4.2 导入命名空间
import { MathUtils } from './12.namespace命名空间'

console.log('数学工具：', MathUtils.PI, MathUtils.round(3.14159, 2), MathUtils.random(1, 10))

// ==================== 5. 命名空间别名 ====================
// 使用 import 为命名空间创建别名

namespace ComplexNamespace {
  export namespace Deeply {
    export namespace Nested {
      export namespace Structure {
        export function complexFunction(): string {
          return '复杂的嵌套结构'
        }
      }
    }
  }
}

// 创建别名简化访问
import Complex = ComplexNamespace.Deeply.Nested.Structure

console.log('命名空间别名：', Complex.complexFunction())

// ==================== 6. 实际应用示例 ====================
// 综合运用命名空间的实际例子

// 6.1 API 服务命名空间
namespace ApiService {
  export interface RequestConfig {
    url: string
    method: 'GET' | 'POST' | 'PUT' | 'DELETE'
    headers?: Record<string, string>
    data?: any
  }
  
  export interface ApiResponse<T = any> {
    success: boolean
    data: T
    message: string
    status: number
  }
  
  export namespace User {
    export interface User {
      id: number
      name: string
      email: string
      createdAt: Date
    }
    
    export async function getUsers(): Promise<ApiResponse<User[]>> {
      // 模拟 API 调用
      return {
        success: true,
        data: [
          { id: 1, name: '张三', email: 'zhangsan@example.com', createdAt: new Date() },
          { id: 2, name: '李四', email: 'lisi@example.com', createdAt: new Date() }
        ],
        message: '获取用户列表成功',
        status: 200
      }
    }
    
    export async function createUser(userData: Omit<User, 'id' | 'createdAt'>): Promise<ApiResponse<User>> {
      // 模拟 API 调用
      return {
        success: true,
        data: {
          id: Math.floor(Math.random() * 1000),
          ...userData,
          createdAt: new Date()
        },
        message: '创建用户成功',
        status: 201
      }
    }
  }
  
  export namespace Product {
    export interface Product {
      id: number
      name: string
      price: number
      category: string
    }
    
    export async function getProducts(): Promise<ApiResponse<Product[]>> {
      // 模拟 API 调用
      return {
        success: true,
        data: [
          { id: 1, name: 'iPhone', price: 5999, category: '手机' },
          { id: 2, name: 'MacBook', price: 12999, category: '电脑' }
        ],
        message: '获取产品列表成功',
        status: 200
      }
    }
  }
}

// 使用 API 服务
async function testApiService() {
  const users = await ApiService.User.getUsers()
  const products = await ApiService.Product.getProducts()
  const newUser = await ApiService.User.createUser({
    name: '王五',
    email: 'wangwu@example.com'
  })
  
  console.log('API 服务测试：', users, products, newUser)
}

testApiService()

// 6.2 配置管理命名空间
namespace Config {
  export interface AppConfig {
    name: string
    version: string
    debug: boolean
  }
  
  export namespace Database {
    export interface Config {
      host: string
      port: number
      database: string
      username: string
      password: string
    }
  }
  
  export namespace Cache {
    export interface Config {
      type: 'memory' | 'redis'
      ttl: number
      maxSize: number
    }
  }
  
  export namespace Security {
    export interface Config {
      jwtSecret: string
      bcryptRounds: number
      sessionTimeout: number
    }
  }
  
  // 默认配置
  export const defaults: {
    app: AppConfig
    database: Database.Config
    cache: Cache.Config
    security: Security.Config
  } = {
    app: {
      name: 'MyApp',
      version: '1.0.0',
      debug: false
    },
    database: {
      host: 'localhost',
      port: 3306,
      database: 'myapp',
      username: 'root',
      password: ''
    },
    cache: {
      type: 'memory',
      ttl: 3600,
      maxSize: 1000
    },
    security: {
      jwtSecret: 'your-secret-key',
      bcryptRounds: 10,
      sessionTimeout: 86400
    }
  }
}

console.log('配置管理：', Config.defaults)

// 6.3 工具函数命名空间
namespace Tools {
  export namespace String {
    export function capitalize(str: string): string {
      return str.charAt(0).toUpperCase() + str.slice(1)
    }
    
    export function truncate(str: string, length: number): string {
      return str.length > length ? str.slice(0, length) + '...' : str
    }
    
    export function slugify(str: string): string {
      return str
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim()
    }
  }
  
  export namespace Array {
    export function chunk<T>(arr: T[], size: number): T[][] {
      const chunks: T[][] = []
      for (let i = 0; i < arr.length; i += size) {
        chunks.push(arr.slice(i, i + size))
      }
      return chunks
    }
    
    export function unique<T>(arr: T[]): T[] {
      return [...new Set(arr)]
    }
    
    export function groupBy<T, K extends keyof any>(arr: T[], key: (item: T) => K): Record<K, T[]> {
      return arr.reduce((groups, item) => {
        const groupKey = key(item)
        if (!groups[groupKey]) {
          groups[groupKey] = []
        }
        groups[groupKey].push(item)
        return groups
      }, {} as Record<K, T[]>)
    }
  }
  
  export namespace Date {
    export function format(date: Date, format: string = 'YYYY-MM-DD'): string {
      const year = date.getFullYear()
      const month = String(date.getMonth() + 1).padStart(2, '0')
      const day = String(date.getDate()).padStart(2, '0')
      const hours = String(date.getHours()).padStart(2, '0')
      const minutes = String(date.getMinutes()).padStart(2, '0')
      const seconds = String(date.getSeconds()).padStart(2, '0')
      
      return format
        .replace('YYYY', String(year))
        .replace('MM', month)
        .replace('DD', day)
        .replace('HH', hours)
        .replace('mm', minutes)
        .replace('ss', seconds)
    }
    
    export function addDays(date: Date, days: number): Date {
      const result = new Date(date)
      result.setDate(result.getDate() + days)
      return result
    }
    
    export function isToday(date: Date): boolean {
      const today = new Date()
      return date.toDateString() === today.toDateString()
    }
  }
}

// 使用工具函数
console.log('字符串工具：', Tools.String.capitalize('hello'), Tools.String.truncate('这是一个很长的字符串', 10))
console.log('数组工具：', Tools.Array.chunk([1, 2, 3, 4, 5, 6], 2), Tools.Array.unique([1, 2, 2, 3, 3, 4]))
console.log('日期工具：', Tools.Date.format(new Date()), Tools.Date.isToday(new Date()))

// ==================== 7. 命名空间最佳实践 ====================
/*
📚 命名空间使用最佳实践：

1. 组织结构
   ✅ 使用命名空间组织相关功能
   ✅ 合理使用嵌套命名空间
   ✅ 避免过深的嵌套层级

2. 命名规范
   ✅ 使用 PascalCase 命名命名空间
   ✅ 使用描述性的名称
   ✅ 保持命名一致性

3. 导出管理
   ✅ 只导出必要的接口和函数
   ✅ 使用 export 关键字明确导出
   ✅ 合理使用命名空间别名

4. 模块化
   ✅ 考虑使用 ES6 模块替代命名空间
   ✅ 在大型项目中使用模块系统
   ✅ 保持向后兼容性

5. 实际应用
   ✅ API 服务组织
   ✅ 工具函数分类
   ✅ 配置管理
   ✅ 第三方库集成

🎯 重点掌握：
- 理解命名空间的作用和优势
- 掌握命名空间的语法和用法
- 学会合理组织代码结构
- 理解命名空间与模块的区别
*/