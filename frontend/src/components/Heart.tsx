import { FaRegHeart, FaHeart } from "react-icons/fa";
import { useEffect, useState } from "react";
import axios from "axios";
import UserDataInterface from "./data/interfaces/UserDataInterface";
import PostDataInterface from "./data/interfaces/PostDataInterface";
interface HeartDataInterface {
  user: UserDataInterface,
  post: PostDataInterface
}
const Heart = ({user, post}: HeartDataInterface) => {
    const [hearted, setHearted] = useState(false);
    const [counter, setCounter] = useState(0);
    useEffect(() => {
        if (post.likerIDs){
            setHearted(Object.keys(post.likerIDs).includes(user._id))
            setCounter(Object.keys(post.likerIDs).length)
        }
    }, [post.likerIDs, user._id])
    const SelectHeart = () => (
        hearted ? (<FaHeart />) : (<FaRegHeart />)
    )
    const toggleHeart = async (e: any) => {
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