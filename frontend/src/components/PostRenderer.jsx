import { marked } from 'marked';
import axios from 'axios';
import { useState, useRef } from 'react'; 
import DOMPurify from 'dompurify';

const PostRenderer = ({user, post, hideURL}) => {
    const [mount, setMount] = useState(true);
    const modalRef = useRef();
    const yesRef = useRef();

    const nullA = (e) => {
        e.preventDefault();
    }
    const deletePost = async (e) => {
        e.preventDefault();
        const params = new URLSearchParams();
        params.append("postID", post._id);
        const deletePost = await axios.post("/posts/delete", params, {withCredentials:true})
        if (deletePost){
            setMount(false)
        }
        deletePostModalClose();
    }
    const deletePostModalOpen = (e) => {
        e.preventDefault();
        modalRef.current.style.display = "block";
        document.body.style.overflowX = "none";
        modalRef.current.style.opacity = "1";
        document.getElementsByTagName("html")[0].style.overflowY = "hidden";
    }
    const deletePostModalClose = (e) => {
        e.preventDefault();
        document.getElementsByTagName("html")[0].style.overflowY = "auto";
        modalRef.current.style.display = "none";
    }
    const managementButtons = () => {
        if (user.id === post.authorID){
            return (
                <p className="postrenderer-management-buttons"><button onClick={nullA} className="postrenderer-management-button">Edit</button>&nbsp;<button onClick={deletePostModalOpen} className="postrenderer-management-button">Delete</button></p>
            )
        }
    }
    const markdown = () => ({__html: DOMPurify.sanitize(marked.parse(post.markdownText).replace("<h1>", "<h1><hr>"))})
    if (mount){
        if (hideURL){
            return(
                <>
                    <div className="postrenderer-confirm-modal-parent">
                        <div ref={modalRef} className="postrenderer-confirm-modal">
                                <h1>Are you sure you would like to delete the post?</h1>
                                <p><button ref={yesRef}>Yes</button>&nbsp;<button onClick={deletePostModalClose}>No</button></p>
                        </div>
                    </div>
                    <div className="post">
                        <p>{post.authorUsername}</p>
                        {managementButtons()}
                        <hr></hr>
                        <p dangerouslySetInnerHTML={markdown()} className="post-body"></p>
                    </div>
                </>
            )
        }
        else{
            return (
                <>
                    <div className="postrenderer-confirm-modal-parent">
                                <div ref={modalRef} className="postrenderer-confirm-modal">
                                    <h1>Are you sure you would like to delete the post?</h1>
                                    <p><button onClick={deletePost} ref={yesRef} className="postrenderer-confirm-modal-button-yes">Yes</button>&nbsp;<button onClick={deletePostModalClose} className="postrenderer-confirm-modal-button-no">No</button></p>
                                </div>
                    </div>
                    <div className="post">
                        <a href={`/post#${post._id}`}>
                            <p>{post.authorUsername}</p>
                            {managementButtons()}
                            <hr></hr>
                            <p dangerouslySetInnerHTML={markdown()} className="post-body"></p>
                        </a>
                    </div>
                </>
            )
        }
    }
    else{
        return;
    }
}
export default PostRenderer;