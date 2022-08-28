import { useRef } from "react";

export default function NewCommentEditor({handle}){
  const newCommentRef = useRef();
  const NewCommentHandle = (e) => {
    e.preventDefault();
    handle(newCommentRef);
  }
  return (
    <div className="comments-newcomment">
      <form onSubmit={NewCommentHandle}>
        <textarea type="text" ref={newCommentRef} className="comments-newcomment-text" />
        <button type="submit" className="comments-newcomment-button">Submit</button>
      </form>
    </div>
  )
}