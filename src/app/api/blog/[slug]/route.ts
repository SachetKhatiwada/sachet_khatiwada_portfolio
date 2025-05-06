import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import BlogPostModel from '@/model/BlogPost';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/options';

// GET single blog post by slug (public)
export async function GET(
  request: Request,
  { params }: { params: { slug: string } }
) {
  await dbConnect();

  try {
    const query: { slug: string; published?: boolean } = { 
      slug: params.slug 
    };
    
    // Non-admin users only see published posts
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'admin') {
      query.published = true;
    }

    const post = await BlogPostModel.findOne(query);
    if (!post) {
      return NextResponse.json(
        { error: 'Blog post not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(post);
  } catch (error) {
    console.error('Error fetching blog post:', error);
    return NextResponse.json(
      { error: 'Failed to fetch blog post' },
      { status: 500 }
    );
  }
}

// PUT update blog post (admin only)
export async function PUT(
  request: Request,
  { params }: { params: { slug: string } }
) {
  const session = await getServerSession(authOptions);
  
  if (!session || session.user.role !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  await dbConnect();

  try {
    const body = await request.json();
    
    // Prevent slug changes through API
    if (body.slug && body.slug !== params.slug) {
      return NextResponse.json(
        { error: 'Cannot change post slug' },
        { status: 400 }
      );
    }

    const updatedPost = await BlogPostModel.findOneAndUpdate(
      { slug: params.slug },
      {
        ...body,
        updatedAt: new Date()
      },
      { new: true, runValidators: true }
    );

    if (!updatedPost) {
      return NextResponse.json(
        { error: 'Blog post not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(updatedPost);
  } catch (error: any) {
    console.error('Error updating blog post:', error);
    return NextResponse.json(
      { 
        error: error.message || 'Failed to update blog post',
        ...(error.name === 'ValidationError' && { validationErrors: error.errors })
      },
      { status: 400 }
    );
  }
}

// DELETE blog post (admin only)
export async function DELETE(
  request: Request,
  { params }: { params: { slug: string } }
) {
  const session = await getServerSession(authOptions);
  
  if (!session || session.user.role !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  await dbConnect();

  try {
    const deletedPost = await BlogPostModel.findOneAndDelete({ 
      slug: params.slug 
    });
    
    if (!deletedPost) {
      return NextResponse.json(
        { error: 'Blog post not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: 'Blog post deleted successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error deleting blog post:', error);
    return NextResponse.json(
      { error: 'Failed to delete blog post' },
      { status: 500 }
    );
  }
}