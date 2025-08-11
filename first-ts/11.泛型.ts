/*
TypeScript 泛型学习笔记
泛型是一种在定义函数、接口或类时不预先指定具体类型，而在使用时再指定类型的特性

【命名约定】
- 推荐使用大写字母 T 作为单一类型参数的名称。
- 当有多个类型参数时，依次使用 T、U、V、W 等，或使用更具描述性的名称（如 TItem, TKey, TValue）。
    T：Type（类型）
    K：Key（键）
    V：Value（值）
    E：Element（元素）
    R：Return（返回值）
- 保持类型参数命名的一致性，避免随意使用无意义的字母。
- 对于通用工具类型，建议加前缀 T（如 TData, TResult）。
*/
namespace 泛型 {
  // ==================== 1. 函数泛型 ====================
  // 泛型函数：可以处理多种类型的数据

  // 1.1 基础泛型函数
  function identity<T>(arg: T): T {
    return arg
  }

  // 使用泛型函数
  const stringResult = identity<string>('Hello')
  const numberResult = identity<number>(42)
  const booleanResult = identity<boolean>(true)

  console.log('基础泛型函数：', stringResult, numberResult, booleanResult)

  // 1.2 类型推断
  // TypeScript 可以自动推断类型
  const inferredString = identity('TypeScript') // 自动推断为 string
  const inferredNumber = identity(123) // 自动推断为 number

  console.log('类型推断：', inferredString, inferredNumber)

  // 1.3 多类型参数
  function pair<T, U>(first: T, second: U): [T, U] {
    return [first, second]
  }

  const stringNumberPair = pair<string, number>('age', 25)
  const booleanStringPair = pair<boolean, string>(true, 'success')

  console.log('多类型参数：', stringNumberPair, booleanStringPair) // [ 'age', 25 ] [ true, 'success' ]

  // ==================== 2. 泛型接口 ====================
  // 定义泛型接口

  // 2.1 基础泛型接口
  interface Box<T> {
    value: T
    getValue(): T
    setValue(value: T): void
  }

  // 实现泛型接口
  class StringBox implements Box<string> {
    constructor(private _value: string) { }

    get value(): string {
      return this._value
    }

    getValue(): string {
      return this._value
    }

    setValue(value: string): void {
      this._value = value
    }
  }

  class NumberBox implements Box<number> {
    constructor(private _value: number) { }

    get value(): number {
      return this._value
    }

    getValue(): number {
      return this._value
    }

    setValue(value: number): void {
      this._value = value
    }
  }

  const stringBox = new StringBox('Hello')
  const numberBox = new NumberBox(42)

  console.log('泛型接口：', stringBox.getValue(), numberBox.getValue())

  // 2.2 函数类型泛型接口
  interface Comparator<T> {
    (a: T, b: T): number
  }

  interface Transformer<T, U> {
    (input: T): U
  }

  // 使用函数类型泛型接口
  const numberComparator: Comparator<number> = (a, b) => a - b
  const stringComparator: Comparator<string> = (a, b) => a.localeCompare(b)
  const numberToString: Transformer<number, string> = (num) => num.toString()

  console.log('函数类型接口：', numberComparator(5, 3), stringComparator('b', 'a'), numberToString(42))

  // ==================== 3. 泛型类 ====================
  // 定义泛型类

  // 3.1 基础泛型类
  class Container<T> {
    private items: T[] = []

    add(item: T): void {
      this.items.push(item)
    }

    remove(item: T): boolean {
      const index = this.items.indexOf(item)
      if (index > -1) {
        this.items.splice(index, 1)
        return true
      }
      return false
    }

    get(index: number): T | undefined {
      return this.items[index]
    }

    getAll(): T[] {
      return [...this.items]
    }

    size(): number {
      return this.items.length
    }
  }

  // 使用泛型类
  const stringContainer = new Container<string>()
  stringContainer.add('apple')
  stringContainer.add('banana')
  stringContainer.add('orange')

  const numberContainer = new Container<number>()
  numberContainer.add(1)
  numberContainer.add(2)
  numberContainer.add(3)

  console.log('泛型类：', stringContainer.getAll(), numberContainer.getAll())

  // 3.2 多类型参数泛型类
  class KeyValuePair<K, V> {
    constructor(private key: K, private value: V) { }

    getKey(): K {
      return this.key
    }

    getValue(): V {
      return this.value
    }

    setValue(value: V): void {
      this.value = value
    }

    toString(): string {
      return `${this.key}: ${this.value}`
    }
  }

  const userAge = new KeyValuePair<string, number>('张三', 25)
  const productPrice = new KeyValuePair<number, string>(1, '¥99.99')

  console.log('多类型参数类：', userAge.toString(), productPrice.toString()) // 张三: 25 1: ¥99.99

  // ==================== 4. 泛型约束 ====================
  // 限制泛型类型的范围

  // 4.1 基础约束
  interface HasLength {
    length: number
  }

  function getLength<T extends HasLength>(item: T): number {
    return item.length
  }

  // 可以用于字符串、数组等有 length 属性的类型
  console.log('长度约束：', getLength('Hello'), getLength([1, 2, 3]), getLength({ length: 5 })) // 5 3 5

  // 4.2 多重约束
  interface HasId {
    id: number
  }

  interface HasName {
    name: string
  }

  function processItem<T extends HasId & HasName>(item: T): string {
    return `ID: ${item.id}, Name: ${item.name}`
  }

  const user = { id: 1, name: '李四', age: 30 }
  console.log('多重约束：', processItem(user))

  // 4.3 keyof 约束
  function getProperty<T, K extends keyof T>(obj: T, key: K): T[K] {
    return obj[key]
  }

  const person = { name: '王五', age: 28, city: '北京' }
  console.log('keyof 约束：', getProperty(person, 'name'), getProperty(person, 'age'))

  // ==================== 5. 泛型默认值 ====================
  // 为泛型参数提供默认类型

  // 5.1 函数泛型默认值
  function createArray<T = string>(length: number, value: T): T[] {
    return Array(length).fill(value)
  }

  const stringArray = createArray(3, 'default') // 使用默认类型 string
  const numberArray = createArray<number>(3, 0) // 显式指定类型

  console.log('泛型默认值：', stringArray, numberArray)

  // 5.2 接口泛型默认值
  interface ApiResponse<T = any> {
    success: boolean
    data: T
    message: string
  }

  const userResponse: ApiResponse = { success: true, data: user, message: 'Success' }
  const numberResponse: ApiResponse<number> = { success: true, data: 42, message: 'Success' }

  console.log('接口默认值：', userResponse, numberResponse)

  // ==================== 6. 条件类型 ====================
  // 基于条件选择类型

  // 6.1 基础条件类型
  type NonNullable<T> = T extends null | undefined ? never : T
  type StringOrNumber<T> = T extends string ? string : T extends number ? number : never

  type Test1 = NonNullable<string | null> // string
  type Test2 = StringOrNumber<string> // string
  type Test3 = StringOrNumber<number> // number

  // 6.2 映射条件类型
  type Optional<T> = {
    [K in keyof T]?: T[K]
  }

  type Required<T> = {
    [K in keyof T]-?: T[K]
  }

  type Readonly<T> = {
    readonly [K in keyof T]: T[K]
  }

  // ==================== 7. 实际应用示例 ====================
  // 综合运用泛型的实际例子

  // 7.1 数据存储服务
  interface DataStore<T> {
    save(key: string, data: T): void
    get(key: string): T | null
    delete(key: string): boolean
    has(key: string): boolean
  }

  class MemoryStore<T> implements DataStore<T> {
    private storage = new Map<string, T>()

    save(key: string, data: T): void {
      this.storage.set(key, data)
    }

    get(key: string): T | null {
      return this.storage.get(key) || null
    }

    delete(key: string): boolean {
      return this.storage.delete(key)
    }

    has(key: string): boolean {
      return this.storage.has(key)
    }
  }

  // 使用数据存储服务
  const userStore = new MemoryStore<{ id: number; name: string; email: string }>()
  const configStore = new MemoryStore<{ theme: string; language: string }>()

  userStore.save('user1', { id: 1, name: '赵六', email: 'zhaoliu@example.com' })
  configStore.save('app', { theme: 'dark', language: 'zh-CN' })

  console.log('数据存储：', userStore.get('user1'), configStore.get('app'))

  // 7.2 API 请求工具
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
    async request<TRequest = any, TResponse = any>(
      config: ApiRequest<TRequest>
    ): Promise<ApiResponse<TResponse>> {
      // 模拟 API 请求
      return {
        success: true,
        data: {} as TResponse,
        message: 'Success',
        status: 200
      }
    }

    async get<T>(url: string): Promise<ApiResponse<T>> {
      return this.request<never, T>({ url, method: 'GET' })
    }

    async post<TRequest, TResponse>(url: string, data: TRequest): Promise<ApiResponse<TResponse>> {
      return this.request<TRequest, TResponse>({ url, method: 'POST', data })
    }
  }

  // 使用 API 客户端
  const apiClient = new ApiClient()

  interface User {
    id: number
    name: string
    email: string
  }

  interface CreateUserRequest {
    name: string
    email: string
  }

  // 模拟 API 调用
  const getUser = async (id: number) => {
    return apiClient.get<User>(`/users/${id}`)
  }

  const createUser = async (userData: CreateUserRequest) => {
    return apiClient.post<CreateUserRequest, User>('/users', userData)
  }

  console.log('API 客户端：', getUser, createUser)

  // 7.3 事件系统
  type EventHandler<T = any> = (data: T) => void

  class EventEmitter {
    private events = new Map<string, EventHandler[]>()

    on<T>(event: string, handler: EventHandler<T>): void {
      if (!this.events.has(event)) {
        this.events.set(event, [])
      }
      this.events.get(event)!.push(handler)
    }

    emit<T>(event: string, data: T): void {
      const handlers = this.events.get(event)
      if (handlers) {
        handlers.forEach(handler => handler(data))
      }
    }

    off(event: string, handler: EventHandler): void {
      const handlers = this.events.get(event)
      if (handlers) {
        const index = handlers.indexOf(handler)
        if (index > -1) {
          handlers.splice(index, 1)
        }
      }
    }
  }

  // 使用事件系统
  const eventEmitter = new EventEmitter()

  interface UserEvent {
    userId: number
    action: string
    timestamp: Date
  }

  eventEmitter.on<UserEvent>('userAction', (data) => {
    console.log('用户事件：', data)
  })

  eventEmitter.emit<UserEvent>('userAction', {
    userId: 1,
    action: 'login',
    timestamp: new Date()
  })

  // ==================== 8. 泛型最佳实践 ====================
  /*
  📚 泛型使用最佳实践：
  
  1. 命名规范
     ✅ 使用有意义的类型参数名称（T, U, V 或更具描述性的名称）
     ✅ 保持命名一致性
     ✅ 避免使用单个字母（除非是标准约定）
  
  2. 约束使用
     ✅ 合理使用泛型约束
     ✅ 避免过度约束
     ✅ 使用 extends 而不是 implements
  
  3. 类型推断
     ✅ 充分利用 TypeScript 的类型推断
     ✅ 只在必要时显式指定类型参数
     ✅ 注意复杂表达式的类型推断
  
  4. 性能考虑
     ✅ 避免过度复杂的泛型
     ✅ 合理使用条件类型
     ✅ 注意编译时性能
  
  5. 实际应用
     ✅ 数据结构和算法
     ✅ API 和数据库操作
     ✅ 状态管理
     ✅ 工具函数
  
  🎯 重点掌握：
  - 理解泛型的基本概念和语法
  - 掌握泛型约束和条件类型
  - 学会在实际项目中合理使用泛型
  - 理解泛型的类型安全和代码复用优势
  */
}
