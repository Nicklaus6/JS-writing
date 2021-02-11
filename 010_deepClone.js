/*
 * @Author: your name
 * @Date: 2021-02-10 21:13:23
 * @LastEditTime: 2021-02-11 21:50:35
 * @LastEditors: Please set LastEditors
 * @Description: #手写一个深拷贝
 * @FilePath: \21道JS手写面试题\010_deepClone.js
 */

// #手写一个深拷贝

// 什么是深拷贝？
// 就是将一个对象从内存中完整地拷贝出来一份给目标对象，并从堆内存中开辟一个全新的空间存放新对象，且新对象的修改并不会改变原对象，二者实现真正的分离。

// 1. 基础版（手写递归实现）

// 下面是一个实现 deepClone 函数封装的例子，
// 通过 for in 遍历传入参数的属性值，如果值是引用类型则再次递归调用该函数，如果是基础数据类型就直接复制。

// 代码如下所示：

// function deepClone(obj) {
//   let cloneObj = {};
//   for (let key in obj) {
//     if (typeof obj[key] === 'object') {
//       cloneObj[key] = deepClone(obj[key]); // 是对象就继续调用该函数进行递归
//     } else {
//       cloneObj[key] = obj[key]; // 基本类型的值的话就直接复制值
//     }
//   }
//   return cloneObj;
// }

// // 测试代码
// let obj1 = { a: { b: 1 } };
// let obj2 = deepClone(obj1);
// obj1.a.b = 2;
// console.log(obj2); // { a: { b: 1} }

// 虽然利用递归能实现一个深拷贝，但是同 `JSON.stringfy` 一样，还是有一些问题没有完全解决，例如：
// 1. 这个深拷贝函数并不能复制不可枚举的属性以及 Symbol 类型；
// 2. 这种方法只是针对普通的引用类型的值做递归复制，而对于 Array、Date、RegExp、Error、Function 这样的引用类型并不能正确地拷贝；
// 3. 对象的属性里面成环，即循环引用没有解决。

// 2. 递归改进版

// 针对上面几个待解决问题，我们先看一下应该怎么做：
// 1. 针对能够遍历对象的不可枚举属性以及 Symbol 类型，我们可以使用 Reflect.ownKeys 方法；
// 2. 当参数为 Date、RegExp 类型，则直接生成一个新的实例返回；
// 3. 利用 Object 的 getOwnPropertyDescriptors 方法可以获得对象的所有属性，以及对应的特性，顺便结合 Object 的 create 方法创建一个新对象，并继承传入原对象的原型链；
// 4. 利用 WeakMap 类型作为 Hash 表，因为 WeakMap 是弱引用类型，可以有效防止内存泄漏，对检测 循环引用 很有帮助，如果存在循环，则引用直接返回 WeakMap 存储的值。

// 代码如下所示：

const isComplexDataType = (obj) =>
  (typeof obj === 'object' || typeof obj === 'function') && typeof obj !== null;

const deepClone = function (obj, hash = new WeakMap()) {
  if (obj.constructor === Date) return new Date(obj); // 日期对象直接返回一个新的日期对象
  if (obj.constructor === RegExp) return new RegExp(obj); // 正则对象直接返回一个新的正则对象

  // 如果循环引用了就用 weakMap 来解决
  if (hash.has(obj)) return hash.get(obj);
  let allDesc = Object.getOwnPropertyDescriptor(obj);
  // 遍历传入参数所有键的特性
  let cloneObj = Object.create(Object.getPrototypeOf(obj), allDesc);
  // 继承原型链
  hash.set(obj, cloneObj);
  for (let key of Reflect.ownKeys(obj)) {
    cloneObj[key] =
      isComplexDataType(obj[key]) && typeof obj[key] !== 'function'
        ? deepClone(obj[key], hash)
        : obj[key];
  }
  return cloneObj;
};

// 下面是验证代码
let obj = {
  num: 0,
  str: '',
  boolean: true,
  unf: undefined,
  nul: null,
  obj: { name: '我是一个对象', id: 1 },
  arr: [0, 1, 2],
  func: function () {
    console.log('我是一个函数');
  },
  date: new Date(0),
  reg: new RegExp('/我是一个正则/ig'),
  [Symbol('1')]: 1,
};

Object.defineProperty(obj, 'innumerable', {
  enumerable: false,
  value: '不可枚举属性',
});

obj = Object.create(obj, Object.getOwnPropertyDescriptors(obj));

obj.loop = obj; // 设置loop成循环引用的属性

let cloneObj = deepClone(obj);
cloneObj.arr.push(4);

console.log('obj', obj);
console.log('cloneObj', cloneObj);
