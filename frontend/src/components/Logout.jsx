import axios from "axios";

const Logout = () => {
    window.user = {username: null}
    axios.get("/logout", {withCredentials: true}).then(() => {
        window.location.href = "/"
    }).catch((e) => {
        window.location.href = "/"
    })
}
export default Logout;