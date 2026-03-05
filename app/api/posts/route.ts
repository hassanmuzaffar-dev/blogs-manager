import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { uploadImageToCloudinary } from '@/lib/upload';

export async function POST(request: Request) {
    try {
        const formData = await request.formData();

        const title = formData.get('title') as string;
        const content = formData.get('content') as string;
        const imageFile = formData.get('image') as File | null;

        if (!title || !content) {
            return NextResponse.json(
                { error: 'Title and content are required' },
                { status: 400 }
            );
        }

        let image = '';
        if (imageFile && imageFile.size > 0) {
            image = await uploadImageToCloudinary(imageFile);
        }

        const post = await prisma.post.create({
            data: {
                title,
                content,
                image,
            },
        });

        return NextResponse.json({ post }, { status: 201 });
    } catch (error) {
        console.error('Error creating post:', error);
        return NextResponse.json(
            { error: 'Failed to create post' },
            { status: 500 }
        );
    }
}
