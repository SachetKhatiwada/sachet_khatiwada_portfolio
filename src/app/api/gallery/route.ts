import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import GalleryItemModel from '@/model/GalleryItem';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/options';


// GET all gallery items (public)
export async function GET(request: Request) {
  await dbConnect();

  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const featured = searchParams.get('featured');
    
    const query: { category?: string; featured?: boolean } = {};
    
    if (category) query.category = category;
    if (featured === 'true') query.featured = true;

    const galleryItems = await GalleryItemModel.find(query)
      .sort({ createdAt: -1 });
      
    return NextResponse.json(galleryItems);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch gallery items' },
      { status: 500 }
    );
  }
}

// POST new gallery item (admin only)
export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  
  if (!session || session.user.role !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  await dbConnect();

  try {
    const body = await request.json();
    
    // Basic validation
    if (!body.title || !body.imageUrl) {
      return NextResponse.json(
        { error: 'Title and image URL are required' },
        { status: 400 }
      );
    }

    const newItem = await GalleryItemModel.create(body);
    return NextResponse.json(newItem, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to create gallery item' },
      { status: 400 }
    );
  }
}