import { createUpdate, enqeueUpdate } from './ReactFiberClassUpdateQueue';
import { scheduledUpdateOnFiber } from './ReactFiberWorkLoop';
import { createFiberRoot } from './ReactFiberRoot';

/**
 * 在跟节点上创建fiber容器
 * @param {*} containerInfo 
 * @returns 
 */
export function createContainer (containerInfo) {
  return createFiberRoot(containerInfo);
}

/**
 * 更新容器，把虚拟dom element变成真实DOM插入到container容器中
 * @param {*} element 虚拟DOM
 * @param {*} container FiberRootNode
 */
export function updateContainer(element, container) {
  // 1. 调用 reconciler 的 updateContainer 方法
  // 2. 将 element 渲染到 container 上
  // 3. container 是一个 DOM 节点
  // 4. ReactDOMRoot.prototype.render = function (children) {
  //    return updateContainer(children, root, null, null);
  // }
  // 5. updateContainer 方法会调用 scheduleUpdateOnFiber 方法
  // 6. scheduleUpdateOnFiber 方法会调用 requestWork 方法
  const current = container.current;

  // 创建更新
  const update = createUpdate();

  // 要更新的虚拟 dom
  update.payload = { element };

  // 把此更新对象添加到 current 这个根 fiber 的更新队列上
  const root = enqeueUpdate(current, update);

  console.log('root', root);

  scheduledUpdateOnFiber(root);

  return root;
}