import { useParams, useNavigate } from 'react-router-dom';
import { usePost } from '../hooks/usePosts';
import { useAuth } from '../context/AuthContext';
import '../styles/PostDetail.css';

function PostDetail() {
  const { id } = useParams();
  const { post, loading, error, addComment } = usePost(id);
  const { user } = useAuth();
  const navigate = useNavigate();
  const [comment, setComment] = useState('');

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="post-detail">
      <h1>{post.title}</h1>
      {post.image && <img src={`http://localhost:5000/${post.image}`} alt={post.title} />}
      <p>{post.content}</p>
      <p>Category: {post.category.name}</p>
      <p>Author: {post.author.username}</p>
      {user && user.id === post.author._id && (
        <div>
          <Link to={`/edit/${post._id}`}>Edit</Link>
          <button onClick={() => { /* Implement delete */ navigate('/'); }}>Delete</button>
        </div>
      )}
      <h3>Comments</h3>
      {post.comments.map((c) => (
        <div key={c._id}>
          <p>{c.content} - {c.author.username}</p>
        </div>
      ))}
      {user && (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            addComment(comment);
            setComment('');
          }}
        >
          <textarea value={comment} onChange={(e) => setComment(e.target.value)}></textarea>
          <button type="submit">Add Comment</button>
        </form>
      )}
    </div>
  );
}

export default PostDetail;