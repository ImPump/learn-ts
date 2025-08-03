/*
TypeScript 内置对象学习笔记
包含 ECMAScript 内置对象、DOM 和 BOM 对象的类型定义
*/

// ==================== 1. ECMAScript 内置对象 ====================
// TypeScript 为 JavaScript 的内置对象提供了类型定义

// Boolean 对象
let booleanObj: Boolean = new Boolean(1)
console.log('Boolean 对象：', booleanObj)

// Number 对象
let numberObj: Number = new Number(true)
console.log('Number 对象：', numberObj)

// String 对象
let stringObj: String = new String('hello world')
console.log('String 对象：', stringObj)

// Date 对象
let dateObj: Date = new Date()
console.log('Date 对象：', dateObj)

// RegExp 对象
let regexObj: RegExp = /^1/
console.log('RegExp 对象：', regexObj)

// Error 对象
let errorObj: Error = new Error("这是一个错误")
console.log('Error 对象：', errorObj)

// ==================== 2. Promise 类型定义 ====================
// 如果不指定返回的类型，TypeScript 无法推断出返回的类型
// 函数定义返回 Promise 语法规则: Promise<T>

const promise: Promise<number> = new Promise<number>((resolve, reject) => {
  resolve(123)
})

promise.then((res) => {
  console.log('Promise 结果：', res)
})

// Promise 链式调用
const asyncOperation = (): Promise<string> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve('异步操作完成')
    }, 1000)
  })
}

asyncOperation()
  .then(result => console.log('异步操作：', result))
  .catch(error => console.error('错误：', error))

// ==================== 3. DOM 和 BOM 内置对象 ====================
// TypeScript 为 DOM 和 BOM 对象提供了完整的类型定义

// 基础 DOM 对象
let body: HTMLElement = document.body
let allDivs: NodeList = document.querySelectorAll('div')

// 读取单个元素需要类型断言，因为可能返回 null
let div: HTMLElement = document.querySelector('div') as HTMLDivElement

// 事件监听器
document.addEventListener('click', function (e: MouseEvent) {
  console.log('点击事件：', e.clientX, e.clientY)
})

// ==================== 4. 常用 DOM 元素类型 ====================
// TypeScript 为各种 HTML 元素提供了具体的类型定义

// 表单元素
let input: HTMLInputElement = document.querySelector('input') as HTMLInputElement
let button: HTMLButtonElement = document.querySelector('button') as HTMLButtonElement
let textarea: HTMLTextAreaElement = document.querySelector('textarea') as HTMLTextAreaElement
let select: HTMLSelectElement = document.querySelector('select') as HTMLSelectElement

// 容器元素
let divElement: HTMLDivElement = document.querySelector('div') as HTMLDivElement
let spanElement: HTMLSpanElement = document.querySelector('span') as HTMLSpanElement
let pElement: HTMLParagraphElement = document.querySelector('p') as HTMLParagraphElement

// 媒体元素
let imgElement: HTMLImageElement = document.querySelector('img') as HTMLImageElement
let videoElement: HTMLVideoElement = document.querySelector('video') as HTMLVideoElement
let audioElement: HTMLAudioElement = document.querySelector('audio') as HTMLAudioElement

// 表格元素
let tableElement: HTMLTableElement = document.querySelector('table') as HTMLTableElement
let trElement: HTMLTableRowElement = document.querySelector('tr') as HTMLTableRowElement
let tdElement: HTMLTableDataCellElement = document.querySelector('td') as HTMLTableDataCellElement

// ==================== 5. 事件类型 ====================
// TypeScript 为各种 DOM 事件提供了类型定义

// 鼠标事件
document.addEventListener('mousedown', (e: MouseEvent) => {
  console.log('鼠标按下：', e.button)
})

document.addEventListener('mousemove', (e: MouseEvent) => {
  console.log('鼠标移动：', e.clientX, e.clientY)
})

// 键盘事件
document.addEventListener('keydown', (e: KeyboardEvent) => {
  console.log('按键按下：', e.key, e.code)
})

// 表单事件
const form = document.querySelector('form') as HTMLFormElement
form?.addEventListener('submit', (e: SubmitEvent) => {
  e.preventDefault()
  console.log('表单提交')
})

// 触摸事件（移动端）
document.addEventListener('touchstart', (e: TouchEvent) => {
  console.log('触摸开始：', e.touches.length)
})

// ==================== 6. 实际应用示例 ====================
// 综合运用各种内置对象的实际例子

// 表单验证工具
interface FormValidator {
  validateEmail(email: string): boolean
  validatePhone(phone: string): boolean
  validatePassword(password: string): string[]
}

const formValidator: FormValidator = {
  validateEmail(email: string): boolean {
    const emailRegex: RegExp = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  },

  validatePhone(phone: string): boolean {
    const phoneRegex: RegExp = /^1[3-9]\d{9}$/
    return phoneRegex.test(phone)
  },

  validatePassword(password: string): string[] {
    const errors: string[] = []
    
    if (password.length < 8) {
      errors.push('密码长度至少8位')
    }
    
    if (!/[A-Z]/.test(password)) {
      errors.push('密码必须包含大写字母')
    }
    
    if (!/[a-z]/.test(password)) {
      errors.push('密码必须包含小写字母')
    }
    
    if (!/\d/.test(password)) {
      errors.push('密码必须包含数字')
    }
    
    return errors
  }
}

// 使用示例
console.log('邮箱验证：', formValidator.validateEmail('test@example.com'))
console.log('手机验证：', formValidator.validatePhone('13812345678'))
console.log('密码验证：', formValidator.validatePassword('weak'))

// 数据存储工具
interface StorageManager {
  setItem(key: string, value: any): void
  getItem<T>(key: string): T | null
  removeItem(key: string): void
  clear(): void
}

const storageManager: StorageManager = {
  setItem(key: string, value: any): void {
    try {
      localStorage.setItem(key, JSON.stringify(value))
    } catch (error) {
      console.error('存储失败：', error)
    }
  },

  getItem<T>(key: string): T | null {
    try {
      const item = localStorage.getItem(key)
      return item ? JSON.parse(item) : null
    } catch (error) {
      console.error('读取失败：', error)
      return null
    }
  },

  removeItem(key: string): void {
    localStorage.removeItem(key)
  },

  clear(): void {
    localStorage.clear()
  }
}

// 使用示例
storageManager.setItem('user', { name: '张三', age: 25 })
const user = storageManager.getItem<{ name: string, age: number }>('user')
console.log('存储的用户：', user)

// 网络请求工具
interface ApiResponse<T> {
  data: T
  status: number
  message: string
}

interface ApiClient {
  get<T>(url: string): Promise<ApiResponse<T>>
  post<T>(url: string, data: any): Promise<ApiResponse<T>>
}

const apiClient: ApiClient = {
  async get<T>(url: string): Promise<ApiResponse<T>> {
    try {
      const response = await fetch(url)
      const data = await response.json()
      return {
        data,
        status: response.status,
        message: '请求成功'
      }
    } catch (error) {
      return {
        data: null as T,
        status: 500,
        message: '请求失败'
      }
    }
  },

  async post<T>(url: string, data: any): Promise<ApiResponse<T>> {
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      })
      const responseData = await response.json()
      return {
        data: responseData,
        status: response.status,
        message: '请求成功'
      }
    } catch (error) {
      return {
        data: null as T,
        status: 500,
        message: '请求失败'
      }
    }
  }
}

// 使用示例（模拟）
interface User {
  id: number
  name: string
  email: string
}

// 模拟 API 调用
const mockGetUser = async (): Promise<ApiResponse<User>> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        data: { id: 1, name: '张三', email: 'zhangsan@example.com' },
        status: 200,
        message: '获取成功'
      })
    }, 100)
  })
}

mockGetUser().then(response => {
  console.log('API 响应：', response)
})

// ==================== 学习要点总结 ====================
/*
📚 TypeScript 内置对象学习要点：

1. ECMAScript 内置对象
   ✅ Boolean: 布尔对象，注意与 boolean 类型的区别
   ✅ Number: 数字对象，提供数字相关的方法
   ✅ String: 字符串对象，提供字符串操作方法
   ✅ Date: 日期对象，处理日期和时间
   ✅ RegExp: 正则表达式对象，用于模式匹配
   ✅ Error: 错误对象，用于错误处理
   ✅ Promise: 异步操作对象，处理异步编程

2. DOM 和 BOM 对象
   ✅ HTMLElement: HTML 元素的基础类型
   ✅ NodeList: 节点列表类型
   ✅ MouseEvent: 鼠标事件类型
   ✅ KeyboardEvent: 键盘事件类型
   ✅ 各种 HTML 元素类型: HTMLInputElement、HTMLButtonElement 等

3. 类型定义的重要性
   ✅ 类型安全: 确保操作内置对象时的类型正确性
   ✅ 智能提示: IDE 提供更好的代码提示
   ✅ 错误预防: 在编译时发现潜在错误
   ✅ 代码可读性: 明确表达代码意图

4. 实际应用工具
   ✅ 表单验证: 使用 RegExp 进行数据验证
   ✅ 数据存储: 使用 localStorage 进行本地存储
   ✅ 网络请求: 使用 fetch API 进行 HTTP 请求
   ✅ 错误处理: 使用 Error 对象进行错误管理

5. 最佳实践
   ✅ 优先使用基本类型: boolean 而不是 Boolean
   ✅ 合理使用类型断言: 处理可能为 null 的 DOM 元素
   ✅ 异步编程: 正确使用 Promise 和 async/await
   ✅ 错误处理: 使用 try-catch 和 Error 对象

🎯 重点掌握：
- 理解内置对象与基本类型的区别
- 掌握 DOM 和 BOM 对象的类型定义
- 学会在实际项目中正确使用内置对象
- 理解类型定义对开发效率的重要性
- 掌握异步编程和错误处理的最佳实践
*/ 