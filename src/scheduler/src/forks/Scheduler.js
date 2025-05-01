export function scheduleCallback(callback) {
  requestIdleCallback(callback);
  // 1、获取当前的 root
  // 2、获取当前的更新队列
  // 3、获取当前的更新优先级
  // 4、获取当前的更新
  // 5、获取当前的更新的回调函数
  // 6、执行更新
}
// 7、更新当前的更新队列