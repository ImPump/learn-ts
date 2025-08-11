/*
TypeScript Symbol 学习笔记
Symbol 是 ES6 引入的一种新的原始数据类型，表示唯一的标识符
*/
namespace Symbol学习 {

  // ==================== 1. Symbol 基础 ====================
  // Symbol 是唯一的，即使描述相同也是不同的值

  // 1.1 创建 Symbol
  const symbol1 = Symbol('description')
  const symbol2 = Symbol('description')
  const symbol3 = Symbol()

  console.log('Symbol 基础：', symbol1, symbol2, symbol3)
  console.log('Symbol 相等性：', symbol1 === symbol2) // false，每个 Symbol 都是唯一的

  // 1.2 Symbol 作为对象属性
  const userInfo = {
    name: '张三',
    age: 25,
    [symbol1]: '私有数据1',
    [symbol2]: '私有数据2'
  }

  console.log('Symbol 属性：', userInfo[symbol1], userInfo[symbol2])

  // ==================== 2. Symbol 属性的遍历 ====================
  // Symbol 属性在常规遍历中是不可见的

  const objWithSymbols = {
    publicProp: '公开属性',
    [Symbol('private1')]: '私有属性1',
    [Symbol('private2')]: '私有属性2',
    normalProp: '普通属性'
  }

  // 2.1 for...in 遍历（不会遍历 Symbol 属性）
  console.log('for...in 遍历：')
  for (const key in objWithSymbols) {
    console.log(key) // 只输出 publicProp 和 normalProp
  }

  // 2.2 Object.keys() 遍历（不会遍历 Symbol 属性）
  console.log('Object.keys()：', Object.keys(objWithSymbols))

  // 2.3 Object.getOwnPropertyNames() 遍历（不会遍历 Symbol 属性）
  console.log('Object.getOwnPropertyNames()：', Object.getOwnPropertyNames(objWithSymbols))

  // 2.4 JSON.stringify() 序列化（不会包含 Symbol 属性）
  console.log('JSON.stringify()：', JSON.stringify(objWithSymbols))

  // 2.5 获取 Symbol 属性
  console.log('Object.getOwnPropertySymbols()：', Object.getOwnPropertySymbols(objWithSymbols))

  // 2.6 Reflect.ownKeys() 获取所有属性（包括 Symbol）
  console.log('Reflect.ownKeys()：', Reflect.ownKeys(objWithSymbols))

  // ==================== 3. Symbol 迭代器 ====================
  // Symbol.iterator 是迭代器接口的标识符

  // 3.1 数组的迭代器
  const numbers = [1, 2, 3, 4, 5]
  const iterator = numbers[Symbol.iterator]()

  console.log('迭代器示例：')
  console.log(iterator.next()) // { value: 1, done: false }
  console.log(iterator.next()) // { value: 2, done: false }
  console.log(iterator.next()) // { value: 3, done: false }
  console.log(iterator.next()) // { value: 4, done: false }
  console.log(iterator.next()) // { value: 5, done: false }
  console.log(iterator.next()) // { value: undefined, done: true }

  // 3.2 自定义迭代器函数
  function iterateCollection<T>(collection: Iterable<T>): void {
    const iterator = collection[Symbol.iterator]()
    let result = iterator.next()

    while (!result.done) {
      console.log('迭代值：', result.value)
      result = iterator.next()
    }
  }

  // 3.3 使用自定义迭代器
  const stringArray = ['apple', 'banana', 'orange']
  const numberSet = new Set([1, 2, 3, 4, 5])
  const stringMap = new Map([
    ['key1', 'value1'],
    ['key2', 'value2']
  ])

  console.log('字符串数组迭代：')
  iterateCollection(stringArray)

  console.log('数字集合迭代：')
  iterateCollection(numberSet)

  console.log('字符串映射迭代：')
  iterateCollection(stringMap)

  // ==================== 4. for...of 循环 ====================
  // for...of 是迭代器的语法糖

  console.log('for...of 循环示例：')

  // 4.1 数组的 for...of
  for (const num of numbers) {
    console.log('数字：', num)
  }

  // 4.2 Set 的 for...of
  for (const item of numberSet) {
    console.log('集合项：', item)
  }

  // 4.3 Map 的 for...of
  for (const [key, value] of stringMap) {
    console.log('映射项：', key, '=', value)
  }

  // 4.4 字符串的 for...of
  for (const char of 'Hello') {
    console.log('字符：', char)
  }

  // 注意：普通对象不支持 for...of
  // for (const key of objWithSymbols) { } // 错误！

  // ==================== 5. 自定义可迭代对象 ====================
  // 实现 Symbol.iterator 方法使对象可迭代

  // 5.1 范围迭代器
  class Range {
    constructor(
      private start: number,
      private end: number,
      private step: number = 1
    ) { }

    [Symbol.iterator]() {
      let current = this.start
      const end = this.end
      const step = this.step

      return {
        next() {
          if (current <= end) {
            const value = current
            current += step
            return { value, done: false }
          } else {
            return { value: undefined, done: true }
          }
        }
      }
    }
  }

  // 使用范围迭代器
  const range = new Range(1, 10, 2)
  console.log('范围迭代器：')
  for (const num of range) {
    console.log('范围值：', num)
  }

  // 5.2 对象迭代器
  class IterableObject {
    private data: Record<string, any>

    constructor(data: Record<string, any>) {
      this.data = data
    }

    [Symbol.iterator]() {
      const keys = Object.keys(this.data)
      let index = 0

      return {
        next: () => {
          if (index < keys.length) {
            const key = keys[index]
            const value = this.data[key]
            index++
            return { value: [key, value], done: false }
          } else {
            return { value: undefined, done: true }
          }
        }
      }
    }
  }

  const iterableObj = new IterableObject({
    name: '李四',
    age: 30,
    city: '北京'
  })

  console.log('可迭代对象：')
  for (const [key, value] of iterableObj) {
    console.log(`${key}: ${value}`)
  }

  // ==================== 6. 数组解构和展开运算符 ====================
  // 数组解构和展开运算符内部也使用迭代器

  // 6.1 数组解构
  const [first, second, ...rest] = [1, 2, 3, 4, 5]
  console.log('数组解构：', first, second, rest)

  // 6.2 展开运算符
  const originalArray = [1, 2, 3]
  const spreadArray = [...originalArray, 4, 5]
  console.log('展开运算符：', spreadArray)

  // 6.3 字符串解构
  const [firstChar, secondChar] = 'Hello'
  console.log('字符串解构：', firstChar, secondChar)

  // 6.4 Set 展开
  const setNumbers = new Set([1, 2, 3])
  const arrayFromSet = [...setNumbers]
  console.log('Set 展开：', arrayFromSet)

  // ==================== 7. 实际应用示例 ====================
  // 综合运用 Symbol 和迭代器的实际例子

  // 7.1 私有属性模拟
  class BankAccount {
    private [Symbol('balance')] = 0
    private [Symbol('transactions')] = []

    constructor(private accountNumber: string, private owner: string) { }

    deposit(amount: number): void {
      this[Symbol('balance')] += amount
      this[Symbol('transactions')].push({
        type: 'deposit',
        amount,
        date: new Date()
      })
    }

    withdraw(amount: number): boolean {
      if (this[Symbol('balance')] >= amount) {
        this[Symbol('balance')] -= amount
        this[Symbol('transactions')].push({
          type: 'withdraw',
          amount,
          date: new Date()
        })
        return true
      }
      return false
    }

    getBalance(): number {
      return this[Symbol('balance')]
    }

    // 提供交易历史迭代器
    [Symbol.iterator]() {
      return this[Symbol('transactions')][Symbol.iterator]()
    }
  }

  const account = new BankAccount('123456789', '王五')
  account.deposit(1000)
  account.withdraw(300)
  account.deposit(500)

  console.log('账户余额：', account.getBalance())
  console.log('交易历史：')
  for (const transaction of account) {
    console.log(transaction)
  }

  // 7.2 配置管理器
  class ConfigManager {
    private [Symbol('config')] = new Map<string, any>()
    private [Symbol('defaults')] = new Map<string, any>()

    constructor() {
      // 设置默认值
      this[Symbol('defaults')].set('theme', 'light')
      this[Symbol('defaults')].set('language', 'zh-CN')
      this[Symbol('defaults')].set('timeout', 5000)
    }

    set(key: string, value: any): void {
      this[Symbol('config')].set(key, value)
    }

    get(key: string): any {
      return this[Symbol('config')].get(key) ?? this[Symbol('defaults')].get(key)
    }

    // 迭代所有配置项
    [Symbol.iterator]() {
      const allConfig = new Map([
        ...this[Symbol('defaults')],
        ...this[Symbol('config')]
      ])
      return allConfig[Symbol.iterator]()
    }
  }

  const config = new ConfigManager()
  config.set('theme', 'dark')
  config.set('debug', true)

  console.log('配置项：')
  for (const [key, value] of config) {
    console.log(`${key}: ${value}`)
  }

  // ==================== 8. Symbol 最佳实践 ====================
  /*
  📚 Symbol 使用最佳实践：
  
  1. 唯一性
     ✅ 利用 Symbol 的唯一性创建私有属性
     ✅ 避免 Symbol 描述冲突
     ✅ 合理使用 Symbol 作为对象键
  
  2. 遍历控制
     ✅ 使用 Symbol 属性隐藏内部数据
     ✅ 了解不同遍历方法的区别
     ✅ 合理使用 Reflect.ownKeys()
  
  3. 迭代器
     ✅ 实现 Symbol.iterator 使对象可迭代
     ✅ 理解迭代器协议
     ✅ 合理使用 for...of 循环
  
  4. 性能考虑
     ✅ Symbol 属性不影响常规遍历性能
     ✅ 合理使用 Symbol 缓存
     ✅ 避免过度使用 Symbol
  
  5. 实际应用
     ✅ 私有属性模拟
     ✅ 元数据存储
     ✅ 配置管理
     ✅ 插件系统
  
  🎯 重点掌握：
  - 理解 Symbol 的唯一性和不可枚举性
  - 掌握迭代器协议和 for...of 循环
  - 学会使用 Symbol 创建私有属性
  - 理解数组解构和展开运算符的原理
  */
}