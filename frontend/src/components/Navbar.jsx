import { Link } from "react-router-dom";
const Navbar = ({user}) => {
    const ATag = () => {
        if (user.isAnonymous){
            return <Link className="login-logout" to="/login">Login</Link>;
        }
        else{
            return <Link className="login-logout" to="/logout">Logout</Link>;
        }
    }
    return (
        <nav className="heading-nav">
            <a to="/">Kilogram</a>
            <ATag />
        </nav>
    )
}
export default Navbar;