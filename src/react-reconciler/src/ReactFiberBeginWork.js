import logger, { indent } from "shared/logger";
import { shouldSetTextContent } from "react-dom-bindings/src/client/ReactDOMHostConfig";
import { processUpdateQueue } from "./ReactFiberClassUpdateQueue";
import { HostRoot, HostComponent, HostText } from "./ReactWorkTags";
import { mountChildFibers, reconcileChildFibers } from "./ReactChildFiber";

function updateHostRoot(current, workInProgress) {
  processUpdateQueue(workInProgress);

  const nextState = workInProgress.memoizedState;
  const nextChildren = nextState.element;

  reconcileChilren(current, workInProgress, nextChildren);
  return workInProgress.child;
}

/**
 * 构建原生组件的子fiber链
 * @param {*} current 
 * @param {*} workInProgress 
 */
function updateHostComponent(current, workInProgress) {
  // debugger;
  const { type } = workInProgress;
  const nextProps = workInProgress.pendingProps;
  let nextChildren = nextProps.children;
  const isDirectTextChild = shouldSetTextContent(type, nextProps);
  if (isDirectTextChild) {
    nextChildren = null;
  }
  reconcileChilren(current, workInProgress, nextChildren);
  return workInProgress.child;
}

/**
 * 根据新的虚拟DOM生成新的fiber
 * @param {*} current 老的 fiber
 * @param {*} workInProgress 新的 fiber
 * @param {*} nextChilren 新的子虚拟 DOM
 */
function reconcileChilren(current, workInProgress, nextChildren) {
  // debugger;
  if (current === null) {
    // 如果此新fiber没有老fiber，说明此新fiber是新创建的
    workInProgress.child = mountChildFibers(workInProgress, null, nextChildren);
  } else {
    // 如果说有老Fiber的话，做DOM-DIFF 拿老的子fiber链表和新的子虚拟DOM进行比较，进行最小化的更
    workInProgress.child = reconcileChildFibers(
      workInProgress,
      current.child,
      nextChildren
    );
  }
}

/**
 * 根据新的虚拟dom构建新的fiber子链表
 * @param {*} current 老fiber
 * @param {*} workInProgress 新fiber
 */
export function beginWork(current, workInProgress) {
  logger(" ".repeat(indent.number) + "beginWork", workInProgress);
  indent.number += 2;

  switch (workInProgress.tag) {
    // case IndeterminateComponent:
    //   return mountIndeterminateComponent(current, workInProgress, workInProgress.type);
    // case FunctionComponent: {
    //   const Component = workInProgress.type;
    //   const props = workInProgress.pendingProps;
    //   return updateFunctionComponent(current, workInProgress, Component, props);
    // }
    case HostRoot:
      return updateHostRoot(current, workInProgress);
    case HostComponent:
      return updateHostComponent(current, workInProgress);
    case HostText:
      return null;
    default:
      return null;
  }
}
