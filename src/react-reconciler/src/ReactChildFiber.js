import { REACT_ELEMENT_TYPE } from "shared/ReactSymbols";
import { createFiberFromElement, createFiberFromText } from "./ReactFiber";
import { ChildDeletion, Placement } from "./ReactFiberFlags";
import { HostText } from "./ReactWorkTags";
import isArray from "shared/isArray";

/**
 *
 * @param {*} shouldTrackSideEffect 是否跟踪副作用
 */
function createChildReconciler(shouldTrackSideEffects) {
  function placeSingleChild(newFiber) {
    if (shouldTrackSideEffects) {
      newFiber.flags |= Placement;
    }
    return newFiber;
  }

  function reconcileSigleElement(
    returnFiber,
    currentFirstChild,
    element,
    lanes
  ) {
    const created = createFiberFromElement(element);
    created.return = returnFiber;
    return created;
  }

  function createFiber(returnFiber, newChild) {
    if ((typeof newChild === 'string' && newChild !== "") || typeof newChild === 'number') {
      const created = createFiberFromText(newChild);
      created.return = returnFiber;
      return created;
    }

    if (typeof newChild === 'object' && newChild !== null) {
      switch(newChild.$$typeof) {
        case REACT_ELEMENT_TYPE:
          const created = createFiberFromElement(newChild);
          created.return = returnFiber;
          return created;
        default:
          break;
      }
    }

    return null;
  }

  function placeChild(newFiber, newIdx) {
    newFiber.index = newIdx;
    if (shouldTrackSideEffects) {
      newFiber.flags |= Placement;
    }
    // return newFiber;

  }

  function reconcileChildrenArray(returnFiber, currentFirstChild, newChildren) {
    let resultingFirstChild = null;
    let previousNewFiber = null;
    let newIdx = 0;

    for (; newIdx < newChildren.length; newIdx++) {
      const newFiber = createFiber(returnFiber, newChildren[newIdx]);
      if (newFiber === null) {
        continue;
      }
      placeChild(newFiber, newIdx);
      if (previousNewFiber === null) {
        resultingFirstChild = newFiber;
      } else {
        // 否则说明不是大儿子，就把这个newFiber添加上一个子节点后面
        previousNewFiber.sibling = newFiber;
      }

      // 让newFiber成为新的父fiber的第一个子fiber
      // 让newFiber成为最后一个或者说上一个子fiber
      previousNewFiber = newFiber;
    }

    return resultingFirstChild;
  }

  /**
   * DOM-DIFF 就是用老的子fiber链表和新的虚拟DOM进行比较的过程
   * @param {*} returnFiber 新的父Fiber
   * @param {*} currentFirstChild 老fiber第一个子fibercunrent一般来说指的是老
   * @param {*} newChild 新的于虚拟DOM h1虚拟DOM
   * @param {*} lanes
   * @returns
   */
  function reconcileChildFibers(
    returnFiber,
    currentFirstChild,
    newChild,
    lanes
  ) {
    if (typeof newChild === "object" && newChild !== null) {
      switch (newChild.$$typeof) {
        case REACT_ELEMENT_TYPE:
          const newFiber = reconcileSigleElement(returnFiber, currentFirstChild, newChild);
          return placeSingleChild(newFiber);
        default:
          break;
      }
    }

    //newChild ［he11o文本节点，span虚拟DOM元系］
    if (isArray(newChild)) {
      return reconcileChildrenArray(returnFiber, currentFirstChild, newChild);
    }

    return null;
  }

  return reconcileChildFibers;
}

/**
 * 创建子child reconciler
 */
export const mountChildFibers = createChildReconciler(false);

export const reconcileChildFibers = createChildReconciler(true);
