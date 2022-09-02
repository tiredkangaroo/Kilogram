import axios from "axios";
import React, { useRef } from "react";
React;
const Register = () => {
    const emailRef = useRef<HTMLInputElement>(null);
    const usernameRef = useRef<HTMLInputElement>(null);
    const passwordRef = useRef<HTMLInputElement>(null);
    const passwordConfirmRef = useRef<HTMLInputElement>(null);
    const errorDisplayRef = useRef<HTMLParagraphElement>(null);

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const params = new URLSearchParams();
        params.append("email", emailRef.current!.value);
        params.append("username", usernameRef.current!.value)
        params.append("password", passwordRef.current!.value);
        params.append("password_confirmation", passwordConfirmRef.current!.value);
        axios.post("/register", params, {withCredentials: true}).then(async (response) => {
            if (response.status === 200){
                const confirmParams = new URLSearchParams();
                confirmParams.append("email", emailRef.current!.value)
                confirmParams.append("token", response.data)
                await axios.post("/sendConfirmationToken", confirmParams)
                window.location.href = "/confirmEmail"
            }
            else {
                errorDisplayRef.current!.innerText = response.data;
                errorDisplayRef.current!.style.display = "inline-block";
            }
        }).catch((e) => {
            console.log(e)
            errorDisplayRef.current!.innerText = e.response.data
            errorDisplayRef.current!.style.display = "inline-block";
        })
    }
    return (
        <><p className="register-errorDisplay" ref={errorDisplayRef}></p>
            <form className="auth-form" onSubmit={handleSubmit}>
                <p>Email: <input ref={emailRef} placeholder="Ex: johndoe@example.com" type="email"></input></p>
                <p>Username: <input ref={usernameRef} placeholder="Ex: johndoe" type="username"></input></p>
                <p>Password: <input ref={passwordRef} type="password" placeholder="Enter Secure Password Here"></input></p>
                <p>Password Confirmation: <input ref={passwordConfirmRef} type="password" placeholder="Re-enter the Password Above" /></p>
                <button type="submit">Submit</button>
            </form>
        </>
    )
}
export default Register;
