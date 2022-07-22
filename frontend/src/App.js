import './App.css';
import { Route, Routes } from "react-router-dom";
import Home from "./components/Home.jsx";
import Login from "./components/Login.jsx";
import Logout from "./components/Logout.jsx";
import { useState, useEffect } from 'react';
import Navbar from './components/Navbar.jsx'
import axios from 'axios';

const App = () => {
  const [user, setUser] = useState({isAnonymous: true})
  useEffect(() => {
    axios.get("http://localhost:8000/whoami", {withCredentials: true}).then( (res) => {
      if (res.status === 200) {
        setUser({email: res.data.email, isAnonymous: false})
      }
    } )
  }, [])
  
  return (
    <div className="App">
      <div className="divider"></div>
      <Navbar user={user} />
      <Routes>
        <Route path="/" element={<Home user={user} />} />
        <Route path="/login" element={<Login user={user} />} />
        <Route path="/logout" element={<Logout />}></Route>
      </Routes>
    </div>
  );
}

export default App;
