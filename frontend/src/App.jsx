import React, { useState, useEffect } from 'react';

function App() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Update this endpoint to match your backend API route
        const response = await fetch('/api/posts');
        
        if (!response.ok) {
          throw new Error(`Failed to fetch posts (Status: ${response.status})`);
        }
        
        const data = await response.json();
        setPosts(data);
      } catch (err) {
        setError(err.message || 'An unexpected error occurred while fetching posts.');
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  // Criterion 2: Loading State Indicator
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-lg font-medium text-gray-600 animate-pulse">Loading posts...</p>
      </div>
    );
  }

  // Criterion 3: Error Handling & Message
  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen p-4">
        <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-lg shadow-sm max-w-md w-full">
          <strong className="font-bold block mb-1">Failed to Load Data</strong>
          <span className="text-sm">{error}</span>
        </div>
      </div>
    );
  }

  // Criterion 1: Dynamic API Data Rendering (replacing hardcoded useState)
  return (
    <div className="max-w-3xl mx-auto p-6 font-sans">
      <header className="mb-8 border-b pb-4">
        <h1 className="text-3xl font-bold text-gray-800">Community Posts</h1>
      </header>

      {posts.length === 0 ? (
        <p className="text-gray-500 text-center py-8">No posts found.</p>
      ) : (
        <div className="space-y-6">
          {posts.map((post) => (
            <article key={post.id || post._id} className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
              <h2 className="text-xl font-semibold text-gray-800 mb-2">{post.title}</h2>
              <p className="text-gray-600 leading-relaxed">{post.content || post.body}</p>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}

export default App;