import { useRef, useState } from "react";
import { Link } from "react-router-dom";
const Navbar = ({user}) => {
    const navbarRef = useRef();
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
        if (!user.isAnonymous){
            return <a className="navbar-username" href={`/profile#@${user.username}`}>{user.username}</a>;
        }
    }
    window.addEventListener("scroll", (e) => {
        if (window.scrollY > 50 && navbarRef.current){
            navbarRef.current.style.opacity = "0.8";
        }
        else if (navbarRef.current) {
            navbarRef.current.style.opacity = "1";
        }
    })
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
                <a href="/"><img alt="Kilogram Logo" src="/storage/favicon.ico" width="80" height="40"></img></a>
                <div className="branding-parent"><h1 className="heading-nav-branding">Kilogram</h1></div>
                <p className="username"><b>{Username()}</b></p>
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