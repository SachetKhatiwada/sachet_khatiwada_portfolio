import { NextResponse } from 'next/server';
import { writeFile } from 'fs/promises';
import path from 'path';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/options';

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  //  || session.user.role !== 'admin'
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }
    
    const buffer = Buffer.from(await file.arrayBuffer());
    const filename = Date.now() + '-' + file.name.replaceAll(' ', '_');
    
    const type = formData.get('type') || 'gallery';
    let uploadDir: string;
    
    switch (type) {
      case 'project':
        uploadDir = path.join(process.cwd(), 'public/images/projects');
        break;
      case 'blog':
        uploadDir = path.join(process.cwd(), 'public/images/blog');
        break;
      default:
        uploadDir = path.join(process.cwd(), 'public/images/gallery');
    }
    
    const filePath = path.join(uploadDir, filename);
    
    await writeFile(filePath, buffer);
    
    return NextResponse.json({ 
      message: 'File uploaded successfully',
      url: `/images/${type}/${filename}`
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}