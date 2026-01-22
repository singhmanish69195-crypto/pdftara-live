'use server'
import fs from 'fs/promises';
import path from 'path';
import { revalidatePath } from 'next/cache';

export async function addCommentAction(slug: string, commentText: string) {
  try {
    const filePath = path.join(process.cwd(), 'src/data/posts.json');
    const fileData = await fs.readFile(filePath, 'utf8');
    const posts = JSON.parse(fileData);

    const postIndex = posts.findIndex((p: any) => p.slug === slug);
    if (postIndex === -1) return { success: false };

    const newComment = {
      text: commentText,
      date: new Date().toLocaleString(),
      user: "Guest User"
    };

    if (!posts[postIndex].comments) posts[postIndex].comments = [];
    posts[postIndex].comments.push(newComment);

    await fs.writeFile(filePath, JSON.stringify(posts, null, 2));
    
    // Page ko refresh karne ke liye taaki naya comment turant dikhe
    revalidatePath(`/en/blog/${slug}`);
    return { success: true };
  } catch (error) {
    console.error("Error saving comment:", error);
    return { success: false };
  }
}