"use server"

// @/lib/... ki jagah ../lib/... use karein taaki rasta sahi mil jaye
import { supabase } from '../lib/supabase'; 
import { revalidatePath } from 'next/cache';

export async function savePost(formData: FormData) {
  try {
    const title = formData.get('title') as string;
    const content = formData.get('content') as string;

    if (!title || !content) {
      throw new Error("Title and Content are required");
    }

    const slug = title
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');

    const { error } = await supabase
      .from('posts')
      .insert([{ title, content, slug }]);

    if (error) {
      console.error("Supabase Error:", error.message);
      return { success: false, error: error.message };
    }

    // ==========================================
    // CONFIRMATION MESSAGE (Bhai yahan dekho)
    // ==========================================
    console.log("✅ MUBARAK HO! Article Supabase mein save ho gaya hai.");
    console.log("Title:", title);

    revalidatePath('/blog'); 
    revalidatePath('/en/blog');
    
    return { success: true };
  } catch (err: any) {
    console.error("❌ Action Error:", err.message);
    return { success: false, error: err.message };
  }
}