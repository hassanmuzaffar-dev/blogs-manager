import { getPostById } from '@/lib/post'
import { notFound } from 'next/navigation'
import { PostForm } from '../../../../components/post-form'

export default async function EditPostPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params
    const postId = parseInt(id)
    if (isNaN(postId)) return notFound()

    const post = await getPostById(postId)
    if (!post) return notFound()

    return (
        <div className="container mx-auto py-10 max-w-2xl px-4">
            <div className="mb-8">
                <h1 className="text-3xl font-bold tracking-tight">Edit Post</h1>
                <p className="text-muted-foreground mt-2">Update the details of your blog post.</p>
            </div>

            <PostForm
                apiEndpoint={`/api/posts/${post.id}`}
                method="PUT"
                initialData={{
                    title: post.title,
                    image: post.image,
                    content: post.content
                }}
                submitLabel="Save Changes"
                cancelHref={`/posts/${post.id}`}
            />
        </div>
    )
}
