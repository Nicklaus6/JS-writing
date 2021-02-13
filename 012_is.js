/*
 * @Author: your name
 * @Date: 2021-02-13 20:27:03
 * @LastEditTime: 2021-02-13 20:57:21
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \21道JS手写面试题\012_Object.is.js
 */
// Object.is() 方法用于判断两个值是否为同一个值。
// 与 == 的区别在于，Object.is() 不会进行隐式转换
// 与 === 的区别在于，Object.is() 区分了 +0, -0 和 NaN, NaN

let is = (x, y) => {
  if (x === y) {
    // 针对 +0 === -0 的情况，利用 1/+0 = +Infinity, 1/-0 = -Infinity 解决。
    return x !== 0 || y !== 0 || 1 / x === 1 / y;
  } else {
    // 针对 NaN === NaN 为 false 的情况，x !== x , 如果 x 不是对象，那么一定就是 NaN
    // x 和 y 都是 NaN 就返回 true
    return x !== x && y !== y;
  }
};
