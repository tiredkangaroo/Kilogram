import {marked} from 'marked';
import DOMPurify from 'dompurify';
import { useRef, useState } from 'react';
import axios from 'axios';

const NewPost = ({user}) => {
    const [markdown, setMarkdown] = useState("");
    const markdownRef = useRef();
    const errorRef = useRef();
    const markdownChange = (e) => {
        setMarkdown(e.target.value);
    }
    const handleNewPost = async () => {
        const params = new URLSearchParams();
        params.append("markdownText", markdownRef.current.value)
        const result = await axios.post("/posts/newpost", params, {withCredentials: true})
        if (result.status === 200){
            window.location.href = "/"
        }
        else{
            errorRef.current.innerText = result.response.data;
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
                <button onClick={handleNewPost}>Create</button>
                <div className="newPost-window">
                    <textarea required={true} ref={markdownRef} onChange={markdownChange} autoFocus={true} className="newpost-markdown-textarea"></textarea>
                    <p dangerouslySetInnerHTML={{__html: DOMPurify.sanitize(marked.parse(markdown))}}></p>
                </div>
            </div>
        )
    }
}
export default NewPost;