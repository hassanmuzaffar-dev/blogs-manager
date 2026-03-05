'use server'

import prisma from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { uploadImageToCloudinary } from '@/lib/upload'

export async function getPosts() {
    return prisma.post.findMany({
        orderBy: { createdAt: 'desc' },
    })
}

export async function getPostById(id: number) {
    return prisma.post.findUnique({
        where: { id },
    })
}

export async function createPost(formData: FormData) {
    const title = formData.get('title') as string
    const content = formData.get('content') as string
    const imageFile = formData.get('image') as File | null

    if (!title || !content || !imageFile) {
        return { error: 'Missing required fields' }
    }

    try {
        const imageUrl = await uploadImageToCloudinary(imageFile)

        await prisma.post.create({
            data: {
                title,
                content,
                image: imageUrl,
            },
        })
    } catch (e: any) {
        return { error: e.message || 'Failed to create post' }
    }

    revalidatePath('/posts')
    redirect('/posts')
}

export async function updatePost(id: number, formData: FormData) {
    const title = formData.get('title') as string
    const content = formData.get('content') as string
    const imageFile = formData.get('image') as File | null

    if (!title || !content) {
        return { error: 'Missing required fields' }
    }

    try {
        let imageUrl: string | undefined

        if (imageFile && imageFile.size > 0) {
            imageUrl = await uploadImageToCloudinary(imageFile)
        }

        const dataToUpdate: any = { title, content }
        if (imageUrl) {
            dataToUpdate.image = imageUrl
        }

        await prisma.post.update({
            where: { id },
            data: dataToUpdate,
        })
    } catch (e: any) {
        return { error: e.message || 'Failed to update post' }
    }

    revalidatePath('/posts')
    revalidatePath(`/posts/${id}`)
    redirect(`/posts/${id}`)
}

export async function deletePost(id: number) {
    try {
        await prisma.post.delete({
            where: { id },
        })
    } catch (e: any) {
        return { error: e.message || 'Failed to delete post' }
    }

    revalidatePath('/posts')
    redirect('/posts')
}
