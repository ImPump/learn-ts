/*
TypeScript 元组类型学习笔记
元组（Tuple）是固定数量的不同类型的元素的组合，是数组的变种
*/

// ==================== 1. 基础元组定义 ====================
// 元组与数组的不同之处在于，元组中的元素类型可以是不同的，而且数量固定
// 元组的好处在于可以把多个元素作为一个单元传递
// 如果一个方法需要返回多个值，可以把这多个值作为元组返回，而不需要创建额外的类来表示

// 基础元组：固定类型和数量
let arr: [number, string] = [1, 'string']
console.log('基础元组：', arr) // 输出：基础元组： [1, 'string']

// 只读元组：使用 readonly 修饰符
let arr2: readonly [number, boolean, string, undefined] = [1, true, 'string', undefined]
console.log('只读元组：', arr2) // 输出：只读元组： [1, true, 'string', undefined]
// arr2[0] = 999 // 错误！只读元组不能修改

// ==================== 2. 元组类型检查 ====================
// 当赋值或访问一个已知索引的元素时，会得到正确的类型检查
let arr3: [number, string] = [1, 'string']

// arr3[0].length // 错误！数字类型没有 length 属性
console.log('第一个元素（数字）：', arr3[0]) // 输出：第一个元素（数字）： 1

// arr3[1].length // 正确！字符串类型有 length 属性
console.log('第二个元素（字符串）长度：', arr3[1].length) // 输出：第二个元素（字符串）长度： 6

// ==================== 3. 可选元素和命名元组 ====================
// 元组类型还可以支持自定义名称和变为可选的
let a: [x: number, y?: boolean] = [1] // 第二个元素是可选的
console.log('可选元素元组：', a) // 输出：可选元素元组： [1]

let b: [x: number, y?: boolean] = [1, true] // 也可以提供可选元素
console.log('提供可选元素：', b) // 输出：提供可选元素： [1, true]

// 命名元组：给每个元素指定名称
let coordinates2D: [x: number, y: number, z?: number] = [10, 20]
console.log('坐标：', coordinates2D) // 输出：坐标： [10, 20]

// ==================== 4. 越界元素限制 ====================
// 对于越界的元素，其类型被限制为联合类型（就是你在元组中定义的类型）
let arr4: [number, string] = [1, 'string']

// 可以添加元组中已定义的类型
arr4.push(42) // 正确：number 类型
arr4.push('hello') // 正确：string 类型

// arr4.push(true) // 错误！boolean 类型不在元组定义中
console.log('添加元素后：', arr4) // 输出：添加元素后： [1, 'string', 42, 'hello']

// ==================== 5. 元组解构和赋值 ====================
// 元组支持解构赋值
let userTuple: [string, number, boolean] = ['张三', 25, true]

// 解构赋值
let [userName, userAge, isStudent] = userTuple
console.log('解构结果：', userName, userAge, isStudent) // 输出：解构结果： 张三 25 true

// 部分解构
let [firstName, ...rest] = userTuple
console.log('部分解构：', firstName, rest) // 输出：部分解构： 张三 [25, true]

// 跳过某些元素
let [, ageValue, userStatus] = userTuple
console.log('跳过元素：', ageValue, userStatus) // 输出：跳过元素： 25 true

// ==================== 6. 函数返回元组 ====================
// 函数可以返回元组，这是元组的重要应用场景
function getUserInfo(): [string, number, string] {
  return ['李四', 30, '北京']
}

function divideWithRemainder(a: number, b: number): [number, number] {
  return [Math.floor(a / b), a % b]
}

const userInfoResult = getUserInfo()
console.log('用户信息：', userInfoResult) // 输出：用户信息： ['李四', 30, '北京']

const [quotient, remainder] = divideWithRemainder(17, 5)
console.log('除法结果：', quotient, '余数：', remainder) // 输出：除法结果： 3 余数： 2

// ==================== 7. 元组数组 ====================
// 可以定义元组数组，每个元素都是一个元组
let excel: [string, string, number, string][] = [
  ['姓名', '张三', 25, '北京'],
  ['姓名', '李四', 30, '上海'],
  ['姓名', '王五', 28, '广州'],
  ['姓名', '赵六', 35, '深圳'],
  ['姓名', '钱七', 22, '杭州']
]

console.log('Excel数据：', excel)
// 输出：Excel数据： [['姓名', '张三', 25, '北京'], ['姓名', '李四', 30, '上海'], ...]

// 处理元组数组
excel.forEach(([label, name, age, city]) => {
  console.log(`${label}：${name}，年龄：${age}，城市：${city}`)
})
// 输出：
// 姓名：张三，年龄：25，城市：北京
// 姓名：李四，年龄：30，城市：上海
// 姓名：王五，年龄：28，城市：广州
// 姓名：赵六，年龄：35，城市：深圳
// 姓名：钱七，年龄：22，城市：杭州

// ==================== 8. 实际应用示例 ====================
// 综合运用元组特性的实际例子

// 1. 坐标系统
type Point2D = [x: number, y: number]
type Point3D = [x: number, y: number, z: number]

function calculateDistance(p1: Point2D, p2: Point2D): number {
  const [x1, y1] = p1
  const [x2, y2] = p2
  return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2))
}

const point1: Point2D = [0, 0]
const point2: Point2D = [3, 4]
console.log('两点距离：', calculateDistance(point1, point2)) // 输出：两点距离： 5

// 2. 数据库查询结果
type UserRecord = [id: number, name: string, email: string, isActive: boolean]

function fetchUsers(): UserRecord[] {
  // 模拟数据库查询结果
  return [
    [1, '张三', 'zhangsan@example.com', true],
    [2, '李四', 'lisi@example.com', false],
    [3, '王五', 'wangwu@example.com', true]
  ]
}

const userRecords = fetchUsers()
console.log('用户数据：', userRecords)
// 输出：用户数据： [[1, '张三', 'zhangsan@example.com', true], ...]

// 处理用户数据
userRecords.forEach(([id, name, email, isActive]) => {
  const status = isActive ? '活跃' : '非活跃'
  console.log(`用户 ${name} (ID: ${id}) - ${status}`)
})
// 输出：
// 用户 张三 (ID: 1) - 活跃
// 用户 李四 (ID: 2) - 非活跃
// 用户 王五 (ID: 3) - 活跃

// 3. API 响应处理
type ApiResponse<T> = [success: boolean, data: T | null, error: string | null]

function fetchData<T>(url: string): ApiResponse<T> {
  // 模拟 API 调用
  if (url.includes('success')) {
    return [true, { message: '数据获取成功' } as T, null]
  } else {
    return [false, null, '请求失败']
  }
}

const [success, data, error] = fetchData<{ message: string }>('/api/success')
if (success && data) {
  console.log('API成功：', data.message) // 输出：API成功： 数据获取成功
} else if (error) {
  console.log('API失败：', error)
}

// 4. 状态管理
type State = [count: number, loading: boolean, error: string | null]

function createCounter(): () => State {
  let count = 0
  let loading = false
  let error: string | null = null

  return () => {
    count++
    return [count, loading, error]
  }
}

const counter = createCounter()
console.log('计数器状态：', counter()) // 输出：计数器状态： [1, false, null]
console.log('计数器状态：', counter()) // 输出：计数器状态： [2, false, null]

// ==================== 9. 元组的高级用法 ====================
// 1. 可变长度元组（TypeScript 4.0+）
type StringNumberBooleans = [string, number, ...boolean[]]
type StringBooleansNumber = [string, ...boolean[], number]
type BooleansStringNumber = [...boolean[], string, number]

const tuple1: StringNumberBooleans = ['hello', 42, true, false, true]
const tuple2: StringBooleansNumber = ['hello', true, false, 42]
const tuple3: BooleansStringNumber = [true, false, 'hello', 42]

console.log('可变长度元组：', tuple1, tuple2, tuple3)
// 输出：可变长度元组： ['hello', 42, true, false, true] ['hello', true, false, 42] [true, false, 'hello', 42]

// 2. 元组类型推断
function tuple<T extends any[]>(...args: T): T {
  return args
}

const inferredTuple = tuple('hello', 42, true)
console.log('推断的元组类型：', inferredTuple) // 输出：推断的元组类型： ['hello', 42, true]
// 类型被推断为 [string, number, boolean]

// 3. 只读元组的实用场景
type ReadonlyPoint = readonly [number, number]
const readonlyPoint: ReadonlyPoint = [10, 20]
console.log('只读坐标：', readonlyPoint) // 输出：只读坐标： [10, 20]
// readonlyPoint[0] = 30 // 错误！不能修改只读元组

// ==================== 学习要点总结 ====================
/*
📚 TypeScript 元组类型学习要点：

1. 基础元组定义
   ✅ 语法: [类型1, 类型2, ...] 定义元组类型
   ✅ 特点: 固定长度和类型的数组
   ✅ 与数组区别: 元组中元素类型可以不同，数量固定
   ✅ 只读元组: 使用 readonly 修饰符

2. 元组特性
   ✅ 类型检查: 每个位置都有明确的类型检查
   ✅ 可选元素: 使用 ? 标记可选元素
   ✅ 命名元组: 给元素指定名称提高可读性
   ✅ 越界限制: 只能添加元组中已定义的类型

3. 元组操作
   ✅ 解构赋值: 支持解构语法
   ✅ 部分解构: 可以只解构部分元素
   ✅ 跳过元素: 使用逗号跳过不需要的元素
   ✅ 剩余参数: 使用 ... 获取剩余元素

4. 函数返回元组
   ✅ 多返回值: 函数可以返回多个不同类型的值
   ✅ 类型安全: 确保返回值的类型正确
   ✅ 解构接收: 使用解构语法接收返回值
   ✅ 应用场景: 数据库查询、数学计算、状态管理

5. 实际应用场景
   ✅ 坐标系统: 2D/3D 坐标表示
   ✅ 数据库查询: 查询结果的多列数据
   ✅ API 响应: 成功/失败状态和数据
   ✅ 状态管理: 计数器、加载状态等
   ✅ Excel 数据处理: 表格数据的行记录

6. 高级用法
   ✅ 可变长度元组: TypeScript 4.0+ 的新特性
   ✅ 元组类型推断: 自动推断元组类型
   ✅ 只读元组: 防止意外修改
   ✅ 元组数组: 元组的数组，处理表格数据

🎯 重点掌握：
- 理解元组与数组的区别和应用场景
- 掌握元组的各种特性和操作方法
- 学会使用元组作为函数返回值
- 理解元组在实际项目中的应用价值
- 掌握元组的高级用法和最佳实践
*/