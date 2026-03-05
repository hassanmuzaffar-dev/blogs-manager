import { createPost } from '@/app/actions/post'
import { PostForm } from '../../../components/post-form'

export default function CreatePostPage() {
    return (
        <div className="container mx-auto py-10 max-w-2xl px-4">
            <div className="mb-8">
                <h1 className="text-3xl font-bold tracking-tight">Create New Post</h1>
                <p className="text-muted-foreground mt-2">Write down your thoughts and share them.</p>
            </div>

            <PostForm
                action={createPost}
                submitLabel="Create Post"
                cancelHref="/posts"
            />
        </div>
    )
}
