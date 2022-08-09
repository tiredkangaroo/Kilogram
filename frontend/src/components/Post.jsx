import axios from 'axios';
import { useEffect, useState } from 'react';
import PostRenderer from "./PostRenderer.jsx"

const Post = ({user}) => {
    const [loaded, setLoaded] = useState(false);
    const [post, setPost] = useState(null);
    useEffect(() => {
        if (!window.location.hash.length > 1){window.location.href = "/"};
        axios.get(`/posts/post?id=${window.location.hash.split("#")[1]}`).then((result) => {
            setPost(result.data);
            setLoaded(true);
        }).catch((e) => {
            console.error(e)
        })
    }, [])
    if (loaded){
        return (<><br/><PostRenderer user={user} post={post} hideURL={true} /></>)
    }
    else{
        return <span className="uncompleted-loading"></span>
    }
}
export default Post;