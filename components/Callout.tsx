import { NodeViewContent } from '@tiptap/react';
import * as React from 'react';
import { MarkdocTagComponentProps } from '../types';
import './Callout.css';

export const Callout: React.FC = ({ attributes, tiptap }: MarkdocTagComponentProps) => {
  function updateType(type) {
    tiptap.updateAttributes({
      attributes: { ...attributes, type }
    });
  }

  const icon = attributes.type === 'warning' ?
    'la-exclamation-triangle' : 'la-info-circle';

  return (
    <div className={`Tag--Callout Tag--Callout__${attributes.type}`}>
      <i onClick={ev => updateType(attributes.type === 'warning' ? 'info' : 'warning')} className={`Tag--Callout__icon las ${icon}`} contentEditable="false" draggable="true" data-drag-handle></i>
      <NodeViewContent className="Tag--Callout__content" />
    </div>
  )
}