import { prisma } from '@/prisma/prisma';
import { NextRequest, NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';
import { auth } from '@/lib/auth';

type CloudinaryResponse = {
  url: string;
  [key: string]: string;
};

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ username: string }> },
) {
  const username = (await params).username;

  const session = await auth();
  if (session == null) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
  }

  const user = session.user as { username: string };
  console.log(user.username, username);
  if (user.username !== username) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
  }
  try {
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });

    const fileData = await req.formData();
    const file = fileData.get('file') as File;
    if (!file) {
      throw new Error('No file selected');
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const response = await new Promise<CloudinaryResponse>(
      (resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          {
            folder: 'curiously-profilePictures',
            resource_type: 'image',
            transformation: { width: 200, height: 200, crop: 'fill' },
          },
          (error, result) => {
            if (result) resolve(result as CloudinaryResponse);
            else reject(error);
          },
        );
        stream.end(buffer);
      },
    );
    if (!response) {
      throw new Error('Failed to upload image');
    }

    const user = await prisma.user.findUnique({
      where: { username },
    });
    if (user) {
      await prisma.user.update({
        where: { username },
        data: { profilePicture: response.url },
      });
    }

    return NextResponse.json({
      status: 200,
      message: 'Image uploaded successfully',
    });
  } catch (error) {
    console.error('Error uploading image', error);
    return NextResponse.json(
      { error: 'Failed to upload image' },
      { status: 500 },
    );
  }
}
