import Node from '@markdoc/markdoc/src/ast/node';

import type { Config } from '../types';

import type {
  Node as EditorNode,
  Mark as EditorMark,
  Fragment
} from 'prosemirror-model';

export function convertMark(mark: EditorMark, config: Config): Node {
  return config.converters.toAst.marks[mark.type.name]?.(mark, config); 
}

export function convertNode(node: EditorNode, config: Config): Node {
  return config.converters.toAst.nodes[node.type.name]?.(node, config); 
}

export function convertInline(node: EditorNode, config: Config): Node {
  const stack = [new Node('inline')];

  for (let i = 0; i < node.childCount; i++) {
    const child = node.child(i);
    const previous = i > 0 ? node.child(i - 1).marks : [];

    for (let mark of previous)
      if (!child.marks.includes(mark))  
        stack.pop();

    for (let mark of child.marks) {
      if (previous.includes(mark)) continue;
      
      const item = convertMark(mark, config);
      if (!item) continue;
      
      stack.at(-1).push(item);
      stack.push(item);
    }

    const text = new Node('text', {content: child.text});
    stack.at(-1)?.push(text);
  }

  return stack[0];
}

export function convertChildren(node: EditorNode | Fragment, config: Config): Node[] {
  const output: Node[] = [];

  for (let i = 0; i < node.childCount; i++) {
    const child = node.child(i);
    const converted = convertNode(child, config);
    
    if (converted)
      output.push(converted);
  }

  return output;
}