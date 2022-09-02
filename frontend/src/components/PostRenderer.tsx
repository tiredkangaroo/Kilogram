import { marked } from 'marked';
import axios from 'axios';
import { useState, useRef, useEffect, SyntheticEvent } from 'react'; 
import DOMPurify from 'dompurify';
import Heart from './Heart';
import { GrFormClose } from "react-icons/gr";
import "./stylesheets/Post.css";
import UserDataInterface from "./data/interfaces/UserDataInterface";

interface PostDataInterface{
  user: UserDataInterface,
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
export default function PostRenderer({user, post, hideURL}: PostDataInterface): JSX.Element{
    const [mount, setMount] = useState(true);
    const modalRef = useRef<HTMLDivElement>(null);
    const yesRef = useRef<HTMLButtonElement>(null);
    const postrendererParentRef = useRef<HTMLDivElement>(null);
    const postRef = useRef<HTMLDivElement>(null);
    const imageRef = useRef<HTMLImageElement>(null);
    const postBodyRef = useRef<HTMLParagraphElement>(null);
    const nullA = (e: any) => {
        e.stopPropagation();
        e.preventDefault();
    }
    const deletePost = async (e: any) => {
        e.preventDefault();
        e.stopPropagation();
        const params = new URLSearchParams();
        params.append("postID", post._id);
        const deletePostReq = await axios.post("/posts/delete", params, {withCredentials:true})
        if (deletePostReq){
            setMount(false)
        }
        deletePostModalClose(e);
    }
    const deletePostModalOpen = (e: any) => {
        e.stopPropagation();
        e.preventDefault();
        modalRef.current!.style.display = "block";
        modalRef.current!.style.boxShadow = "0px 0px 10px 100vh rgba(0, 0, 0, 0.75)"
        document.getElementsByTagName("html")[0].style.overflowY = "hidden";
    }
    const deletePostModalClose = (e: any) => {
      e.preventDefault();
      e.stopPropagation();
      document.getElementsByTagName("html")[0].style.overflowY = "auto";
      modalRef.current!.style.display = "none";
    }
    function ManagementButtons() {
        if (user._id === post.authorID){
            return (
                <p className="postrenderer-management-buttons"><button type="button" onClick={(e) => {e.stopPropagation(); window.location.href = `/edit#${post._id}`}} title="Edit" className="postrenderer-management-button">Edit</button>&nbsp;<button onClick={deletePostModalOpen} title="Delete" className="postrenderer-management-button">Delete</button></p>
            )
        }
        else{
          return <></>
        }
    }
    useEffect(() => {
        if (postrendererParentRef.current!){
            if (!hideURL){
                postrendererParentRef.current!.style.cursor = "pointer";
            }
        }
    }, [postrendererParentRef, hideURL])
    useEffect(() => {
      if (postBodyRef.current! && !hideURL && postBodyRef.current!.innerText.length > 150){
        postBodyRef.current!.innerText = postBodyRef.current!.innerText.substr(0, 165) + "..."
      }
      //eslint-disable-next-line
    }, [postBodyRef.current!, hideURL])
    const linkToPost = () => {
        if (!hideURL){
            window.location.href = `/post#${post._id}`
        }
    }
    const image = (e: SyntheticEvent<HTMLImageElement>) => {
      const target = e.target as HTMLImageElement;
      target.width = window.innerWidth/2.1
    }
    // const postResizer = () => {
    //   const posts: HTMLCollection = document.getElementsByClassName("post")
    //     if (window.innerWidth < 693){
    //       for (let i = 0; i < posts.length; i++){
    //         posts[0].style.width = "88vw";
    //       }
    //     }
    //     else{
    //       for (let i = 0; i < posts.length; i++){
    //         posts[0].style.width = "50vw";
    //       }
    //     }
    // }
    window.addEventListener("resize", () => {
        if (post.imageKey && imageRef.current!){
            imageRef.current!.width = window.innerWidth/2.1
        }
        // postResizer();
    })
    const RenderImage = () => {
        if (post.imageKey){
            return (<img onLoad={image} className="post-img" ref={imageRef} src={`storage/${post.imageKey}`} alt="Unable to load."/>)
        }
        else{
          return <></>
        }
    }
    let markdown;
    if (post.text){
        markdown = () => ({__html: DOMPurify.sanitize(marked.parse(post.text))})
    }
    else{
        markdown = () => ({__html: ""})
    }
    if (mount){
        return(
            <div className="post-parent" ref={postrendererParentRef} onClick={linkToPost}>
                <div className="postrenderer-confirm-modal-parent" onClick={nullA}>
                    <div ref={modalRef} className="postrenderer-confirm-modal">
                            <div><GrFormClose onClick={deletePostModalClose} /></div>
                            <h1>Are you sure you would like to delete the post?</h1>
                            <p><button ref={yesRef} onClick={deletePost}>Yes</button>&nbsp;<button onClick={deletePostModalClose}>No</button></p>
                    </div>
                </div>
                <div ref={postRef} className="post">
                    <p className="post-username">{post.authorUsername}</p>
                    <ManagementButtons />
                    <RenderImage />
                    <p dangerouslySetInnerHTML={markdown()} ref={postBodyRef} className="post-body"></p>
                    <div className="post-hearts-parent"><Heart user={user} post={post}/></div>
                </div>
            </div>
        )
    }
    else if (hideURL){
      window.location.href = "/"
      return <></>;
    }
    else{
        return <></>;
    }
}