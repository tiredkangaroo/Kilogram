import { useRef, useState } from "react";
import "./stylesheets/Editor.css";
function Editor(props){
    const fileRef = useRef();
    const markdownRef = useRef();
    const wrapperRef = useRef();
    const [fileName, setFileName] = useState("No image provided.")
    const changeFileName = (e) => {
        setFileName(e.target.files[0].name);
    }
    const ButtonName = (e) => {
        if (fileName === "No image provided."){
            return <p>Insert Image.</p>
        }
        else{
            return <p>Replace image.</p>
        }
    }
    const handle = () => {
        if (fileRef.current.files.length === 0 && markdownRef.current.value.replace(/\s/g, "").length === 0){
            return alert("At least one field must filled out.")
        }
        props.handle(fileRef, markdownRef)
    }
    return (
        <div className="editor-window-parent">
            <div className="editor-firstline">
                <div className="editor-file-wrapper" ref={wrapperRef}>
                    <ButtonName />
                    <input type="file" className="editor-file" ref={fileRef} onChange={changeFileName} />
                </div>
                <p>{fileName}</p>
            </div>
            <div className="editor-window">
                Text:
                <textarea required={true} ref={markdownRef} maxLength={150304} className="editor-textarea"></textarea>
            </div>
            <p align="center"><button onClick={handle}>Create</button></p>
        </div>
    )
}
export default Editor;