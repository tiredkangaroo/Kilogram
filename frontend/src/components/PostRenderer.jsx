import { marked } from 'marked';
import axios from 'axios';
import { useState, useRef, useEffect } from 'react'; 
import DOMPurify from 'dompurify';
import Heart from './Heart';
import { GrFormClose } from "react-icons/gr";

const PostRenderer = ({user, post, hideURL}) => {
    window.post = post;
    const [mount, setMount] = useState(true);
    const modalRef = useRef();
    const yesRef = useRef();
    const postrendererParentRef = useRef();
    const postRef = useRef();
    const nullA = (e) => {
        e.stopPropagation();
        e.preventDefault();
    }
    const deletePost = async (e) => {
        e.preventDefault();
        e.stopPropagation();
        const params = new URLSearchParams();
        params.append("postID", post._id);
        const deletePost = await axios.post("/posts/delete", params, {withCredentials:true})
        if (deletePost){
            setMount(false)
        }
        deletePostModalClose();
    }
    const deletePostModalOpen = (e) => {
        e.stopPropagation();
        e.preventDefault();
        modalRef.current.style.display = "block";
        modalRef.current.style.boxShadow = "0px 0px 10px 100vh rgba(0, 0, 0, 0.75)"
        document.getElementsByTagName("html")[0].style.overflowY = "hidden";
    }
    const deletePostModalClose = (e) => {
        e.preventDefault();
        e.stopPropagation();
        document.getElementsByTagName("html")[0].style.overflowY = "auto";
        modalRef.current.style.display = "none";
    }
    const managementButtons = () => {
        if (user.id === post.authorID){
            return (
                <p className="postrenderer-management-buttons"><button onClick={(e) => {e.stopPropagation(); window.location.href = `/edit#${post.id}`}} title="Edit" className="postrenderer-management-button">Edit</button>&nbsp;<button onClick={deletePostModalOpen} title="Delete" className="postrenderer-management-button">Delete</button></p>
            )
        }
    }
    useEffect(() => {
        if (postrendererParentRef.current){
            if (!hideURL){
                postrendererParentRef.current.style.cursor = "pointer";
                postrendererParentRef.current.title = "View post."
            }
        }
    }, [postrendererParentRef, hideURL])
    useEffect(() => {
        if (postRef.current && hideURL){
            postRef.current.classList.add("postrenderer-large");
        }
    }, [postRef, hideURL])
    const linkToPost = (e) => {
        if (!hideURL){
            window.location.href = `/post#${post._id}`
        }
    }
    const markdown = () => ({__html: DOMPurify.sanitize(marked.parse(post.markdownText).replace("<h1>", "<h1><hr>"))})
    if (mount){
        return(
            <div ref={postrendererParentRef} onClick={linkToPost}>
                <div className="postrenderer-confirm-modal-parent" onClick={nullA}>
                    <div ref={modalRef} className="postrenderer-confirm-modal">
                            <div><GrFormClose onClick={deletePostModalClose} /></div>
                            <h1>Are you sure you would like to delete the post?</h1>
                            <p><button ref={yesRef} onClick={deletePost}>Yes</button>&nbsp;<button onClick={deletePostModalClose}>No</button></p>
                    </div>
                </div>
                <div ref={postRef} className="post">
                    <p className="post-username">{post.authorUsername}</p>
                    {managementButtons()}
                    <hr></hr>
                    <h1>{post.title}</h1>
                    <p dangerouslySetInnerHTML={markdown()} className="post-body"></p>
                    <Heart user={user} post={post}/>
                </div>
            </div>
        )
    }
    else if (hideURL){
        window.location.href = "/"
    }
    else{
        return;
    }
}
export default PostRenderer;