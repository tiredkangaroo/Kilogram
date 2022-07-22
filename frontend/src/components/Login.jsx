import { useRef } from "react";
import axios from "axios";

const Login = ({user}) => {
    const emailRef = useRef();
    const passwordRef = useRef();
    const errorRef = useRef();
    const handleLogin = (e) => {
        e.preventDefault();
        const params = new URLSearchParams();
        params.append("email", emailRef.current.value);
        params.append("password", passwordRef.current.value)
        axios.post("http://localhost:8000/login", params, {withCredentials: true}).then((res) => {
            if (res.status === 200 || res.status === 304){
                window.location.href = "/"
            }
            errorRef.current.innerText = e.response.data;
        }).catch((e) => {
            errorRef.current.innerText = e.response.data;
        })
    }
    if (user.isAnonymous){
        return (
            <form onSubmit={handleLogin}>
                <p ref={errorRef}></p>
                <p>Username: <input type="email" ref={emailRef} required></input></p>
                <p>Password: <input type="password" ref={passwordRef} required/></p>
                <p><button type="submit">Submit</button></p>
            </form>
        )
    }
    else{
        window.location.replace("/")
    }

}
export default Login;