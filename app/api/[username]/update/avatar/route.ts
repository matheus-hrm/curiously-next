import { prisma } from "@/prisma/prisma";
import { NextRequest, NextResponse } from "next/server";
import { v2 as cloudinary } from 'cloudinary'


type CloudinaryResponse = {
    url: string;
    [key: string]: any;
}

export async function POST(
    req: NextRequest,
    { params }: { params: Promise<{ username: string }> }
) {
    try {
        cloudinary.config({
            cloud_name: process.env.CLOUDINARY_NAME,
            api_key: process.env.CLOUDINARY_API_KEY,
            api_secret: process.env.CLOUDINARY_API_SECRET
        })


        const fileData = await req.formData();
        const file = fileData.get('file') as File;
        const username = (await params).username;
        if (!file) {
            throw new Error('No file selected');
        }

        const buffer = Buffer.from(await file.arrayBuffer());
        const response = await new Promise<CloudinaryResponse>(
            (resolve,reject) => {
                const stream = cloudinary.uploader.upload_stream(
                    {
                        folder: 'curiously-profilePictures',
                        resource_type: 'image',
                        transformation: { width: 200, height: 200, crop: 'fill'}
                    },
                    (error, result) => {
                        if (result) resolve(result as CloudinaryResponse | any);
                        else reject(error);
                        }
                );
                stream.end(buffer);
            }
        );
        if (!response) {
            throw new Error('Failed to upload image');
        }

        const user = await prisma.user.findUnique({
            where: { username }
        });
        user && await prisma.user.update({
            where: { username },
            data: { profilePicture: response.url }
        });


        return NextResponse.json({ 
            status: 200,
            message: "Image uploaded successfully",
        }
        )
    } catch (error) {
        console.error('Error uploading image', error);
        return NextResponse.json(
            { error: 'Failed to upload image' },
            { status: 500 }
        );
    }
}