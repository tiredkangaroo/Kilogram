import {marked} from 'marked';
import DOMPurify from 'dompurify';
import { useRef, useState } from 'react';
import axios from 'axios';

const NewPost = ({user}) => {
    const [markdown, setMarkdown] = useState("");
    const markdownRef = useRef();
    const errorRef = useRef();
    const titleRef = useRef();
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
    const markdownChange = (e) => {
        setMarkdown("# " + titleRef.current.value + "\n" + markdownTextEmojis(e.target.value));
    }
    const handleNewPost = async () => {
        const params = new URLSearchParams();
        params.append("title", titleRef.current.value)
        params.append("markdownText", markdownRef.current.value)
        try{
            const result = await axios.post("/posts/newpost", params, {withCredentials: true})
            if (result.status === 200){
                window.location.href = `/post#${result.data}`
            }
            else{
                errorRef.current.innerText = result.response.data;
                errorRef.current.style.display = "inline-block";
            }
        }
        catch (e) {
            errorRef.current.innerText = e.response.data;
            errorRef.current.style.display = "inline-block";
        }
    }
    if (!user.completedLoading){
        if (navigator.onLine){
            return (
                <div><span className="uncompleted-loading"></span></div>
            )
        }
        else{
            return <div><span className="uncompleted-loading"></span> <p className="uncompleted-loading-checkinternet">You're offline.</p></div>
        }
    }
    else if (user.isAnonymous){
        window.location.href = "/"
    }
    else {
        return (
            <div className="newPost-window-parent">
                <p ref={errorRef} className="newPost-error"></p>
                <p className="newPost-window-title-parent">Title: &nbsp; <textarea className="newPost-window-title" ref={titleRef} autoFocus={true} type="text" placeholder='Insert title here.'/></p>
                <div className="newPost-window">
                    Text:
                    <textarea required={true} ref={markdownRef} maxLength={150304} onChange={markdownChange} className="newpost-markdown-textarea"></textarea>
                    <p dangerouslySetInnerHTML={{__html: DOMPurify.sanitize(marked.parse(markdown))}}></p>
                </div>
                <p align="center"><button onClick={handleNewPost}>Create</button></p>
            </div>
        )
    }
}
export default NewPost;