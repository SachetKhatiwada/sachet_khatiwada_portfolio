import { FiCalendar, FiClock, FiTag, FiArrowLeft } from 'react-icons/fi';
import Image from 'next/image';
import Link from 'next/link';
import { format } from 'date-fns';
import Markdown from 'react-markdown';
import { notFound } from 'next/navigation';

interface BlogPost {
  _id: string;
  title: string;
  slug: string;
  content: string;
  coverImage: string;
  category: string;
  tags: string[];
  createdAt: string;
}

async function getBlogPost(slug: string) {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/blog/${slug}`, {
      next: { 
        revalidate: 60,
        tags: [`blog-${slug}`] // Add cache tag for on-demand revalidation
      }
    });
    
    if (!res.ok) {
      if (res.status === 404) return null;
      throw new Error(`Failed to fetch blog post (${res.status})`);
    }
    
    return await res.json();
  } catch (error) {
    console.error('Fetch error:', error);
    return null;
  }
}

export default async function BlogDetailPage({ params }: { params: { slug: string } }) {
  // First destructure the params object
    const { slug } = await params;
  
  // Then fetch the data (with error boundary)
  let post: BlogPost | null;
  try {
    post = await getBlogPost(slug);
  } catch (error) {
    console.error('Page error:', error);
    notFound();
  }

  if (!post) notFound();

  // Pre-calculate derived data
  const wordCount = post.content.split(/\s+/).length;
  const readTime = Math.max(1, Math.ceil(wordCount / 200));
  const formattedDate = format(new Date(post.createdAt), 'MMMM d, yyyy');

  return (
    <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 bg-white rounded-2xl shadow-md">
      <Link 
        href="/" 
        className="flex items-center text-blue-600 hover:underline mb-8"
        prefetch={false} // Disable prefetch if not needed
      >
        <FiArrowLeft className="mr-2" />
        Back to Articles
      </Link>

      <div className="mb-8">
        <div className="flex items-center text-sm text-blue-500 mb-4">
          <FiTag className="mr-1.5" />
          <span>{post.category}</span>
        </div>

        <h1 className="text-4xl font-extrabold text-gray-900 mb-6 leading-tight">
          {post.title}
        </h1>

        <div className="flex items-center text-sm text-gray-500 mb-6">
          <div className="flex items-center mr-6">
            <FiCalendar className="mr-1.5" />
            <span>{formattedDate}</span>
          </div>
          <div className="flex items-center">
            <FiClock className="mr-1.5" />
            <span>{readTime} min read</span>
          </div>
        </div>
      </div>

      <div className="relative aspect-video w-full mb-10 rounded-xl overflow-hidden shadow-sm">
        <Image
          src={post.coverImage}
          alt={post.title}
          width={800}
          height={450}
          className="object-cover"
          priority
          quality={85}
          placeholder="blur"
          blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg=="
        />
      </div>

      <div className="prose prose-lg max-w-none text-gray-800">
        <Markdown>{post.content}</Markdown>
      </div>

      {post.tags?.length > 0 && (
        <div className="mt-16 pt-8 border-t border-gray-200">
          <h3 className="text-sm font-semibold text-gray-600 mb-4 tracking-widest">
            TAGS
          </h3>
          <div className="flex flex-wrap gap-2">
            {post.tags.map((tag) => (
              <span
                key={tag}
                className="px-4 py-1 bg-gray-100 text-gray-700 text-sm rounded-full border border-gray-300 hover:bg-gray-200"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      )}
    </article>
  );
}