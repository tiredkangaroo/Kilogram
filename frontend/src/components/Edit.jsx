import { useRef, useState } from "react";
import { marked } from "marked";
import DOMPurify from 'dompurify';
import axios from "axios";

const Edit = ({post}) => {
    const [markdown, setMarkdown] = useState("");
    const errorRef = useRef();
    const titleRef = useRef();
    const markdownRef = useRef();
    const markdownChange = (e) => {
        setMarkdown("# " + titleRef.current.value + "\n" + markdownTextEmojis(e.target.value));
    }
    const markdownTextEmojis = (md) => {
        const wrappingSymbol = ":" //: wraps the key, so :grin: will translate it into the grin
        const map = {
            "grin": "😃",
            "cry": "😢",
            "sob": "😭",
            "happycry": "🥲",
            "sunglasses": "😎",
            "party": "🎉",
            "ghost": "👻",
            "skull": "💀",
            "laughing": "😂",
            "rofl": "🤣",
            "beg": "🙏",
            "fire": "🔥",
            "sus": "😳"
        }
        for (let i = 0; i < Object.keys(map).length; i++){
            let re = new RegExp(wrappingSymbol + Object.keys(map)[i] + wrappingSymbol, "g")
            md = md.replace(re, Object.values(map)[i])
        }
        return md;
    }
    const handleEditPost = async () => {
        const params = new URLSearchParams();
        params.append("title", titleRef.current.value)
        params.append("markdownText", markdownRef.current.value)
        try{
            await axios.post("/posts/editpost", params, {withCredentials: true})
            window.location.href = `/post#${post.id}`
        }
        catch (e) {
            errorRef.current.innerText = e.response.data;
            errorRef.current.style.display = "inline-block";
        }
    }
    return (
        <div className="editpost-window-parent">
            <p ref={errorRef} className="editpost-error"></p>
            <p className="editpost-window-title-parent">Title: &nbsp; 
                <textarea className="editpost-window-title" autoFocus={true} type="text" placeholder='Insert title here.'></textarea>
            </p>
            <div className="editpost-window">
                Text:
                <textarea required={true} ref={markdownRef} maxLength={150304} onChange={markdownChange} className="newpost-markdown-textarea"></textarea>
                <p dangerouslySetInnerHTML={{__html: DOMPurify.sanitize(marked.parse(markdown))}}></p>
            </div>
            <p align="center"><button onClick={handleEditPost}>Create</button></p>
        </div>
    )
}
export default Edit;