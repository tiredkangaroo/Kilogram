import { Link } from "react-router-dom";
const Navbar = ({user}) => {
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
            return user.email
        }
    }
    return (
        <nav className="heading-nav">
            <a href="/"><img alt="Kilogram Logo" src="/storage/favicon.ico" width="80" height="49"></img></a>
            <p className="username"><b>{Username()}</b></p>
            <ATag />
        </nav>
    )
}
export default Navbar;