import { createContainer, updateContainer } from "react-reconciler/src/ReactFiberReconciler";

function ReactDOMRoot(internalRoot) {
  this._internalRoot = internalRoot;
}

ReactDOMRoot.prototype.render = function (children) {
  // debugger;
  const root = this._internalRoot;
  // 1. 调用 reconciler 的 updateContainer 方法
  updateContainer(children, root, null, null);
  // 2. 将 children 渲染到 root.containerInfo 上
  // 3. containerInfo 是一个 DOM 节点
  // 4. ReactDOMRoot.prototype.render = function (children) {
  //    return updateContainer(children, root, null, null);
  // }
  // 5. updateContainer 方法会调用 scheduleUpdateOnFiber 方法
  // 6. scheduleUpdateOnFiber 方法会调用 requestWork 方法
  // 7. requestWork 方法会调用 scheduleCallback 方法
  // 8. scheduleCallback 方法会调用 requestIdleCallback 方法
  // 9. requestIdleCallback 方法会调用 requestAnimationFrame 方法
}

export function createRoot(container) {
  const root = createContainer(container);

  /**
   * const root = {
   *    containerInfo: div#root [container]
   * }
   * const ReactDOMRoot = {
   *    _internalRoot: {
   *        containerInfo: div#root [container]
   *    }
   * }
   */
  return new ReactDOMRoot(root);
}
