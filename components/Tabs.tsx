import * as React from 'react';
import { NodeViewContent } from '@tiptap/react';
import type { MarkdocTagComponentProps } from '../types';
import './Tabs.css';

export const Tabs: React.FC = ({ attributes, tiptap: { editor, node, getPos, updateAttributes } }: MarkdocTagComponentProps) => {
  const [active, setActive] = React.useState(0);
  const id = React.useId().replaceAll(':', '');

  const nodes = [];
  node.forEach(child => nodes.push(child.attrs.attributes));

  function update(title) {
    node.firstChild.attrs
  }

  function addTab() {
    if (typeof getPos !== 'function') return;
    const { tr, schema } = editor.state;
    const para = schema.nodes.paragraph.create({});
    const newTab = node.type.create({ tag: 'tab', attributes: { title: 'Tab' } }, para);
    editor.view.dispatch(tr.insert(getPos() + 1, newTab));
  }

  function removeTab() {
    const {tr} = editor.state;
  }

  const style = `
  #${id} .node-markdocTag:nth-child(${active + 1}) {
    display: block;
  }`;

  return (
    <div id={id} className="Tag--Tabs">
      <style scoped>{style}</style>
      <div className="Tag--Tabs__switcher">
        {
          nodes.map((node, i) =>
            <div className={`Tag--Tabs__tab ${active === i ? 'Tag--Tabs__tab--active' : ''}`}
              onClick={ev => setActive(i)}>
              {node?.title ?? 'Tab'}
            </div>)
        }

        <div className="Tag--Tabs__buttons">
          <div className="Tag--Tabs__add" onClick={ev => addTab()}>
            <i className="las la-plus"></i>
            Add
          </div>
          <div className="Tag--Tabs__remove">
            <i className="las la-trash"></i>
            Remove
          </div>
        </div>
      </div>
      <NodeViewContent className="content" />
    </div>
  )
}

export const Tab: React.FC = ({ attributes, tiptap }: MarkdocTagComponentProps) => {
  function update(ev) {
    tiptap.updateAttributes({ attributes: { title: ev.target.value } });
  }

  return (
    <div className="Tag--Tab" >
      <div className="Tag--Tab__editor" contentEditable="false">
        <input onBlur={update} defaultValue={attributes.title} />
      </div>
      <NodeViewContent className="content" />
    </div>
  );
}