import * as React from 'react';
import { NodeViewContent } from '@tiptap/react';
import type { MarkdocTagComponentProps } from '../types';
import './GenericTag.css';

const AttributeEditor: React.FC = ({value, onUpdate}) => {
  const [editing, setEditing] = React.useState(false);
  const text = JSON.stringify(value);

  function update(ev) {
    setEditing(false);
    onUpdate(ev);
  }

  function handleKey(ev) {
    if (ev.key === 'Escape')
      setEditing(false);

    if (ev.key === 'Enter')
      update(ev);
  }

  if (!editing)
    return (
      <span onClick={ev => setEditing(true)}>{text}</span>
    );

  return (
    <input onKeyPress={handleKey} onBlur={update}
      className="Tag--Generic__attributes__value--editing" defaultValue={text} />
  )
}

export const GenericTag: React.FC = ({ tag, attributes, tiptap }: MarkdocTagComponentProps) => {
  function update(key, value) {
    console.log('Updated:', value);
    tiptap.updateAttributes({
      attributes: { ...attributes, [key]: JSON.parse(value)}
    });
  }

  return (
    <div className="Tag--Generic">
      <div className="Tag--Generic__name" draggable="true" data-drag-handle contentEditable="false">{tag}</div>

      {
        attributes && Object.keys(attributes).length ?
        <div className="Tag--Generic__attributes" contentEditable="false">
          <ul>
            {
              Object.entries(attributes).map(([key, value]) =>
                <li>
                  <span className="Tag--Generic__attributes__key">{key}:</span>
                  <span className="Tag--Generic__attributes__value">
                    <AttributeEditor onUpdate={ev => update(key, ev.target.value)} value={value} />
                  </span>
                </li>
              )
            }
          </ul>
        </div> : null
      }

      <NodeViewContent className="Tag--Generic__content" />
    </div>
  );
}