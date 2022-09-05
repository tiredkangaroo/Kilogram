import { useEffect, useState } from "react"
import axios from "axios";
import PostDataInterface from "./data/interfaces/PostDataInterface";
const Profile = () => { 
    const [userDetails, setUserDetails] = useState({_id: null, username: null, email: null, posts: []})
    useEffect(() => {
        let ProfileURL = `/userdetails?username=${window.location.hash.split("#")[1].substring(1)}`
        axios.get(ProfileURL).then((res) => {
            console.log(res.data)
            setUserDetails(res.data)
        }).catch((e) => {
            console.log(e)
            // window.location.href = "/"
        })
    }, [])
    if (userDetails){
      return (
          <div className="profile-parent">
              <div className="profile">
                  <h1 className="profile-username">{userDetails.username}</h1>
                  <p className="profile-email">Email: <a className="email-url" href={`mailto:${userDetails.email}`}>{userDetails.email}</a></p>
                  <p>Posts written:</p>
                  <ol>
                      {userDetails.posts.map((ele: PostDataInterface) => {
                          return <li key={ele._id}><a className="post-url" href={`/post#${ele._id}`}>{ele._id}</a></li>;
                      })}
                  </ol>
              </div>
          </div>
      )
    }
    else{
      return <></>
    }
}
export default Profile;