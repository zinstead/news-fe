import { EditorState } from "draft-js";
import { useState } from "react";
import { Editor } from "react-draft-wysiwyg";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";

const NewsEditor = (props: { getContent: (content: EditorState) => void }) => {
  const { getContent } = props;
  const [editorState, setEditorState] = useState<EditorState>(() =>
    EditorState.createEmpty()
  );
  return (
    <div>
      <Editor
        editorState={editorState}
        toolbarClassName="toolbarClassName"
        wrapperClassName="wrapperClassName"
        editorClassName="editorClassName"
        onEditorStateChange={(value) => {
          setEditorState(value);
        }}
        onBlur={() => {
          // draftToHtml(convertToRaw(editorState.getCurrentContent()))
          // editorState.getCurrentContent().getPlainText()
          getContent(editorState);
        }}
      />
    </div>
  );
};

export default NewsEditor;
