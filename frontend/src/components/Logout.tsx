import axios from "axios";

const Logout = (): JSX.Element => {
    axios.get("/logout", {withCredentials: true}).then(() => {
        window.location.href = "/"
        return <></>
    }).catch((e) => {
        window.location.href = "/"
        return <></>
    })
    return <></>;
}
export default Logout;