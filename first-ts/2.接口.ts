/*
TypeScript 接口学习笔记
接口（Interface）是 TypeScript 中定义对象类型的主要方式
*/
namespace 接口 {

  // ==================== 1. 基础接口定义 ====================
  interface Person {
    name: string
    age: number
    city: string
  }

  const person: Person = {
    name: '张三',
    age: 25,
    city: '北京'
  }

  console.log('基础接口示例：', person)

  // ==================== 2. 接口合并 ====================
  interface UserInfo {
    name: string
  }

  interface UserInfo {
    age: number
  }

  interface UserInfo {
    email: string
  }

  const userInfo: UserInfo = {
    name: '李四',
    age: 30,
    email: 'lisi@example.com'
  }

  console.log('接口合并示例：', userInfo)

  // ==================== 3. 接口继承 ====================
  interface Animal {
    name: string
  }

  interface Dog extends Animal {
    breed: string
  }

  const myDog: Dog = {
    name: '旺财',
    breed: '金毛'
  }

  console.log('接口继承示例：', myDog)

  // ==================== 4. 可选属性 ====================
  interface Employee {
    id: number
    name: string
    salary?: number // 可选属性
  }

  const employee1: Employee = {
    id: 1,
    name: '王五'
  }

  const employee2: Employee = {
    id: 2,
    name: '赵六',
    salary: 8000
  }

  console.log('可选属性示例：', employee1, employee2)

  // ==================== 5. 只读属性 ====================
  interface Config {
    readonly apiUrl: string
    timeout: number
  }

  const config: Config = {
    apiUrl: 'https://api.example.com',
    timeout: 5000
  }

  // config.apiUrl = 'https://new-api.example.com' // 错误！
  config.timeout = 10000 // 正确

  console.log('只读属性示例：', config)

  // ==================== 6. 索引签名 ====================
  interface FlexibleObject {
    name: string
    [propName: string]: any
  }

  const flexibleObj: FlexibleObject = {
    name: '张三',
    city: '北京',
    hobbies: ['读书', '游泳']
  }

  console.log('索引签名示例：', flexibleObj)

  // ==================== 7. 函数类型接口 ====================
  interface Calculator {
    (a: number, b: number): number
  }

  const addFunc: Calculator = (a: number, b: number): number => {
    return a + b
  }

  console.log('函数类型接口示例：', addFunc(5, 3))

  // ==================== 8. 实际应用示例 ====================
  interface Product {
    id: number
    name: string
    price: number
    category?: string
  }

  interface CartItem {
    product: Product
    quantity: number
  }

  interface ShoppingCart {
    items: CartItem[]
    total: number
    addItem(product: Product, quantity: number): void
    removeItem(productId: number): void
    calculateTotal(): void
  }

  const cart: ShoppingCart = {
    items: [],
    total: 0,
    addItem(product: Product, quantity: number) {
      const existingItem = this.items.find(item => item.product.id === product.id)
      if (existingItem) {
        existingItem.quantity += quantity
      } else {
        this.items.push({ product, quantity })
      }
      this.calculateTotal()
    },
    removeItem(productId: number) {
      this.items = this.items.filter(item => item.product.id !== productId)
      this.calculateTotal()
    },
    calculateTotal() {
      this.total = this.items.reduce((sum, item) => sum + item.product.price * item.quantity, 0)
    }
  }

  const product1: Product = { id: 1, name: '苹果', price: 5, category: '水果' }
  const product2: Product = { id: 2, name: '香蕉', price: 3, category: '水果' }

  cart.addItem(product1, 2)
  cart.addItem(product2, 1)

  console.log('购物车示例：', cart)

  // ==================== 学习要点总结 ====================
  /*
  📚 TypeScript 接口学习要点：
  
  1. 基础接口定义
     ✅ interface: 定义对象类型的标准方式
     ✅ 属性定义: 必需属性、可选属性、只读属性
     ✅ 类型安全: 确保对象符合接口定义
  
  2. 接口特性
     ✅ 接口合并: 同名接口会自动合并
     ✅ 接口继承: 使用 extends 继承其他接口
     ✅ 索引签名: 支持动态属性名
     ✅ 函数类型: 定义函数签名
  
  3. 访问修饰符
     ✅ readonly: 只读属性，创建后不能修改
     ✅ 可选属性: 使用 ? 标记可选属性
     ✅ 任意属性: 使用索引签名支持额外属性
  
  4. 接口应用场景
     ✅ 对象类型定义: 定义复杂对象结构
     ✅ 函数类型定义: 定义函数参数和返回值
     ✅ API 接口定义: 定义前后端交互的数据结构
     ✅ 组件属性定义: 在 React 等框架中定义组件 props
  
  5. 实际应用
     ✅ 购物车系统: 展示接口在业务逻辑中的应用
     ✅ 类型安全: 确保数据结构的正确性
     ✅ 代码可维护性: 通过接口提高代码的可读性和可维护性
  
  🎯 重点掌握：
  - 理解接口的核心概念和作用
  - 掌握接口的各种特性和用法
  - 学会在实际项目中合理使用接口
  - 理解接口对代码质量和可维护性的重要性
  */
}