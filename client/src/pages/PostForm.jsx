import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { usePost, useCategories } from '../hooks/usePosts';

function PostForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { post, createPost, updatePost, loading, error } = usePost(id);
  const { categories, error: categoriesError } = useCategories();
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
    try {
      if (id) {
        await updatePost(id, data);
      } else {
        await createPost(data);
      }
      navigate('/');
    } catch (err) {
      console.error('Form submission error:', err);
    }
  };

  return (
    <div className="container py-8">
      <form className="card" onSubmit={handleSubmit}>
        <h1 className="text-3xl font-bold text-textDark mb-6">{id ? 'Edit Post' : 'Create Post'}</h1>
        {error && <p className="error mb-4">{error}</p>}
        {categoriesError && <p className="error mb-4">{categoriesError}</p>}
        <input
          type="text"
          placeholder="Title"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          className="input mb-4"
        />
        <textarea
          placeholder="Content"
          value={formData.content}
          onChange={(e) => setFormData({ ...formData, content: e.target.value })}
          className="input mb-4"
          rows="6"
        ></textarea>
        <select
          value={formData.category}
          onChange={(e) => setFormData({ ...formData, category: e.target.value })}
          className="input mb-4"
        >
          <option value="">Select Category</option>
          {categories && categories.length > 0 ? (
            categories.map((cat) => (
              <option key={cat._id} value={cat._id}>
                {cat.name}
              </option>
            ))
          ) : (
            <option disabled>No categories available</option>
          )}
        </select>
        <input
          type="file"
          onChange={(e) => setFormData({ ...formData, image: e.target.files[0] })}
          className="input mb-4"
        />
        <button type="submit" disabled={loading} className="btn-primary disabled:bg-accent disabled:text-textMuted">
          {loading ? 'Saving...' : id ? 'Update Post' : 'Create Post'}
        </button>
      </form>
    </div>
  );
}

export default PostForm;