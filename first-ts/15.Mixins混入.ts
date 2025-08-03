/*
TypeScript Mixins 混入学习笔记
Mixins 是一种代码复用的方式，通过组合多个类的功能来创建新的类
*/

// ==================== 1. 对象混入 ====================
// 使用 Object.assign 合并多个对象

// 1.1 基础对象混入
interface Name {
  name: string
}

interface Age {
  age: number
}

interface Email {
  email: string
}

const personWithName: Name = { name: '张三' }
const personWithAge: Age = { age: 25 }
const personWithEmail: Email = { email: 'zhangsan@example.com' }

// 使用 Object.assign 合并对象
const completePerson = Object.assign(personWithName, personWithAge, personWithEmail)

console.log('对象混入：', completePerson)

// 1.2 类型安全的对象混入
type Person = Name & Age & Email

function createPerson(name: string, age: number, email: string): Person {
  return Object.assign(
    { name },
    { age },
    { email }
  )
}

const newPerson = createPerson('李四', 30, 'lisi@example.com')
console.log('类型安全的混入：', newPerson)

// ==================== 2. 类混入 ====================
// 通过组合多个类的功能来创建新的类

// 2.1 定义 Mixin 类
class TimestampMixin {
  createdAt: Date = new Date()
  
  getCreatedTime(): string {
    return this.createdAt.toISOString()
  }
  
  updateTimestamp(): void {
    this.createdAt = new Date()
  }
}

class LoggerMixin {
  log(message: string): void {
    console.log(`[${new Date().toISOString()}] ${message}`)
  }
  
  error(message: string): void {
    console.error(`[${new Date().toISOString()}] ERROR: ${message}`)
  }
}

class ValidatorMixin {
  validateEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }
  
  validateAge(age: number): boolean {
    return age >= 0 && age <= 150
  }
}

// 2.2 创建混入函数
function applyMixins(derivedCtor: any, constructors: any[]) {
  constructors.forEach((baseCtor) => {
    Object.getOwnPropertyNames(baseCtor.prototype).forEach((name) => {
      Object.defineProperty(
        derivedCtor.prototype,
        name,
        Object.getOwnPropertyDescriptor(baseCtor.prototype, name) ||
        Object.create(null)
      )
    })
  })
}

// 2.3 使用混入创建类
class User {
  constructor(
    public name: string,
    public email: string,
    public age: number
  ) {}
  
  getInfo(): string {
    return `${this.name} (${this.email}) - ${this.age}岁`
  }
}

// 应用混入
interface User extends TimestampMixin, LoggerMixin, ValidatorMixin {}
applyMixins(User, [TimestampMixin, LoggerMixin, ValidatorMixin])

// 使用混入后的类
const user = new User('王五', 'wangwu@example.com', 28)
console.log('用户信息：', user.getInfo())
console.log('创建时间：', user.getCreatedTime())
user.log('用户已创建')
console.log('邮箱验证：', user.validateEmail(user.email))
console.log('年龄验证：', user.validateAge(user.age))

// ==================== 3. 高级混入模式 ====================
// 更复杂的混入实现

// 3.1 条件混入
class ConditionalMixin {
  isEnabled: boolean = true
  
  enable(): void {
    this.isEnabled = true
  }
  
  disable(): void {
    this.isEnabled = false
  }
  
  whenEnabled<T>(action: () => T): T | null {
    return this.isEnabled ? action() : null
  }
}

// 3.2 状态管理混入
class StateMixin<T> {
  private state: T
  
  constructor(initialState: T) {
    this.state = initialState
  }
  
  getState(): T {
    return this.state
  }
  
  setState(newState: Partial<T>): void {
    this.state = { ...this.state, ...newState }
  }
  
  updateState(updater: (state: T) => Partial<T>): void {
    this.setState(updater(this.state))
  }
}

// 3.3 事件系统混入
class EventMixin {
  private events: Map<string, Function[]> = new Map()
  
  on(event: string, handler: Function): void {
    if (!this.events.has(event)) {
      this.events.set(event, [])
    }
    this.events.get(event)!.push(handler)
  }
  
  off(event: string, handler: Function): void {
    const handlers = this.events.get(event)
    if (handlers) {
      const index = handlers.indexOf(handler)
      if (index > -1) {
        handlers.splice(index, 1)
      }
    }
  }
  
  emit(event: string, ...args: any[]): void {
    const handlers = this.events.get(event)
    if (handlers) {
      handlers.forEach(handler => handler(...args))
    }
  }
}

// ==================== 4. 实际应用示例 ====================
// 综合运用混入的实际例子

// 4.1 购物车系统
interface CartItem {
  id: string
  name: string
  price: number
  quantity: number
}

interface CartState {
  items: CartItem[]
  total: number
  itemCount: number
}

class ShoppingCart {
  constructor() {
    // 初始化状态
    this.setState({
      items: [],
      total: 0,
      itemCount: 0
    })
  }
  
  addItem(item: Omit<CartItem, 'quantity'>, quantity: number = 1): void {
    const existingItem = this.getState().items.find(i => i.id === item.id)
    
    if (existingItem) {
      this.updateState(state => ({
        items: state.items.map(i => 
          i.id === item.id 
            ? { ...i, quantity: i.quantity + quantity }
            : i
        )
      }))
    } else {
      this.updateState(state => ({
        items: [...state.items, { ...item, quantity }]
      }))
    }
    
    this.updateTotals()
    this.emit('itemAdded', item, quantity)
  }
  
  removeItem(itemId: string): void {
    this.updateState(state => ({
      items: state.items.filter(item => item.id !== itemId)
    }))
    
    this.updateTotals()
    this.emit('itemRemoved', itemId)
  }
  
  updateQuantity(itemId: string, quantity: number): void {
    if (quantity <= 0) {
      this.removeItem(itemId)
      return
    }
    
    this.updateState(state => ({
      items: state.items.map(item => 
        item.id === itemId 
          ? { ...item, quantity }
          : item
      )
    }))
    
    this.updateTotals()
    this.emit('quantityUpdated', itemId, quantity)
  }
  
  private updateTotals(): void {
    this.updateState(state => {
      const total = state.items.reduce((sum, item) => sum + (item.price * item.quantity), 0)
      const itemCount = state.items.reduce((sum, item) => sum + item.quantity, 0)
      return { total, itemCount }
    })
  }
  
  clear(): void {
    this.setState({ items: [], total: 0, itemCount: 0 })
    this.emit('cartCleared')
  }
  
  getItems(): CartItem[] {
    return this.getState().items
  }
  
  getTotal(): number {
    return this.getState().total
  }
  
  getItemCount(): number {
    return this.getState().itemCount
  }
}

// 应用混入到购物车
interface ShoppingCart extends StateMixin<CartState>, EventMixin, LoggerMixin {}
applyMixins(ShoppingCart, [StateMixin, EventMixin, LoggerMixin])

// 使用购物车
const cart = new ShoppingCart()

// 添加事件监听
cart.on('itemAdded', (item: CartItem, quantity: number) => {
  cart.log(`添加商品: ${item.name} x${quantity}`)
})

cart.on('itemRemoved', (itemId: string) => {
  cart.log(`移除商品: ${itemId}`)
})

cart.on('cartCleared', () => {
  cart.log('购物车已清空')
})

// 操作购物车
cart.addItem({ id: '1', name: 'iPhone', price: 5999 }, 1)
cart.addItem({ id: '2', name: 'MacBook', price: 12999 }, 1)
cart.addItem({ id: '1', name: 'iPhone', price: 5999 }, 1) // 增加数量

console.log('购物车商品：', cart.getItems())
console.log('总价：', cart.getTotal())
console.log('商品数量：', cart.getItemCount())

cart.updateQuantity('1', 3)
cart.removeItem('2')

console.log('更新后商品：', cart.getItems())
console.log('更新后总价：', cart.getTotal())

// 4.2 表单验证系统
interface FormField {
  name: string
  value: any
  isValid: boolean
  errors: string[]
}

interface FormState {
  fields: Record<string, FormField>
  isValid: boolean
  isDirty: boolean
}

class FormValidator {
  private validators: Map<string, (value: any) => string | null> = new Map()
  
  addValidator(fieldName: string, validator: (value: any) => string | null): void {
    this.validators.set(fieldName, validator)
  }
  
  validateField(fieldName: string, value: any): string[] {
    const validator = this.validators.get(fieldName)
    if (validator) {
      const error = validator(value)
      return error ? [error] : []
    }
    return []
  }
  
  validateAll(fields: Record<string, any>): Record<string, string[]> {
    const errors: Record<string, string[]> = {}
    
    for (const [fieldName, value] of Object.entries(fields)) {
      errors[fieldName] = this.validateField(fieldName, value)
    }
    
    return errors
  }
}

class Form {
  constructor() {
    this.setState({
      fields: {},
      isValid: true,
      isDirty: false
    })
  }
  
  addField(name: string, initialValue: any = ''): void {
    this.updateState(state => ({
      fields: {
        ...state.fields,
        [name]: {
          name,
          value: initialValue,
          isValid: true,
          errors: []
        }
      }
    }))
  }
  
  setFieldValue(name: string, value: any): void {
    this.updateState(state => {
      const field = state.fields[name]
      if (!field) return state
      
      const errors = this.validateField(name, value)
      const isValid = errors.length === 0
      
      return {
        fields: {
          ...state.fields,
          [name]: {
            ...field,
            value,
            isValid,
            errors
          }
        },
        isDirty: true
      }
    })
    
    this.updateFormValidity()
    this.emit('fieldChanged', name, value)
  }
  
  getFieldValue(name: string): any {
    return this.getState().fields[name]?.value
  }
  
  getFieldErrors(name: string): string[] {
    return this.getState().fields[name]?.errors || []
  }
  
  private updateFormValidity(): void {
    this.updateState(state => ({
      isValid: Object.values(state.fields).every(field => field.isValid)
    }))
  }
  
  submit(): void {
    if (this.getState().isValid) {
      this.emit('submit', this.getFormData())
    } else {
      this.emit('submitError', '表单验证失败')
    }
  }
  
  getFormData(): Record<string, any> {
    const data: Record<string, any> = {}
    for (const [name, field] of Object.entries(this.getState().fields)) {
      data[name] = field.value
    }
    return data
  }
  
  reset(): void {
    this.setState({
      fields: {},
      isValid: true,
      isDirty: false
    })
    this.emit('reset')
  }
}

// 应用混入到表单
interface Form extends StateMixin<FormState>, EventMixin, FormValidator {}
applyMixins(Form, [StateMixin, EventMixin, FormValidator])

// 使用表单
const form = new Form()

// 添加验证器
form.addValidator('email', (value) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(value) ? null : '邮箱格式不正确'
})

form.addValidator('age', (value) => {
  const age = parseInt(value)
  return age >= 18 && age <= 100 ? null : '年龄必须在18-100之间'
})

form.addValidator('password', (value) => {
  return value.length >= 6 ? null : '密码长度至少6位'
})

// 添加字段
form.addField('name', '')
form.addField('email', '')
form.addField('age', '')
form.addField('password', '')

// 添加事件监听
form.on('fieldChanged', (fieldName: string, value: any) => {
  console.log(`字段 ${fieldName} 已更改: ${value}`)
})

form.on('submit', (data: Record<string, any>) => {
  console.log('表单提交成功:', data)
})

form.on('submitError', (error: string) => {
  console.error('表单提交失败:', error)
})

// 操作表单
form.setFieldValue('name', '张三')
form.setFieldValue('email', 'zhangsan@example.com')
form.setFieldValue('age', '25')
form.setFieldValue('password', '123456')

console.log('表单数据:', form.getFormData())
console.log('表单有效:', form.getState().isValid)
console.log('邮箱错误:', form.getFieldErrors('email'))

form.submit()

// ==================== 5. 混入最佳实践 ====================
/*
📚 Mixins 使用最佳实践：

1. 设计原则
   ✅ 单一职责：每个 Mixin 只负责一个功能
   ✅ 可组合性：Mixins 应该可以自由组合
   ✅ 避免冲突：注意属性和方法名冲突

2. 类型安全
   ✅ 使用接口定义 Mixin 结构
   ✅ 合理使用泛型
   ✅ 提供完整的类型定义

3. 实现方式
   ✅ 使用 applyMixins 函数
   ✅ 注意原型链的正确设置
   ✅ 处理构造函数参数

4. 性能考虑
   ✅ 避免过度使用 Mixins
   ✅ 合理缓存 Mixin 实例
   ✅ 注意内存泄漏

5. 实际应用
   ✅ 功能模块化
   ✅ 代码复用
   ✅ 横切关注点

🎯 重点掌握：
- 理解 Mixins 的概念和优势
- 掌握对象混入和类混入的实现
- 学会合理设计和使用 Mixins
- 理解 Mixins 与继承的区别
*/