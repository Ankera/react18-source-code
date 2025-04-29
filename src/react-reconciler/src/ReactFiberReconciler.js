import { createFiberRoot } from './ReactFiberRoot';

/**
 * 在跟节点上创建fiber容器
 * @param {*} containerInfo 
 * @returns 
 */
export function createContainer (containerInfo) {
  return createFiberRoot(containerInfo);
}