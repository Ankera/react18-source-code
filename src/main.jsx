import { createRoot } from "react-dom/client";
import "./main.css";

// debugger;
const element = (
  <div>
    hello <span style={{ color: "red" }}>world</span>
  </div>
);

console.log(element)
const root = createRoot(document.getElementById("root"));
console.log(root);
// root.render(<App />);


/**
 * Babel 在处理 JSX 代码时，会通过插件 @babel/plugin-transform-react-jsx 将 JSX 转换为对应的函数调用
 * 
 * 转换 JSXElement
 * 插件会遍历 AST，找到 JSXElement 节点，并将其转换为 _jsxDEV 的调用
 * 
 * <div>
 *  children
 *  - hello 
 *  - <span>
 *    world
 * 
 * React 处理的是虚拟DOM
 */