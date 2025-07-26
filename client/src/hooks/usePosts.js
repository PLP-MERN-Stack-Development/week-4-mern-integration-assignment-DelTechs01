import { useState, useEffect } from 'react';
import axios from 'axios';

export function usePosts(page, search, category) {
  const [posts, setPosts] = useState([]);
  const [total, setTotal] = useState(0);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      try {
        const { data } = await axios.get(`/posts?page=${page}&search=${search}&category=${category}`);
        setPosts(data.posts);
        setTotal(data.total);
        setError(null);
      } catch (err) {
        setError(err.response?.data?.error || 'Error fetching posts');
      } finally {
        setLoading(false);
      }
    };

    const fetchCategories = async () => {
      try {
        const { data } = await axios.get('/categories');
        setCategories(data);
      } catch (err) {
        setError(err.response?.data?.error || 'Error fetching categories');
      }
    };

    fetchPosts();
    fetchCategories();
  }, [page, search, category]);

  return { posts, total, categories, loading, error };
}

export function usePost(id) {
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!id) return;
    const fetchPost = async () => {
      setLoading(true);
      try {
        const { data } = await axios.get(`/posts/${id}`);
        setPost(data);
        setError(null);
      } catch (err) {
        setError(err.response?.data?.error || 'Error fetching post');
      } finally {
        setLoading(false);
      }
    };
    fetchPost();
  }, [id]);

  const createPost = async (data) => {
    setLoading(true);
    try {
      const { data: newPost } = await axios.post('/posts', data);
      setPost(newPost);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.error || 'Error creating post');
    } finally {
      setLoading(false);
    }
  };

  const updatePost = async (id, data) => {
    setLoading(true);
    try {
      const { data: updatedPost } = await axios.put(`/posts/${id}`, data);
      setPost(updatedPost);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.error || 'Error updating post');
    } finally {
      setLoading(false);
    }
  };

  const addComment = async (content) => {
    try {
      const { data } = await axios.post(`/posts/${id}/comments`, { content });
      setPost({ ...post, comments: [...post.comments, data] });
      setError(null);
    } catch (err) {
      setError(err.response?.data?.error || 'Error adding comment');
    }
  };

  return { post, createPost, updatePost, addComment, loading, error };
}

export function useCategories() {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data } = await axios.get('/categories');
        setCategories(data);
      } catch (err) {
        console.error(err.response?.data?.error || 'Error fetching categories');
      }
    };
    fetchCategories();
  }, []);

  return { categories };
}