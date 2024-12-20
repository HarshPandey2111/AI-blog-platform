import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { generateSummary } from '../lib/openai';
import { PostForm } from '../components/PostForm';
import type { Post } from '../types/database';

export default function EditPost() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [post, setPost] = useState<Post | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

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

  const handleSubmit = async (data: { title: string; content: string }) => {
    setIsSubmitting(true);
    try {
      const summary = await generateSummary(data.content);
      const { error } = await supabase
        .from('posts')
        .update({
          title: data.title,
          content: data.content,
          summary,
          updated_at: new Date().toISOString()
        })
        .eq('id', id);

      if (error) throw error;
      navigate(`/post/${id}`);
    } catch (error) {
      console.error('Error updating post:', error);
      alert('Failed to update post. Please try again.');
    } finally {
      setIsSubmitting(false);
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
      <h1 className="text-3xl font-bold mb-6">Edit Post</h1>
      <PostForm
        initialData={post}
        onSubmit={handleSubmit}
        isSubmitting={isSubmitting}
      />
    </div>
  );
}