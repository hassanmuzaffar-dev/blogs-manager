"use client";

import { useState } from "react";
import Link from 'next/link';
import { ImageUploadField } from "@/components/ui/image-uploader";
import { Button } from "@/components/ui/button";

interface PostFormProps {
    action: (formData: FormData) => Promise<{ error?: string } | void | never>;
    initialData?: {
        title?: string;
        content?: string;
        image?: string;
    };
    submitLabel: string;
    cancelHref: string;
}

export function PostForm({ action, initialData, submitLabel, cancelHref }: PostFormProps) {
    const [image, setImage] = useState<File | string | null>(initialData?.image || null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!image) {
            setError("A cover image is required.");
            return;
        }

        setIsLoading(true);
        setError(null);

        const formData = new FormData(e.currentTarget);

        if (image instanceof File) {
            formData.set('image', image);
        } else if (typeof image === 'string') {
            formData.delete('image');
        }

        try {
            const result = await action(formData);

            if (result?.error) {
                setError(result.error);
                setIsLoading(false);
            }
            // Note: If successful, the server action will trigger a redirect() 
            // which throws a Next.js navigational error that will skip the lines below.
        } catch (err: any) {
            // Handle the Next.js RedirectError safely or standard JS errors
            if (err.message === 'NEXT_REDIRECT') {
                // Do not reset loading state because we are navigating away
                return;
            }
            console.error('Submission error:', err);
            setError(err.message || 'An unexpected error occurred.');
            setIsLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6 bg-card text-card-foreground p-6 rounded-lg border shadow-sm">
            {error && (
                <div className="p-3 bg-destructive/10 border-l-4 border-destructive text-destructive rounded-md text-sm">
                    {error}
                </div>
            )}

            <div className="space-y-2">
                <label htmlFor="title" className="text-sm font-medium leading-none">
                    Title
                </label>
                <input
                    id="title"
                    name="title"
                    required
                    defaultValue={initialData?.title}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    placeholder="e.g. My Awesome Blog Post"
                />
            </div>

            <div className="space-y-2">
                <label htmlFor="image" className="text-sm font-medium leading-none">
                    Cover Image
                </label>
                <ImageUploadField
                    name="image"
                    value={image}
                    onChange={setImage}
                    className="w-full aspect-video"
                    aspectRatio={16 / 9}
                />
                <p className="text-sm text-muted-foreground">Upload a cover image for your post.</p>
            </div>

            <div className="space-y-2">
                <label htmlFor="content" className="text-sm font-medium leading-none">
                    Content
                </label>
                <textarea
                    id="content"
                    name="content"
                    required
                    rows={8}
                    defaultValue={initialData?.content}
                    className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    placeholder="Write your content here..."
                />
            </div>

            <div className="flex items-center justify-end space-x-4 pt-4 border-t">
                <Link
                    href={cancelHref}
                    className="text-sm font-medium hover:underline text-muted-foreground"
                >
                    Cancel
                </Link>
                <Button
                    type="submit"
                    disabled={isLoading}
                    className="bg-primary text-primary-foreground px-4 py-2 rounded-md font-medium hover:bg-primary/90 transition cursor-pointer"
                >
                    {isLoading ? 'Saving...' : submitLabel}
                </Button>
            </div>
        </form>
    );
}
