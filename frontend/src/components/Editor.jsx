import { useRef } from "react";

function Editor(props){
    const fileRef = useRef();
    const markdownRef = useRef();
    return (
        <div className="editor-window-parent">
            <div className="editor-file-wrapper">
                Insert image
                <input type="file" className="editor-file" ref={fileRef} />
            </div>
            <div className="editor-window">
                Text:
                <textarea required={true} ref={markdownRef} maxLength={150304} className="editor-textarea"></textarea>
            </div>
            <p align="center"><button onClick={() => {props.handle(fileRef, markdownRef)}}>Create</button></p>
        </div>
    )
}
export default Editor;