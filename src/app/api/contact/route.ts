import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import ContactModel from '@/model/Contact';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/options';


// GET all contacts (for admin)
export async function GET(request: Request) {
  await dbConnect();
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const read = searchParams.get('read'); // Filter by read status
    
    const query: { read?: boolean } = {};
    if (read === 'true' || read === 'false') {
      query.read = read === 'true';
    }

    const contacts = await ContactModel.find(query).sort({ createdAt: -1 });
    return NextResponse.json(contacts);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch contacts' },
      { status: 500 }
    );
  }
}

// POST new contact message (public)
export async function POST(request: Request) {
  await dbConnect();

  try {
    const body = await request.json();
    const newContact = await ContactModel.create(body);
    return NextResponse.json(newContact, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to create contact' },
      { status: 400 }
    );
  }
}