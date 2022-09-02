import { useRef } from "react";

export default function NewCommentEditor({handle}: {handle: Function}): JSX.Element{
  const newCommentRef = useRef<HTMLTextAreaElement>(null);
  const NewCommentHandle = (e: any) => {
    e.preventDefault();
    handle(newCommentRef);
  }
  return (
    <div className="comments-newcomment">
      <form onSubmit={NewCommentHandle}>
        <label htmlFor=""></label>
        <textarea ref={newCommentRef} placeholder="Caption" className="comments-newcomment-text" />
        <button type="submit" className="comments-newcomment-button">Submit</button>
      </form>
    </div>
  )
}