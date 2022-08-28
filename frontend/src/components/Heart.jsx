import { FaRegHeart, FaHeart } from "react-icons/fa";
import { useEffect, useState } from "react";
import axios from "axios";
const Heart = ({user, post}) => {
    const [hearted, setHearted] = useState(false);
    const [counter, setCounter] = useState(0);
    useEffect(() => {
        if (post.likerIDs){
            setHearted(Object.keys(post.likerIDs).includes(user.id))
            setCounter(Object.keys(post.likerIDs).length)
        }
    }, [post.likerIDs, user.id])
    const SelectHeart = () => (
        hearted ? (<FaHeart />) : (<FaRegHeart />)
    )
    const toggleHeart = async (e) => {
        e.stopPropagation();
        e.preventDefault();
        const params = new URLSearchParams();
        params.append("postID", post._id);
        if (hearted){
            setCounter(counter - 1);
        }
        else{
            setCounter(counter + 1);
        }
        setHearted(!hearted);
        await axios.post("/posts/heart", params, {withCredentials: true});
    }
    return (<div className="post-hearts"><p className="heart" onClick={toggleHeart}><SelectHeart/><span>{counter}</span></p></div>)
}
export default Heart;