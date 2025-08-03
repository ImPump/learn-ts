/*
命名空间 vs 模块导出对比示例
展示两种方式的具体区别和使用场景
*/

// ==================== 1. 命名空间方式 ====================

// 1.1 基础命名空间
namespace MathUtils {
  export function add(a: number, b: number): number {
    return a + b
  }
  
  export function subtract(a: number, b: number): number {
    return a - b
  }
  
  export const PI = 3.14159
  
  // 内部函数（不导出）
  function internalHelper() {
    return 'internal'
  }
}

// 1.2 嵌套命名空间
namespace Utils {
  export namespace String {
    export function capitalize(str: string): string {
      return str.charAt(0).toUpperCase() + str.slice(1)
    }
    
    export function reverse(str: string): string {
      return str.split('').reverse().join('')
    }
  }
  
  export namespace Array {
    export function unique<T>(arr: T[]): T[] {
      return [...new Set(arr)]
    }
  }
}

// 1.3 命名空间的使用
console.log('命名空间使用示例：')
console.log(MathUtils.add(5, 3)) // 8
console.log(MathUtils.PI) // 3.14159
console.log(Utils.String.capitalize('hello')) // Hello
console.log(Utils.Array.unique([1, 2, 2, 3])) // [1, 2, 3]

// ==================== 2. 模块导出方式 ====================

// 2.1 命名导出
export function multiply(a: number, b: number): number {
  return a * b
}

export function divide(a: number, b: number): number {
  if (b === 0) throw new Error('除数不能为零')
  return a / b
}

export const E = 2.71828

// 2.2 默认导出
export default class Calculator {
  add(a: number, b: number): number {
    return a + b
  }
  
  subtract(a: number, b: number): number {
    return a - b
  }
}

// 2.3 重新导出
export { multiply as multiplyNumbers }
export { divide as divideNumbers }

// 2.4 类型导出
export type MathOperation = (a: number, b: number) => number
export interface CalculatorConfig {
  precision: number
  roundingMode: 'floor' | 'ceil' | 'round'
}

// ==================== 3. 实际使用对比 ====================

// 3.1 命名空间的使用方式
function useNamespace() {
  // 直接使用，无需导入
  const result1 = MathUtils.add(10, 5)
  const result2 = Utils.String.capitalize('typescript')
  
  console.log('命名空间结果：', result1, result2)
}

// 3.2 模块的使用方式（模拟）
// 注意：在实际文件中，这些函数需要通过 import 导入
function useModule() {
  // 需要先导入才能使用
  // import { multiply, divide, Calculator } from './math-module'
  
  const calc = new Calculator()
  const result1 = calc.add(10, 5)
  const result2 = multiply(4, 3)
  
  console.log('模块结果：', result1, result2)
}

// ==================== 4. 性能和行为差异 ====================

// 4.1 命名空间的特点
namespace PerformanceTest {
  export function testNamespace() {
    // 命名空间在运行时创建对象
    // 所有导出的内容都会被打包
    console.log('命名空间：所有内容都会被打包')
  }
}

// 4.2 模块的特点
export function testModule() {
  // 模块支持树摇优化
  // 未使用的导出会被移除
  console.log('模块：支持树摇优化，未使用的代码会被移除')
}

// ==================== 5. 适用场景总结 ====================

/*
📋 命名空间适用场景：
✅ 学习项目和小型项目
✅ 需要快速原型开发
✅ 代码组织简单，不需要复杂的模块管理
✅ 与现有 JavaScript 代码集成
✅ 避免配置复杂性

📋 模块导出适用场景：
✅ 大型项目和团队开发
✅ 需要代码分割和懒加载
✅ 需要树摇优化减少打包体积
✅ 现代前端框架（React、Vue、Angular）
✅ 需要严格的模块边界
✅ 支持 TypeScript 的完整模块系统特性

🎯 选择建议：
- 学习阶段：使用命名空间，简单直接
- 实际项目：使用模块导出，符合现代标准
- 遗留项目：可以混合使用，逐步迁移
*/

// 测试函数
export function runComparison() {
  console.log('=== 命名空间 vs 模块导出对比 ===')
  
  // 命名空间测试
  useNamespace()
  
  // 模块测试
  useModule()
  
  // 性能测试
  PerformanceTest.testNamespace()
  testModule()
  
  console.log('=== 对比完成 ===')
}

// 如果直接运行此文件
if (typeof require !== 'undefined' && require.main === module) {
  runComparison()
} 