import { useRef, useState } from "react";
import "./stylesheets/Editor.css";
const Editor = (props: any) => {
    const fileRef = useRef<HTMLInputElement>(null);
    const markdownRef = useRef<HTMLTextAreaElement>(null);
    const wrapperRef = useRef<HTMLDivElement>(null);
    const [fileName, setFileName] = useState<string>("No image provided.")
    const changeFileName = (e: any) => {
      const target = e.target as HTMLInputElement; 
      setFileName(target.files![0].name);
    }
    const ButtonName = () => {
        if (fileName === "No image provided."){
            return <p>Insert Image.</p>
        }
        else{
            return <p>Replace image.</p>
        }
    }
    const handle = () => {
        if (fileRef.current!.files!.length === 0 && markdownRef.current!.value.replace(/\s/g, "").length === 0){
            return alert("At least one field must filled out.")
        }
        props.handle(fileRef, markdownRef)
    }
    return (
        <div className="editor-window-parent">
            <br/>
            <div className="editor-firstline">
                <div className="editor-file-wrapper" ref={wrapperRef}>
                    <ButtonName />
                    <label htmlFor=""></label>
                    <input placeholder="Input file here." type="file" className="editor-file" ref={fileRef} onChange={changeFileName} />
                </div>
                <p>{fileName}</p>
            </div>
            <div className="editor-window">
                Text:
                <label htmlFor=""></label>
                <textarea placeholder="Enter caption here." required={true} ref={markdownRef} maxLength={150304} className="editor-textarea"></textarea>
            </div>
            <p className="editor-create"><button type="button" onClick={handle}>Create</button></p>
        </div>
    )
}
export default Editor;