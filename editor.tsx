import * as React from 'react';
import { useEditor, EditorContent, Editor, ReactNodeViewRenderer, NodeViewWrapper, NodeViewContent } from '@tiptap/react';
import { InputRule, JSONContent, Mark, Node } from '@tiptap/core';
import TipTapDefault from '@tiptap/starter-kit';
import TipTapLink from '@tiptap/extension-link';
import Markdoc from '@markdoc/markdoc';
import * as toAst from './converter/toAst';
import * as fromAst from './converter/fromAst';
import converters from './converters';
import { TextSelection } from 'prosemirror-state';
import { Callout } from './components/Callout';
import { Tabs, Tab } from './components/Tabs';
import type { ComponentMap, TipTapComponentProps } from './types';
import { GenericTag } from './components/GenericTag';
import { WebrtcProvider } from 'y-webrtc'
import Collaboration from '@tiptap/extension-collaboration'
import * as Y from 'yjs'
import markdoc from '@markdoc/markdoc';
import {Slice, Fragment, Node as EditorNode} from 'prosemirror-model'

const ydoc = new Y.Doc()
const provider = new WebrtcProvider('markdoc-1', ydoc);


import './editor.css';
import CollaborationCursor from '@tiptap/extension-collaboration-cursor';
import Placeholder from '@tiptap/extension-placeholder';

const user = `User ${Math.round(Math.random() * (1000 - 1) + 1)}`;

const content = `
# Sample Document

This is a sample document with example content.

Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Amet purus gravida quis blandit turpis cursus in hac. Aliquet bibendum enim facilisis gravida neque convallis. Facilisis magna etiam tempor orci. Lobortis elementum nibh tellus molestie nunc non. Aliquam malesuada bibendum arcu vitae elementum curabitur vitae. Mauris a diam maecenas sed enim. Est lorem ipsum dolor sit. Sed libero enim sed faucibus turpis in. Et tortor at risus viverra adipiscing at in. Cursus in hac habitasse platea dictumst. Morbi tristique senectus et netus et malesuada. Tincidunt lobortis feugiat vivamus at augue eget arcu dictum varius. Vitae nunc sed velit dignissim sodales ut. Ac orci phasellus egestas tellus rutrum. Donec et odio pellentesque diam. Odio aenean sed adipiscing diam donec adipiscing tristique risus. Suspendisse in est ante in nibh mauris cursus mattis. Vel elit scelerisque mauris pellentesque pulvinar. Gravida neque convallis a cras semper auctor neque vitae.

Faucibus purus in massa tempor nec feugiat nisl pretium fusce. Rhoncus aenean vel elit scelerisque mauris pellentesque pulvinar pellentesque. Tempus iaculis urna id volutpat lacus laoreet non curabitur gravida. Est pellentesque elit ullamcorper dignissim. Lectus arcu bibendum at varius vel pharetra vel turpis. Semper quis lectus nulla at. Diam sollicitudin tempor id eu nisl nunc. Nisi lacus sed viverra tellus in hac. Imperdiet sed euismod nisi porta lorem mollis. Ultrices eros in cursus turpis. Volutpat commodo sed egestas egestas fringilla phasellus. Dignissim sodales ut eu sem integer vitae justo eget. Augue lacus viverra vitae congue. Orci ac auctor augue mauris augue neque gravida in. Cras fermentum odio eu feugiat pretium nibh ipsum. Sed adipiscing diam donec adipiscing tristique risus nec. Urna condimentum mattis pellentesque id nibh tortor.

Nulla aliquet porttitor lacus luctus accumsan tortor posuere ac. Eleifend mi in nulla posuere. Fermentum dui faucibus in ornare. Adipiscing elit ut aliquam purus sit amet luctus venenatis. Vestibulum sed arcu non odio. Purus sit amet volutpat consequat mauris nunc congue. Ac feugiat sed lectus vestibulum mattis. Nascetur ridiculus mus mauris vitae ultricies leo. Mi ipsum faucibus vitae aliquet nec ullamcorper. Semper quis lectus nulla at volutpat. Lectus nulla at volutpat diam ut venenatis. Ultrices gravida dictum fusce ut placerat orci. Leo vel fringilla est ullamcorper. Etiam sit amet nisl purus. Sit amet volutpat consequat mauris nunc. Vulputate dignissim suspendisse in est ante in nibh mauris.

Erat nam at lectus urna duis convallis convallis tellus. Ornare arcu dui vivamus arcu felis bibendum ut. Duis ut diam quam nulla porttitor. Eleifend mi in nulla posuere sollicitudin aliquam ultrices sagittis orci. Tellus orci ac auctor augue mauris augue neque gravida in. Morbi non arcu risus quis varius quam quisque id. Lobortis elementum nibh tellus molestie nunc non blandit. Quis commodo odio aenean sed adipiscing diam donec adipiscing. Habitasse platea dictumst vestibulum rhoncus est pellentesque elit. At urna condimentum mattis pellentesque id. Elit ullamcorper dignissim cras tincidunt lobortis. Quis varius quam quisque id. Nullam vehicula ipsum a arcu cursus vitae. Convallis a cras semper auctor neque vitae tempus. Mi ipsum faucibus vitae aliquet nec ullamcorper sit amet. At quis risus sed vulputate odio ut. Viverra tellus in hac habitasse platea dictumst vestibulum rhoncus est. Sed vulputate mi sit amet mauris.

Aliquet sagittis id consectetur purus ut faucibus pulvinar elementum integer. Turpis egestas sed tempus urna. Non tellus orci ac auctor augue mauris. Nisl rhoncus mattis rhoncus urna neque viverra justo. Sagittis id consectetur purus ut faucibus pulvinar elementum integer. Egestas maecenas pharetra convallis posuere morbi leo. Aenean et tortor at risus viverra adipiscing at in. Lacus sed turpis tincidunt id aliquet risus feugiat. Amet volutpat consequat mauris nunc congue. Nec ultrices dui sapien eget mi proin sed libero enim. In tellus integer feugiat scelerisque varius morbi enim nunc faucibus. Posuere lorem ipsum dolor sit amet consectetur. Elit pellentesque habitant morbi tristique. Sagittis vitae et leo duis ut diam quam. Bibendum ut tristique et egestas quis ipsum suspendisse ultrices. Molestie ac feugiat sed lectus vestibulum. Amet consectetur adipiscing elit pellentesque habitant morbi.
`;

const colors = [
  '5469D4',
  '09825D',
  'A450B5',
  'CD3D64',
];

const components: ComponentMap = {
  callout: Callout,
  tabs: Tabs,
  tab: Tab,
};

const MarkdocTagComponent: React.FC = (tiptap: TipTapComponentProps) => {
  const { tag, attributes } = tiptap.node.attrs;
  const component = components[tag] ?? GenericTag;

  return (
    <NodeViewWrapper>
      {component({ tiptap, tag, attributes })}
    </NodeViewWrapper>
  );
};

const Comment = Mark.create({
  name: 'comment',
  addAttributes() {
    return {
      name: { rendered: false },
      text: { rendered: false },
    }
  },
  renderHTML({ HTMLAttributes }) {
    return ['mark', HTMLAttributes, 0];
  },

  addKeyboardShortcuts() {
    return {
      'Mod-Shift-c': () => this.editor.commands.setMark('comment', {
        name: user,
        text: 'This is a test'
      }),
    }
  },
});

const MarkdocTag = Node.create({
  name: 'markdocTag',
  group: 'block',
  content: 'block*',
  selectable: true,
  draggable: true,
  defining: true,
  isolating: true,
  allowGapCursor: false,
  addAttributes() {
    return {
      tag: { rendered: false },
      attributes: { rendered: false },
    }
  },
  addNodeView() {
    return ReactNodeViewRenderer(MarkdocTagComponent)
  },
  renderHTML({ HTMLAttributes }) {
    return ['div', HTMLAttributes, 0]
  },
  addInputRules() {
    const type = this.type;
    return [
      new InputRule({
        find: /^(\{% ([a-zA-Z0-9-_]+).*%\}$)/,
        handler({ state, range, match }) {
          const tag = match[2];
          const text = state.schema.nodes.paragraph.create({}, state.schema.text(' '))
          let child = text;

          const parsed = markdoc.parse(match[0]);
          const {attributes} = parsed.children[0];

          if (tag === 'tabs') {
            child = [
              type.create({ tag: 'tab', attributes: { title: 'Tab 1' } }, text),
              type.create({ tag: 'tab', attributes: { title: 'Tab 2' } }, text),
            ]
          }

          const node = type.create({ tag, attributes }, child);
          state.tr.replaceRangeWith(range.from, range.to, node);
          const selection = new TextSelection(state.tr.doc.resolve(range.from - 1));
          state.tr.setSelection(selection);
        }
      })
    ]
  }
});

function exportJSON(editor: Editor) {
  const json = JSON.stringify(editor.getJSON(), null, 4);
  console.log(json);
}

function exportMarkdoc(editor: Editor) {
  const ast = toAst.convertNode(editor.state.doc, { converters })
  return Markdoc.format(ast);
}

const ast = Markdoc.parse(content);
const doc = fromAst.convertNode(ast, { converters });
console.log(JSON.stringify(doc, null, 4));

const CommentView: React.FC = ({name, text, editing, onChange, onCancel, ...rest}) => {
  
  function handleBlur(ev) {
    ev.target.value = '';
    onCancel(ev);
  }

  return (
    <div {...rest} className="Comment">
      <h3>{name}</h3>
      {
        editing ?
        <div className="Comment__editing">
           <textarea ref={x => x?.focus()} onBlur={handleBlur} onKeyPress={onChange} />
        </div>
        : <p>{text}</p>
      }
    </div>
  )
};

export const MarkdocEditor: React.FC = () => {
  const [active, setActive] = React.useState(0);
  const [selection, setSelection] = React.useState(null);
  const [commenting, setCommenting] = React.useState(false);
  const [comments, setComments] = React.useState([]);

  const editor = useEditor({
    // content: doc,
    editorProps: {
      clipboardTextSerializer(content) {
        const nodes = toAst.convertChildren(content.content, { converters });
        const doc = new markdoc.Ast.Node('document', {}, nodes);
        return Markdoc.format(doc);
      },
      clipboardTextParser(text, context, plain) {
        const ast = Markdoc.parse(text);
        const doc = fromAst.convertNode(ast, {converters});
        const node = EditorNode.fromJSON(context.doc.type.schema, doc);
        return Slice.maxOpen(node.content);
      }
    },
    // onSelectionUpdate({editor, transaction}) {
    //   if (selection == transaction.selection.empty) return;
    //   setSelection(!transaction.selection.empty);
    // },
    editable: true,
    extensions: [
      MarkdocTag,
      Comment,
      TipTapDefault.configure({history: false}),
      TipTapLink,
      Placeholder.configure({
        placeholder: 'Write Something Here',
      }),
      Collaboration.configure({
        document: ydoc,
      }),
      CollaborationCursor.configure({
        provider,
        user: {
          name: user,
          color: `#${colors[Math.floor(Math.random()*colors.length)]}`
        },
      }),
    ],
  });

  const anchor = editor?.state?.selection?.$anchor;
  const marks = anchor?.marks();
  const comment = marks?.find(m => m.type.name === 'comment');
  const coords = anchor ? editor.view.coordsAtPos(anchor.pos) : null;
  
  console.log(editor?.state?.doc);

  function onCommentChange(ev) {
    if (ev.code !== 'Enter') return;
    editor.commands.setMark('comment', {name: user, text: ev.target.value});
    setCommenting(false);
  }

  function onCommentCancel(ev) {
    setCommenting(false);
  }

  const tabs = ['Rich', 'Source', 'Ast'];
  const editorView =
    active === 0 ?
      <div className="Editor">
        <EditorContent className="Editor__content" editor={editor} />
        <div className="Editor__comments">
          { 
            commenting ? <CommentView style={{top: coords.top + scrollY - 64}} editing={true} name={user} onCancel={onCommentCancel} onChange={onCommentChange} /> :
            comment ? <CommentView style={{top: coords.top + scrollY - 64}} {...comment.attrs} /> :
              !editor?.state?.selection?.empty && coords ?
                <div onClick={ev => setCommenting(true)} className="CommentButton" style={{top: coords.top + scrollY - 70}}>
                  <i class="las la-comment"></i>
                </div> :
                null
          }
        </div>
      </div> :
      active === 1 ?
        <div className="PlainEditor">
          <pre>{exportMarkdoc(editor)}</pre>
        </div> :
        active === 2 ?
          <div className="Ast">
            <pre>{JSON.stringify(toAst.convertNode(editor.state.doc, { converters }), null, 4)}</pre>
          </div> : '';


  return (
    <div className="App">
      <div className="App__titlebar">
        <h1>Markdoc Editor</h1>

        <div className="App__tabs">
          {
            tabs.map((name, i) =>
              <div className={`App__tab ${active === i ? 'App__tab--active' : ''}`}
                onClick={ev => setActive(i)}>
                {name}
              </div>)
          }
        </div>
      </div>

      {editorView}


    </div>
  )
}