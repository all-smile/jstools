/*
函数柯里化 curry
是把接收多个参数的函数变换成接收一个单一参数（最初函数的第一个参数）的函数，
并且返回接收余下的参数而且返回结果的新函数的技术。

表现形式上就是函数里面返回函数（闭包）

用处：
1.参数复用
2.兼容性检测
3.延迟执行(对参数复用功能进行改进)
*/

// 1.参数复用

// (1)正常正则验证字符串 reg.test(txt)
// 函数封装后
function check(reg, txt) {
  return reg.test(txt)
}

check(/\d+/g, 'test')       //false
check(/[a-z]+/g, 'test')    //true


// Currying后
function curryingCheck(reg) {
  return function (txt) {
    return reg.test(txt)
  }
}

var hasNumber = curryingCheck(/\d+/g)
var hasLetter = curryingCheck(/[a-z]+/g)

hasNumber('test1')      // true
hasNumber('testtest')   // false
hasLetter('21212')      // false


// 2.兼容性写法
const whichEvent = (function () {
  if (window.addEventListener) {
    // 主流浏览器，事件冒泡事件捕获
    return function (ele, type, listener, useCapture) {
      ele.addEventListener(type, function (e) {
        listener.call(ele, e)
      }, useCapture)
    }
  } else if (window.attachEvent) {
    // ie 事件冒泡
    return function (ele, type, handler) {
      ele.attachEvent(`on${type}`, function (e) {
        handler.call(ele, e)
      })
    }
  }
})()


// 3.延迟执行
/* 
面试题
实现add函数，实现一下计算结果
add(1)(2)(3) = 6;
add(1,2,3)(4) = 10;
add(1)(2)(3)(4)(5) = 15;
*/

/* 
分析: 
1.对传入参数不限定 
2.不能丢失传入的参数 
3.什么时候传入参数都可以（不同时期传入的参数可以和已传入的参数一起使用）
*/

// (1)基础版
function add() {
  let args = Array.prototype.slice.call(arguments);
  let inner = function () {
    args.push(...arguments)
    let sum = args.reduce(function (preSum, cur) {
      return preSum + cur
    })
    return sum
  }
  return inner;
}

console.log(add(1)(2)) // 3
console.log(add(1)(2)(3))
/*
Uncaught TypeError: add(...)(...) is not a function
    at <anonymous>:1:22
*/

// (2)用递归处理参数不定情况
function add() {
  let args = Array.prototype.slice.call(arguments);
  let inner = function () {
    args.push(...arguments)
    return inner // 内部函数已经返回了内部函数，很难再返回一个额外的结果到外部 => 修改toString方法
  }
  return inner;
}

console.log(add(1)(2)(3)(4))
// 原本的函数被转换成字符串显示了，其实就是发生了隐式转换，发生隐式转换是因为调用了内部的toString方法
/*
ƒ () {
    args.push(...arguments)
    return inner
  }
*/

// (3)修改toString方法，并在里面处理返回值

function add() {
  // 定义args存储所有参数
  let args = Array.prototype.slice.call(arguments);
  // 内部声明一个函数，利用闭包的特性保存args, 进行参数收集
  let inner = function () {
    args.push(...arguments)
    return inner
  }
  inner.toString = function () {
    return args.reduce(function (preSum, cur) {
      return preSum + cur
    })
  }
  return inner;
}

console.log(add(1)(2)(3)(4)) // ƒ 10 函数类型

