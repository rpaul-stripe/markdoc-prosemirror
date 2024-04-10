import Node from '@markdoc/markdoc/src/ast/node';
import * as fromAst from './converter/fromAst';
import * as toAst from './converter/toAst';

import type { Converters } from "./types";

export default {
  fromAst: {
    block: {
      document(node, config) {
        return {
          type: 'doc',
          content: fromAst.convertChildren(node, config)
        };
      },

      heading(node, config) {
        return {
          type: 'heading',
          attrs: { level: node.attributes.level },
          content: fromAst.convertChildren(node, config)
        };
      },

      paragraph(node, config) {
        return {
          type: 'paragraph',
          content: fromAst.convertChildren(node, config)
        };
      },

      list(node, config) {
        return {
          type: node.attributes.ordered ? 'orderedList' : 'bulletList',
          content: fromAst.convertChildren(node, config)
        };
      },

      // TODO: handle loose/tight list distinction
      item(node, config) {
        return {
          type: 'listItem',
          content: [
            {
              type: 'paragraph',
              content: fromAst.convertChildren(node, config)
            }
          ]
        };
      },

      tag(node, config) {
        return {
          type: 'markdocTag',
          content: fromAst.convertChildren(node, config),
          attrs: {
            attributes: node.attributes,
            tag: node.tag,
          }
        }
      }
    },
    inline: {
      strong(node, config) {
        return { type: 'bold' };
      },

      em(node, config) {
        return { type: 'italic' };
      },

      link(node, config) {
        return {
          type: 'link',
          attrs: { href: node.attributes.href }
        };
      }
    }
  },
  toAst: {
    nodes: {
      doc(node, config) {
        return new Node('document', {}, toAst.convertChildren(node, config));
      },

      heading(node, config) {
        return new Node('heading', { level: node.attrs.level }, [toAst.convertInline(node, config)]);
      },

      paragraph(node, config) {
        return new Node('paragraph', {}, [toAst.convertInline(node, config)]);
      },

      bulletList(node, config) {
        return new Node('list', { ordered: false }, toAst.convertChildren(node, config));
      },

      orderedList(node, config) {
        return new Node('list', { ordered: true }, toAst.convertChildren(node, config));
      },

      listItem(node, config) {
        return new Node('item', {}, toAst.convertChildren(node, config));
      },

      markdocTag(node, config) {
        return new Node('tag', node.attrs.attributes,
          toAst.convertChildren(node, config), node.attrs.tag);
      }
    },
    marks: {
      bold(mark, config) {
        return new Node('strong');
      },

      italic(mark, config) {
        return new Node('em');
      },

      link(mark, config) {
        return new Node('link', { href: mark.attrs.href });
      },
      comment(mark, config) {
        return [];
      }
    }
  }
} as Converters;
