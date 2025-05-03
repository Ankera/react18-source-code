import logger, { indent } from "shared/logger";
import {
  createTextInstance,
  createInstance,
  finalizeInitialChildren,
  appendInitialChild,
} from "react-dom-bindings/src/client/ReactDOMHostConfig";
import { HostComponent, HostRoot, HostText } from "./ReactWorkTags";
import { NoFlags, Update } from "./ReactFiberFlags";

function appendAllChildren(parent, workInPropress) {
  const node = workInPropress.child;
  while (node !== null) {
    if (node.tag === HostComponent || node.tag === HostText) {
      appendInitialChild(parent, node.stateNode);
    } else if (node.child !== null) {
      node = node.child;
      continue;
    }

    if (node.return === workInPropress) {
      return;
    }

    while (node.sibling !== null) {
      if (node.return === null || node.return === workInPropress) {
        return;
      }
      node = node.return;
    }

    node = node.sibling;
  }
}

/**
 * 完成一个fiber节点
 * @param {*} current
 * @param {*} workInPropress
 */
export function completeWork(current, workInPropress) {
  indent.number -= 2;
  logger(" ".repeat(indent.number) + "completeWork", workInPropress);

  const newProps = workInPropress.pendingProps;
  switch (workInPropress.tag) {
    case HostRoot:
      bubbleProperties(workInPropress);
      break;
    case HostComponent:
      const { type } = workInPropress;
      const instance = createInstance(type, newProps, workInPropress);

      appendAllChildren(instance, workInPropress);

      // 把所有子节点挂载到父节点上
      workInPropress.stateNode = instance;

      finalizeInitialChildren(instance, type, newProps);

      // 向上冒泡属性, 收集副作用
      bubbleProperties(workInPropress);
      break;
    case HostText:
      const newText = newProps;
      workInPropress.stateNode = createTextInstance(newText);

      // 向上冒泡属性, 收集副作用
      bubbleProperties(workInPropress);
      break;
    default:
      return null;
  }
}

function bubbleProperties(completedWork) {
  let subtreeFlags = NoFlags;
  let child = completedWork.child;

  while (child !== null) {
    subtreeFlags |= child.subtreeFlags;
    subtreeFlags |= child.flags;

    child = child.sibling;
  }

  completedWork.subtreeFlags = subtreeFlags;
}
