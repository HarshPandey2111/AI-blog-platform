import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { Pencil, Trash2, ArrowLeft } from 'lucide-react';
import { supabase } from '../lib/supabase';
import type { Post } from '../types/database';

export default function ViewPost() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [post, setPost] = useState<Post | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    async function fetchPost() {
      try {
        const { data, error } = await supabase
          .from('posts')
          .select('*')
          .eq('id', id)
          .single();

        if (error) throw error;
        setPost(data);
      } catch (error) {
        console.error('Error fetching post:', error);
        navigate('/');
      } finally {
        setIsLoading(false);
      }
    }

    fetchPost();
  }, [id, navigate]);

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this post?')) {
      return;
    }

    setIsDeleting(true);
    try {
      const { error } = await supabase
        .from('posts')
        .delete()
        .eq('id', id);

      if (error) throw error;
      navigate('/');
    } catch (error) {
      console.error('Error deleting post:', error);
      alert('Failed to delete post. Please try again.');
      setIsDeleting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-gray-500">Loading post...</div>
      </div>
    );
  }

  if (!post) {
    return null;
  }

  return (
    <div className="max-w-2xl mx-auto">
      <Link to="/" className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-6">
        <ArrowLeft size={20} className="mr-1" />
        Back to Posts
      </Link>
      <article className="bg-white rounded-lg shadow-md p-6">
        <header className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">{post.title}</h1>
          <div className="mt-2 text-sm text-gray-500">
            Posted on {new Date(post.created_at).toLocaleDateString()}
          </div>
        </header>
        {post.summary && (
          <div className="mb-6 bg-gray-50 p-4 rounded-md">
            <h2 className="text-sm font-medium text-gray-700 mb-2">Summary</h2>
            <p className="text-gray-600">{post.summary}</p>
          </div>
        )}
        <div className="prose max-w-none">
          {post.content.split('\n').map((paragraph, index) => (
            <p key={index} className="mb-4">{paragraph}</p>
          ))}
        </div>
        <footer className="mt-8 pt-4 border-t border-gray-200">
          <div className="flex justify-end space-x-4">
            <Link
              to={`/edit/${post.id}`}
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            >
              <Pencil size={16} className="mr-2" />
              Edit
            </Link>
            <button
              onClick={handleDelete}
              disabled={isDeleting}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 disabled:opacity-50"
            >
              <Trash2 size={16} className="mr-2" />
              {isDeleting ? 'Deleting...' : 'Delete'}
            </button>
          </div>
        </footer>
      </article>
    </div>
  );
}