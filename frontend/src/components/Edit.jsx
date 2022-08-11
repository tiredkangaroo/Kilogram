import { useRef } from "react";
import axios from "axios";
import Editor from "./Editor.jsx";

const Edit = ({post}) => {
    const errorRef = useRef();
    const handle = async (titleRef, markdownRef) => {
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
        <Editor md="<h1>hi</h1>" handle={handle} />
    )
}
export default Edit;