'use client';

import { FiCalendar, FiTag, FiImage } from 'react-icons/fi';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { format } from 'date-fns';
import React, { useEffect, useState } from 'react';

interface BlogPost {
  _id: string;
  title: string;
  slug: string;
  excerpt: string;
  coverImage: string;
  category: string;
  tags: string[];
  createdAt: string;
}

async function getBlogPosts() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/blog`);
  if (!res.ok) throw new Error('Failed to fetch blog posts');
  return res.json();
}

const BlogList = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({});

  const handleImageError = (id: string) => {
    setImageErrors(prev => ({ ...prev, [id]: true }));
  };

  useEffect(() => {
    getBlogPosts()
      .then(data => {
        setPosts(data);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (loading) return <p className="text-center py-12">Loading posts...</p>;
  if (error) return <p className="text-center py-12 text-red-600">Error: {error}</p>;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-4xl font-bold text-center text-gray-900 dark:text-white mb-16"
      >
        Latest <span className="text-blue-600">Articles</span>
      </motion.h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {posts.map((post, index) => (
          <motion.div
            key={post._id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ y: -5 }}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden border border-gray-200 dark:border-gray-700 transition-all duration-300"
          >
            <Link href={`/blog/${post.slug}`} className="block">
              <div className="relative h-48 w-full overflow-hidden rounded-lg bg-gray-100 dark:bg-gray-800 shadow-md group">
                {imageErrors[post._id] ? (
                  <div className="w-full h-full flex flex-col items-center justify-center text-gray-400 dark:text-gray-500 select-none">
                    <FiImage className="text-5xl mb-3" />
                    <span className="text-sm font-medium">Image not available</span>
                  </div>
                ) : (
                  <Image
                    src={post.coverImage}
                    alt={post.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105 rounded-lg"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    onError={() => handleImageError(post._id)}
                    priority={index < 3} // prioritize first few images
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent pointer-events-none rounded-lg" />
              </div>

              <div className="p-6">
                <div className="flex items-center text-sm text-blue-600 dark:text-blue-400 mb-2">
                  <FiTag className="mr-1.5" />
                  <span>{post.category}</span>
                </div>

                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 line-clamp-2">
                  {post.title}
                </h3>

                <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-3">
                  {post.excerpt}
                </p>

                <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
                  <div className="flex items-center">
                    <FiCalendar className="mr-1.5" />
                    <span>{format(new Date(post.createdAt), 'MMM d, yyyy')}</span>
                  </div>
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default BlogList;
