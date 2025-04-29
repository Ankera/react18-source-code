import { createContainer } from "react-reconciler/src/ReactFiberReconciler";

function ReactDOMRoot(internalRoot) {
  this._internalRoot = internalRoot;
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
