export default function Comment({data}){
  const {username, userID, text, date} = data;
  const dateObject = new Date(date);
  return (
    <div className="comment">
      <div className="comment-username-date">
        <h3 id={userID}>{username}</h3>
        <span>{`${dateObject.toLocaleDateString()}    ${dateObject.toLocaleTimeString().replace("AM", "am").replace("PM", "pm")}`}</span>
      </div>
      <p className="comment-text">{text}</p>
    </div>
  )
}