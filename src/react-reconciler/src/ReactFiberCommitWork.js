import { HostComponent, HostRoot, HostText } from "./ReactWorkTags";

export function commitMuationEffectsOnFiber(finishedWork, root) {
  const current = finishedWork.alternate;
  const flags = finishedWork.flags;

  switch (finishedWork.tag) {
    case HostRoot:
      break;
    case HostComponent:
      break;
    case HostText: {
      // 先遍历他们的子节点，处理他们子几点上的副作用
      recursivelyTraverseMutationEffects(root, finishedWork);

      // 再处理自己身上的副作用
      commitReconciliationEffects(finishedWork);
      break;
    }
    default:
      break;
  }
}

/**
 * 递归处理变更的副作用
 * @param {*} root
 * @param {*} parentFiber
 */
function recursivelyTraverseMutationEffects(root, parentFiber) {
  // 先把父节点要删除的全部删除
  const deletions = parentFiber.deletions;
  if (deletions !== null) {
    for (let i = 0; i < deletions.length; i++) {
      const childToDelete = deletions[i];
      commitDeletionEffects(root, parentFiber, childToDelete);
    }
  }

  if (parentFiber.subtreeFlags & MutationMask) {
    let { child } = parentFiber;
    while (child != null) {
      commitMuationEffectsOnFiber(child, root);
      child = child.sibling;
    }
  }
}

function commitReconciliationEffects() {}
