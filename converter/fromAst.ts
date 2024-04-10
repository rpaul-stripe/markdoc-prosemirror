import Node from '@markdoc/markdoc/src/ast/node';

import type { JSONContent } from '@tiptap/core';
import type { Config, JSONMark } from '../types';

export function convertNode(node: Node, config: Config) {
  return config.converters.fromAst.block[node.type]?.(node, config);
}

export function convertMark(node: Node, config: Config) {
  return config.converters.fromAst.inline[node.type]?.(node, config);
}

export function convertChildren(node: Node, config: Config) {
  const output: JSONContent[] = [];

  for (let child of node.children) {
    if (child.type === 'inline') {
      output.push(...convertInline(child, config));
      continue;
    }

    const converted = convertNode(child, config);
    if (converted) output.push(converted);
  }

  return output;
}

export function convertInline(node: Node, config: Config, marks: JSONMark[] = []) {
  const output: JSONContent[] = [];

  for (let child of node.children) {
    if (child.type === 'text') {
      output.push({
        type: 'text',
        text: child.attributes.content,
        marks: [...marks],
      });

      continue;
    }

    const mark = convertMark(child, config);
    if (!mark) continue;
    
    marks.push(mark);
    output.push(...convertInline(child, config, marks));
    marks.pop();
  }

  return output;
}