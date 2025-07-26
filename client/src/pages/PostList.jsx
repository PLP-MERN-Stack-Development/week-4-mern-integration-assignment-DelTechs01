import { useState, useEffect } from 'react';
import { usePosts } from '../hooks/usePosts';
import '../styles/PostList.css';

function PostList() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const { posts, total, categories, loading, error } = usePosts(page, search, category);

  return (
    <div className="post-list">
      <h1>Blog Posts</h1>
      <input
        type="text"
        placeholder="Search posts..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      <select onChange={(e) => setCategory(e.target.value)} value={category}>
        <option value="">All Categories</option>
        {categories.map((cat) => (
          <option key={cat._id} value={cat._id}>{cat.name}</option>
        ))}
      </select>
      {loading && <p>Loading...</p>}
      {error && <p>{error}</p>}
      <div className="posts">
        {posts.map((post) => (
          <div key={post._id} className="post-card">
            {post.image && <img src={`http://localhost:5000/${post.image}`} alt={post.title} />}
            <h2>{post.title}</h2>
            <p>{post.content.substring(0, 100)}...</p>
            <Link to={`/posts/${post._id}`}>Read More</Link>
          </div>
        ))}
      </div>
      <div className="pagination">
        <button disabled={page === 1} onClick={() => setPage(page - 1)}>Previous</button>
        <button disabled={page * 10 >= total} onClick={() => setPage(page + 1)}>Next</button>
      </div>
    </div>
  );
}

export default PostList;