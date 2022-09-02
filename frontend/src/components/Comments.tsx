import { useState } from "react";
import Comment from "./Comment";
import NewCommentEditor from "./NewCommentEditor";
import "./stylesheets/Comments.css";
import PostDataInterface from "./data/interfaces/PostDataInterface";

interface CommentsPostDataInterface {
  post: PostDataInterface
}
const Comments = ({post}: CommentsPostDataInterface) =>  {

  const [comments, setComments] = useState(post.comments.map(ele => <Comment key={Math.random() * 50} data={ele} />))
  const handleNewComment = (newCommentRef:HTMLTextAreaElement) => {
    setComments(post.comments.map(ele => <Comment key={Math.random() * 50} data={ele} />));
  } 
  if (comments.length === 0){
    return (
      <>
        <NewCommentEditor handle={handleNewComment} />
        <div className="comments">
          <h3>Be the first to write a comment.</h3>
        </div>
      </>
    )
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
export default Comments