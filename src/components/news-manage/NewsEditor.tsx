import { EditorState, convertToRaw } from 'draft-js';
import { useState } from 'react';
import { Editor } from 'react-draft-wysiwyg';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import draftToHtml from 'draftjs-to-html';

const NewsEditor = (props: { getContent: (content: EditorState) => void }) => {
  const { getContent } = props;
  const [editorState, setEditorState] = useState<EditorState>(() =>
    EditorState.createEmpty(),
  );
  return (
    <div>
      <Editor
        editorState={editorState}
        toolbarClassName="toolbarClassName"
        wrapperClassName="wrapperClassName"
        editorClassName="editorClassName"
        onEditorStateChange={value => {
          setEditorState(value);
        }}
        onBlur={() => {
          // console.log(
          //   draftToHtml(convertToRaw(editorState.getCurrentContent())),
          // );
          // console.log(editorState.getCurrentContent().getPlainText());
          getContent(editorState);
        }}
      />
    </div>
  );
};

export default NewsEditor;
