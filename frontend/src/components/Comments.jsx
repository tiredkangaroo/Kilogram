import { useState } from "react";

import Comment from "./Comment.jsx";
import NewCommentEditor from "./NewCommentEditor.jsx";
import "./stylesheets/Comments.css";

export default function Comments ({post}) {
  const [comments, setComments] = useState(post.comments.map(ele => <Comment key={Math.random() * 50} data={ele} />))
  if (comments.length === 0){
    return (
      <>
        <NewCommentEditor/>
        <div className="comments">
          <h3>Be the first to write a comment.</h3>
        </div>
      </>
    )
  }
  const handleNewComment = (newCommentRef) => {
    setComments(...comments, <Comment key={Math.random() * 50} data={{username: window.user.username, userID: window.user._id, text: newCommentRef.current.value, date: new Date()}} />);
  }
  return (
    <>
      <NewCommentEditor handle={handleNewComment} />
      <div className="comments">
        {comments.map((ele) => (ele))}
      </div>
    </>
  )
}