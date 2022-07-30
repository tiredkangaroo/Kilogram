import { useEffect, useState } from "react"
import axios from "axios";

const Profile = ({user}) => { 
    const [userDetails, setUserDetails] = useState(null)
    useEffect(() => {
        let ProfileURL;
        try{
            ProfileURL = `/userdetails?username=${window.location.hash.split("#")[1].substring(1)}`
        }
        catch{
            window.location.href = "/"
        }
        axios.get(ProfileURL).then((res) => {
            console.log(res.data)
            setUserDetails(res.data)
        }).catch((e) => {
            console.log(e)
            // window.location.href = "/"
        })
    }, [])
    if (!user.completedLoading || !userDetails){
        if (navigator.onLine){
            return (
                <div><span className="uncompleted-loading"></span></div>
            )
        }
        else{
            return <div><span className="uncompleted-loading"></span> <p className="uncompleted-loading-checkinternet">You're offline.</p></div>
        }
    }
    else{
        return (
            <div className="profile-parent">
                <div className="profile">
                    <h1 className="profile-username">{userDetails.username}</h1>
                    <p className="profile-email">Email: <a className="email-url" href={`mailto:${userDetails.email}`}>{userDetails.email}</a></p>
                    <p>Posts written:</p>
                    <ol>
                        {userDetails.posts.map((ele) => {
                            return <li key={ele._id}><a className="post-url" href={`/post#${ele._id}`}>{ele._id}</a></li>;
                        })}
                    </ol>
                </div>
            </div>
        )
    }
}
export default Profile;