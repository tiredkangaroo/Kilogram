import { Route, Routes, useLocation, Navigate, Outlet } from "react-router-dom";
import { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';
import Home from "./components/Home.tsx";
import Login from "./components/Login.tsx";
import Logout from "./components/Logout.tsx";
import Register from "./components/Register.tsx";
import Confirm from "./components/Confirm.tsx";
import Navbar from './components/Navbar.tsx';
import Post from "./components/Post.tsx";
import NewPost from "./components/NewPost.tsx";
import ConfirmEmail from "./components/ConfirmEmail.tsx"
import Profile from "./components/Profile.tsx";
import Edit from "./components/Edit.tsx";
//eslint-disable-next-line
Array.prototype.remove = function (value){
  return this.filter(function (ele){
    return ele !== value;
  })
}
const App = () => {
  const [user, setUser] = useState({isAnonymous: true, completedLoading: false});
  const location = useLocation();
  window.user = user;
  useEffect(() => {
    axios.get("/whoami", {withCredentials: true}).then((res) => {
      if (res.status === 200) {
        setUser({id: res.data.id, email: res.data.email, username: res.data.username, isAnonymous: false, completedLoading: true});
      }
      else{
        setUser({isAnonymous: true, completedLoading: true})
      }
    }).catch(() => {setUser({isAnonymous: true, completedLoading: true})})
  }, [location.pathname, user.isAnonymous])
  const Protected = ({Element, props}) => (
    user.completedLoading ? user.isAnonymous ? <Navigate to="/login" replace/> : <Element {...props}/> : <Outlet />
  )
  return (
    <div className="App">
      <Navbar user={user} />
      <>
        <Routes>
          <Route path="/" element={<Home user={user} />} />
          <Route path="/login" element={<Login user={user} />} />
          <Route path="/logout" element={<Protected Element={Logout} />} />
          <Route path="/register" element={<Register />} />
          <Route path="/confirm" element={<Confirm />} />
          <Route path="/post" element={<Post user={user} />} />
          <Route path="/new" element={<Protected Element={NewPost} props={{user: user}} />} />
          <Route path="/confirmEmail" element={<ConfirmEmail />} />
          <Route path="/profile" element={<Profile user={user} />} />
          <Route path="/edit" element={<Protected Element={Edit} />} />
        </Routes>
      </>
    </div>
  );
}

export default App;