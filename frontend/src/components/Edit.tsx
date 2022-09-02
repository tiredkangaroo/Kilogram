import React, { useRef } from "react";
import axios from "axios";
import Editor from "./Editor";

interface EditData {
  user: Object,
  post: {
    _id: string,
    authorUsername: string,
    authorID: string,
    imageKey: string,
    text: string,
    date_created: Date,
    likerIDs: Object,
    comments: Array<any>
  },
  hideURL: Boolean
}
const Edit = ({post}: EditData) => {
    const errorRef = useRef<HTMLParagraphElement>();
    const handle = async (titleRef: React.RefObject<HTMLInputElement>, markdownRef: React.RefObject<HTMLTextAreaElement>) => {
        const params = new URLSearchParams();
        params.append("title", titleRef.current!.value)
        params.append("markdownText", markdownRef.current!.value)
        try{
            await axios.post("/posts/editpost", params, {withCredentials: true})
            window.location.href = `/post#${post._id}`
        }
        catch (e: any) {
            errorRef.current!.innerText = e.response.data;
            errorRef.current!.style.display = "inline-block";
        }
    }
    return (
        <Editor md="<h1>hi</h1>" handle={handle} />
    )
}
export default Edit;