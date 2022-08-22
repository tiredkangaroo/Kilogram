export default function Comments ({post}) {
  return (
    <>
      {post.comments.map((ele) => {
      return (<h3>{ele}</h3>)
      })}
    </>
  )
}