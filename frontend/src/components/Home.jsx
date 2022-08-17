import axios from "axios";
import PostRenderer from "./PostRenderer.jsx";
import { useState, useRef, useEffect } from "react";
import { FiPlus } from "react-icons/fi";
import "./stylesheets/NoAuthHome.css"
const Home = ({user}) => {
    setTimeout(() => {}, 900)
    const [posts, setPosts] = useState(null);
    const [loaded, setLoaded] = useState(false)
    const spinnerRef = useRef();
    useEffect(() => {
        axios.get("/posts/all").then((result) => {
            setPosts(result.data)
            setLoaded(true);
        })
    }, [])
    if (user.isAnonymous && user.completedLoading){
        return (
            <div className="home-nocreds">
                <h1 className="home-nocreds-title">Welcome to Kilogram</h1>
                <p className="home-nocreds-begforcreds"><i>please log in or sign up</i></p>
                <div className="home-nocreds-authbuttons">
                    <a href="/login"><button type="button" className="home-nocreds-authbutton home-nocreds-login">Log In</button></a>
                    <a href="/register"><button type="button" className="home-nocreds-authbutton home-nocreds-signup">Sign Up</button></a>
                </div>
            </div>
        )
    }
    else if (!user.completedLoading || !loaded){
        if (navigator.onLine){
            return (
                <div><span ref={spinnerRef} className="uncompleted-loading"></span></div>
            )
        }
        else{
            return <div><span className="uncompleted-loading"></span> <p className="uncompleted-loading-checkinternet">You're offline.</p></div>
        }
    }
    else{
        return (
            <div className="authenticated-home">
                <br/>
                <a href="/new"><button className="home-newpost-button"><FiPlus className="home-newpost-newicon"/><p>New Post</p></button></a>
                <div className="posts">
                    {posts.map((element) => {
                        return <div key={element._id} className="post-parent"><br/><PostRenderer user={user} post={element} setLoader={setLoaded} /></div>
                    })}
                </div>
            </div>
        )
    }
}
export default Home;