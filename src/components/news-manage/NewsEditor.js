import React, { useState } from 'react';
// 引入编辑
import { Editor } from "react-draft-wysiwyg";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
// 
import { convertToRaw } from 'draft-js';
import draftToHtml from 'draftjs-to-html';

export default function NewsEditor(props) {
  // console.log(props);

  const [editorState, setEditorState] = useState("")

  // 获取编辑框内容方法
  const { getContent } = props

  return (
    <div>
      <Editor
        editorState={editorState}
        toolbarClassName="toolbarClassName"
        wrapperClassName="wrapperClassName"
        editorClassName="editorClassName"
        // onEditorStateChange={this.onEditorStateChange}
        onEditorStateChange={(editorState) => setEditorState(editorState)}
        onBlur={() => {
          // console.log(draftToHtml(convertToRaw(editorState.getCurrentContent())));
          getContent(draftToHtml(convertToRaw(editorState.getCurrentContent())))
        }}
      />;
    </div>
  )
}
