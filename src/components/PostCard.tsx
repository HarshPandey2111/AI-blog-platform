import React from 'react';
import { Link } from 'react-router-dom';
import { Clock, User } from 'lucide-react';
import type { Post } from '../types/database';

interface PostCardProps {
  post: Post;
}

export function PostCard({ post }: PostCardProps) {
  return (
    <article className="bg-white rounded-lg shadow-md overflow-hidden">
      <Link to={`/post/${post.id}`} className="block p-6 hover:bg-gray-50">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">{post.title}</h2>
        {post.summary && (
          <p className="text-gray-600 mb-4">{post.summary}</p>
        )}
        <div className="flex items-center text-sm text-gray-500 space-x-4">
          <div className="flex items-center">
            <User size={16} className="mr-1" />
            <span>{post.user_id}</span>
          </div>
          <div className="flex items-center">
            <Clock size={16} className="mr-1" />
            <span>{new Date(post.created_at).toLocaleDateString()}</span>
          </div>
        </div>
      </Link>
    </article>
  );
}