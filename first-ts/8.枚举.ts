/*
TypeScript 枚举学习笔记
枚举是一种特殊的类型，用于定义一组命名的常量
*/

// ==================== 1. 数字枚举 ====================
// 数字枚举：默认从0开始，也可以手动指定起始值

// 基础数字枚举（从0开始）
enum Color {
  Red,    // 0
  Green,  // 1
  Blue    // 2
}

console.log('基础数字枚举：', Color.Red, Color.Green, Color.Blue) // 0, 1, 2

// 手动指定起始值的数字枚举
enum Status {
  Pending = 1,
  Approved,  // 2
  Rejected   // 3
}

console.log('指定起始值的枚举：', Status.Pending, Status.Approved, Status.Rejected) // 1, 2, 3

// 完全手动指定值的数字枚举
enum Direction {
  North = 0,
  East = 90,
  South = 180,
  West = 270
}

console.log('完全手动指定：', Direction.North, Direction.East, Direction.South, Direction.West)

// ==================== 2. 字符串枚举 ====================
// 字符串枚举：每个成员都必须有字符串值，没有自增长行为

enum UserRole {
  Admin = 'ADMIN',
  User = 'USER',
  Guest = 'GUEST'
}

console.log('字符串枚举：', UserRole.Admin, UserRole.User, UserRole.Guest)

// 字符串枚举的实际应用
function checkPermission(role: UserRole): boolean {
  switch (role) {
    case UserRole.Admin:
      return true
    case UserRole.User:
      return true
    case UserRole.Guest:
      return false
    default:
      return false
  }
}

console.log('权限检查：', checkPermission(UserRole.Admin)) // true
console.log('权限检查：', checkPermission(UserRole.Guest)) // false

// ==================== 3. 异构枚举 ====================
// 异构枚举：混合字符串和数字成员（不推荐使用）

enum MixedEnum {
  No = 'NO',
  Yes = 1,
  Maybe = 'MAYBE',
  Unknown = 0
}

console.log('异构枚举：', MixedEnum.No, MixedEnum.Yes, MixedEnum.Maybe, MixedEnum.Unknown)

// ==================== 4. 接口中使用枚举 ====================
// 在接口中使用枚举作为属性类型

enum UserType {
  Regular,
  Premium,
  VIP
}

interface User {
  id: number
  name: string
  type: UserType
  isActive: boolean
}

const user: User = {
  id: 1,
  name: '张三',
  type: UserType.Premium,
  isActive: true
}

console.log('用户类型：', user.type, UserType[user.type]) // 1, 'Premium'

// ==================== 5. const 枚举 ====================
// const 枚举：编译时会被内联，不会生成额外的代码
// 即所有 const enum 的用法会被直接替换为对应的常量值，不会在编译后的 JavaScript 代码中生成枚举对象，从而减少运行时代码体积，提高性能。

const enum Size {
  Small = 'S',
  Medium = 'M',
  Large = 'L',
  XLarge = 'XL'
}

// 使用 const 枚举
function getSizeLabel(size: Size): string {
  switch (size) {
    case Size.Small:
      return '小号'
    case Size.Medium:
      return '中号'
    case Size.Large:
      return '大号'
    case Size.XLarge:
      return '特大号'
    default:
      return '未知尺寸'
  }
}

console.log('尺寸标签：', getSizeLabel(Size.Medium)) // '中号'

// ==================== 6. 反向映射 ====================
// 数字枚举支持反向映射：通过值获取名称

enum WeekDay {
  Sunday = 0,
  Monday = 1,
  Tuesday = 2,
  Wednesday = 3,
  Thursday = 4,
  Friday = 5,
  Saturday = 6
}

// 正向映射：名称 -> 值
console.log('正向映射：', WeekDay.Monday) // 1

// 反向映射：值 -> 名称
console.log('反向映射：', WeekDay[1]) // 'Monday'

// 注意：字符串枚举不支持反向映射
enum StringEnum {
  A = 'a',
  B = 'b'
}
// console.log(StringEnum['a']) // undefined

// ==================== 7. 实际应用示例 ====================
// 综合运用各种枚举特性的实际例子

// 订单状态枚举
enum OrderStatus {
  Created = 'CREATED',
  Paid = 'PAID',
  Shipped = 'SHIPPED',
  Delivered = 'DELIVERED',
  Cancelled = 'CANCELLED'
}

// 订单类型枚举
enum OrderType {
  Standard = 1,
  Express = 2,
  Premium = 3
}

// 订单接口
interface Order {
  id: string
  customerName: string
  status: OrderStatus
  type: OrderType
  amount: number
  createdAt: Date
}

// 订单处理函数
function processOrder(order: Order): string {
  switch (order.status) {
    case OrderStatus.Created:
      return `订单 ${order.id} 已创建，等待支付`
    case OrderStatus.Paid:
      return `订单 ${order.id} 已支付，准备发货`
    case OrderStatus.Shipped:
      return `订单 ${order.id} 已发货，正在配送中`
    case OrderStatus.Delivered:
      return `订单 ${order.id} 已送达`
    case OrderStatus.Cancelled:
      return `订单 ${order.id} 已取消`
    default:
      return `订单 ${order.id} 状态未知`
  }
}

function getOrderTypeLabel(type: OrderType): string {
  const typeLabels = {
    [OrderType.Standard]: '标准配送',
    [OrderType.Express]: '快速配送',
    [OrderType.Premium]: '优先配送'
  }
  return typeLabels[type] || '未知类型'
}

// 创建订单
const order: Order = {
  id: 'ORD-001',
  customerName: '李四',
  status: OrderStatus.Paid,
  type: OrderType.Express,
  amount: 299.99,
  createdAt: new Date()
}

console.log('订单处理：', processOrder(order))
console.log('配送类型：', getOrderTypeLabel(order.type))
console.log('订单状态：', order.status)
console.log('状态代码：', OrderStatus[order.status as any]) // 注意：字符串枚举不支持反向映射

// ==================== 8. 枚举最佳实践 ====================
/*
📚 枚举使用最佳实践：

1. 命名规范
   ✅ 使用 PascalCase 命名枚举
   ✅ 使用描述性的名称
   ✅ 避免使用缩写

2. 值的选择
   ✅ 数字枚举：用于连续的数值
   ✅ 字符串枚举：用于有意义的标识符
   ✅ 避免异构枚举

3. 性能考虑
   ✅ 使用 const 枚举提高性能
   ✅ 避免在循环中频繁访问枚举
   // 为什么要避免在循环中频繁访问枚举？
   // 因为每次访问枚举成员时，实际上是一次对象属性查找，频繁访问会影响性能。
   // 建议在循环前将枚举值缓存到局部变量中，提高执行效率。
   
4. 类型安全
   ✅ 充分利用 TypeScript 的类型检查
   ✅ 使用枚举而不是魔法数字

5. 实际应用
   ✅ 状态管理
   ✅ 配置选项
   ✅ 权限控制
   ✅ 业务逻辑分类

🎯 重点掌握：
- 理解数字枚举和字符串枚举的区别
- 掌握 const 枚举的性能优势
- 学会在实际项目中合理使用枚举
- 理解反向映射的机制和限制
*/
