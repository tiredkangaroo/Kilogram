import { Route, Routes, useLocation, Navigate, Outlet } from "react-router-dom";
import { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';
import Home from "./components/Home";
import Login from "./components/Login";
import Logout from "./components/Logout";
import Register from "./components/Register";
import Navbar from './components/Navbar';
import Post from "./components/Post";
import NewPost from "./components/NewPost";
import Profile from "./components/Profile";
import Edit from "./components/Edit";
import UserDataInterface from "./components/data/interfaces/UserDataInterface";
// const remove = function (value: unknown){
//   return this.filter(function (ele){
//     return ele !== value;
//   })
// }

const App = () => {
  const [userData, setUser] = useState<UserDataInterface>({isAnonymous: true, completedLoading: false});
  const location = useLocation();
  useEffect(() => {
    axios.get("/whoami", {withCredentials: true}).then((res) => {
      if (res.status === 200) {
        const userData: UserDataInterface = {id: res.data.id, email: res.data.email, username: res.data.username, isAnonymous: false, completedLoading: true}
        setUser(userData);
      }
      else{
        setUser({isAnonymous: true, completedLoading: true})
      }
    }).catch(() => {setUser({isAnonymous: true, completedLoading: true})})
  }, [location.pathname, userData.isAnonymous])
  interface ProtectedInterfaceProps {
    [key: string] : string | UserDataInterface
  }
  interface ProtectedInterface {
    Element: any,
    props: ProtectedInterfaceProps
  }
  const Protected = ({Element, props={}}: ProtectedInterface): JSX.Element => (
    userData.completedLoading ? userData.isAnonymous ? <Navigate to="/login" replace/> : <Element {...props}/> : <Outlet />
  )
  return (
    <div className="App">
      <Navbar user={userData} />
      <>
        <Routes>
          <Route path="/" element={<Home user={userData} />} />
          <Route path="/login" element={<Login user={userData} />} />
          <Route path="/logout" element={<Protected Element={Logout} props={{}} />} />
          <Route path="/register" element={<Register />} />
          <Route path="/post" element={<Post user={userData} />} />
          <Route path="/new" element={<Protected Element={NewPost} props={{user: userData}} />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/edit" element={<Protected Element={Edit} props={{}} />} />
        </Routes>
      </>
    </div>
  );
}

export default App;