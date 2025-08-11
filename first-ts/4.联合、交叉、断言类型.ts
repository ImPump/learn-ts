/*
TypeScript 联合类型、交叉类型、类型断言学习笔记
包含高级类型操作和类型安全的实践
*/
namespace 联合_交叉_断言类型 {

  // ==================== 1. 联合类型 (Union Types) ====================
  // 联合类型使用 | 符号，表示一个值可以是多种类型中的任意一种

  // 基础联合类型示例
  let phoneNumber: number | string = '010-820-1234' // 座机号码
  phoneNumber = 13812345678 // 手机号码

  // 这样写会报错，因为联合类型中没有布尔值
  // let phoneNumber: number | string = true

  console.log('联合类型示例：', phoneNumber)

  // 函数参数使用联合类型
  function formatContact(contact: number | string): string {
    if (typeof contact === 'number') {
      return `手机号：${contact}`
    } else {
      return `座机号：${contact}`
    }
  }

  console.log('函数联合类型：', formatContact(13812345678))
  console.log('函数联合类型：', formatContact('010-820-1234'))

  // 联合类型数组
  let mixedArray: (string | number | boolean)[] = ['hello', 42, true, 'world', 100]

  // 联合类型对象
  type Status = 'pending' | 'success' | 'error'
  let requestStatus: Status = 'pending'

  // ==================== 2. 交叉类型 (Intersection Types) ====================
  // 交叉类型使用 & 符号，表示一个对象必须同时具有多个类型的所有属性

  // 基础交叉类型示例
  interface Person {
    name: string
    age: number
  }

  interface Employee {
    id: number
    department: string
  }

  // 交叉类型：同时具有 Person 和 Employee 的所有属性
  type EmployeePerson = Person & Employee

  const employee: EmployeePerson = {
    name: '张三',
    age: 30,
    id: 1001,
    department: '技术部'
  }

  console.log('交叉类型示例：', employee)

  // 函数使用交叉类型
  function processEmployee(person: Person & Employee): void {
    console.log(`员工 ${person.name}，年龄 ${person.age}，工号 ${person.id}，部门 ${person.department}`)
  }

  processEmployee(employee)

  // ==================== 3. 类型断言 (Type Assertions) ====================
  // 类型断言允许我们告诉 TypeScript 编译器一个值的具体类型

  // 基础类型断言
  let someValue: unknown = 'hello world'
  let strLength: number = (someValue as string).length

  console.log('基础类型断言：', strLength)

  // 接口类型断言
  interface Car {
    brand: string
    model: string
    start(): void
  }

  interface Bike {
    brand: string
    wheels: number
    pedal(): void
  }

  function processVehicle(vehicle: Car | Bike): void {
    // 使用类型断言来访问特定属性
    if ((vehicle as Car).start) {
      (vehicle as Car).start()
    } else if ((vehicle as Bike).pedal) {
      (vehicle as Bike).pedal()
    }
  }

  const car: Car = {
    brand: '丰田',
    model: '凯美瑞',
    start() {
      console.log(`${this.brand} ${this.model} 启动了`)
    }
  }

  const bike: Bike = {
    brand: '捷安特',
    wheels: 2,
    pedal() {
      console.log(`${this.brand} 自行车开始骑行`)
    }
  }

  processVehicle(car)
  processVehicle(bike)

  // ==================== 4. 类型守卫 (Type Guards) ====================
  // 类型守卫是运行时检查，用于缩小联合类型的范围

  // typeof 类型守卫
  function processValue(value: string | number): string {
    if (typeof value === 'string') {
      return value.toUpperCase()
    } else {
      return value.toString()
    }
  }

  console.log('类型守卫示例：', processValue('hello'), processValue(42))

  // instanceof 类型守卫
  class Animal {
    name: string
    constructor(name: string) {
      this.name = name
    }
  }

  class Dog extends Animal {
    bark(): void {
      console.log(`${this.name} 汪汪叫`)
    }
  }

  class Cat extends Animal {
    meow(): void {
      console.log(`${this.name} 喵喵叫`)
    }
  }

  function makeSound(animal: Animal): void {
    if (animal instanceof Dog) {
      animal.bark()
    } else if (animal instanceof Cat) {
      animal.meow()
    }
  }

  const dog = new Dog('旺财')
  const cat = new Cat('咪咪')

  makeSound(dog)
  makeSound(cat)

  // ==================== 5. as const 断言 ====================
  // as const 将值断言为最具体的字面量类型

  // 普通 const 声明
  const normalConst = 'hello' // 类型是 string

  // as const 断言
  const constAssertion = 'hello' as const // 类型是 'hello'

  // 数组的 as const
  const colors = ['red', 'green', 'blue'] as const

  // 对象的 as const
  const config = {
    apiUrl: 'https://api.example.com',
    timeout: 5000
  } as const

  console.log('as const 示例：', constAssertion, colors, config)

  // ==================== 6. 实际应用示例 ====================
  // 综合运用各种类型特性的实际例子

  // 用户系统类型定义
  interface BaseUser {
    id: number
    name: string
    email: string
  }

  interface AdminUser {
    permissions: string[]
    canManageUsers: boolean
  }

  interface RegularUser {
    subscription: 'free' | 'premium'
    lastLogin: Date
  }

  // 联合类型：用户可以是管理员或普通用户
  type UserType = (BaseUser & AdminUser) | (BaseUser & RegularUser)

  // 类型守卫函数
  function isAdmin(user: UserType): user is BaseUser & AdminUser {
    return 'permissions' in user && 'canManageUsers' in user
  }

  function isRegularUser(user: UserType): user is BaseUser & RegularUser {
    return 'subscription' in user && 'lastLogin' in user
  }

  // 用户处理函数
  function processUser(user: UserType): string {
    if (isAdmin(user)) {
      return `管理员 ${user.name}，权限：${user.permissions.join(', ')}`
    } else if (isRegularUser(user)) {
      return `用户 ${user.name}，订阅：${user.subscription}`
    }
    return '未知用户类型'
  }

  // 创建用户实例
  const admin: BaseUser & AdminUser = {
    id: 1,
    name: '管理员',
    email: 'admin@example.com',
    permissions: ['read', 'write', 'delete'],
    canManageUsers: true
  }

  const regularUser: BaseUser & RegularUser = {
    id: 2,
    name: '普通用户',
    email: 'user@example.com',
    subscription: 'premium',
    lastLogin: new Date()
  }

  console.log('实际应用示例：')
  console.log(processUser(admin))
  console.log(processUser(regularUser))

  // ==================== 学习要点总结 ====================
  /*
  📚 TypeScript 联合类型、交叉类型、类型断言学习要点：
  
  1. 联合类型 (Union Types)
     ✅ 语法: 使用 | 符号连接多个类型
     ✅ 特点: 一个值可以是多种类型中的任意一种
     ✅ 应用: 函数参数、变量类型、返回值类型
     ✅ 类型守卫: 使用 typeof、instanceof 等缩小类型范围
  
  2. 交叉类型 (Intersection Types)
     ✅ 语法: 使用 & 符号连接多个类型
     ✅ 特点: 一个对象必须同时具有多个类型的所有属性
     ✅ 应用: 组合多个接口、扩展对象类型
     ✅ 类型合并: 将多个类型合并为一个更完整的类型
  
  3. 类型断言 (Type Assertions)
     ✅ 语法: 使用 as 或 <> 进行类型断言
     ✅ 用途: 告诉 TypeScript 编译器一个值的具体类型
     ✅ 安全: 需要确保断言的类型是正确的
     ✅ 应用: 处理 unknown 类型、DOM 操作、第三方库
  
  4. 类型守卫 (Type Guards)
     ✅ typeof: 用于基本类型的类型守卫
     ✅ instanceof: 用于类的类型守卫
     ✅ 自定义: 创建用户自定义的类型守卫函数
     ✅ 作用: 在运行时缩小联合类型的范围
  
  5. as const 断言
     ✅ 作用: 将值断言为最具体的字面量类型
     ✅ 应用: 常量定义、配置对象、API 响应
     ✅ 优势: 提供更精确的类型推断
  
  6. 实际应用
     ✅ 用户系统: 展示联合类型和交叉类型的实际应用
     ✅ 类型安全: 通过类型守卫确保类型安全
     ✅ 代码可读性: 通过类型断言提高代码可读性
  
  🎯 重点掌握：
  - 理解联合类型和交叉类型的区别和应用场景
  - 掌握类型断言的使用方法和注意事项
  - 学会使用类型守卫确保类型安全
  - 理解 as const 断言的作用和优势
  - 在实际项目中合理使用这些高级类型特性
  */
}