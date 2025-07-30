// @ts-nocheck
import { useState } from "react";
import { Editor, EditorState } from "react-draft-wysiwyg";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";

const NewsEditor = () => {
    const [editorState, setEditorState] = useState<EditorState>(() => EditorState.createEmpty());
    return (
        <div>
            <Editor
                editorState={editorState}
                toolbarClassName="toolbarClassName"
                wrapperClassName="wrapperClassName"
                editorClassName="editorClassName"
                onEditorStateChange={(value) => { setEditorState(value) }}
            />
        </div>
    );
}

export default NewsEditor;
