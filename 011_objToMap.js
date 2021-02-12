/*
 * @Author: your name
 * @Date: 2021-02-12 20:36:20
 * @LastEditTime: 2021-02-12 23:00:36
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \21道JS手写面试题\011_objToMap.js
 */

// 将对象转为 Map
let obj = {"a":1, "b":2};

// 方法一 
// `Object.entries()`方法返回一个给定对象自身可枚举属性的 **键值对数组** 。

let objToMap = (obj) => {return new Map(Object.entries(obj))}
console.log(objToMap(obj))

// 方法二
let objToMap = (obj) => {
    let toMap = new Map(); // 创建一个空映射
    for (let k of Object.keys(obj)) { // 遍历对象属性设置值
        toMap.set(k,obj[key])
    }
    return toMap;
}

console.log(objToMap({yes: true, no: false}))