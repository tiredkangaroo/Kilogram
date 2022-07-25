import { Route, Routes } from "react-router-dom";
import { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';
import Home from "./components/Home.jsx";
import Login from "./components/Login.jsx";
import Logout from "./components/Logout.jsx";
import Register from "./components/Register.jsx";
import Confirm from "./components/Confirm.jsx";
import Navbar from './components/Navbar.jsx';
import Post from "./components/Post.jsx"

const App = () => {
  const [user, setUser] = useState({isAnonymous: true, completedLoading: false})
  const loadingSpinnerTime = 300;
  useEffect(() => {
    axios.get("/whoami", {withCredentials: true}).then( (res) => {
      if (res.status === 200) {
        setTimeout(() => {setUser({email: res.data.email, isAnonymous: false, completedLoading: true})}, loadingSpinnerTime);
      }
      else{
        setTimeout(() => {setUser({isAnonymous: true, completedLoading: true})}, loadingSpinnerTime)
      }
    } ).catch((e) => {
        setTimeout(() => {setUser({isAnonymous: true, completedLoading: true})}, loadingSpinnerTime);
    })
  }, [])
  return (
    <div className="App">
      <div className="divider"></div>
      <Navbar user={user} />
      <Routes>
        <Route path="/" element={<Home user={user} />} />
        <Route path="/login" element={<Login user={user} />} />
        <Route path="/logout" element={<Logout />}></Route>
        <Route path="/register" element={<Register />} />
        <Route path="/confirm" element={<Confirm />} />
        <Route path="/post" element={<Post />} />
      </Routes>
    </div>
  );
}

export default App;
