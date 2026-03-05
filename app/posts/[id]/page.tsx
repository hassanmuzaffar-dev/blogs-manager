import { getPostById } from '@/app/actions/post'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { PostActions } from '../../../components/post-actions'

export default async function PostDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params
    const postId = parseInt(id)
    if (isNaN(postId)) return notFound()

    const post = await getPostById(postId)
    if (!post) return notFound()

    return (
        <div className="container mx-auto py-10 max-w-3xl px-4">
            <div className="flex items-center justify-between mb-6">
                <Link href="/posts" className="text-muted-foreground hover:text-foreground transition inline-block">
                    &larr; Back to all posts
                </Link>

                <PostActions postId={post.id} />
            </div>

            <div className="bg-card text-card-foreground rounded-lg overflow-hidden border shadow-sm">
                {post.image && (
                    <div className="relative w-full h-80 bg-muted">
                        <Image
                            src={post.image.startsWith('http') ? post.image : (post.image.startsWith('/') ? post.image : `/images/${post.image}`)}
                            alt={post.title}
                            fill
                            className="object-cover"
                            priority
                        />
                    </div>
                )}

                <div className="p-8">
                    <h1 className="text-4xl font-extrabold tracking-tight mb-4">{post.title}</h1>
                    <p className="text-sm text-muted-foreground mb-8">
                        Published on {new Date(post.createdAt).toLocaleDateString()}
                    </p>

                    <div className="prose dark:prose-invert max-w-none">
                        {post.content.split('\n').map((paragraph: string, index: number) => (
                            <p key={index} className="mb-4 text-lg leading-relaxed">{paragraph}</p>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}
