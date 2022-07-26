import { marked } from 'marked';

const PostRenderer = ({post}) => {
    const generatePostLink = (id) => {
        return `/post#${id}`
    }
    const markdown = () => ({__html: marked.parse(post.markdownText).replace("<h1>", "<h1><hr>")})
    return (<a href={generatePostLink(post._id)} className="post-link">
                <div className="post">
                    <p>{post.authorEmail}</p>
                    <hr></hr>
                    <p dangerouslySetInnerHTML={markdown()} className="post-body"></p>
                </div>
            </a>)
}
export default PostRenderer;