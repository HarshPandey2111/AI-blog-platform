/*
  # Blog Schema Setup

  1. New Tables
    - `posts`
      - `id` (uuid, primary key)
      - `title` (text)
      - `content` (text)
      - `summary` (text)
      - `user_id` (uuid, references auth.users)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on `posts` table
    - Add policies for CRUD operations
*/

CREATE TABLE IF NOT EXISTS posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  content text NOT NULL,
  summary text,
  user_id uuid REFERENCES auth.users NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE posts ENABLE ROW LEVEL SECURITY;

-- Policy for users to read all posts
CREATE POLICY "Anyone can read posts"
  ON posts
  FOR SELECT
  USING (true);

-- Policy for users to create their own posts
CREATE POLICY "Users can create their own posts"
  ON posts
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Policy for users to update their own posts
CREATE POLICY "Users can update their own posts"
  ON posts
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Policy for users to delete their own posts
CREATE POLICY "Users can delete their own posts"
  ON posts
  FOR DELETE
  USING (auth.uid() = user_id);