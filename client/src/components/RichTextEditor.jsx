import ReactQuill from 'react-quill-new';
import React, { useEffect, useRef, useState } from 'react';

const RichTextEditor = ({ value, onChange }) => {
  const toolbarRef = useRef(null);
  const [modules, setModules] = useState(null);

  useEffect(() => {
    if (toolbarRef.current) {
      setModules({
        toolbar: {
          container: toolbarRef.current,
        },
      });
    }
  }, []);

  return (
    <>
      <div ref={toolbarRef} className="custom-toolbar">
        <span className="ql-formats">
          <select className="ql-header">
            <option value="1">Heading</option>
            <option value="2">Subheading</option>
            <option value="3">Subtitle</option>
            <option value="" selected>Normal</option>
          </select>
        </span>
        <span className="ql-formats">
          <button className="ql-bold" />
          <button className="ql-italic" />
          <button className="ql-underline" />
        </span>
        <span className="ql-formats">
          <button className="ql-list" value="ordered" />
          <button className="ql-list" value="bullet" />
        </span>
        <span className="ql-formats">
          <button className="ql-link" />
        </span>
      </div>
      <ReactQuill
        theme="snow"
        value={value}
        onChange={onChange}
        modules={modules}
      />
    </>
  );
};

export default RichTextEditor;
