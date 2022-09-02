import { useEffect, useState } from "react"
import axios from "axios";

const Confirm = () => {
    const [html, setHTML] = useState("Attempting to reach confirmation")
    useEffect(() => {
        if (!window.location.hash.includes("#")){
            setTimeout(() => {window.location.href = "/"}, 2000)
            return setHTML("No token passed in. Redirecting to home page...");

        }
        axios.get(`/confirm?token=${window.location.hash.split("#")[1]}`, {withCredentials: true}).then((result) => {
            setHTML(result.data)
            setTimeout(() => {window.location.href = "/"}, 2000)
        }).catch((e) => {
            setHTML(e.response.data)
            setTimeout(() => {window.location.href = "/"}, 2000)
        })
    }, [])
    return <pre className="confirm-text">{html}</pre>;
}
export default Confirm;