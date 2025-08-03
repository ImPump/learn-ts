/*
TypeScript 装饰器学习笔记
装饰器是一种特殊类型的声明，可以附加到类声明、方法、属性或参数上
注意：装饰器是实验性特性，需要在 tsconfig.json 中启用 "experimentalDecorators": true
*/

// ==================== 1. 类装饰器 ====================
// 类装饰器在类声明之前被声明，应用于类的构造函数

// 1.1 基础类装饰器
function classDecorator(constructor: Function) {
  console.log('类装饰器被调用，构造函数：', constructor.name)
  
  // 可以修改类的原型
  constructor.prototype.timestamp = new Date()
  constructor.prototype.getTimestamp = function() {
    return this.timestamp
  }
}

@classDecorator
class ExampleClass {
  name: string
  
  constructor(name: string) {
    this.name = name
  }
}

const example = new ExampleClass('测试')
console.log('类装饰器示例：', (example as any).getTimestamp())

// 1.2 装饰器工厂
function classDecoratorFactory(message: string) {
  return function(constructor: Function) {
    console.log(`装饰器工厂：${message}`)
    
    // 添加静态属性
    constructor.prototype.message = message
    
    // 添加静态方法
    constructor.getInfo = function() {
      return `类名：${constructor.name}，消息：${message}`
    }
  }
}

@classDecoratorFactory('这是一个装饰器工厂')
class DecoratedClass {
  constructor() {
    console.log('DecoratedClass 构造函数')
  }
}

console.log('装饰器工厂示例：', (DecoratedClass as any).getInfo())

// 1.3 多个装饰器
function firstDecorator(constructor: Function) {
  console.log('第一个装饰器')
  constructor.prototype.first = true
}

function secondDecorator(constructor: Function) {
  console.log('第二个装饰器')
  constructor.prototype.second = true
}

@firstDecorator
@secondDecorator
class MultiDecoratedClass {
  constructor() {
    console.log('MultiDecoratedClass 构造函数')
  }
}

const multi = new MultiDecoratedClass()
console.log('多个装饰器：', (multi as any).first, (multi as any).second)

// ==================== 2. 方法装饰器 ====================
// 方法装饰器声明在一个方法的声明之前

// 2.1 基础方法装饰器
function methodDecorator(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
  console.log('方法装饰器参数：', {
    target: target.constructor.name,
    propertyKey,
    descriptor
  })
  
  // 保存原始方法
  const originalMethod = descriptor.value
  
  // 修改方法行为
  descriptor.value = function(...args: any[]) {
    console.log(`调用方法：${propertyKey}，参数：`, args)
    const result = originalMethod.apply(this, args)
    console.log(`方法 ${propertyKey} 返回：`, result)
    return result
  }
}

class MethodExample {
  @methodDecorator
  add(a: number, b: number): number {
    return a + b
  }
  
  @methodDecorator
  greet(name: string): string {
    return `Hello, ${name}!`
  }
}

const methodExample = new MethodExample()
console.log('方法装饰器示例：', methodExample.add(5, 3))
console.log('方法装饰器示例：', methodExample.greet('张三'))

// 2.2 方法装饰器工厂
function logMethod(prefix: string = '') {
  return function(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value
    
    descriptor.value = function(...args: any[]) {
      const start = Date.now()
      const result = originalMethod.apply(this, args)
      const end = Date.now()
      
      console.log(`${prefix}方法 ${propertyKey} 执行时间：${end - start}ms`)
      return result
    }
  }
}

class PerformanceExample {
  @logMethod('[性能监控]')
  slowMethod() {
    // 模拟耗时操作
    const start = Date.now()
    while (Date.now() - start < 100) {
      // 等待100ms
    }
    return '慢方法执行完成'
  }
  
  @logMethod('[API调用]')
  async fetchData() {
    // 模拟异步操作
    await new Promise(resolve => setTimeout(resolve, 50))
    return { data: '模拟数据' }
  }
}

const perfExample = new PerformanceExample()
perfExample.slowMethod()
perfExample.fetchData()

// ==================== 3. 属性装饰器 ====================
// 属性装饰器声明在一个属性声明之前

// 3.1 基础属性装饰器
function propertyDecorator(target: any, propertyKey: string) {
  console.log('属性装饰器参数：', {
    target: target.constructor.name,
    propertyKey
  })
  
  // 可以修改属性的行为
  let value: any
  
  // 创建 getter 和 setter
  Object.defineProperty(target, propertyKey, {
    get: function() {
      console.log(`获取属性：${propertyKey}`)
      return value
    },
    set: function(newValue: any) {
      console.log(`设置属性：${propertyKey} = ${newValue}`)
      value = newValue
    },
    enumerable: true,
    configurable: true
  })
}

class PropertyExample {
  @propertyDecorator
  name: string = ''
  
  @propertyDecorator
  age: number = 0
}

const propExample = new PropertyExample()
propExample.name = '李四'
propExample.age = 25
console.log('属性装饰器示例：', propExample.name, propExample.age)

// 3.2 属性验证装饰器
function validate(min: number, max: number) {
  return function(target: any, propertyKey: string) {
    let value: number
    
    Object.defineProperty(target, propertyKey, {
      get: function() {
        return value
      },
      set: function(newValue: number) {
        if (newValue < min || newValue > max) {
          throw new Error(`${propertyKey} 必须在 ${min} 和 ${max} 之间`)
        }
        value = newValue
      },
      enumerable: true,
      configurable: true
    })
  }
}

class ValidationExample {
  @validate(0, 150)
  age: number = 0
  
  @validate(0, 1000000)
  salary: number = 0
}

const validationExample = new ValidationExample()
validationExample.age = 25
validationExample.salary = 50000

try {
  validationExample.age = 200 // 会抛出错误
} catch (error) {
  console.log('验证错误：', error.message)
}

// ==================== 4. 参数装饰器 ====================
// 参数装饰器声明在一个参数声明之前

// 4.1 基础参数装饰器
function parameterDecorator(target: any, propertyKey: string, parameterIndex: number) {
  console.log('参数装饰器参数：', {
    target: target.constructor.name,
    propertyKey,
    parameterIndex
  })
  
  // 可以记录参数信息
  if (!target.constructor.parameterMetadata) {
    target.constructor.parameterMetadata = {}
  }
  
  if (!target.constructor.parameterMetadata[propertyKey]) {
    target.constructor.parameterMetadata[propertyKey] = []
  }
  
  target.constructor.parameterMetadata[propertyKey][parameterIndex] = {
    index: parameterIndex,
    type: 'unknown'
  }
}

class ParameterExample {
  method(
    @parameterDecorator name: string,
    @parameterDecorator age: number,
    @parameterDecorator email: string
  ) {
    console.log(`方法调用：${name}, ${age}, ${email}`)
  }
}

const paramExample = new ParameterExample()
paramExample.method('王五', 30, 'wangwu@example.com')
console.log('参数元数据：', (ParameterExample as any).parameterMetadata)

// ==================== 5. 实际应用示例 ====================
// 综合运用装饰器的实际例子

// 5.1 API 路由装饰器
interface RouteMetadata {
  path: string
  method: 'GET' | 'POST' | 'PUT' | 'DELETE'
  handler: string
}

function Route(path: string, method: 'GET' | 'POST' | 'PUT' | 'DELETE' = 'GET') {
  return function(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    if (!target.constructor.routes) {
      target.constructor.routes = []
    }
    
    target.constructor.routes.push({
      path,
      method,
      handler: propertyKey
    })
    
    console.log(`注册路由：${method} ${path} -> ${propertyKey}`)
  }
}

class UserController {
  @Route('/users', 'GET')
  getUsers() {
    return [{ id: 1, name: '张三' }, { id: 2, name: '李四' }]
  }
  
  @Route('/users/:id', 'GET')
  getUser(id: string) {
    return { id: parseInt(id), name: '用户' }
  }
  
  @Route('/users', 'POST')
  createUser(userData: any) {
    return { id: Math.floor(Math.random() * 1000), ...userData }
  }
  
  @Route('/users/:id', 'PUT')
  updateUser(id: string, userData: any) {
    return { id: parseInt(id), ...userData }
  }
  
  @Route('/users/:id', 'DELETE')
  deleteUser(id: string) {
    return { success: true, message: `用户 ${id} 已删除` }
  }
}

console.log('路由注册：', (UserController as any).routes)

// 5.2 缓存装饰器
function Cache(ttl: number = 60000) {
  return function(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value
    const cache = new Map<string, { data: any; timestamp: number }>()
    
    descriptor.value = function(...args: any[]) {
      const key = `${propertyKey}:${JSON.stringify(args)}`
      const now = Date.now()
      
      // 检查缓存
      if (cache.has(key)) {
        const cached = cache.get(key)!
        if (now - cached.timestamp < ttl) {
          console.log(`缓存命中：${propertyKey}`)
          return cached.data
        }
      }
      
      // 执行原方法
      const result = originalMethod.apply(this, args)
      
      // 缓存结果
      cache.set(key, { data: result, timestamp: now })
      console.log(`缓存存储：${propertyKey}`)
      
      return result
    }
  }
}

class DataService {
  @Cache(5000) // 5秒缓存
  async fetchUserData(userId: number) {
    console.log('从服务器获取用户数据...')
    // 模拟网络请求
    await new Promise(resolve => setTimeout(resolve, 100))
    return { id: userId, name: '用户', data: '用户数据' }
  }
  
  @Cache(10000) // 10秒缓存
  async fetchProductData(productId: string) {
    console.log('从服务器获取产品数据...')
    await new Promise(resolve => setTimeout(resolve, 100))
    return { id: productId, name: '产品', price: 99.99 }
  }
}

const dataService = new DataService()

// 第一次调用，会从服务器获取
dataService.fetchUserData(1)
dataService.fetchProductData('prod-001')

// 第二次调用，会使用缓存
setTimeout(() => {
  dataService.fetchUserData(1)
  dataService.fetchProductData('prod-001')
}, 1000)

// 5.3 权限验证装饰器
function RequireAuth(permission?: string) {
  return function(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value
    
    descriptor.value = function(...args: any[]) {
      // 模拟权限检查
      const user = { id: 1, name: '当前用户', permissions: ['read', 'write'] }
      
      if (permission && !user.permissions.includes(permission)) {
        throw new Error(`权限不足：需要 ${permission} 权限`)
      }
      
      console.log(`权限验证通过：${propertyKey}`)
      return originalMethod.apply(this, args)
    }
  }
}

class SecureService {
  @RequireAuth('read')
  getPublicData() {
    return { message: '公开数据' }
  }
  
  @RequireAuth('write')
  updateData(data: any) {
    return { success: true, data }
  }
  
  @RequireAuth('admin')
  deleteData(id: string) {
    return { success: true, message: `数据 ${id} 已删除` }
  }
}

const secureService = new SecureService()

try {
  console.log(secureService.getPublicData())
  console.log(secureService.updateData({ name: '新数据' }))
  secureService.deleteData('123') // 会抛出权限错误
} catch (error) {
  console.log('权限错误：', error.message)
}

// ==================== 6. 装饰器最佳实践 ====================
/*
📚 装饰器使用最佳实践：

1. 设计原则
   ✅ 单一职责：每个装饰器只负责一个功能
   ✅ 可组合性：装饰器应该可以自由组合
   ✅ 副作用最小：避免过度修改原对象

2. 类型安全
   ✅ 使用正确的类型定义
   ✅ 处理泛型装饰器
   ✅ 提供完整的类型注解

3. 性能考虑
   ✅ 避免在装饰器中执行耗时操作
   ✅ 合理使用缓存
   ✅ 注意内存泄漏

4. 调试友好
   ✅ 提供清晰的日志信息
   ✅ 使用有意义的装饰器名称
   ✅ 处理错误情况

5. 实际应用
   ✅ 路由注册
   ✅ 缓存管理
   ✅ 权限验证
   ✅ 日志记录

🎯 重点掌握：
- 理解装饰器的概念和语法
- 掌握各种类型装饰器的用法
- 学会在实际项目中合理使用装饰器
- 理解装饰器的执行顺序和组合方式
*/