# react18-source-code
记录react源码分析


### jsxDEV
```
Babel 在处理 JSX 代码时，会通过插件 @babel/plugin-transform-react-jsx 将 JSX 转换为对应的函数调用
1、解析 JSX 为 AST
  Babel 首先将 JSX 代码解析为抽象语法树
  解析后的 AST 包含了 JSXElement 和 JSXFragment 等节点
2、转换 JSXElement
  插件会遍历 AST，找到 JSXElement 节点，并将其转换为 _jsxDEV 的调用
  a、生成 _jsxDEV 调用
    - 对于每个 JSXElement，生成一个 _jsxDEV 函数调用。例如，<div> 被转换为 _jsxDEV("div", {...})
    - 处理子节点

completeWork
```