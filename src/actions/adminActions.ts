"use server"

import { supabase } from '../lib/supabase';
import { revalidatePath } from 'next/cache';

// 1. SAVE POST ACTION (Supabase Version)
export async function savePostAction(formData: FormData) {
  try {
    const title = formData.get('title') as string;
    const tags = formData.get('tags') as string;
    const content = formData.get('content') as string;
    const bannerFile = formData.get('banner') as File;

    let bannerUrl = "https://placehold.co/600x400/e2e8f0/1e293b?text=Article"; // Default

    // --- IMAGE UPLOAD TO SUPABASE STORAGE ---
    if (bannerFile && bannerFile.size > 0) {
      const fileName = `${Date.now()}-${bannerFile.name.replaceAll(" ", "_")}`;
      
      // Supabase Storage (banners bucket) mein upload karein
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('banners')
        .upload(fileName, bannerFile);

      if (uploadError) {
        console.error("Image Upload Error:", uploadError.message);
      } else {
        // Public URL nikaalein
        const { data: publicUrlData } = supabase.storage
          .from('banners')
          .getPublicUrl(fileName);
        
        bannerUrl = publicUrlData.publicUrl;
      }
    }

    // Slug taiyaar karein
    const slug = title
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');

    // Naya Post Object jo Supabase Table mein jayega
    const newPost = {
      slug,
      title,
      tags: tags ? tags.split(',').map(t => t.trim()) : ["General"],
      image: bannerUrl,
      content,
      date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
      comments: [] // JSON format mein save hoga
    };

    // Supabase mein insert karein
    const { error: dbError } = await supabase
      .from('posts')
      .insert([newPost]);

    if (dbError) {
      console.error("Database Insert Error:", dbError.message);
      return { success: false, error: dbError.message };
    }
    
    console.log("✅ Article saved successfully in Supabase!");

    // Refresh pages
    revalidatePath('/blog');
    revalidatePath('/en/blog');
    revalidatePath('/admin');
    
    return { success: true };
  } catch (e: any) {
    console.error("Save Error:", e.message);
    return { success: false };
  }
}

// 2. DELETE POST ACTION (Supabase Version)
export async function deletePostAction(slug: string) {
  try {
    // A. Pehle post ka data nikaalein taaki image path mil sake
    const { data: post, error: fetchError } = await supabase
      .from('posts')
      .select('image')
      .eq('slug', slug)
      .single();

    if (fetchError) throw fetchError;

    // B. Supabase Storage se image delete karein (agar default nahi hai)
    if (post && post.image && post.image.includes('banners/')) {
        const fileName = post.image.split('/').pop(); // URL se filename nikaalein
        if (fileName) {
            await supabase.storage.from('banners').remove([fileName]);
            console.log("🗑️ Image deleted from storage");
        }
    }

    // C. Table se row delete karein
    const { error: deleteError } = await supabase
      .from('posts')
      .delete()
      .eq('slug', slug);

    if (deleteError) {
      console.error("Delete Error:", deleteError.message);
      return { success: false };
    }
    
    console.log(`✅ Article deleted successfully: ${slug}`);

    // Cache clear karein
    revalidatePath('/blog');
    revalidatePath('/en/blog');
    revalidatePath('/admin');
    
    return { success: true };
  } catch (e: any) {
    console.error("Delete Error:", e.message);
    return { success: false };
  }
}