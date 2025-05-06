import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import ProjectModel from '@/model/Project';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/options';

export async function GET(request: Request) {
  await dbConnect();
  
  // Get query parameters
  const { searchParams } = new URL(request.url);
  const featured = searchParams.get('featured');
  
  let query: { featured?: boolean } = {};
  if (featured === 'true') {
    query.featured = true;
  }
  
  try {
    const projects = await ProjectModel.find(query).sort({ createdAt: -1 });
    return NextResponse.json(projects);
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  
  // Check if user is authenticated and is admin
  if (!session || session.user.role !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  
  await dbConnect();
  
  try {
    const body = await request.json();
    const newProject = await ProjectModel.create(body);
    return NextResponse.json(newProject, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}