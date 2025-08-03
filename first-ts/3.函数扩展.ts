/*
TypeScript 函数扩展学习笔记
包含函数参数的各种用法和高级特性
*/

// ==================== 1. 基础函数类型 ====================
// 注意：参数不能多传，也不能少传，必须按照约定的类型来
const greet = (name: string, age: number): string => {
  return `你好，我是${name}，今年${age}岁`
}
console.log(greet('张三', 18)) // 输出：你好，我是张三，今年18岁

// ==================== 2. 可选参数 ====================
// 通过 ? 表示该参数为可选参数，调用时可以不传
const createUser = (name: string, age?: number): string => {
  if (age) {
    return `用户${name}，年龄${age}岁`
  }
  return `用户${name}，年龄未知`
}
console.log(createUser('李四')) // 输出：用户李四，年龄未知
console.log(createUser('王五', 25)) // 输出：用户王五，年龄25岁

// ==================== 3. 剩余参数（可变参数） ====================
// 通过 ... 表示该参数为可变参数，可以接收多个值
const calculateSum = (name: string, ...numbers: number[]): string => {
  const sum = numbers.reduce((total, num) => total + num, 0)
  return `${name}的计算结果：${sum}`
}
console.log(calculateSum('小明', 1, 2, 3, 4, 5)) // 输出：小明的计算结果：15
console.log(calculateSum('小红', 10, 20)) // 输出：小红的计算结果：30

// ==================== 4. 函数参数的默认值 ====================
// 为参数设置默认值，调用时如果不传该参数则使用默认值
const sendMessage = (to: string, message: string = '你好！', priority: string = '普通'): string => {
  return `发送给${to}的消息：${message}（优先级：${priority}）`
}
console.log(sendMessage('张三')) // 输出：发送给张三的消息：你好！（优先级：普通）
console.log(sendMessage('李四', '紧急通知', '高')) // 输出：发送给李四的消息：紧急通知（优先级：高）

// ==================== 5. 函数参数的解构 ====================
// 使用解构语法来接收对象参数
const updateProfile = ({name, age, city = '北京'}: {name: string, age: number, city?: string}): string => {
  return `更新用户信息：${name}，${age}岁，来自${city}`
}
console.log(updateProfile({name: '赵六', age: 30})) // 输出：更新用户信息：赵六，30岁，来自北京
console.log(updateProfile({name: '钱七', age: 28, city: '上海'})) // 输出：更新用户信息：钱七，28岁，来自上海

// ==================== 6. 接口定义函数 ====================
// 使用接口来定义函数的类型签名
interface Calculator {
  (a: number, b: number): number
}

const add: Calculator = (a: number, b: number): number => {
  return a + b
}

const multiply: Calculator = (a: number, b: number): number => {
  return a * b
}

console.log(add(5, 3)) // 输出：8
console.log(multiply(4, 6)) // 输出：24

// 接口定义带属性的函数（函数对象）
interface UserService {
  (user: UserInfo): UserInfo
  version: string
  getInfo(): string
}

interface UserInfo {
  name: string
  age: number
}

const userService: UserService = (user: UserInfo): UserInfo => {
  return user
}
userService.version = '1.0.0'
userService.getInfo = () => '用户服务'

console.log(userService({name: '孙八', age: 35})) // 输出：{name: '孙八', age: 35}
console.log(userService.version) // 输出：1.0.0

// ==================== 7. 函数重载 ====================
// 函数重载：同一个函数名，不同的参数类型和返回值类型

// 重载签名1：接收数字参数
function processData(value: number): string
// 重载签名2：接收字符串参数
function processData(value: string): number
// 重载签名3：接收两个参数
function processData(value: string, count: number): string
// 实现签名：包含所有可能的情况
function processData(value: any, count?: any): any {
  if (typeof value === 'number') {
    return `数字：${value}`
  } else if (typeof value === 'string' && count !== undefined) {
    return `字符串${value}重复${count}次：${value.repeat(count)}`
  } else if (typeof value === 'string') {
    return value.length
  }
}

console.log(processData(123)) // 输出：数字：123
console.log(processData('hello')) // 输出：5
console.log(processData('hi', 3)) // 输出：字符串hi重复3次：hihihi

// 更实用的重载例子：处理不同类型的用户数据
function formatUser(user: string): string
function formatUser(user: {name: string, age: number}): string
function formatUser(user: any): string {
  if (typeof user === 'string') {
    return `用户名：${user}`
  } else if (typeof user === 'object') {
    return `用户：${user.name}，年龄：${user.age}`
  }
  return '无效用户数据'
}

console.log(formatUser('周九')) // 输出：用户名：周九
console.log(formatUser({name: '吴十', age: 40})) // 输出：用户：吴十，年龄：40

// ==================== 8. 实际应用示例 ====================
// 综合运用各种函数特性的实际例子

interface Product {
  id: number
  name: string
  price: number
  category?: string
}

// 创建商品列表
const createProductList = (products: Product[], options: {sortBy?: string, limit?: number} = {}): Product[] => {
  let result = [...products]
  
  // 排序
  if (options.sortBy === 'price') {
    result.sort((a, b) => a.price - b.price)
  } else if (options.sortBy === 'name') {
    result.sort((a, b) => a.name.localeCompare(b.name))
  }
  
  // 限制数量
  if (options.limit) {
    result = result.slice(0, options.limit)
  }
  
  return result
}

const products: Product[] = [
  {id: 1, name: '苹果', price: 5, category: '水果'},
  {id: 2, name: '香蕉', price: 3, category: '水果'},
  {id: 3, name: '牛奶', price: 8, category: '饮品'},
  {id: 4, name: '面包', price: 6, category: '主食'}
]

console.log('原始列表：', products)
console.log('按价格排序：', createProductList(products, {sortBy: 'price'}))
console.log('按名称排序并限制2个：', createProductList(products, {sortBy: 'name', limit: 2}))

// ==================== 学习要点总结 ====================
/*
📚 TypeScript 函数扩展学习要点：

1. 基础函数类型
   ✅ 参数类型: 必须按照约定的类型传递参数
   ✅ 返回值类型: 明确指定函数返回值类型
   ✅ 类型安全: 确保参数和返回值的类型正确

2. 函数参数特性
   ✅ 可选参数: 使用 ? 标记可选参数
   ✅ 默认参数: 为参数设置默认值
   ✅ 剩余参数: 使用 ... 接收可变数量的参数
   ✅ 参数解构: 使用解构语法接收对象参数

3. 接口定义函数
   ✅ 函数类型接口: 定义函数签名
   ✅ 函数对象: 接口定义带属性的函数
   ✅ 方法重载: 同一个函数名，不同的参数类型和返回值类型

4. 函数重载
   ✅ 重载签名: 定义不同的函数签名
   ✅ 实现签名: 包含所有可能情况的实现
   ✅ 类型推断: TypeScript 根据参数类型选择正确的重载

5. 实际应用
   ✅ 商品列表管理: 展示函数在业务逻辑中的应用
   ✅ 参数验证: 通过类型系统确保参数正确性
   ✅ 代码复用: 通过函数重载提高代码复用性

🎯 重点掌握：
- 理解函数类型系统的重要性
- 掌握各种函数参数特性的用法
- 学会使用接口定义函数类型
- 理解函数重载的作用和实现方式
- 在实际项目中合理使用函数类型特性
*/

