"use server"

import { supabase } from '../lib/supabase';
import { revalidatePath } from 'next/cache';

export async function addCommentAction(slug: string, commentText: string) {
  try {
    // 1. Pehle us post ko dhundo jisme comment karna hai
    const { data: post, error: fetchError } = await supabase
      .from('posts')
      .select('comments')
      .eq('slug', slug)
      .single();

    if (fetchError || !post) {
      console.error("Post nahi mili:", fetchError);
      return { success: false };
    }

    // 2. Naya comment taiyaar karo
    const newComment = {
      text: commentText,
      date: new Date().toLocaleString(),
      user: "Guest User"
    };

    // 3. Purane comments mein naya comment jodo
    const existingComments = post.comments || [];
    const updatedComments = [...existingComments, newComment];

    // 4. Supabase mein update kar do
    const { error: updateError } = await supabase
      .from('posts')
      .update({ comments: updatedComments })
      .eq('slug', slug);

    if (updateError) {
      console.error("Comment save karne mein galti:", updateError.message);
      return { success: false };
    }

    console.log(`✅ Comment added successfully on post: ${slug}`);

    // Page refresh karo taaki naya comment dikhe
    revalidatePath(`/en/blog/${slug}`);
    revalidatePath(`/blog/${slug}`);
    
    return { success: true };
  } catch (error) {
    console.error("Error saving comment:", error);
    return { success: false };
  }
}