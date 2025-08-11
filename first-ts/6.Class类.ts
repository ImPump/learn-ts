/*
TypeScript 类（Class）学习笔记
包含类的定义、修饰符、继承、接口实现、抽象类等核心概念
*/
namespace Class类 {
  // ==================== 1. 基础类定义 ====================
  class Person {
    // 公共属性：可以在类内部和外部访问
    public name: string
    // 私有属性：只能在类内部访问
    private age: number
    // 受保护属性：只能在类内部和子类中访问
    protected some?: any
    // 静态属性：属于类本身，不属于实例
    static height: number = 180

    // 构造函数：创建实例时自动调用
    constructor(name: string, age: number, some?: any) {
      this.name = name
      this.age = age
      this.some = some
      // 注意：静态属性不能通过 this 访问
      // this.height = height // 错误！
    }

    // 静态方法：属于类本身，通过类名调用
    static lay(name?: string) {
      console.log(name, '摊着')
    }

    static sleep(name?: string) {
      this.lay() // 静态方法可以调用其他静态方法
      console.log(name, '睡觉')
    }

    // 实例方法：属于实例，通过实例调用
    run(name: string) {
      console.log(name, '可以奔跑')
    }

    // 获取私有属性的方法
    getAge(): number {
      return this.age
    }

    // 设置私有属性的方法
    setAge(age: number) {
      if (age >= 0) {
        this.age = age
      }
    }
  }

  // 创建实例
  let xiaoming = new Person('小明', 18)
  console.log('静态属性：', Person.height) // 输出：静态属性： 180
  Person.sleep('小明') // 输出：undefined 摊着 \n 小明 睡觉
  xiaoming.run('小明') // 输出：小明 可以奔跑
  console.log('小明年龄：', xiaoming.getAge()) // 输出：小明年龄： 18

  // ==================== 2. 访问修饰符详解 ====================
  /*
  public 修饰符：可以让你定义的变量内部访问，也可以外部访问，如果不写默认就是public
  private 修饰符：代表定义的变量私有的只能在内部访问，不能在外部访问
  protected 修饰符：代表定义的变量私有的只能在内部和继承的子类中访问，不能在外部访问
  */

  class BankAccount {
    public accountNumber: string
    private balance: number
    protected bankName: string

    constructor(accountNumber: string, initialBalance: number, bankName: string) {
      this.accountNumber = accountNumber
      this.balance = initialBalance
      this.bankName = bankName
    }

    // 公共方法：外部可以调用
    public deposit(amount: number): void {
      if (amount > 0) {
        this.balance += amount
        console.log(`存款成功，当前余额：${this.balance}`)
      }
    }

    // 私有方法：只能在类内部调用
    private validateWithdrawal(amount: number): boolean {
      return amount > 0 && amount <= this.balance
    }

    // 公共方法调用私有方法
    public withdraw(amount: number): boolean {
      if (this.validateWithdrawal(amount)) {
        this.balance -= amount
        console.log(`取款成功，当前余额：${this.balance}`)
        return true
      } else {
        console.log('取款失败：余额不足或金额无效')
        return false
      }
    }

    // 受保护方法：子类可以访问
    protected getBankInfo(): string {
      return `${this.bankName} - ${this.accountNumber}`
    }
  }

  const account = new BankAccount('1234567890', 1000, '中国银行')
  account.deposit(500) // 输出：存款成功，当前余额：1500
  account.withdraw(200) // 输出：取款成功，当前余额：1300
  // account.balance = 9999 // 错误！私有属性不能外部访问
  // account.validateWithdrawal(100) // 错误！私有方法不能外部调用

  // ==================== 3. 静态属性和方法 ====================
  /*
  static 定义的属性不可以通过 this 去访问，只能通过类名去调用
  静态函数同样也是不能通过 this 去调用，也是通过类名去调用
  需注意：如果两个函数都是static，静态的是可以通过this互相调用
  */

  class MathUtils {
    // 静态属性
    static PI: number = 3.14159
    static E: number = 2.71828

    // 静态方法
    static add(a: number, b: number): number {
      return a + b
    }

    static multiply(a: number, b: number): number {
      return a * b
    }

    // 静态方法调用其他静态方法
    static calculateArea(radius: number): number {
      return this.PI * this.multiply(radius, radius)
    }

    // 实例方法调用静态属性
    getPiValue(): number {
      return MathUtils.PI // 通过类名访问静态属性
    }
  }

  console.log('静态属性：', MathUtils.PI, MathUtils.E) // 输出：静态属性： 3.14159 2.71828
  console.log('静态方法：', MathUtils.add(5, 3), MathUtils.multiply(4, 6)) // 输出：静态方法： 8 24
  console.log('圆面积：', MathUtils.calculateArea(5)) // 输出：圆面积： 78.53975

  const mathUtils = new MathUtils()
  console.log('PI值：', mathUtils.getPiValue()) // 输出：PI值： 3.14159

  // ==================== 4. 接口实现类 ====================
  /*
  TypeScript interface 定义类使用关键字 implements，后面跟interface的名字，多个用逗号隔开
  继承还是用 extends
  */

  interface PersonClass {
    get(type: boolean): boolean
  }

  interface PersonClass2 {
    set(): void
    asd: string
  }

  // 基类
  class BaseClass {
    name: string
    constructor() {
      this.name = "123"
    }
  }

  // 实现多个接口并继承基类
  class Person4 extends BaseClass implements PersonClass, PersonClass2 {
    asd: string
    constructor() {
      super() // 调用父类构造函数
      this.asd = '123'
    }

    get(type: boolean) {
      return type
    }

    set() {
      console.log('设置方法被调用')
    }
  }

  const person4 = new Person4()
  console.log('接口实现示例：', person4.get(true), person4.name) // 输出：接口实现示例： true 123

  // ==================== 5. 抽象类 ====================
  /*
  抽象类应用场景：如果你写的类实例化之后毫无用处，此时我可以把他定义为抽象类
  或者你也可以把他作为一个基类，通过继承一个派生类去实现基类的一些方法
  抽象类无法被实例化，只能被继承
  */

  // 抽象类定义
  abstract class Animal {
    public name: string

    constructor(name: string) {
      this.name = name
    }

    // 抽象方法：子类必须实现
    abstract makeSound(): void

    // 普通方法：子类可以继承使用
    move(): void {
      console.log(`${this.name} 正在移动`)
    }
  }

  // 抽象类无法实例化
  // new Animal('动物') // 错误！

  // 继承抽象类并实现抽象方法
  class DogAnimal extends Animal {
    constructor(name: string) {
      super(name)
    }

    // 必须实现抽象方法
    makeSound(): void {
      console.log(`${this.name} 汪汪叫`)
    }

    // 可以添加自己的方法
    wagTail(): void {
      console.log(`${this.name} 摇尾巴`)
    }
  }

  class CatAnimal extends Animal {
    constructor(name: string) {
      super(name)
    }

    makeSound(): void {
      console.log(`${this.name} 喵喵叫`)
    }

    climb(): void {
      console.log(`${this.name} 爬树`)
    }
  }

  const dogAnimal = new DogAnimal('旺财')
  const catAnimal = new CatAnimal('咪咪')

  dogAnimal.makeSound() // 输出：旺财 汪汪叫
  dogAnimal.move() // 输出：旺财 正在移动
  dogAnimal.wagTail() // 输出：旺财 摇尾巴

  catAnimal.makeSound() // 输出：咪咪 喵喵叫
  catAnimal.move() // 输出：咪咪 正在移动
  catAnimal.climb() // 输出：咪咪 爬树

  // ==================== 6. 实际应用示例 ====================
  // 综合运用各种类特性的实际例子

  // 用户管理系统
  abstract class BaseUser {
    public id: number
    public name: string
    public email: string
    public createdAt: Date

    constructor(id: number, name: string, email: string) {
      this.id = id
      this.name = name
      this.email = email
      this.createdAt = new Date()
    }

    // 抽象方法：子类必须实现
    abstract getRole(): string

    // 公共方法
    public getInfo(): string {
      return `ID: ${this.id}, 姓名: ${this.name}, 邮箱: ${this.email}, 角色: ${this.getRole()}`
    }

    // 受保护方法
    protected validateEmail(email: string): boolean {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      return emailRegex.test(email)
    }

    // 静态方法
    static generateId(): number {
      return Math.floor(Math.random() * 10000)
    }
  }

  // 普通用户类
  class RegularUser extends BaseUser {
    public subscription: 'free' | 'premium'
    public lastLogin?: Date

    constructor(id: number, name: string, email: string, subscription: 'free' | 'premium' = 'free') {
      super(id, name, email)
      this.subscription = subscription
    }

    getRole(): string {
      return '普通用户'
    }

    login(): void {
      this.lastLogin = new Date()
      console.log(`${this.name} 登录成功`)
    }

    getSubscriptionInfo(): string {
      return `订阅类型: ${this.subscription}`
    }
  }

  // 管理员用户类
  class AdminUser extends BaseUser {
    public permissions: string[]
    public department: string

    constructor(id: number, name: string, email: string, department: string, permissions: string[] = []) {
      super(id, name, email)
      this.department = department
      this.permissions = permissions
    }

    getRole(): string {
      return '管理员'
    }

    addPermission(permission: string): void {
      if (!this.permissions.includes(permission)) {
        this.permissions.push(permission)
        console.log(`权限 ${permission} 已添加`)
      }
    }

    getPermissions(): string[] {
      return [...this.permissions]
    }

    getDepartmentInfo(): string {
      return `部门: ${this.department}`
    }
  }

  // 用户管理类
  class UserManager {
    private users: BaseUser[] = []
    private static instance: UserManager

    // 单例模式
    static getInstance(): UserManager {
      if (!UserManager.instance) {
        UserManager.instance = new UserManager()
      }
      return UserManager.instance
    }

    addUser(user: BaseUser): void {
      this.users.push(user)
      console.log(`用户 ${user.getInfo()} 已添加`)
    }

    removeUser(id: number): boolean {
      const index = this.users.findIndex(user => (user as any).id === id)
      if (index !== -1) {
        const removedUser = this.users.splice(index, 1)[0]
        console.log(`用户 ${removedUser.getInfo()} 已删除`)
        return true
      }
      return false
    }

    getUserById(id: number): BaseUser | undefined {
      return this.users.find(user => (user as any).id === id)
    }

    getAllUsers(): BaseUser[] {
      return [...this.users]
    }

    getUsersByRole(role: string): BaseUser[] {
      return this.users.filter(user => user.getRole() === role)
    }
  }

  // 使用示例
  const userManager = UserManager.getInstance()

  // 创建用户
  const regularUserExample = new RegularUser(BaseUser.generateId(), '张三', 'zhangsan@example.com', 'premium')
  const adminUserExample = new AdminUser(BaseUser.generateId(), '李四', 'lisi@example.com', '技术部', ['read', 'write'])

  // 添加用户
  userManager.addUser(regularUserExample) // 输出：用户 ID: [随机数], 姓名: 张三, 邮箱: zhangsan@example.com, 角色: 普通用户 已添加
  userManager.addUser(adminUserExample) // 输出：用户 ID: [随机数], 姓名: 李四, 邮箱: lisi@example.com, 角色: 管理员 已添加

  // 用户操作
  if (regularUserExample instanceof RegularUser) {
    regularUserExample.login() // 输出：张三 登录成功
    console.log(regularUserExample.getSubscriptionInfo()) // 输出：订阅类型: premium
  }

  if (adminUserExample instanceof AdminUser) {
    adminUserExample.addPermission('delete') // 输出：权限 delete 已添加
    console.log('管理员权限：', adminUserExample.getPermissions()) // 输出：管理员权限： ['read', 'write', 'delete']
    console.log(adminUserExample.getDepartmentInfo()) // 输出：部门: 技术部
  }

  // 查询用户
  console.log('所有用户：', userManager.getAllUsers().map(user => user.getInfo())) // 输出：所有用户： [用户信息数组]
  console.log('管理员用户：', userManager.getUsersByRole('管理员').map(user => user.getInfo())) // 输出：管理员用户： [管理员用户信息数组]

  // ==================== 学习要点总结 ====================
  /*
  📚 TypeScript 类（Class）学习要点：
  
  1. 基础类定义
     ✅ class: 定义类的关键字
     ✅ constructor: 构造函数，创建实例时自动调用
     ✅ 属性: 类的数据成员
     ✅ 方法: 类的行为成员
  
  2. 访问修饰符
     ✅ public: 公共访问，默认修饰符
     ✅ private: 私有访问，只能在类内部访问
     ✅ protected: 受保护访问，只能在类内部和子类中访问
     ✅ 封装性: 通过访问修饰符控制属性访问
  
  3. 静态成员
     ✅ static: 静态属性和方法属于类本身
     ✅ 访问方式: 通过类名访问，不能通过 this 访问
     ✅ 应用场景: 工具类、常量定义、单例模式
  
  4. 继承和实现
     ✅ extends: 类继承，使用 extends 关键字
     ✅ implements: 接口实现，使用 implements 关键字
     ✅ super: 调用父类构造函数和方法
     ✅ 多继承: 可以实现多个接口
  
  5. 抽象类
     ✅ abstract: 抽象类关键字
     ✅ 抽象方法: 子类必须实现的方法
     ✅ 实例化: 抽象类不能直接实例化
     ✅ 应用场景: 基类定义、模板方法模式
  
  6. 实际应用
     ✅ 用户管理系统: 展示类的实际应用
     ✅ 单例模式: 确保类只有一个实例
     ✅ 类型安全: 通过类提供类型安全
     ✅ 面向对象: 体现面向对象编程思想
  
  🎯 重点掌握：
  - 理解类的核心概念和面向对象编程思想
  - 掌握访问修饰符的作用和使用场景
  - 学会使用继承和接口实现代码复用
  - 理解抽象类的作用和应用场景
  - 在实际项目中合理使用类的各种特性
  */
}
