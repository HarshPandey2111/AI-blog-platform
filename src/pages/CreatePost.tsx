import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { generateSummary, generateTags } from '../lib/openai';
import { PostForm } from '../components/PostForm';

export default function CreatePost() {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (data: { title: string; content: string }) => {
    setIsSubmitting(true);
    try {
      const [summary, tags] = await Promise.all([
        generateSummary(data.content),
        generateTags(data.content)
      ]);

      const user = (await supabase.auth.getUser()).data.user;
      if (!user) throw new Error('Not authenticated');

      const { error } = await supabase.from('posts').insert({
        title: data.title,
        content: data.content,
        summary,
        tags,
        user_id: user.id
      });

      if (error) throw error;
      navigate('/');
    } catch (error) {
      console.error('Error creating post:', error);
      throw new Error(error.message || 'Failed to create post. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Create New Post</h1>
      <PostForm onSubmit={handleSubmit} isSubmitting={isSubmitting} />
    </div>
  );
}