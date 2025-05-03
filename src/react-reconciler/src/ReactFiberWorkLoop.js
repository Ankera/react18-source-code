import { scheduleCallback } from "scheduler";
import { beginWork } from "./ReactFiberBeginWork";
import { createWorkInProgress } from "./ReactFiber";
import { completeWork } from "./ReactFiberCompleteWork";
import { ChildDeletion, MutationMask, NoFlags, Passive, Placement, Update } from './ReactFiberFlags';
import { FunctionComponent, HostComponent, HostRoot, HostText } from './ReactWorkTags';
import {
  commitMuationEffectsOnFiber, // 执行 DOM操作
  // commitPassiveUnmountEffects, // 执行 destroy
  // commitPassiveMountEffects,// 执行 create
  // commitLayoutEffects,
} from './ReactFiberCommitWork';

let workInProgress = null;

let workInProgressRoot = null;

/**
 * 计划更新root
 * 源码中此处有一个任务功能
 * @param {*} root
 */
export function scheduledUpdateOnFiber(root) {
  // 确保调度执行root上的更新
  ensureRootInScheduled(root);
}

function ensureRootInScheduled(root) {
  // 确保root在调度中
  if (root !== null) {
    // 调度更新
    scheduleCallback(performConcurrentWorkOnRoot.bind(null, root));
  }
}

function performConcurrentWorkOnRoot(root) {
  // 第一次渲染以同步的方式渲染根节点，初次渲染的时候，都是同步
  renderRootSync(root);

  // 开始进入提交阶段，就是执行副作用
  const finishedWork = root.current.alternate;
  root.finishedWork = finishedWork;

  commitRoot(root);
}

function prepareFreshStack(root) {
  workInProgress = createWorkInProgress(root.current, null);
}

function renderRootSync(root) {
  // 1. 获取当前的fiber, 开始构建fiber树
  prepareFreshStack(root);

  workLoopSync();
}

function workLoopSync() {
  // 1. 获取当前的fiber
  // 2. 如果没有当前的fiber，说明没有需要渲染的内容
  // 3. 如果有当前的fiber，开始渲染
  while (workInProgress !== null) {
    // debugger;
    performUnitOfWork(workInProgress);
  }
}

function performUnitOfWork(unitOfWork) {
  const current = unitOfWork.alternate;
  const next = beginWork(current, unitOfWork);
  unitOfWork.memoizedProps = unitOfWork.pendingProps;
  if (next === null) {
    completeUnitOfWork(unitOfWork);
  } else {
    workInProgress = next;
  }
}

function completeUnitOfWork(unitOfWork) {
  let completedWork = unitOfWork;
  do {
    const current = completedWork.alternate;
    const returnFiber = completedWork.return;
    completeWork(current, completedWork);

    // 如果有弟弟，就构建弟弟对应fiber子链表
    const siblingFiber = completedWork.sibling;
    if (siblingFiber !== null) {
      workInProgress = siblingFiber;
      return;
    }

    // 如果没有弟弟，说明当前完成的就是父fiber的最后一个节点
    // 也就是说一个父fiber，所有的子fiber全部完成了
    completedWork = returnFiber;
    workInProgress = completedWork;
  } while (completedWork !== null);
}

/**
 * 提交阶段
 * @param {*} root
 */
function commitRoot(root) {
  // 先获取新构建好的 fiber 树的根节点
  const { finishedWork } = root;

  console.log("~~~~~~~~~~~~~~~~~开始commit~~~~~~~~~~~~~~~~~~~~");
  // 判断子树有没有副作用
  const subtreeFlags = (finishedWork.subtreeFlags & MutationMask) != NoFlags;
  const rootFlags = (finishedWork.flags & MutationMask) != NoFlags;
  if (subtreeFlags || rootFlags) {
    console.log("~~~~~~~~~~~~~~~~~DOM执行变更~~~~~~~~~~~~~~~~~~~~");
    // 当 DOM 执行变更之后
    commitMuationEffectsOnFiber(finishedWork, root);

    console.log("~~~~~~~~~~~~~~~~~DOM执行变更后~~~~~~~~~~~~~~~~~~~~");
  }
}
