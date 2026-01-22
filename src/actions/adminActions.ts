'use server'

import fs from 'fs/promises';
import path from 'path';
import { revalidatePath } from 'next/cache';

// Path define kiya (Correct Location)
const filePath = path.join(process.cwd(), 'src/data/posts.json');
const uploadDir = path.join(process.cwd(), 'public/uploads');

// 1. SAVE POST ACTION (Create New)
export async function savePostAction(formData: FormData) {
  try {
    // File padhna
    let posts = [];
    try {
      const fileData = await fs.readFile(filePath, 'utf8');
      posts = JSON.parse(fileData);
    } catch (err) {
      // Agar file nahi mili to khali array rakho
      posts = [];
    }

    const title = formData.get('title') as string;
    const tags = formData.get('tags') as string;
    const content = formData.get('content') as string;
    const bannerFile = formData.get('banner') as File;

    let bannerUrl = "https://placehold.co/600x400/e2e8f0/1e293b?text=Article"; // Default Professional Image

    // Image Upload Logic (Folder check karega, nahi hoga to banayega)
    if (bannerFile && bannerFile.size > 0) {
      const buffer = Buffer.from(await bannerFile.arrayBuffer());
      const fileName = `${Date.now()}-${bannerFile.name.replaceAll(" ", "_")}`;
      
      // Upload folder banao agar nahi hai
      await fs.mkdir(uploadDir, { recursive: true });
      
      // Image save karo
      await fs.writeFile(path.join(uploadDir, fileName), buffer);
      bannerUrl = `/uploads/${fileName}`;
    }

    // Naya Post Object
    const newPost = {
      slug: title.toLowerCase().trim().replace(/[^\w\s-]/g, '').replace(/[\s_-]+/g, '-'),
      title,
      tags: tags ? tags.split(',').map(t => t.trim()) : ["General"],
      image: bannerUrl,
      content,
      date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
      comments: []
    };

    posts.push(newPost);
    await fs.writeFile(filePath, JSON.stringify(posts, null, 2));
    
    // Refresh pages
    revalidatePath('/[locale]/blog');
    revalidatePath('/[locale]/admin');
    
    return { success: true };
  } catch (e) {
    console.error("Save Error:", e);
    return { success: false };
  }
}

// 2. DELETE POST ACTION (Delete Logic Fixed)
export async function deletePostAction(slug: string) {
  try {
    const fileData = await fs.readFile(filePath, 'utf8');
    let posts = JSON.parse(fileData);

    // Image bhi delete karne ka try karein (Optional, par achha rehta hai)
    const postToDelete = posts.find((p: any) => p.slug === slug);
    if (postToDelete && postToDelete.image && postToDelete.image.startsWith('/uploads/')) {
        try {
            const imagePath = path.join(process.cwd(), 'public', postToDelete.image);
            await fs.unlink(imagePath); // Delete image file
        } catch (err) {
            console.log("Image delete nahi hui, koi baat nahi.");
        }
    }

    // List se post hatao
    const newPosts = posts.filter((p: any) => p.slug !== slug);
    
    // Nayi list save karo
    await fs.writeFile(filePath, JSON.stringify(newPosts, null, 2));
    
    // Cache clear karo taaki button turant kaam kare
    revalidatePath('/[locale]/blog');
    revalidatePath('/[locale]/admin');
    
    return { success: true };
  } catch (e) {
    console.error("Delete Error:", e);
    return { success: false };
  }
}