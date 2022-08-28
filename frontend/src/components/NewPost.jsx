import { useRef } from 'react';
import axios from 'axios';
import Editor from './Editor';

const NewPost = ({user}) => {
    const errorRef = useRef();
    const handleNewPost = async (fileRef, markdownRef) => {
        const params = new FormData();
        try{
            params.append("image", fileRef.current.files[0])
        }
        catch (e){
            console.log(e);
        }
        params.append("text", markdownRef.current.value)
        try{
            const result = await axios.post("/posts/newpost", params, {withCredentials: true, headers: {"Content-Type": "multipart/form-data"}})
            if (result.status === 200){
                window.location.href = `/post#${result.data}`
            }
            else{
                errorRef.current.innerText = result.response.data;
                errorRef.current.style.display = "inline-block";
            }
        }
        catch (e) {
            errorRef.current.innerText = e.response.data;
            errorRef.current.style.display = "inline-block";
            window.scroll(0, 0);
        }
    }
    if (!user.completedLoading){
        if (navigator.onLine){
            return (
                <div><span className="uncompleted-loading"></span></div>
            )
        }
        else{
            return <div><span className="uncompleted-loading"></span> <p className="uncompleted-loading-checkinternet">You're offline.</p></div>
        }
    }
    else if (user.isAnonymous){
        window.location.href = "/"
    }
    else {
        return (
            <>
              <div className="editor-error-parent"><p className="editor-error" ref={errorRef}></p></div>
              <Editor user={user} handle={handleNewPost} />
            </>
        )
    }
}
export default NewPost;