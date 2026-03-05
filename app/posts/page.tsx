import Link from 'next/link'
import Image from 'next/image'
import { getPosts } from '@/app/actions/post'
import { PostActions } from '../../components/post-actions'

export default async function PostsPage() {
    const posts = await getPosts()

    return (
        <div className="container mx-auto py-10 max-w-4xl px-4">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-4xl font-extrabold tracking-tight">Blogs</h1>
                <Link
                    href="/posts/create"
                    className="bg-primary text-primary-foreground px-4 py-2 rounded-md font-medium hover:bg-primary/90 transition"
                >
                    Create Post
                </Link>
            </div>

            {posts.length === 0 ? (
                <div className="text-center py-20 border rounded-lg bg-muted/20">
                    <p className="text-muted-foreground">No posts yet. Create your first blog post!</p>
                </div>
            ) : (
                <div className="grid gap-6 md:grid-cols-2">
                    {posts.map((post: { id: number, title: string, content: string, image: string, createdAt: Date }) => (
                        <div key={post.id} className="border rounded-lg overflow-hidden flex flex-col bg-card text-card-foreground shadow-sm hover:shadow-md transition">
                            {post.image && (
                                <div className="relative w-full h-48 bg-muted">
                                    <Image
                                        src={post.image.startsWith('http') ? post.image : (post.image.startsWith('/') ? post.image : `/images/${post.image}`)}
                                        alt={post.title}
                                        fill
                                        className="object-cover"
                                    />
                                </div>
                            )}
                            <div className="p-6 flex flex-col flex-grow">
                                <h2 className="text-2xl font-bold mb-2 line-clamp-1">{post.title}</h2>
                                <p className="text-muted-foreground mb-4 line-clamp-3 flex-grow">{post.content}</p>

                                <div className="flex justify-between items-center mt-4 pt-4 border-t">
                                    <Link
                                        href={`/posts/${post.id}`}
                                        className="text-primary hover:underline font-medium text-sm"
                                    >
                                        Read more
                                    </Link>
                                    <div className="flex space-x-2">
                                        <PostActions postId={post.id} />
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}
