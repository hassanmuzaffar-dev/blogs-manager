import prisma from '@/lib/prisma'

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

