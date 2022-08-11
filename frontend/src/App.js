import { Route, Routes, useLocation } from "react-router-dom";
import { useState, useEffect } from 'react';
import { MdArrowBack } from "react-icons/md";
import axios from 'axios';
import './App.css';
import Home from "./components/Home.jsx";
import Login from "./components/Login.jsx";
import Logout from "./components/Logout.jsx";
import Register from "./components/Register.jsx";
import Confirm from "./components/Confirm.jsx";
import Navbar from './components/Navbar.jsx';
import Post from "./components/Post.jsx";
import NewPost from "./components/NewPost.jsx";
import ConfirmEmail from "./components/ConfirmEmail.jsx"
import Profile from "./components/Profile.jsx";
import Edit from "./components/Edit.jsx";
//eslint-disable-next-line
Array.prototype.remove = function (value){
  return this.filter(function (ele){
    return ele !== value;
  })
}
const App = () => {
  const [user, setUser] = useState({isAnonymous: true, completedLoading: false})
  const location = useLocation();
  window.user = user
  const loadingSpinnerTime = 10;
  useEffect(() => {
    axios.get("/whoami", {withCredentials: true}).then( (res) => {
      if (res.status === 200) {
        setTimeout(() => {setUser({id: res.data.id, email: res.data.email, username: res.data.username, isAnonymous: false, completedLoading: true})}, loadingSpinnerTime);
      }
      else{
        setTimeout(() => {setUser({isAnonymous: true, completedLoading: true})}, loadingSpinnerTime)
      }
    } ).catch((e) => {
        setTimeout(() => {setUser({isAnonymous: true, completedLoading: true})}, loadingSpinnerTime);
    })
  }, [])
  const HomeLink = () => {
    if (!(location.pathname === "/")){
      return <a href="/" className="go-to-home"><MdArrowBack /></a>
    }
  }
  return (
    <div className="App">
      <div className="divider"></div>
      <Navbar user={user} />
      <div className="route-container">
        <HomeLink />
        <Routes>
          <Route path="/" element={<Home user={user} />} />
          <Route path="/login" element={<Login user={user} />} />
          <Route path="/logout" element={<Logout />}></Route>
          <Route path="/register" element={<Register />} />
          <Route path="/confirm" element={<Confirm />} />
          <Route path="/post" element={<Post user={user} />} />
          <Route path="/new" element={<NewPost user={user} />} />
          <Route path="/confirmEmail" element={<ConfirmEmail />} />
          <Route path="/profile" element={<Profile user={user} />} />
          <Route path="/edit" element={<Edit />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;