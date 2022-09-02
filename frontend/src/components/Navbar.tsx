import { useRef, useState } from "react";
import { Link } from "react-router-dom";
import "./stylesheets/Navbar.css";
import { NavbarDropdownElements } from "./data/NavbarDropdownElements";
import UserDataInterface from "./data/interfaces/UserDataInterface";
const Navbar = ({user}: {user: UserDataInterface}) => {
    const navbarRef = useRef(null);
    const [width, setWidth] = useState(window.innerWidth);
    const ATag = () => {
        if (user.isAnonymous){
            return (
                <>
                    <Link className="register" to="/register">Register</Link>
                    <Link className="login-logout" to="/login">Login</Link>
                </>
            );
        }
        else{
            return <Link className="login-logout" to="/logout">Logout</Link>;
        }
    }
    const Username = () => {
        console.log(user)
        if (!user.isAnonymous){
            return (
              <div className="dropdown">
                <a className="navbar-username" href={`/profile#@${user.username}`}>{user.username}</a>
                <div className="dropdown-content">
                  {Object.keys(NavbarDropdownElements).map((ele) => {
                    return <p key={ele}><a href={NavbarDropdownElements[ele]}>{ele}</a></p>
                  })}
                </div>
              </div>
            )
        }
        else {
          return <></>
        }
    }
//     window.addEventListener("scroll", (e) => {
//         if (window.scrollY > 50 && navbarRef.current){
//             navbarRef.current.style.opacity = "0.8";
//         }
//         else if (navbarRef.current) {
//             navbarRef.current.style.opacity = "1";
//         }
//     })
    window.addEventListener("resize", () => {setWidth(window.innerWidth)})
    const ATagOrUsername = () => {
        if (user.isAnonymous){
            return (
                <>
                    <Link className="register" to="/register">Register</Link>
                    <Link className="login-logout" to="/login">Login</Link>
                </>
            )
        }
        else{
            return (
                <>
                    <b title="View profile."><Username /></b>
                    <Link className="logout" to="/logout">Logout</Link>
                </>
            )
        }
    }
    if (width >= 562){
        return (
            <nav className="heading-nav" ref={navbarRef}>
                <div className="branding-logo-parent"><img className="branding-logo" alt="Kilogram Logo" src="/storage/favicon.ico"/></div>
                <div className="branding-parent"><h1 className="heading-nav-branding">Kilogram</h1></div>
                <div className="username"><b>{Username()}</b></div>
                <ATag />
            </nav>
        )
    }
    else{
        return (
            <nav className="heading-nav heading-nav-center" ref={navbarRef}>
                <ATagOrUsername />
            </nav>
        )
    }
}
export default Navbar;