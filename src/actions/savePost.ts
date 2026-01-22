'use server'
import fs from 'fs/promises';
import path from 'path';
import { revalidatePath } from 'next/cache';

const filePath = path.join(process.cwd(), 'src/data/posts.json');
const uploadDir = path.join(process.cwd(), 'public/uploads');

// 1. Image Upload + Post Save Action
export async function savePostAction(formData: FormData) {
  try {
    // Pehle purana data lo
    const fileData = await fs.readFile(filePath, 'utf8');
    const posts = JSON.parse(fileData);

    const title = formData.get('title') as string;
    const content = formData.get('content') as string;
    const tags = formData.get('tags') as string;
    const bannerFile = formData.get('banner') as File;

    let bannerUrl = "/placeholder-banner.jpg";

    // Agar image upload ki hai toh use public/uploads me save karo
    if (bannerFile && bannerFile.size > 0) {
      const buffer = Buffer.from(await bannerFile.arrayBuffer());
      const fileName = Date.now() + "-" + bannerFile.name.replaceAll(" ", "_");
      
      // Folder check karo, nahi hai toh banao
      await fs.mkdir(uploadDir, { recursive: true });
      await fs.writeFile(path.join(uploadDir, fileName), buffer);
      bannerUrl = `/uploads/${fileName}`;
    }

    const newPost = {
      slug: title.toLowerCase().trim().replace(/[^\w\s-]/g, '').replace(/[\s_-]+/g, '-'),
      title,
      tags: tags.split(','),
      image: bannerUrl,
      content,
      date: new Date().toLocaleDateString(),
      comments: []
    };

    posts.push(newPost);
    await fs.writeFile(filePath, JSON.stringify(posts, null, 2));
    
    revalidatePath('/en/blog');
    return { success: true };
  } catch (e) {
    return { success: false };
  }
}

// 2. Delete Post Action
export async function deletePostAction(slug: string) {
  try {
    const fileData = await fs.readFile(filePath, 'utf8');
    let posts = JSON.parse(fileData);
    
    posts = posts.filter((p: any) => p.slug !== slug);
    
    await fs.writeFile(filePath, JSON.stringify(posts, null, 2));
    revalidatePath('/en/admin');
    revalidatePath('/en/blog');
    return { success: true };
  } catch (e) {
    return { success: false };
  }
}