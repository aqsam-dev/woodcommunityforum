import { useState, useEffect } from 'react';
import api from './api';

function PostList() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await api.get('/posts');
        setPosts(response.data);
      } catch (err) {
        // Extract backend error message if available, otherwise fallback
        const message =
          err.response?.data?.error || 'Failed to load posts. Is the server running?';
        setError(message);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []); // Empty array [] ensures this runs once when the component mounts

  // 1. Handle Loading State
  if (loading) {
    return <p className="status-message">Loading community posts...</p>;
  }

  // 2. Handle Error State
  if (error) {
    return <p className="error-message">Error: {error}</p>;
  }

  // 3. Handle Empty Database State
  if (posts.length === 0) {
    return <p className="status-message">No posts yet. Be the first to start a discussion!</p>;
  }

  // 4. Render Real Data
  return (
    <div className="post-list">
      {posts.map((post) => (
        <article key={post._id} className="post-card">
          <h3>{post.title}</h3>
          <p>{post.content}</p>
          <small>
            Posted by <strong>{post.author}</strong> •{' '}
            {new Date(post.createdAt).toLocaleDateString()}
          </small>
        </article>
      ))}
    </div>
  );
}

export default PostList;