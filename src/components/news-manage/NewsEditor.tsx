import { EditorState } from "draft-js";
import { Editor } from "react-draft-wysiwyg";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";

const NewsEditor = (props: { content: EditorState, setContent: (content: EditorState) => void }) => {
  const { content, setContent } = props;
  // draftToHtml(convertToRaw(editorState.getCurrentContent()))
  // editorState.getCurrentContent().getPlainText()

  return (
    <div>
      <Editor
        editorState={content}
        toolbarClassName="toolbarClassName"
        wrapperClassName="wrapperClassName"
        editorClassName="editorClassName"
        onEditorStateChange={(value) => {
          setContent(value);
        }}
      />
    </div>
  );
};

export default NewsEditor;
