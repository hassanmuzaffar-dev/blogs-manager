import cloudinary from './cloudinary';

export async function uploadImageToCloudinary(file: File): Promise<string> {
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    return new Promise<string>((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
            { folder: 'blog_images' },
            (error, result) => {
                if (error) return reject(error);
                resolve(result?.secure_url as string);
            }
        );
        stream.end(buffer);
    });
}
