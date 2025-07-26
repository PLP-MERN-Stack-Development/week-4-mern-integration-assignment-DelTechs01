import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { usePost, useCategories } from '../hooks/usePosts';
import '../styles/PostForm.css';

function PostForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { post, createPost, updatePost, loading, error } = usePost(id);
  const { categories } = useCategories();
  const [formData, setFormData] = useState({ title: '', content: '', category: '', image: null });

  useEffect(() => {
    if (post) {
      setFormData({
        title: post.title,
        content: post.content,
        category: post.category._id,
        image: null,
      });
    }
  }, [post]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    Object.keys(formData).forEach((key) => data.append(key, formData[key]));
    if (id) {
      await updatePost(id, data);
    } else {
      await createPost(data);
    }
    navigate('/');
  };

  return (
    <form className="post-form" onSubmit={handleSubmit}>
      <h1>{id ? 'Edit Post' : 'Create Post'}</h1>
      {error && <p>{error}</p>}
      <input
        type="text"
        placeholder="Title"
        value={formData.title}
        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
      />
      <textarea
        placeholder="Content"
        value={formData.content}
        onChange={(e) => setFormData({ ...formData, content: e.target.value })}
      ></textarea>
      <select
        value={formData.category}
        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
      >
        <option value="">Select Category</option>
        {categories.map((cat) => (
          <option key={cat._id} value={cat._id}>{cat.name}</option>
        ))}
      </select>
      <input
        type="file"
        onChange={(e) => setFormData({ ...formData, image: e.target.files[0] })}
      />
      <button type="submit" disabled={loading}>
        {loading ? 'Saving...' : id ? 'Update Post' : 'Create Post'}
      </button>
    </form>
  );
}

export default PostForm;