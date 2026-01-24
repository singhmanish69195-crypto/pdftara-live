"use client";
import { useState, useRef, useEffect } from "react";
import { savePostAction, deletePostAction } from "@/actions/adminActions";
import { supabase } from "@/lib/supabase"; // JSON ki jagah Supabase import kiya

export default function PDFTaraAdmin() {
  const [loading, setLoading] = useState(false);
  const [tab, setTab] = useState("editor"); 
  const [preview, setPreview] = useState<string | null>(null);
  const [posts, setPosts] = useState<any[]>([]); // Dynamic posts state
  const editorRef = useRef<HTMLDivElement>(null);

  // 1. Supabase se Articles fetch karne ke liye
  const fetchPosts = async () => {
    const { data } = await supabase.from('posts').select('*').order('created_at', { ascending: false });
    if (data) setPosts(data);
  };

  useEffect(() => {
    fetchPosts();
  }, [tab]); // Jab bhi tab badle, data refresh ho

  const execCommand = (command: string, value: string = "") => {
    document.execCommand(command, false, value);
    editorRef.current?.focus();
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleDelete = async (slug: string) => {
    if(confirm("Bhai, kya is article ko hamesha ke liye uda dein?")) {
      setLoading(true);
      const res = await deletePostAction(slug);
      if(res.success) {
        alert("🗑️ Article Deleted!");
        fetchPosts(); // List refresh karein
      }
      setLoading(false);
    }
  };

  const handlePublish = async (e: any) => {
    e.preventDefault();
    const finalContent = editorRef.current?.innerHTML || "";
    if (finalContent === "") return alert("Content likho bhai!");

    setLoading(true);
    const formData = new FormData(e.target);
    formData.append("content", finalContent);

    const result = await savePostAction(formData);
    if (result.success) {
      alert("🚀 Article Published Successfully!");
      setTab("all-posts"); // Seeda manage tab par bhej do
      fetchPosts();
    } else {
      alert("Error: " + result.error);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-800 font-sans">
      <style jsx>{`.editor:empty:before { content: "Start writing or paste from Google Docs..."; color: #cbd5e1; }`}</style>

      <header className="bg-white border-b sticky top-0 z-50 px-8 py-3 flex justify-between items-center shadow-sm">
        <div className="flex items-center gap-4">
          <div className="bg-blue-600 p-2 rounded-lg text-white font-black">PC</div>
          <h1 className="font-bold text-blue-900 uppercase tracking-tighter text-xl">PDFTara Admin</h1>
        </div>
        <div className="flex gap-4">
          <button onClick={() => setTab('editor')} className={`font-bold transition ${tab === 'editor' ? 'text-blue-600' : 'text-slate-400'}`}>Editor</button>
          <button onClick={() => setTab('all-posts')} className={`font-bold transition ${tab === 'all-posts' ? 'text-blue-600' : 'text-slate-400'}`}>Manage ({posts.length})</button>
        </div>
      </header>

      <main className="max-w-[1400px] mx-auto p-6">
        {tab === 'editor' ? (
          <form onSubmit={handlePublish} className="flex flex-col lg:flex-row gap-8 text-left">
            <div className="flex-1 space-y-4">
              <input name="title" required type="text" placeholder="Title" className="w-full text-5xl font-black p-4 bg-transparent border-b-4 border-slate-200 focus:border-blue-500 outline-none transition-all" />
              
              <div className="bg-white border-2 border-slate-100 rounded-2xl p-3 flex gap-4 text-slate-600 shadow-sm sticky top-[80px] z-40">
                <button type="button" onClick={()=>execCommand('bold')} className="font-bold hover:bg-slate-100 px-3 py-1 rounded">B</button>
                <button type="button" onClick={()=>execCommand('formatBlock', 'H2')} className="font-black hover:bg-slate-100 px-3 py-1 rounded underline">H2</button>
                <button type="button" onClick={()=>{const url = prompt("Link:"); if(url) execCommand('createLink', url)}} className="text-blue-500 font-bold hover:bg-slate-100 px-3 py-1 rounded">Link</button>
              </div>

              <div ref={editorRef} contentEditable suppressContentEditableWarning className="editor w-full p-10 bg-white border-2 border-slate-100 rounded-[2.5rem] shadow-sm outline-none text-xl leading-relaxed font-serif min-h-[600px] prose prose-xl max-w-none focus:shadow-xl transition-all"></div>
            </div>

            <aside className="w-full lg:w-96 space-y-6">
              <div className="bg-white p-8 rounded-[2.5rem] border shadow-sm sticky top-[80px]">
                <h4 className="font-black text-slate-400 uppercase text-xs tracking-widest mb-6 text-center">Post Settings</h4>
                <div className="space-y-8">
                  <div>
                    <label className="text-[10px] font-black text-blue-600 uppercase tracking-widest">Labels (Tags)</label>
                    <input name="tags" type="text" className="w-full mt-2 border-b-2 py-2 outline-none focus:border-blue-500 font-medium" placeholder="PDF, Tutorial, Tech..." />
                  </div>
                  <div>
                    <label className="text-[10px] font-black text-blue-600 uppercase tracking-widest mb-4 block">Cover Banner</label>
                    <label className="relative group cursor-pointer border-4 border-dashed border-slate-100 rounded-[2rem] h-56 flex flex-col items-center justify-center overflow-hidden hover:border-blue-200 transition-all bg-slate-50/50">
                      {preview ? <img src={preview} className="w-full h-full object-cover" alt="Preview" /> : (
                        <div className="text-center">
                          <svg className="w-12 h-12 text-slate-300 mx-auto mb-2 group-hover:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path></svg>
                          <p className="text-[10px] font-black text-slate-400 uppercase">Upload Image</p>
                        </div>
                      )}
                      <input name="banner" type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
                    </label>
                  </div>
                </div>
                <button type="submit" disabled={loading} className="w-full mt-10 bg-[#f8901c] hover:bg-[#e67e17] text-white py-4 rounded-full font-black shadow-lg transition active:scale-95 disabled:bg-slate-300">
                  {loading ? "PROCESSING..." : "PUBLISH ARTICLE"}
                </button>
              </div>
            </aside>
          </form>
        ) : (
          <div className="bg-white p-10 rounded-[2.5rem] shadow-sm border space-y-4 min-h-[600px]">
            <h2 className="text-3xl font-black text-[#0f172a] mb-10 underline decoration-blue-600 decoration-4 underline-offset-8">Manage Articles</h2>
            {posts.length === 0 ? <p className="text-slate-400 font-bold">No articles found in Supabase.</p> : 
             posts.map((post: any) => (
              <div key={post.slug} className="flex flex-col sm:flex-row justify-between items-center p-6 bg-slate-50/50 rounded-3xl border border-slate-100 hover:bg-white transition-all group gap-4">
                <div className="flex items-center gap-4">
                  <img src={post.image} className="w-20 h-14 object-cover rounded-xl shadow-sm" alt="thumb" />
                  <div>
                    <h4 className="font-black text-lg text-slate-800 leading-tight">{post.title}</h4>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">📅 {post.date}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => window.open(`/en/blog/${post.slug}`)} className="bg-white text-slate-600 px-6 py-2 rounded-full font-bold text-xs border border-slate-200 hover:bg-slate-50">View</button>
                  <button onClick={() => handleDelete(post.slug)} className="bg-red-50 text-red-600 px-6 py-2 rounded-full font-bold text-xs hover:bg-red-600 hover:text-white transition">Delete</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}