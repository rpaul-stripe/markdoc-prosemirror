import type * as React from 'react';
import type Node from '@markdoc/markdoc/src/ast/node';
import type { JSONContent, NodeViewRendererProps } from '@tiptap/core';
import type {
  Node as EditorNode,
  Mark as EditorMark,
} from 'prosemirror-model';

export type JSONMark = {
  type: string,
  attrs?: Record<string, any>,
  [key: string]: any,
};

export type Config = {
  converters: Converters,
};

export type Converters = {
  fromAst: {
    block: {
      [name: string]: (node: Node, config: Config) => JSONContent
    },
    inline: {
      [name: string]: (node: Node, config: Config) => JSONMark
    }
  },
  toAst: {
    nodes: {
      [name: string]: (node: EditorNode, config: Config) => Node
    },
    marks: {
      [name: string]: (node: EditorMark, config: Config) => Node | []
    }
  }
};

export type TipTapComponentProps = NodeViewRendererProps & {updateAttributes: any};


export type MarkdocTagComponentProps = {
  tag: string,
  attributes: {[name: string]: any},
  tiptap: TipTapComponentProps,
};

export type ComponentMap = {
  [name: string]: (params: MarkdocTagComponentProps) => React.Node
};