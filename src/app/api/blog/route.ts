import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import BlogPostModel from '@/model/BlogPost';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/options';


// GET all blog posts (public with filters)
export async function GET(request: Request) {
  await dbConnect();

  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const tag = searchParams.get('tag');
    const published = searchParams.get('published');
    const limit = searchParams.get('limit');
    const featured = searchParams.get('featured');
    
    const query: Record<string, unknown> = {};
    
    // Public users only see published posts unless admin
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'admin') {
      query.published = true;
    } else if (published === 'false') {
      query.published = false;
    }
    
    if (category) query.category = category;
    if (tag) query.tags = tag;
    if (featured === 'true') query.featured = true;

    const postsQuery = BlogPostModel.find(query)
      .sort({ createdAt: -1 });
    
    if (limit && !isNaN(Number(limit))) {
      postsQuery.limit(Number(limit));
    }

    const posts = await postsQuery.exec();
    return NextResponse.json(posts);
  } catch (error) {
    console.error('Error fetching blog posts:', error);
    return NextResponse.json(
      { error: 'Failed to fetch blog posts' },
      { status: 500 }
    );
  }
}

// POST new blog post (admin only)
export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  
  if (!session || session.user.role !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  await dbConnect();

  try {
    const body = await request.json();
    
    // Validate required fields
    if (!body.title || !body.slug || !body.content || !body.coverImage) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Check for unique slug
    const existingPost = await BlogPostModel.findOne({ slug: body.slug });
    if (existingPost) {
      return NextResponse.json(
        { error: 'Blog post with this slug already exists' },
        { status: 400 }
      );
    }

    const newPost = await BlogPostModel.create({
      ...body,
      tags: body.tags || [],
      published: body.published !== false, // Default to true
      updatedAt: new Date()
    });

    return NextResponse.json(newPost, { status: 201 });
  } catch (error: any) {
    console.error('Error creating blog post:', error);
    return NextResponse.json(
      { 
        error: error.message || 'Failed to create blog post',
        ...(error.name === 'ValidationError' && { validationErrors: error.errors })
      },
      { status: 400 }
    );
  }
}