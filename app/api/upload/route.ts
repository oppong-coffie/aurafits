import { NextResponse } from 'next/server';
import { supabaseServer } from '@/app/lib/supabase';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      return NextResponse.json(
        { success: false, message: 'No file uploaded.' },
        { status: 400 }
      );
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    
    // Create unique filename
    const fileExt = file.name.split('.').pop() || 'jpg';
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 8)}.${fileExt}`;
    const filePath = `products/${fileName}`;

    // Upload to Supabase Storage bucket 'uploads'
    const { data, error } = await supabaseServer.storage
      .from('uploads')
      .upload(filePath, buffer, {
        contentType: file.type || 'image/jpeg',
        duplex: 'half'
      });

    if (error) {
      console.error('Supabase upload error:', error);
      return NextResponse.json(
        { success: false, message: error.message },
        { status: 500 }
      );
    }

    // Get public URL
    const { data: publicUrlData } = supabaseServer.storage
      .from('uploads')
      .getPublicUrl(filePath);

    return NextResponse.json({
      success: true,
      url: publicUrlData.publicUrl
    });
  } catch (error: any) {
    console.error('Upload endpoint error:', error);
    return NextResponse.json(
      { success: false, message: 'Upload failed: ' + error.message },
      { status: 500 }
    );
  }
}
