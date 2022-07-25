import { marked } from 'marked';

const PostRenderer = ({post}) => {
    window.marked = marked;
    const markdown = () => ({__html: marked.parse(post.markdownText).replace("<h1>", "<h1><hr>")})
    return <div className="post"><p dangerouslySetInnerHTML={markdown()} className="post-body"></p></div>
}
export default PostRenderer;