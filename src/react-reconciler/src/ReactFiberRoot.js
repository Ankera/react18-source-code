import { createHostRootFiber } from './ReactFiber';
import { initialUpdateQueue } from './ReactFiberClassUpdateQueue';

function FiberRootNode(containerInfo) {
  this.containerInfo = containerInfo;
}
export function createFiberRoot(containerInfo) {
  const root = new FiberRootNode(containerInfo);

  const uninitializeFiber = createHostRootFiber();
  root.current = uninitializeFiber;
  uninitializeFiber.stateNode = root;
  // 1. 创建一个 FiberRootNode 对象
  // 2. 创建一个 HostRootFiber 对象
  // 3. 将 HostRootFiber 对象的 stateNode 指向 FiberRootNode 对象
  // 4. 将 FiberRootNode 对象的 current 指向 HostRootFiber 对象
  // 5. 将 FiberRootNode 对象的 finishedWork 指向 HostRootFiber 对象
  // 6. 将 FiberRootNode 对象的 pendingLanes 指向 NoLanes
  // 7. 将 FiberRootNode 对象的 finishedLanes 指向 NoLanes
  // 8. 将 FiberRootNode 对象的 callbackNode 指向 null
  // 9. 将 FiberRootNode 对象的 callbackPriorityNumber 指向 NoLanePriority
  // 10. 将 FiberRootNode 对象的 callbackExpirationTime 指向 NoTimestamp

  initialUpdateQueue(uninitializeFiber);
  
  return root;
}
