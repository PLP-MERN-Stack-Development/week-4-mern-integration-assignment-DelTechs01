import { useState, useEffect } from 'react';
import axios from 'axios';

// If not using Vite proxy, ensure baseURL is set
axios.defaults.baseURL = 'http://localhost:5000/api'; // Uncomment if not using proxy

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
        setPosts(Array.isArray(data.posts) ? data.posts : []);
        setTotal(data.total || 0);
        setError(null);
      } catch (err) {
        setError(err.response?.data?.error || 'Error fetching posts');
        setPosts([]);
      } finally {
        setLoading(false);
      }
    };

    const fetchCategories = async () => {
      try {
        const { data } = await axios.get('/categories');
        console.log('Categories response:', data); // Debug
        setCategories(Array.isArray(data) ? data : []);
        setError(null);
      } catch (err) {
        setError(err.response?.data?.error || 'Error fetching categories');
        setCategories([]);
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
    if (id) fetchPost();
  }, [id]);

  const createPost = async (formData) => {
    try {
      const { data } = await axios.post('/posts', formData);
      setError(null);
      return data;
    } catch (err) {
      setError(err.response?.data?.error || 'Error creating post');
      throw err;
    }
  };

  const updatePost = async (id, formData) => {
    try {
      const { data } = await axios.put(`/posts/${id}`, formData);
      setPost(data);
      setError(null);
      return data;
    } catch (err) {
      setError(err.response?.data?.error || 'Error updating post');
      throw err;
    }
  };

  const addComment = async (content) => {
    try {
      const { data } = await axios.post(`/posts/${id}/comments`, { content });
      setPost(data);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.error || 'Error adding comment');
    }
  };

  return { post, loading, error, createPost, updatePost, addComment };
}

export function useCategories() {
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data } = await axios.get('/categories');
        setCategories(Array.isArray(data) ? data : []);
        setError(null);
      } catch (err) {
        setError(err.response?.data?.error || 'Error fetching categories');
        setCategories([]);
      }
    };
    fetchCategories();
  }, []);

  return { categories, error };
}