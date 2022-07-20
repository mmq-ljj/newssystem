import React, { useEffect, useState } from 'react';
// 引入编辑
import { Editor } from "react-draft-wysiwyg";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import { EditorState, convertToRaw, ContentState } from 'draft-js';

import draftToHtml from 'draftjs-to-html';
// html 转换为 draft对象
import htmlToDraft from 'html-to-draftjs';

// 撰写新闻 - 第二步 - 附文本框
export default function NewsEditor(props) {
  // console.log(props);

  const [editorState, setEditorState] = useState("")

  // 获取编辑框内容方法
  const { getContent, content } = props

  // html ===> draft
  useEffect(() => {
    const html = content;
    if (html === undefined) return;
    // 把html转换成draft对象
    const contentBlock = htmlToDraft(html);
    // 
    if (contentBlock) {
      const contentState = ContentState.createFromBlockArray(contentBlock.contentBlocks);
      const editorState = EditorState.createWithContent(contentState);
      // 把值再传到 editorState 附文本框中
      setEditorState(editorState)
    }
  }, [content])

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
