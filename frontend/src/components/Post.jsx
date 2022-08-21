import axios from 'axios';
import { useEffect, useState } from 'react';
import PostRenderer from "./PostRenderer.jsx"
import Comments from './Comments.jsx';
const Post = ({user}) => {
    const [post, setPost] = useState(null);
    useEffect(() => {
        if (!window.location.hash.length > 1){window.location.href = "/"};
        axios.get(`/posts/post?id=${window.location.hash.split("#")[1]}`).then((result) => {
            setPost(result.data);
        }).catch((e) => {
            console.error(e)
        })
    }, [])
    if (post){
        return (<><br/><PostRenderer user={user} post={post} hideURL={true} /><Comments post={post} /></>)
    }
    else{
        return <span className="uncompleted-loading"></span>
    }
}
export default Post;