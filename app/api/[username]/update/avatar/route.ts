import { prisma } from "@/prisma/prisma";
import { NextRequest, NextResponse } from "next/server";

const webhookUrl = process.env.DISCORD_WEBHOOK_URL;
if (!webhookUrl) {
    throw new Error('Discord webhook URL not provided');
}

export async function POST(
    req: NextRequest,
    { params }: { params: Promise<{ username: string }> }
) {
    try {
        
        const fileData = await req.formData();
        const file = fileData.get('file') as File;
        const username = (await params).username;
        if (!file) {
            throw new Error('No file selected');
        }

        const buffer = Buffer.from(await file.arrayBuffer());
        const blob = new Blob([buffer], { type: file.type });
        const form = new FormData();
        form.append('file', blob, file.name);

        const response = await fetch(webhookUrl!, {
            method: 'POST',
            body: form,
        })

        if (!response.ok) {
            throw new Error('Failed to upload image');
        }

        const data = await response.json();
        const imageUrl = data.attachments[0].url;
        
        const success = await prisma.user.update({
            where: {
                username: username 
            },
            data: {
                profilePicture: imageUrl
            }
        });
        if (!success) {
            throw new Error('Failed to update profile picture');
        }

        return NextResponse.json(
            { status: 200 }
        );
    } catch (error) {
        console.error('Error uploading image', error);
        return NextResponse.json(
            { error: 'Failed to upload image' },
            { status: 500 }
        );
    }
}