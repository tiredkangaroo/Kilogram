import { useRef } from "react";
import axios from "axios";
import UserDataInterface from "./data/interfaces/UserDataInterface";

const Login = ({user} : {user: UserDataInterface}): JSX.Element => {
    const emailRef = useRef<HTMLInputElement>(null);
    const passwordRef = useRef<HTMLInputElement>(null);
    const errorRef = useRef<HTMLParagraphElement>(null);
    const submitButtonRef = useRef<HTMLButtonElement>(null);
    const handleLogin = (e: any) => {
      e.preventDefault();
      const params = new URLSearchParams();
      params.append("email", emailRef.current!.value);
      params.append("password", passwordRef.current!.value);
      axios.post("/login", params, {withCredentials: true}).then((res) => {
        if (res.status === 200 || res.status === 304){
            window.location.href = "/"
        }
        else{
          errorRef.current!.innerText = res.data;
        }
      }).catch((err) => {
        errorRef.current!.innerText = err.response.data;
      })
    }
    const handleDemo = (e: any) => {
        emailRef.current!.value = "demo@demo.com"
        passwordRef.current!.value = "c5839a6e2ca5f3064b6bd1bd5965f988afeac52db20da58500ada75af6e9a4857ccfd843485f44c4be391204a1bde8054b819bdc95467f55d95a168676ff181a355b0d9010f73cc0246bac21d7f513b1395239d563f46f73dd44a926968c67fa0ea046af0d5fe03889521e5d90c6c7f14d8d5ddf802896d225a37aa8797c6dce52ab167cbecba0a8d7cdd7fafa3f02e13d0ce45162225bfacbb891db3e0ab9df82d1ee54a0fd8f7bc36cacda219e69cd3f76ae95a3f176413d93b77f06cef7c48014f00fc177f1cb6d83836a259aa908d351704574e421222df9559dbe4ea9d2f1f3723f4aee8609cabc14457af0d5469c44f08b1bfe9a4db66ad8104777fece"
        setTimeout(() => (handleLogin(e)), 350);
    }
    if (user.isAnonymous){
        return (
            <form className="auth-form" onSubmit={handleLogin}>
                <p ref={errorRef}></p>
                <p>Email Address: <input autoFocus={true} type="email" placeholder="Email" ref={emailRef} required></input></p>
                <p>Password: <input type="password" placeholder="Password" ref={passwordRef} required/></p>
                <p><button type="submit">Submit</button></p>
                <p><button ref={submitButtonRef} type="button" onClick={handleDemo}>Demo User</button></p>
            </form>
        )
    }
    else{
        window.location.replace("/")
        return <></>
    }

}
export default Login;