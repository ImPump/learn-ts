/*
TypeScript 类型推论和类型别名学习笔记
类型推论：TypeScript 自动推断变量类型
类型别名：使用 type 关键字为类型定义别名
*/

// 使用命名空间避免与其他文件的函数名冲突
namespace TypeInferenceAndAlias {
  // ==================== 1. 类型推论 (Type Inference) ====================
  // TypeScript 会根据上下文自动推断变量类型

  // 1.1 变量初始化时的类型推论
  let message = 'Hello TypeScript' // 自动推断为 string 类型
  let count = 42 // 自动推断为 number 类型
  let isActive = true // 自动推断为 boolean 类型
  let items = [1, 2, 3] // 自动推断为 number[] 类型

  console.log('类型推论示例：', typeof message, typeof count, typeof isActive, Array.isArray(items))

  // 1.2 函数返回值的类型推论
  function add(a: number, b: number) {
    return a + b // 自动推断返回值为 number 类型
  }

  function greet(name: string) {
    return `Hello, ${name}!` // 自动推断返回值为 string 类型
  }

  function getRandomValue() {
    return Math.random() > 0.5 ? 'success' : 404 // 自动推断返回值为 string | number 类型
  }

  console.log('函数返回值推论：', add(1, 2), greet('张三'), getRandomValue())

  // 1.3 对象字面量的类型推论
  const user = {
    name: '李四',
    age: 25,
    isAdmin: false
  } // 自动推断为 { name: string; age: number; isAdmin: boolean }

  console.log('对象类型推论：', user.name, user.age, user.isAdmin)

  // 1.4 数组的类型推论
  const numbers = [1, 2, 3, 4, 5] // 自动推断为 number[]
  const mixed = [1, 'hello', true] // 自动推断为 (number | string | boolean)[]

  console.log('数组类型推论：', numbers, mixed)

  // ==================== 2. 类型别名 (Type Aliases) ====================
  // 使用 type 关键字为类型定义别名，提高代码可读性

  // 2.1 基础类型别名
  type UserId = string
  type UserAge = number
  type UserName = string

  const userId: UserId = 'user_123'
  const userAge: UserAge = 30
  const userName: UserName = '王五'

  console.log('基础类型别名：', userId, userAge, userName)

  // 2.2 联合类型别名
  type Status = 'pending' | 'approved' | 'rejected'
  type Priority = 'low' | 'medium' | 'high'
  type ID = string | number

  const orderStatus: Status = 'pending'
  const taskPriority: Priority = 'high'
  const itemId: ID = 12345

  console.log('联合类型别名：', orderStatus, taskPriority, itemId)

  // 2.3 函数类型别名
  type MathFunction = (a: number, b: number) => number
  type StringProcessor = (input: string) => string
  type Callback<T> = (data: T) => void

  const addNumbers: MathFunction = (a, b) => a + b
  const toUpperCase: StringProcessor = (str) => str.toUpperCase()
  const logData: Callback<string> = (data) => console.log('数据：', data)

  console.log('函数类型别名：', addNumbers(5, 3), toUpperCase('hello'))
  logData('测试数据')

  // 2.4 对象类型别名
  type Point = {
    x: number
    y: number
  }

  type User = {
    id: UserId
    name: UserName
    age: UserAge
    email: string
    isActive: boolean
  }

  type Config = {
    apiUrl: string
    timeout: number
    retries: number
    debug: boolean
  }

  const point: Point = { x: 10, y: 20 }
  const userInfo: User = {
    id: 'user_456',
    name: '赵六',
    age: 28,
    email: 'zhaoliu@example.com',
    isActive: true
  }
  const appConfig: Config = {
    apiUrl: 'https://api.example.com',
    timeout: 5000,
    retries: 3,
    debug: true
  }

  console.log('对象类型别名：', point, userInfo, appConfig)

  // 2.5 复杂类型别名
  type ApiResponse<T> = {
    success: boolean
    data: T
    message: string
    timestamp: number
  }

  type PaginatedResponse<T> = {
    items: T[]
    total: number
    page: number
    pageSize: number
    hasNext: boolean
    hasPrev: boolean
  }

  type EventHandler<T = Event> = (event: T) => void

  // 使用复杂类型别名
  const userResponse: ApiResponse<User> = {
    success: true,
    data: userInfo,
    message: '用户信息获取成功',
    timestamp: Date.now()
  }

  const userListResponse: PaginatedResponse<User> = {
    items: [userInfo],
    total: 1,
    page: 1,
    pageSize: 10,
    hasNext: false,
    hasPrev: false
  }

  const clickHandler: EventHandler = (event) => {
    console.log('点击事件：', event)
  }

  console.log('复杂类型别名：', userResponse, userListResponse)

  // ==================== 3. 条件类型 (Conditional Types) ====================
  // 使用 extends 关键字创建条件类型

  // 3.1 基础条件类型
  type IsString<T> = T extends string ? true : false
  type IsNumber<T> = T extends number ? true : false
  type IsArray<T> = T extends any[] ? true : false

  type Test1 = IsString<'hello'> // true
  type Test2 = IsString<123> // false
  type Test3 = IsNumber<42> // true
  type Test4 = IsArray<number[]> // true

  // 3.2 类型层次结构测试
  type TypeHierarchy = 
    | 1 extends number ? 'number' : never
    | 1 extends Number ? 'Number' : never
    | 1 extends Object ? 'Object' : never
    | 1 extends any ? 'any' : never
    | 1 extends unknown ? 'unknown' : never
    | 1 extends never ? 'never' : never

  // ==================== 4. 类型别名 vs 接口 ====================
  // 比较 type 和 interface 的区别

  // 4.1 接口定义
  interface Animal {
    name: string
    age: number
  }

  interface Dog extends Animal {
    breed: string
    bark(): void
  }

  // 4.2 类型别名定义
  type Vehicle = {
    brand: string
    model: string
    year: number
  }

  type Car = Vehicle & {
    engine: string
    start(): void
  }

  // 4.3 联合类型（接口无法直接定义）
  type Shape = Circle | Square | Triangle
  type Circle = { type: 'circle'; radius: number }
  type Square = { type: 'square'; side: number }
  type Triangle = { type: 'triangle'; base: number; height: number }

  // 4.4 映射类型（接口无法直接定义）
  type Optional<T> = {
    [K in keyof T]?: T[K]
  }

  type Readonly<T> = {
    readonly [K in keyof T]: T[K]
  }

  type PartialUser = Optional<User>
  type ReadonlyUser = Readonly<User>

  // ==================== 5. 实际应用示例 ====================
  // 综合运用类型推论和类型别名的实际例子

  // 5.1 API 请求类型定义
  type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH'

  type RequestConfig = {
    method: HttpMethod
    url: string
    headers?: Record<string, string>
    data?: any
    timeout?: number
  }

  type ApiError = {
    code: number
    message: string
    details?: any
  }

  // 5.2 状态管理类型
  type LoadingState = 'idle' | 'loading' | 'success' | 'error'

  type AsyncState<T> = {
    data: T | null
    loading: LoadingState
    error: ApiError | null
  }

  // 5.3 表单验证类型
  type ValidationRule<T> = {
    required?: boolean
    minLength?: number
    maxLength?: number
    pattern?: RegExp
    custom?: (value: T) => boolean | string
  }

  type FormField<T> = {
    value: T
    error: string | null
    touched: boolean
    rules: ValidationRule<T>[]
  }

  // 5.4 实际使用示例
  const apiRequest = async <T>(config: RequestConfig): Promise<ApiResponse<T>> => {
    // 模拟 API 请求
    return {
      success: true,
      data: {} as T,
      message: '请求成功',
      timestamp: Date.now()
    }
  }

  const createFormField = <T>(initialValue: T, rules: ValidationRule<T>[] = []): FormField<T> => ({
    value: initialValue,
    error: null,
    touched: false,
    rules
  })

  // 使用示例
  const userForm = {
    name: createFormField('', [{ required: true, minLength: 2 }]),
    email: createFormField('', [{ required: true, pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/ }]),
    age: createFormField(0, [{ required: true, custom: (value) => value >= 18 || '年龄必须大于18岁' }])
  }

  console.log('实际应用示例：', userForm)

  // ==================== 6. 最佳实践总结 ====================
  /*
  📚 类型推论和类型别名最佳实践：

  1. 类型推论
     ✅ 充分利用 TypeScript 的自动类型推论
     ✅ 只在必要时显式声明类型
     ✅ 注意复杂表达式的类型推论结果

  2. 类型别名
     ✅ 使用描述性的名称
     ✅ 优先使用 type 定义联合类型和复杂类型
     ✅ 使用泛型提高类型别名的复用性

  3. 命名规范
     ✅ 使用 PascalCase 命名类型别名
     ✅ 使用描述性的名称
     ✅ 避免与内置类型冲突

  4. 性能考虑
     ✅ 避免过度复杂的条件类型
     ✅ 合理使用类型缓存
     ✅ 注意类型推断的性能影响

  5. 实际应用
     ✅ API 类型定义
     ✅ 状态管理
     ✅ 表单验证
     ✅ 配置管理

  🎯 重点掌握：
  - 理解类型推论的机制和限制
  - 掌握类型别名的各种用法
  - 学会在实际项目中合理使用类型别名
  - 理解 type 和 interface 的区别和适用场景
  */
}